<script setup lang="ts">
import Hls from 'hls.js'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const movieId = route.params.id as string

interface Subtitle {
  id: string
  language: string
  label: string
  subtitle_url: string
  format: string
}

interface AudioTrack {
  id: string
  language: string
  label: string
  audio_url: string
  is_default: boolean
}

interface Episode {
  id: string
  season_number: number
  episode_number: number
  title: string
  video_url: string | null
  duration_mins: number | null
}

interface Movie {
  id: string
  title: string
  type: 'movie' | 'series'
  is_premium: boolean
  video_url: string | null
  trailer_url?: string | null
  duration_mins?: number | null
  subtitles?: Subtitle[]
  audio_tracks?: AudioTrack[]
  episodes?: Episode[]
}

const config = useRuntimeConfig()
const _rawApiBase = (config.public.apiUrl as string) || 'http://localhost:3000'
const apiBase = import.meta.client && window.location.protocol === 'https:'
  ? _rawApiBase.replace(/^http:\/\//, 'https://')
  : _rawApiBase

const videoEl = ref<HTMLVideoElement | null>(null)
const hls = ref<Hls | null>(null)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const muted = ref(false)
const fullscreen = ref(false)
const controlsVisible = ref(true)
const playbackSpeed = ref(1)
const speedMenuOpen = ref(false)
const selectedSubtitle = ref<string>('off')
const selectedAudio = ref<string>('')
const tracksMenuOpen = ref(false)

function normalizeVideoUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('/')) return `${apiBase}${url}`
  return url
}

let hideTimer: ReturnType<typeof setTimeout> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null

const { data: movie, error } = await useAsyncData(`movie-${movieId}`, () =>
  $api<Movie>(`/movies/${movieId}`)
)

const { listFavorites, addFavorite, removeFavorite } = useFavorites()
const isFavorite = ref(false)
const favoriteLoading = ref(false)

const { data: favoritesData } = await useAsyncData(`watch-favorites-${movieId}`, () =>
  listFavorites({ pageSize: 50 }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 })),
)
isFavorite.value = !!favoritesData.value?.items?.some(f => f.movie_id === movieId)

async function toggleFavorite() {
  if (favoriteLoading.value) return
  favoriteLoading.value = true
  try {
    if (isFavorite.value) {
      await removeFavorite(movieId)
      isFavorite.value = false
    } else {
      await addFavorite(movieId)
      isFavorite.value = true
    }
  } catch {} finally {
    favoriteLoading.value = false
  }
}

const episodeIdParam = route.query.episodeId as string | undefined

const allEpisodes = computed(() =>
  [...(movie.value?.episodes ?? [])].sort((a, b) =>
    a.season_number !== b.season_number
      ? a.season_number - b.season_number
      : a.episode_number - b.episode_number
  )
)

const activeEpisode = ref<Episode | null>(null)
if (movie.value?.type === 'series') {
  const eps = allEpisodes.value
  activeEpisode.value = (episodeIdParam ? eps.find(e => e.id === episodeIdParam) : null) ?? eps[0] ?? null
}

const nextEpisodeItem = computed(() => {
  if (!activeEpisode.value) return null
  const eps = allEpisodes.value
  const idx = eps.findIndex(e => e.id === activeEpisode.value!.id)
  return idx >= 0 && idx < eps.length - 1 ? eps[idx + 1] : null
})

const seasonGroups = computed(() => {
  const map = new Map<number, Episode[]>()
  for (const ep of allEpisodes.value) {
    if (!map.has(ep.season_number)) map.set(ep.season_number, [])
    map.get(ep.season_number)!.push(ep)
  }
  return [...map.entries()].sort(([a], [b]) => a - b)
})

const episodesMenuOpen = ref(false)

const episodeLabel = computed(() => {
  if (!activeEpisode.value) return movie.value?.title ?? ''
  const ep = activeEpisode.value
  return `S${ep.season_number} E${ep.episode_number} · ${ep.title}`
})

function selectEpisode(ep: Episode) {
  if (activeEpisode.value?.id === ep.id) { episodesMenuOpen.value = false; return }
  activeEpisode.value = ep
  episodesMenuOpen.value = false
  playing.value = false
  currentTime.value = 0
  duration.value = 0
  hls.value?.destroy()
  hls.value = null
  nextTick(() => {
    const url = normalizeVideoUrl(ep.video_url || '')
    if (url && /\.(m3u8|mp4)(\?|$)/i.test(url)) initVideo(url)
  })
}

function goToNextEpisode() {
  if (nextEpisodeItem.value) selectEpisode(nextEpisodeItem.value)
}

const effectiveVideoUrl = computed(() => {
  if (movie.value?.type === 'series') return activeEpisode.value?.video_url ?? null
  return movie.value?.video_url ?? null
})

const sourceUrl = computed(() => normalizeVideoUrl(effectiveVideoUrl.value || ''))
const canPlayVideo = computed(() => /\.(m3u8|mp4)(\?|$)/i.test(sourceUrl.value))
const needsSubscription = computed(() => movie.value?.is_premium && !effectiveVideoUrl.value)

const subtitles = computed(() => movie.value?.subtitles ?? [])
const audioTracks = computed(() => movie.value?.audio_tracks ?? [])
const hasTracks = computed(() => subtitles.value.length > 0 || audioTracks.value.length > 0)

const activeSubtitleUrl = computed(() => {
  const s = subtitles.value.find(s => s.id === selectedSubtitle.value)
  return s ? normalizeVideoUrl(s.subtitle_url) : ''
})

watch(audioTracks, (tracks) => {
  if (!selectedAudio.value && tracks.length) {
    const def = tracks.find(t => t.is_default) ?? tracks[0]
    if (def) selectedAudio.value = def.id
  }
}, { immediate: true })

watch(selectedSubtitle, (id) => {
  if (!videoEl.value) return
  const tracks = videoEl.value.textTracks
  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i]
    if (!t) continue
    const sub = subtitles.value[i]
    t.mode = sub && sub.id === id ? 'showing' : 'disabled'
  }
})

onMounted(() => {
  if (sourceUrl.value && canPlayVideo.value) initVideo(sourceUrl.value)
  startProgressTracking()
})

onUnmounted(() => {
  hls.value?.destroy()
  if (hideTimer) clearTimeout(hideTimer)
  if (progressTimer) clearInterval(progressTimer)
})

function initVideo(url: string) {
  const video = videoEl.value
  if (!video) return

  const finalUrl = url.includes('.m3u8') ? `${apiBase}/proxy/hls?url=${encodeURIComponent(url)}` : url

  if (url.includes('.m3u8') && Hls.isSupported()) {
    const hlsInstance = new Hls()
    hls.value = hlsInstance
    hlsInstance.loadSource(finalUrl)
    hlsInstance.attachMedia(video)
    return
  }

  video.src = finalUrl
}

function onTimeUpdate() { currentTime.value = videoEl.value?.currentTime ?? 0 }
function onDurationChange() { duration.value = videoEl.value?.duration ?? 0 }
function onPlay() { playing.value = true }
function onPause() { playing.value = false }

function togglePlay() {
  if (!videoEl.value || !canPlayVideo.value) return
  playing.value ? videoEl.value.pause() : videoEl.value.play()
}

function seek(val: number) {
  if (!videoEl.value || !canPlayVideo.value) return
  videoEl.value.currentTime = val
  currentTime.value = val
}

function skip(seconds: number) {
  if (!videoEl.value || !canPlayVideo.value) return
  seek(Math.max(0, Math.min(duration.value, currentTime.value + seconds)))
}

function setVolume(val: number) {
  volume.value = val
  if (videoEl.value) videoEl.value.volume = val
  muted.value = val === 0
}

function toggleMute() {
  muted.value = !muted.value
  if (videoEl.value) videoEl.value.muted = muted.value
}

function setSpeed(val: number) {
  playbackSpeed.value = val
  speedMenuOpen.value = false
  if (videoEl.value) videoEl.value.playbackRate = val
}

function toggleFullscreen() {
  const el = document.documentElement
  if (!document.fullscreenElement) {
    el.requestFullscreen()
    fullscreen.value = true
  } else {
    document.exitFullscreen()
    fullscreen.value = false
  }
}

function showControls() {
  controlsVisible.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (playing.value) controlsVisible.value = false
  }, 3000)
}

function startProgressTracking() {
  progressTimer = setInterval(() => {
    if (!playing.value || !videoEl.value) return
    saveProgress()
  }, 10000)
}

async function saveProgress() {
  if (!videoEl.value) return
  const watched = Math.floor(videoEl.value.currentTime)
  const total = duration.value
  const completed = total > 0 && watched / total >= 0.9
  try {
    await $api('/watch-history', {
      method: 'POST',
      body: { movieId, watchDuration: watched, isCompleted: completed },
    })
  } catch {}
}

function formatTime(secs: number) {
  if (!secs || Number.isNaN(secs)) return '0:00'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

const speedSteps = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x', sublabel: '(Normal)' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
]
</script>

<template>
  <div class="watch-page" @mousemove="showControls" @click="showControls">
    <div v-if="error || !movie" class="watch-page__error">
      <span class="h1-bold">Không thể tải phim</span>
      <IconButton variant="overlay" aria-label="Back" @click="router.push('/browse')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </IconButton>
    </div>

    <template v-else>
      <video
        v-if="canPlayVideo"
        ref="videoEl"
        class="watch-page__video"
        crossorigin="anonymous"
        @timeupdate="onTimeUpdate"
        @durationchange="onDurationChange"
        @play="onPlay"
        @pause="onPause"
        @click="togglePlay"
      >
        <track
          v-for="sub in subtitles"
          :key="sub.id"
          kind="subtitles"
          :src="normalizeVideoUrl(sub.subtitle_url)"
          :srclang="sub.language"
          :label="sub.label || sub.language"
          :default="sub.id === selectedSubtitle"
        />
      </video>

      <div v-else class="watch-page__brand">
        <span class="watch-page__logo">N</span>
        <template v-if="needsSubscription">
          <span class="h1-bold watch-page__no-video">Nội dung Premium</span>
          <span class="body-regular watch-page__no-video">Đăng ký gói Notflex để mở khóa phim này.</span>
          <Button variant="brand" size="large" @click="navigateTo('/plans')">Chọn gói cước</Button>
        </template>
        <span v-else class="body-regular watch-page__no-video">Video URL phải là link .mp4 hoặc .m3u8</span>
      </div>

      <Transition name="fade">
        <div v-show="controlsVisible" class="watch-page__chrome">
          <div class="watch-page__topbar">
            <IconButton variant="overlay" aria-label="Back" @click="router.back()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </IconButton>

            <div class="watch-page__topbar-right">
              <IconButton
                variant="overlay"
                :aria-label="isFavorite ? 'Remove from list' : 'Add to list'"
                :disabled="favoriteLoading"
                @click.stop="toggleFavorite"
              >
                <svg v-if="isFavorite" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </IconButton>

              <IconButton variant="overlay" aria-label="Report" class="watch-page__report">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 20V5m0 0h10l-1.5 4L16 13H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </IconButton>
            </div>
          </div>

          <IconButton v-if="canPlayVideo" variant="overlay" class="watch-page__center-action" aria-label="Play" @click.stop="togglePlay">
            <svg v-if="!playing" width="72" height="72" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else width="72" height="72" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 19h4V5H6v14Zm8-14v14h4V5h-4Z" />
            </svg>
          </IconButton>

          <div class="watch-page__bottom">
            <div class="watch-page__progress-row">
              <Slider
                :model-value="currentTime"
                :min="0"
                :max="duration || 100"
                :step="1"
                variant="progress"
                :disabled="!canPlayVideo"
                @update:model-value="seek"
              />
              <span class="caption-1-medium watch-page__duration">{{ formatTime(duration) }}</span>
            </div>

            <span class="caption-1-medium watch-page__episode">{{ episodeLabel }}</span>

            <div class="watch-page__controls">
              <div class="watch-page__controls-left">
                <IconButton variant="overlay" size="large" aria-label="Play" @click="togglePlay">
                  <svg v-if="!playing" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6 19h4V5H6v14Zm8-14v14h4V5h-4Z" />
                  </svg>
                </IconButton>

                <IconButton variant="overlay" size="large" aria-label="Back 10 seconds" @click="skip(-10)">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M12 6H7V1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.8 6.8A9 9 0 1 1 5 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <text x="8.2" y="17" fill="currentColor" font-size="7" font-weight="700">10</text>
                  </svg>
                </IconButton>

                <IconButton variant="overlay" size="large" aria-label="Forward 10 seconds" @click="skip(10)">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M16 6h5V1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20.2 6.8A9 9 0 1 0 23 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <text x="9.2" y="17" fill="currentColor" font-size="7" font-weight="700">10</text>
                  </svg>
                </IconButton>

                <div class="watch-page__volume">
                  <IconButton variant="overlay" size="large" aria-label="Volume" @click="toggleMute">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                      <path v-if="!muted" d="M16 9a4 4 0 0 1 0 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    </svg>
                  </IconButton>
                  <div class="watch-page__volume-slider">
                    <Slider :model-value="muted ? 0 : volume" :min="0" :max="1" :step="0.05" @update:model-value="setVolume" />
                  </div>
                </div>

                <span class="caption-1-medium watch-page__control-title">{{ movie.title }}</span>
              </div>

              <div class="watch-page__controls-right">
                <div class="watch-page__tracks">
                  <IconButton variant="overlay" size="large" aria-label="Subtitles and audio" @click.stop="tracksMenuOpen = !tracksMenuOpen">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 6h18v12H3V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                      <path d="M6 14h4M14 14h4M6 11h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    </svg>
                  </IconButton>

                  <Transition name="fade">
                    <div v-if="tracksMenuOpen" class="watch-page__tracks-panel" @click.stop>
                      <div class="watch-page__tracks-section">
                        <span class="watch-page__tracks-title caption-1-medium">Audio</span>
                        <button
                          v-if="!audioTracks.length"
                          class="watch-page__tracks-item is-active"
                          disabled
                        >
                          Original
                        </button>
                        <button
                          v-for="track in audioTracks"
                          :key="track.id"
                          class="watch-page__tracks-item"
                          :class="{ 'is-active': selectedAudio === track.id }"
                          @click="selectedAudio = track.id; tracksMenuOpen = false"
                        >
                          {{ track.label || track.language }}
                        </button>
                      </div>
                      <div class="watch-page__tracks-section">
                        <span class="watch-page__tracks-title caption-1-medium">Subtitles</span>
                        <button
                          class="watch-page__tracks-item"
                          :class="{ 'is-active': selectedSubtitle === 'off' }"
                          @click="selectedSubtitle = 'off'; tracksMenuOpen = false"
                        >
                          Off
                        </button>
                        <button
                          v-for="sub in subtitles"
                          :key="sub.id"
                          class="watch-page__tracks-item"
                          :class="{ 'is-active': selectedSubtitle === sub.id }"
                          @click="selectedSubtitle = sub.id; tracksMenuOpen = false"
                        >
                          {{ sub.label || sub.language }}
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>

                <IconButton
                  v-if="movie.type === 'series'"
                  variant="overlay"
                  size="large"
                  aria-label="Next episode"
                  :disabled="!nextEpisodeItem"
                  @click="goToNextEpisode"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 5l9 7-9 7V5Zm11 0v14" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  </svg>
                </IconButton>

                <div v-if="movie.type === 'series'" class="watch-page__episodes">
                  <IconButton variant="overlay" size="large" aria-label="Episodes" @click.stop="episodesMenuOpen = !episodesMenuOpen">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 7h11v9H5V7Zm3-3h11v9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                    </svg>
                  </IconButton>

                  <Transition name="fade">
                    <div v-if="episodesMenuOpen" class="watch-page__episodes-panel" @click.stop>
                      <div v-for="[season, eps] in seasonGroups" :key="season" class="watch-page__episodes-season">
                        <span class="watch-page__tracks-title caption-1-medium">Season {{ season }}</span>
                        <button
                          v-for="ep in eps"
                          :key="ep.id"
                          class="watch-page__tracks-item watch-page__episode-btn"
                          :class="{ 'is-active': activeEpisode?.id === ep.id }"
                          @click="selectEpisode(ep)"
                        >
                          <span class="watch-page__episode-num">{{ ep.episode_number }}</span>
                          <span class="watch-page__episode-title">{{ ep.title }}</span>
                          <span v-if="ep.duration_mins" class="watch-page__episode-dur">{{ ep.duration_mins }}m</span>
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>

                <div class="watch-page__speed">
                  <IconButton variant="overlay" size="large" aria-label="Playback speed" @click="speedMenuOpen = !speedMenuOpen">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 16a7 7 0 1 1 14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                      <path d="M12 16l4-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                    </svg>
                  </IconButton>

                  <Transition name="fade">
                    <SpeedIndicator
                      v-if="speedMenuOpen"
                      class="watch-page__speed-panel"
                      :model-value="playbackSpeed"
                      :steps="speedSteps"
                      @update:model-value="setSpeed"
                    />
                  </Transition>
                </div>

                <IconButton variant="overlay" size="large" aria-label="Fullscreen" @click="toggleFullscreen">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.watch-page {
  position: fixed;
  inset: 0;
  z-index: 500;
  overflow: hidden;
  background: #000;
  color: #fff;

  &__video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    background: #000;
  }

  &__brand,
  &__error {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__error {
    flex-direction: column;
    gap: token("dm-24");
  }

  &__logo {
    color: #e50914;
    font-size: clamp(120px, 14vw, 260px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.12em;
    text-shadow: 0 0 40px rgba(229, 9, 20, 0.35);
  }

  &__no-video {
    position: absolute;
    bottom: 28%;
    color: rgba(255, 255, 255, 0.72);
  }

  &__chrome {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 24%, transparent 58%, rgba(0, 0, 0, 0.86));
    pointer-events: none;
  }

  &__chrome > * {
    pointer-events: auto;
  }

  &__topbar {
    display: flex;
    align-items: center;
    padding: token("dm-24") token("dm-32");
  }

  &__topbar-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: token("dm-8");
  }

  &__report {
    margin-left: 0;
  }

  &__center-action {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 112px;
    height: 112px;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(0, 0, 0, 0.18);
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    gap: token("dm-12");
    padding: 0 token("dm-32") token("dm-24");
  }

  &__progress-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: token("dm-12");
  }

  &__duration,
  &__episode,
  &__control-title {
    color: #fff;
  }

  &__episode {
    align-self: center;
  }

  &__controls {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: token("dm-24");
  }

  &__controls-left,
  &__controls-right {
    display: flex;
    align-items: center;
    gap: token("dm-12");
  }

  &__controls-right {
    justify-content: flex-end;
  }

  &__tracks {
    position: relative;
  }

  &__tracks-panel {
    position: absolute;
    right: 0;
    bottom: calc(100% + token("dm-8"));
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid token("grey-700");
    border-radius: 8px;
    padding: token("dm-12") 0;
    min-width: 220px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
    z-index: 10;
  }

  &__tracks-section {
    display: flex;
    flex-direction: column;

    & + & {
      border-top: 1px solid token("grey-700");
      padding-top: token("dm-8");
      margin-top: token("dm-4");
    }
  }

  &__tracks-title {
    padding: token("dm-4") token("dm-16") token("dm-8");
    color: token("color-text-secondary");
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__tracks-item {
    background: none;
    border: none;
    text-align: left;
    padding: token("dm-8") token("dm-16");
    color: token("color-text-primary");
    cursor: pointer;
    font-size: 14px;

    &:hover { background: rgba(255, 255, 255, 0.08); }
    &.is-active { color: token("color-action-brand"); font-weight: 700; }
  }

  &__volume {
    display: flex;
    align-items: center;
    gap: token("dm-8");
  }

  &__volume-slider {
    width: 96px;
  }

  &__control-title {
    margin-left: token("dm-8");
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__episodes {
    position: relative;
  }

  &__episodes-panel {
    position: absolute;
    right: 0;
    bottom: calc(100% + token("dm-8"));
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid token("grey-700");
    border-radius: 8px;
    padding: token("dm-12") 0;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    gap: token("dm-4");
    z-index: 10;
  }

  &__episodes-season {
    display: flex;
    flex-direction: column;

    & + & {
      border-top: 1px solid token("grey-700");
      padding-top: token("dm-4");
      margin-top: token("dm-4");
    }
  }

  &__episode-btn {
    display: flex;
    align-items: center;
    gap: token("dm-10");
  }

  &__episode-num {
    width: 24px;
    text-align: right;
    color: token("color-text-secondary");
    font-size: 13px;
    flex-shrink: 0;
  }

  &__episode-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__episode-dur {
    color: token("color-text-secondary");
    font-size: 12px;
    flex-shrink: 0;
  }

  &__speed {
    position: relative;
  }

  &__speed-panel {
    position: absolute;
    right: 0;
    bottom: calc(100% + #{token("dm-20")});
    width: min(420px, 80vw);
    padding: token("dm-16");
    border-radius: token("dm-4");
    background: rgba(31, 31, 31, 0.96);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.24s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

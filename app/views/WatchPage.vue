<script setup lang="ts">
import Hls from 'hls.js'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const movieId = route.params.id as string

interface Movie {
  id: string
  title: string
  video_url: string | null
  trailer_url?: string | null
  duration_mins?: number | null
}

const config = useRuntimeConfig()
const apiBase = (config.public.apiUrl as string) || 'http://localhost:8080'

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

const sourceUrl = computed(() => normalizeVideoUrl(movie.value?.video_url || ''))
const canPlayVideo = computed(() => /\.(m3u8|mp4)(\?|$)/i.test(sourceUrl.value))

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
        @timeupdate="onTimeUpdate"
        @durationchange="onDurationChange"
        @play="onPlay"
        @pause="onPause"
        @click="togglePlay"
      />

      <div v-else class="watch-page__brand">
        <span class="watch-page__logo">N</span>
        <span class="body-regular watch-page__no-video">Video URL phải là link .mp4 hoặc .m3u8</span>
      </div>

      <Transition name="fade">
        <div v-show="controlsVisible" class="watch-page__chrome">
          <div class="watch-page__topbar">
            <IconButton variant="overlay" aria-label="Back" @click="router.back()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </IconButton>

            <IconButton variant="overlay" aria-label="Report" class="watch-page__report">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 20V5m0 0h10l-1.5 4L16 13H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </IconButton>
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

            <span class="caption-1-medium watch-page__episode">{{ movie.title }}</span>

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
                <IconButton variant="overlay" size="large" aria-label="Next episode">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 5l9 7-9 7V5Zm11 0v14" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  </svg>
                </IconButton>

                <IconButton variant="overlay" size="large" aria-label="Episodes">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 7h11v9H5V7Zm3-3h11v9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  </svg>
                </IconButton>

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

  &__report {
    margin-left: auto;
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

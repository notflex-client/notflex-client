<script setup lang="ts">
import Hls from 'hls.js'

const route = useRoute()
const { $api } = useNuxtApp()

const movieId = route.params.id as string

interface Movie {
  id: string
  title: string
  video_url: string
  trailer_url?: string
  duration_mins: number
}

const config = useRuntimeConfig()
const apiBase = (config.public.apiUrl as string) || 'http://localhost:3000'

const movie = ref<Movie | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const hls = ref<Hls | null>(null)

// Player state
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const muted = ref(false)
const fullscreen = ref(false)
const controlsVisible = ref(true)
const playbackSpeed = ref(1)

let hideTimer: ReturnType<typeof setTimeout> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null

// ── Fetch movie ────────────────────────────────────────────────
const { data, error } = await useAsyncData('movie', () =>
  $api<Movie>(`/movies/${movieId}`)
)
movie.value = data.value ?? null

// ── HLS setup ─────────────────────────────────────────────────
onMounted(() => {
  if (!movie.value?.video_url) return
  initHls(movie.value.video_url)
  startProgressTracking()
})

function initHls(url: string) {
  const video = videoEl.value
  if (!video) return

  const proxyUrl = `${apiBase}/proxy/hls?url=${encodeURIComponent(url)}`

  if (Hls.isSupported()) {
    const hlsInstance = new Hls()
    hls.value = hlsInstance
    hlsInstance.loadSource(proxyUrl)
    hlsInstance.attachMedia(video)
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => video.play())
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = proxyUrl
    video.play()
  }
}

onUnmounted(() => {
  hls.value?.destroy()
  if (hideTimer) clearTimeout(hideTimer)
  if (progressTimer) clearInterval(progressTimer)
})

// ── Video event handlers ───────────────────────────────────────
function onTimeUpdate() { currentTime.value = videoEl.value?.currentTime ?? 0 }
function onDurationChange() { duration.value = videoEl.value?.duration ?? 0 }
function onPlay() { playing.value = true }
function onPause() { playing.value = false }

// ── Controls ───────────────────────────────────────────────────
function togglePlay() {
  if (!videoEl.value) return
  playing.value ? videoEl.value.pause() : videoEl.value.play()
}

function seek(val: number) {
  if (!videoEl.value) return
  videoEl.value.currentTime = val
  currentTime.value = val
}

function setVolume(val: number) {
  volume.value = val
  if (videoEl.value) videoEl.value.volume = val
  muted.value = val === 0
}

function toggleMute() {
  if (!videoEl.value) return
  muted.value = !muted.value
  videoEl.value.muted = muted.value
}

function setSpeed(val: number) {
  playbackSpeed.value = val
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

// ── Auto-hide controls ─────────────────────────────────────────
function showControls() {
  controlsVisible.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (playing.value) controlsVisible.value = false
  }, 3000)
}

// ── Progress tracking ──────────────────────────────────────────
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
  } catch { /* ignore */ }
}

// ── Helpers ────────────────────────────────────────────────────
function formatTime(secs: number) {
  if (!secs || isNaN(secs)) return '0:00'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

const speedSteps = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x', sublabel: '(Bình thường)' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
]
</script>

<template>
  <div
    class="watch-page"
    @mousemove="showControls"
    @click="showControls"
  >
    <!-- Error -->
    <div v-if="error || !movie" class="watch-page__error">
      <p>Không thể tải phim. Vui lòng thử lại.</p>
      <NuxtLink to="/browse">← Quay lại</NuxtLink>
    </div>

    <template v-else>
      <!-- HLS video -->
      <video
        ref="videoEl"
        class="watch-page__video"
        @timeupdate="onTimeUpdate"
        @durationchange="onDurationChange"
        @play="onPlay"
        @pause="onPause"
        @click="togglePlay"
      />

      <Transition name="fade">
        <div v-show="controlsVisible" class="watch-page__controls">

          <!-- Top bar -->
          <div class="controls__top">
            <button class="controls__back" @click="$router.back()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
            <span class="controls__title">{{ movie.title }}</span>
          </div>

          <!-- Center play/pause -->
          <div class="controls__center" @click="togglePlay">
            <svg v-if="!playing" width="64" height="64" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else width="64" height="64" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </div>

          <!-- Bottom bar -->
          <div class="controls__bottom">
            <div class="controls__progress">
              <Slider
                :model-value="currentTime"
                :min="0"
                :max="duration || 100"
                :step="1"
                variant="progress"
                @update:model-value="seek"
              />
            </div>

            <div class="controls__row">
              <IconButton variant="overlay" size="medium" @click="togglePlay">
                <template #default>
                  <svg v-if="!playing" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                </template>
              </IconButton>

              <div class="controls__volume">
                <IconButton variant="overlay" size="medium" @click="toggleMute">
                  <template #default>
                    <svg v-if="muted || volume === 0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  </template>
                </IconButton>
                <div class="controls__volume-slider">
                  <Slider
                    :model-value="muted ? 0 : volume"
                    :min="0"
                    :max="1"
                    :step="0.05"
                    variant="default"
                    @update:model-value="setVolume"
                  />
                </div>
              </div>

              <span class="controls__time">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </span>

              <div class="controls__right">
                <SpeedIndicator
                  :model-value="playbackSpeed"
                  :steps="speedSteps"
                  @update:model-value="setSpeed"
                />
                <IconButton variant="overlay" size="medium" @click="toggleFullscreen">
                  <template #default>
                    <svg v-if="!fullscreen" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                  </template>
                </IconButton>
              </div>
            </div>
          </div>

        </div>
      </Transition>

    </template>
  </div>
</template>

<style lang="scss" scoped>
.watch-page {
  position: fixed;
  inset: 0;
  background: #000;

  &__video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;
    gap: 16px;

    a { color: #e50914; }
  }

  &__controls {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.7) 0%,
      transparent 20%,
      transparent 70%,
      rgba(0,0,0,0.85) 100%
    );
    pointer-events: none;

    > * { pointer-events: all; }
  }
}

.controls {
  &__top {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px 32px 0;
  }

  &__back {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    opacity: 0.85;
    &:hover { opacity: 1; }
  }

  &__title {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }

  &__center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    cursor: pointer;
    opacity: 0.9;
    &:hover { opacity: 1; }
  }

  &__bottom {
    padding: 0 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__progress { width: 100%; }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
  }

  &__volume {
    display: flex;
    align-items: center;
    gap: 4px;
    &-slider { width: 80px; }
  }

  &__time {
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    margin-left: 4px;
  }

  &__right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>

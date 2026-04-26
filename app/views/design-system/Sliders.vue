<script setup lang="ts">
// ── Video Progress ───────────────────────────────────────────
const progressBeginning = ref(2)
const progressDefault   = ref(55)
const progressHover     = ref(55)

function formatTime(seconds: number): string {
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}
// 4501s total (~1h 15m), values in seconds
const totalDuration = 4501

// ── Volume ───────────────────────────────────────────────────
const volHigh   = ref(85)
const volMid    = ref(45)
const volMute   = ref(0)

// ── Default (generic) ────────────────────────────────────────
const genericVal = ref(40)
</script>

<template>
  <div class="ds-section">

    <!-- Video Progress Indicator -->
    <div class="ds-block">
      <h3 class="ds-block__title">Video Progress Indicator</h3>
      <p class="ds-block__desc">
        <code>variant="progress"</code>: thin track (3px), expands to 5px on hover.
        Thumb hidden at rest, appears on hover / drag. Buffer shows loaded content.
      </p>
      <div class="sl-demo-box">

        <!-- Beginning -->
        <div class="sl-progress-row">
          <Slider
            v-model="progressBeginning"
            variant="progress"
            :min="0"
            :max="totalDuration"
            :step="1"
            :format-value="formatTime"
            show-value
          />
          <span class="caption-1-regular sl-label">Beginning</span>
        </div>

        <!-- Mid progress -->
        <div class="sl-progress-row">
          <Slider
            v-model="progressDefault"
            variant="progress"
            :min="0"
            :max="totalDuration"
            :step="1"
            :buffer="70"
            :format-value="formatTime"
            show-value
          />
          <span class="caption-1-regular sl-label">Progress Default</span>
        </div>

        <!-- Hover state (thumb forced visible) -->
        <div class="sl-progress-row">
          <Slider
            v-model="progressHover"
            variant="progress"
            :min="0"
            :max="totalDuration"
            :step="1"
            :buffer="70"
            :format-value="formatTime"
            show-value
            class="sl-force-hover"
          />
          <span class="caption-1-regular sl-label">Progress Hover</span>
        </div>

      </div>
    </div>

    <!-- Volume Slider -->
    <div class="ds-block">
      <h3 class="ds-block__title">Volume Slider</h3>
      <p class="ds-block__desc">
        <code>variant="volume"</code>: vertical, fills bottom → top.
        Place volume icon in the default slot below the slider.
      </p>
      <div class="sl-demo-box">
        <div class="sl-volume-group">

          <!-- High -->
          <div class="sl-volume-col">
            <Slider v-model="volHigh" variant="volume" :min="0" :max="100" />
            <button class="sl-vol-icon" type="button" aria-label="Volume High">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
              </svg>
            </button>
            <span class="caption-2-regular sl-vol-label">High</span>
          </div>

          <!-- Middle -->
          <div class="sl-volume-col">
            <Slider v-model="volMid" variant="volume" :min="0" :max="100" />
            <button class="sl-vol-icon" type="button" aria-label="Volume Mid">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 010 7.07"/>
              </svg>
            </button>
            <span class="caption-2-regular sl-vol-label">Middle</span>
          </div>

          <!-- Mute -->
          <div class="sl-volume-col">
            <Slider v-model="volMute" variant="volume" :min="0" :max="100" />
            <button class="sl-vol-icon" type="button" aria-label="Mute">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>
            <span class="caption-2-regular sl-vol-label">Mute</span>
          </div>

        </div>
        <span class="caption-1-regular sl-label" style="align-self: center;">High / Middle / Mute</span>
      </div>
    </div>

    <!-- Default (generic) -->
    <div class="ds-block">
      <h3 class="ds-block__title">Default — Generic Range</h3>
      <p class="ds-block__desc">
        <code>variant="default"</code>: thumb always visible. Usable for speed, brightness, etc.
        Override <code>--slider-range-bg</code> / <code>--slider-thumb-color</code> for custom colors.
      </p>
      <div class="sl-demo-box">
        <div class="sl-progress-row">
          <Slider v-model="genericVal" variant="default" :min="0" :max="100" show-value />
          <span class="caption-1-regular sl-label">Value: {{ genericVal }}</span>
        </div>
        <!-- Speed indicator — discrete steps -->
        <div class="sl-progress-row">
          <Slider
            v-model="genericVal"
            variant="default"
            :min="25"
            :max="200"
            :step="25"
            :format-value="(v) => `${v / 100}×`"
            show-value
            style="--slider-range-bg: #fff; --slider-thumb-color: #fff;"
          />
          <span class="caption-1-regular sl-label">Speed (custom color)</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.sl-demo-box {
  background-color: token("grey-800");
  border-radius: 8px;
  padding: token("dm-24") token("dm-32");
  display: flex;
  flex-direction: column;
  gap: token("dm-20");
}

// ── Progress rows ──────────────────────────────────────────────
.sl-progress-row {
  display: flex;
  align-items: center;
  gap: token("dm-24");
}

.sl-label {
  flex-shrink: 0;
  min-width: 140px;
  color: token("color-text-secondary");
}

// Force hover state visible in demo (3rd progress row)
.sl-force-hover {
  :deep(.slider__thumb)  { opacity: 1 !important; }
  :deep(.slider__track)  { height: 5px !important; }
}

// ── Volume group ───────────────────────────────────────────────
.sl-volume-group {
  display: flex;
  gap: token("dm-32");
  align-items: flex-end;
}

.sl-volume-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: token("dm-8");

  // Fixed height for the slider itself
  :deep(.slider-volume) {
    height: 120px;
  }
}

.sl-vol-icon {
  background: none;
  border: none;
  color: token("color-text-primary");
  cursor: pointer;
  padding: token("dm-4");
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { opacity: 0.7; }
}

.sl-vol-label {
  color: token("color-text-secondary");
}
</style>

<script setup lang="ts">
import type { LangOption } from '~/components/ui/SubtitlePanel.vue'

// ── Speed Indicator ──────────────────────────────────────────
const speed = ref(1)

// ── Subtitle Panel ───────────────────────────────────────────
const AUDIO: LangOption[] = [
  { value: 'ja-original',  label: 'Japanese (Original)' },
  { value: 'en',           label: 'English' },
  { value: 'pt-br',        label: 'Portuguese (Brazil)' },
  { value: 'pl',           label: 'Polish' },
  { value: 'es-la',        label: 'Spanish (Latin America)' },
  { value: 'ja-ad',        label: 'Japanese - Audio Description' },
  { value: 'th',           label: 'Thai' },
]

const SUBTITLES: LangOption[] = [
  { value: 'off',     label: 'Off' },
  { value: 'en-cc',   label: 'English (CC)' },
  { value: 'en',      label: 'English' },
  { value: 'ja-cc',   label: 'Japanese (CC)' },
  { value: 'es-la',   label: 'Spanish (Latin America)' },
  { value: 'zh-hans', label: 'Simplified Chinese' },
  { value: 'zh-hant', label: 'Traditional Chinese' },
  { value: 'ar',      label: 'Arabic' },
  { value: 'hr',      label: 'Croatian' },
  { value: 'cs',      label: 'Czech' },
  { value: 'da',      label: 'Danish' },
  { value: 'fi',      label: 'Finnish' },
  { value: 'fr',      label: 'French' },
  { value: 'de',      label: 'German' },
]

const selectedAudio    = ref('ja-original')
const selectedSubtitle = ref('en-cc')
</script>

<template>
  <div class="ds-section">

    <!-- Speed Indicator -->
    <div class="ds-block">
      <h3 class="ds-block__title">Speed Indicator</h3>
      <p class="ds-block__desc">
        Click a step to select playback speed. Default is <code>1x (Normal)</code>.
        Pass custom <code>:steps</code> to override the speed list.
      </p>
      <div class="pc-demo-box pc-demo-box--sm">
        <SpeedIndicator v-model="speed" />
      </div>
      <p class="ds-label" style="margin-top: 12px;">Selected: {{ speed }}×</p>
    </div>

    <!-- Subtitle Panel -->
    <div class="ds-block">
      <h3 class="ds-block__title">Subtitles</h3>
      <p class="ds-block__desc">
        Two-column panel for Audio and Subtitle language selection.
        Each column is independently scrollable. Active item shows a checkmark.
      </p>
      <div class="pc-demo-box">
        <SubtitlePanel
          :audio-options="AUDIO"
          :subtitle-options="SUBTITLES"
          v-model:audio="selectedAudio"
          v-model:subtitle="selectedSubtitle"
        />
      </div>
      <p class="ds-label" style="margin-top: 12px;">
        Audio: <strong>{{ selectedAudio }}</strong> &nbsp;·&nbsp;
        Subtitle: <strong>{{ selectedSubtitle }}</strong>
      </p>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.pc-demo-box {
  background-color: token("grey-800");
  border-radius: 8px;
  padding: token("dm-32");
  max-width: 520px;

  &--sm {
    max-width: 360px;
    padding: token("dm-24") token("dm-32");
  }
}
</style>

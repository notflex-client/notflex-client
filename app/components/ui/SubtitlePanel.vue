<script setup lang="ts">
export interface LangOption {
  value: string
  label: string
}

defineProps({
  audioOptions:    { type: Array as PropType<LangOption[]>, default: () => [] },
  subtitleOptions: { type: Array as PropType<LangOption[]>, default: () => [] },
  audio:    { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const emit = defineEmits<{
  'update:audio':    [value: string]
  'update:subtitle': [value: string]
}>()
</script>

<template>
  <div class="subtitle-panel">

    <!-- Audio column -->
    <div class="subtitle-panel__col">
      <div class="subtitle-panel__heading">
        <span class="body-medium">Audio</span>
      </div>
      <ul class="subtitle-panel__list">
        <li
          v-for="opt in audioOptions"
          :key="opt.value"
          class="subtitle-panel__item"
          :class="{ 'is-selected': audio === opt.value }"
          @click="emit('update:audio', opt.value)"
        >
          <span class="subtitle-panel__check" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="small-body-regular">{{ opt.label }}</span>
        </li>
      </ul>
    </div>

    <div class="subtitle-panel__divider" aria-hidden="true" />

    <!-- Subtitles column -->
    <div class="subtitle-panel__col">
      <div class="subtitle-panel__heading">
        <span class="body-medium">Subtitles</span>
      </div>
      <ul class="subtitle-panel__list">
        <li
          v-for="opt in subtitleOptions"
          :key="opt.value"
          class="subtitle-panel__item"
          :class="{ 'is-selected': subtitle === opt.value }"
          @click="emit('update:subtitle', opt.value)"
        >
          <span class="subtitle-panel__check" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="small-body-regular">{{ opt.label }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>

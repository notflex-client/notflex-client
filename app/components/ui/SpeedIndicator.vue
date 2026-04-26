<script setup lang="ts">
export interface SpeedStep {
  value:     number
  label:     string
  sublabel?: string
}

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  title: { type: String, default: 'Playback Speed' },
  steps: {
    type: Array as PropType<SpeedStep[]>,
    default: (): SpeedStep[] => [
      { value: 0.5,  label: '0.5x' },
      { value: 0.75, label: '0.75x' },
      { value: 1,    label: '1x', sublabel: '(Normal)' },
      { value: 1.25, label: '1.25x' },
      { value: 1.5,  label: '1.5x' },
    ],
  },
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="speed-indicator">

    <p class="headline-1-medium speed-indicator__title">{{ title }}</p>

    <div class="speed-indicator__track-area">
      <!-- Track line behind dots -->
      <div class="speed-indicator__line" />

      <!-- Dots row -->
      <div class="speed-indicator__steps">
        <button
          v-for="step in steps"
          :key="step.value"
          class="speed-indicator__step"
          :class="{ 'is-active': modelValue === step.value }"
          :aria-label="`Speed ${step.label}`"
          :aria-pressed="modelValue === step.value"
          @click="emit('update:modelValue', step.value)"
        >
          <!-- Fixed-size wrap so dot size change doesn't affect layout -->
          <span class="speed-indicator__dot-wrap">
            <span class="speed-indicator__dot" />
          </span>
          <span class="speed-indicator__step-label">
            {{ step.label }}
            <span v-if="step.sublabel" class="speed-indicator__sublabel">
              {{ step.sublabel }}
            </span>
          </span>
        </button>
      </div>
    </div>

  </div>
</template>

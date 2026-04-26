<script setup lang="ts">
import * as slider from '@zag-js/slider'
import { normalizeProps, useMachine } from '@zag-js/vue'

/**
 * Flexible slider for: video progress, volume, speed, generic range input.
 *
 * CSS custom properties available for full visual override:
 *   --slider-track-bg        track background color
 *   --slider-range-bg        filled range color
 *   --slider-thumb-color     thumb background color
 *   --slider-track-size      track thickness (px)
 *   --slider-track-hover-size track thickness on hover (px) — progress variant
 *   --slider-thumb-size      thumb diameter (px)
 */
const props = defineProps({
  modelValue:  { type: Number, default: 0 },
  min:         { type: Number, default: 0 },
  max:         { type: Number, default: 100 },
  step:        { type: Number, default: 1 },
  orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  /**
   * 'default'  — standard slider, thumb always visible
   * 'progress' — video progress bar: thin track, thumb & expanded track on hover only
   * 'volume'   — vertical, fills bottom→top, larger thumb
   */
  variant:       { type: String as PropType<'default' | 'progress' | 'volume'>, default: 'default' },
  disabled:      { type: Boolean, default: false },
  /** 0-100: secondary fill shown ahead of the thumb (loaded content / preview) */
  buffer:        { type: Number, default: 0 },
  /** Show the current value as a label beside the slider */
  showValue:     { type: Boolean, default: false },
  formatValue:   { type: Function as PropType<(v: number) => string>, default: null },
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  /** Fires when user finishes dragging (mouseup/touchend) */
  'change-end':        [value: number]
}>()

const id = useId()

const context = computed(() => ({
  id,
  min:         props.min,
  max:         props.max,
  step:        props.step,
  orientation: props.variant === 'volume' ? 'vertical' : props.orientation,
  disabled:    props.disabled,
  defaultValue: [props.modelValue],
  onValueChange(details: { value: number[] }) {
    emit('update:modelValue', details.value[0]!)
  },
  onValueChangeEnd(details: { value: number[] }) {
    emit('change-end', details.value[0]!)
  },
}))

const service = useMachine(slider.machine, context)
const api = computed(() => slider.connect(service, normalizeProps))

watch(() => props.modelValue, (val) => {
  if (!api.value || api.value.dragging) return
  if (api.value.value[0] === val) return
  api.value.setValue([val])
})

const bufferPercent = computed(() => Math.min(100, Math.max(0, props.buffer)))

const displayValue = computed(() => {
  if (!props.showValue) return null
  const v = api.value?.value[0] ?? props.modelValue
  return props.formatValue ? props.formatValue(v) : String(v)
})

const resolvedOrientation = computed(() =>
  props.variant === 'volume' ? 'vertical' : props.orientation,
)
</script>

<template>
  <div
    class="slider"
    :class="[
      `slider-${variant}`,
      `slider-${resolvedOrientation}`,
      { 'is-disabled': disabled },
    ]"
    :style="{ '--slider-buffer': `${bufferPercent}%` }"
    v-bind="api.getRootProps()"
  >
    <div class="slider__control" v-bind="api.getControlProps()">

      <div class="slider__track" v-bind="api.getTrackProps()">
        <!-- Buffer fill (video: loaded / hover-scrub preview) -->
        <div v-if="buffer > 0" class="slider__buffer" />
        <!-- Active range -->
        <div class="slider__range" v-bind="api.getRangeProps()" />
      </div>

      <div class="slider__thumb" v-bind="api.getThumbProps({ index: 0 })">
        <input v-bind="api.getHiddenInputProps({ index: 0 })" />
      </div>

    </div>

    <!-- Value label slot (right of horizontal, below vertical) -->
    <span
      v-if="displayValue"
      class="caption-2-regular slider__value"
      v-bind="api.getValueTextProps()"
    >{{ displayValue }}</span>

    <slot name="value" :value="api.value?.[0] ?? modelValue" />
  </div>
</template>

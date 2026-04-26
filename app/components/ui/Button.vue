<script setup lang="ts">
const props = defineProps({
  variant:  { type: String as PropType<'brand' | 'secondary' | 'ghost' | 'light'>, default: 'brand' },
  size:     { type: String as PropType<'large' | 'small'>, default: 'large' },
  disabled: { type: Boolean, default: false },
  block:    { type: Boolean, default: false },
  tag:      { type: String as PropType<'button' | 'a'>, default: 'button' },
})

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  { 'is-disabled': props.disabled, 'is-block': props.block },
])
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
  >
    <span v-if="$slots['leading-icon']" class="btn__icon">
      <slot name="leading-icon" />
    </span>

    <slot />

    <span v-if="$slots['trailing-icon']" class="btn__icon">
      <slot name="trailing-icon" />
    </span>
  </component>
</template>

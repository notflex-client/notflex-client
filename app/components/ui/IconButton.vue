<script setup lang="ts">
const props = defineProps({
  variant:  { type: String as PropType<'ghost' | 'overlay' | 'outline' | 'brand' | 'light'>, default: 'ghost' },
  size:     { type: String as PropType<'large' | 'medium' | 'small'>, default: 'medium' },
  shape:    { type: String as PropType<'square' | 'circle'>, default: 'square' },
  tag:      { type: String as PropType<'button' | 'a'>, default: 'button' },
  disabled: { type: Boolean, default: false },
})

const classes = computed(() => [
  'icon-btn',
  `icon-btn-${props.variant}`,
  `icon-btn-${props.size}`,
  { 'icon-btn-circle': props.shape === 'circle', 'is-disabled': props.disabled },
])
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
  >
    <slot />
  </component>
</template>

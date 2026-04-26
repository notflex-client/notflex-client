<script setup lang="ts">
defineProps({
  variant: {
    type: String as PropType<'new' | 'hot' | 'rating' | 'quality' | 'leaving' | 'default'>,
    default: 'default',
  },
  size: {
    type: String as PropType<'default' | 'small'>,
    default: 'default',
  },
})
</script>

<template>
  <span class="badge" :class="[`badge-${variant}`, `badge-${size}`]">
    <slot />
  </span>
</template>

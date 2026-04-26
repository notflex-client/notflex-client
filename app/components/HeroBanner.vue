<script setup lang="ts">
const props = defineProps({
  variant:   { type: String as PropType<'landing' | 'auth' | 'home' | 'preview'>, default: 'home' },
  image:     { type: String, default: '' },
  minHeight: { type: String, default: '' },
})

const style = computed(() => props.minHeight ? { minHeight: props.minHeight } : undefined)
</script>

<template>
  <section class="hero-banner" :class="`hero-banner-${variant}`" :style="style">

    <!-- Background image -->
    <div class="hero-banner__bg">
      <img v-if="image" :src="image" class="hero-banner__image" alt="" aria-hidden="true" />
      <slot name="bg" />
    </div>

    <!-- Gradient overlay -->
    <div class="hero-banner__overlay" aria-hidden="true" />

    <!-- Content -->
    <div class="hero-banner__content">
      <slot />
    </div>

  </section>
</template>

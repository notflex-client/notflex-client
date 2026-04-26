<script setup lang="ts">
defineProps({
  number:      { type: Number, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  duration:    { type: String, default: '' },
  image:       { type: String, default: '' },
  active:      { type: Boolean, default: false },
  focused:     { type: Boolean, default: false },
})
</script>

<template>
  <div class="episode-item" :class="{ 'is-active': active, 'is-focused': focused }">

    <!-- Episode number -->
    <span class="episode-item__number">{{ number }}</span>

    <!-- Thumbnail -->
    <div class="episode-item__thumb">
      <img v-if="image" :src="image" class="episode-item__img" alt="" />
      <div class="episode-item__overlay">
        <svg class="episode-item__play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M5 3l14 9-14 9V3Z"/>
        </svg>
      </div>
    </div>

    <!-- Info -->
    <div class="episode-item__info">
      <div class="episode-item__header">
        <span class="episode-item__title">{{ title }}</span>
        <span v-if="duration" class="episode-item__duration">{{ duration }}</span>
      </div>
      <p v-if="description" class="episode-item__desc">{{ description }}</p>
    </div>

  </div>
</template>

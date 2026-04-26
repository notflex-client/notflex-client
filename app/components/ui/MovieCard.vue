<script setup lang="ts">
const props = defineProps({
  variant:  { type: String as PropType<'default' | 'more-like-this' | 'episode' | 'trailer' | 'player' | 'top10' | 'continue'>, default: 'default' },
  image:    { type: String, default: '' },
  title:    { type: String, default: '' },
  duration: { type: String, default: '' },   // "2h 18m" | "51:29"
  progress: { type: Number, default: 0 },    // 0–100 (continue variant)
  rank:     { type: Number, default: 1 },    // top10 rank number
  badge:    { type: String, default: '' },   // "Recently Added"
  showPlay: { type: Boolean, default: false },
})

const showNetflixN = computed(() =>
  props.variant === 'more-like-this' || props.variant === 'episode'
)
const showDuration = computed(() =>
  (props.variant === 'more-like-this' || props.variant === 'episode') && !!props.duration
)
const showTime = computed(() =>
  props.variant === 'player' && !!props.duration
)
const showTitle = computed(() =>
  props.variant === 'trailer' && !!props.title
)
const showProgress = computed(() =>
  props.variant === 'continue' && props.progress > 0
)
const showBadge = computed(() =>
  props.variant === 'top10' && !!props.badge
)
const isTop10 = computed(() => props.variant === 'top10')
</script>

<template>
  <!-- TOP10: rank number + card side by side -->
  <div v-if="isTop10" class="movie-card movie-card-top10">
    <span class="movie-card__rank">{{ rank }}</span>
    <div class="movie-card__thumb">
      <img v-if="image" :src="image" class="movie-card__img" alt="" />
      <Badge v-if="showBadge" variant="hot" size="small" class="movie-card__badge">{{ badge }}</Badge>
      <div class="movie-card__overlay">
        <svg class="movie-card__play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M5 3l14 9-14 9V3Z"/>
        </svg>
      </div>
    </div>
  </div>

  <!-- All other variants -->
  <div v-else class="movie-card" :class="`movie-card-${variant}`">
    <div class="movie-card__thumb">
      <img v-if="image" :src="image" class="movie-card__img" alt="" />

      <!-- Netflix N (more-like-this / episode) -->
      <svg v-if="showNetflixN" class="movie-card__n" viewBox="0 0 111 152" fill="none" aria-hidden="true">
        <path d="M0 0h28.5l54 139.5V0H111v152H83L28.5 12V152H0V0Z" fill="#E50914"/>
      </svg>

      <!-- Duration badge top-right (more-like-this / episode) -->
      <span v-if="showDuration" class="movie-card__duration">{{ duration }}</span>

      <!-- Time remaining bottom-right (player) -->
      <span v-if="showTime" class="movie-card__time">{{ duration }}</span>

      <!-- Play overlay -->
      <div v-if="showPlay" class="movie-card__overlay is-visible">
        <svg class="movie-card__play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M5 3l14 9-14 9V3Z"/>
        </svg>
      </div>
      <div v-else class="movie-card__overlay">
        <svg class="movie-card__play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M5 3l14 9-14 9V3Z"/>
        </svg>
      </div>

      <!-- Progress bar (continue watching) -->
      <div v-if="showProgress" class="movie-card__progress">
        <div class="movie-card__progress-fill" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <!-- Title below thumbnail (trailer) -->
    <p v-if="showTitle" class="caption-1-regular movie-card__title">{{ title }}</p>
  </div>
</template>

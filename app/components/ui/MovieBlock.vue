<script setup lang="ts">
export interface MovieBlockItem {
  image?:    string
  title?:    string
  badge?:    string    // "Recently Added" | "Leaving Soon"
  rank?:     number    // top10 variant
  progress?: number    // 0–100, continue variant
  duration?: string    // "2h 18m", more-like-this variant
}

const props = defineProps({
  title:   { type: String, default: '' },
  variant: { type: String as PropType<'default' | 'first' | 'top10' | 'continue'>, default: 'default' },
  items:   { type: Array as PropType<MovieBlockItem[]>, default: () => [] },
})

const cardVariant = computed((): 'more-like-this' | 'top10' | 'continue' => {
  if (props.variant === 'top10') return 'top10'
  if (props.variant === 'continue') return 'continue'
  return 'more-like-this'
})
</script>

<template>
  <section class="movie-block" :class="`movie-block-${variant}`">
    <h3 v-if="title" class="movie-block__title">{{ title }}</h3>
    <div class="movie-block__row">
      <MovieCard
        v-for="(item, i) in items"
        :key="i"
        class="movie-block__item"
        :variant="cardVariant"
        :image="item.image ?? ''"
        :title="item.title ?? ''"
        :badge="item.badge ?? ''"
        :rank="item.rank ?? i + 1"
        :progress="item.progress ?? 0"
        :duration="item.duration ?? ''"
      />
    </div>
  </section>
</template>

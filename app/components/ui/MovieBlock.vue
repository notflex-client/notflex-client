<script setup lang="ts">
import EmblaCarousel from 'embla-carousel'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

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

const emblaRef = ref<HTMLElement>()
const canScrollPrev = ref(false)
const canScrollNext = ref(true)

let embla: ReturnType<typeof EmblaCarousel> | null = null

function updateButtons() {
  canScrollPrev.value = embla?.canScrollPrev() ?? false
  canScrollNext.value = embla?.canScrollNext() ?? false
}

function scrollPrev() { embla?.scrollPrev() }
function scrollNext() { embla?.scrollNext() }

onMounted(() => {
  if (!emblaRef.value) return
  embla = EmblaCarousel(
    emblaRef.value,
    { loop: false, align: 'start', dragFree: true },
    [WheelGesturesPlugin()]
  )
  embla.on('select', updateButtons)
  embla.on('reInit', updateButtons)
  updateButtons()
})

onUnmounted(() => {
  embla?.destroy()
})
</script>

<template>
  <section class="movie-block" :class="`movie-block-${variant}`">
    <span v-if="title" class="title-4-medium movie-block__title">{{ title }}</span>

    <div class="movie-block__viewport-wrap">
      <!-- Prev arrow -->
      <button
        v-if="canScrollPrev"
        class="movie-block__arrow movie-block__arrow-prev"
        aria-label="Scroll previous"
        @click="scrollPrev"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Embla viewport -->
      <div ref="emblaRef" class="movie-block__viewport">
        <div class="movie-block__row">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="movie-block__slide"
          >
            <MovieCard
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
        </div>
      </div>

      <!-- Next arrow -->
      <button
        v-if="canScrollNext"
        class="movie-block__arrow movie-block__arrow-next"
        aria-label="Scroll next"
        @click="scrollNext"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </section>
</template>

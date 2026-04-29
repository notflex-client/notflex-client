<script setup lang="ts">
import EmblaCarousel from 'embla-carousel'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

export interface MovieBlockItem {
  image?:       string
  title?:       string
  badge?:       string
  rank?:        number
  progress?:    number
  duration?:    string
  // preview card data
  rating?:      string
  seasons?:     string
  quality?:     string
  description?: string
  tags?:        string[]
  isNew?:       boolean
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

// ── Embla carousel ────────────────────────────────────────
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

// ── Preview card hover ────────────────────────────────────
const PREVIEW_WIDTH = 320
const SHOW_DELAY    = 500
const HIDE_DELAY    = 150

const hoveredIndex = ref<number | null>(null)
const previewRect  = ref<DOMRect | null>(null)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const hoveredItem = computed(() =>
  hoveredIndex.value !== null ? props.items[hoveredIndex.value] : null
)

function onSlideEnter(index: number, event: MouseEvent) {
  clearTimers()
  const el = event.currentTarget as HTMLElement
  showTimer = setTimeout(() => {
    hoveredIndex.value = index
    previewRect.value = el.getBoundingClientRect()
  }, SHOW_DELAY)
}

function onSlideLeave() {
  clearTimers()
  hideTimer = setTimeout(() => {
    hoveredIndex.value = null
    previewRect.value = null
  }, HIDE_DELAY)
}

function onPreviewEnter() { clearTimers() }

function onPreviewLeave() {
  clearTimers()
  hoveredIndex.value = null
  previewRect.value = null
}

function clearTimers() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

onUnmounted(() => {
  embla?.destroy()
  clearTimers()
})

const previewStyle = computed(() => {
  if (!previewRect.value) return {}
  const rect = previewRect.value
  const margin = 8

  let left = rect.left + rect.width / 2 - PREVIEW_WIDTH / 2
  if (left < margin) left = margin
  if (left + PREVIEW_WIDTH > window.innerWidth - margin) {
    left = window.innerWidth - margin - PREVIEW_WIDTH
  }

  // Preview image (16/9 of 320px = 180px) overlaps the card vertically
  const top = rect.top - 16

  return {
    position: 'fixed' as const,
    left:     `${left}px`,
    top:      `${top}px`,
    width:    `${PREVIEW_WIDTH}px`,
    zIndex:   9999,
  }
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
            @mouseenter="onSlideEnter(i, $event)"
            @mouseleave="onSlideLeave"
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

  <!-- Preview card – teleported outside row overflow -->
  <Teleport to="body">
    <Transition name="mpc-pop">
      <div
        v-if="hoveredItem && previewRect"
        class="mpc-wrapper"
        :style="previewStyle"
        @mouseenter="onPreviewEnter"
        @mouseleave="onPreviewLeave"
      >
        <MoviePreviewCard
          :image="hoveredItem.image ?? ''"
          :rating="hoveredItem.rating ?? 'TV-MA'"
          :seasons="hoveredItem.seasons ?? '1 Season'"
          :quality="hoveredItem.quality ?? 'HD'"
          :description="hoveredItem.description ?? 'An exciting story that will keep you on the edge of your seat.'"
          :tags="hoveredItem.tags ?? ['Drama', 'Thriller']"
          :is-new="hoveredItem.isNew ?? false"
        />
      </div>
    </Transition>
  </Teleport>
</template>

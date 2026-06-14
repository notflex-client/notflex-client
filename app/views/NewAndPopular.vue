<script setup lang="ts">
import type { CatalogMovie } from '~/composables/use-movie-catalog'
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

definePageMeta({ path: '/new-and-popular' })

const { t } = useI18n()
const { lang } = useLocale()
const { mapMovie } = useMovieCatalog()

const runtimeConfig = useRuntimeConfig()
const apiBase = (runtimeConfig.public.apiUrl as string) || 'http://localhost:8080'

// ── Tabs ──────────────────────────────────────────────────────
type Tab = 'new' | 'top10'
const activeTab = ref<Tab>('new')

// ── "New" tab state ───────────────────────────────────────────
type TypeFilter = 'all' | 'movie' | 'series'
const typeFilter  = ref<TypeFilter>('all')
const newPage     = ref(1)
const PAGE_SIZE   = 24

const { data: newData, pending: newPending } = await useAsyncData(
  'nap-new',
  () => $fetch<{ items: CatalogMovie[], itemCount: number, pageCount: number }>(
    `${apiBase}/movies`,
    {
      query: {
        sort: 'new',
        page: newPage.value,
        pageSize: PAGE_SIZE,
        ...(typeFilter.value !== 'all' && { type: typeFilter.value }),
      },
    }
  ).catch(() => ({ items: [], itemCount: 0, pageCount: 0 })),
  { watch: [newPage, typeFilter] }
)

watch(typeFilter, () => { newPage.value = 1 })

const newMovies  = computed(() => newData.value?.items?.map(m => ({ ...mapMovie(m), badge: 'Recently Added' })) ?? [])
const newTotal   = computed(() => newData.value?.itemCount ?? 0)
const newPages   = computed(() => newData.value?.pageCount ?? 0)

// ── "Top 10" tab data ─────────────────────────────────────────
const { data: top10Films } = await useAsyncData('nap-top10-films', () =>
  $fetch<{ items: CatalogMovie[] }>(`${apiBase}/movies`, {
    query: { type: 'movie', sort: 'top', pageSize: 10, page: 1 },
  }).catch(() => ({ items: [] }))
)
const { data: top10Series } = await useAsyncData('nap-top10-series', () =>
  $fetch<{ items: CatalogMovie[] }>(`${apiBase}/movies`, {
    query: { type: 'series', sort: 'top', pageSize: 10, page: 1 },
  }).catch(() => ({ items: [] }))
)

const TOP10_FILMS  = computed<MovieBlockItem[]>(() =>
  top10Films.value?.items?.map((m, i) => mapMovie(m, i)) ?? []
)
const TOP10_SERIES = computed<MovieBlockItem[]>(() =>
  top10Series.value?.items?.map((m, i) => mapMovie(m, i)) ?? []
)

// ── Preview (New tab) ─────────────────────────────────────────
const PREVIEW_WIDTH = 320
const SHOW_DELAY    = 500
const HIDE_DELAY    = 150

const hoveredIndex = ref<number | null>(null)
const previewRect  = ref<DOMRect | null>(null)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const hoveredItem = computed<MovieBlockItem | null>(() =>
  hoveredIndex.value !== null ? newMovies.value[hoveredIndex.value] ?? null : null
)

function onCardEnter(index: number, e: MouseEvent) {
  clearHoverTimers()
  const el = e.currentTarget as HTMLElement
  showTimer = setTimeout(() => {
    hoveredIndex.value = index
    previewRect.value  = el.getBoundingClientRect()
  }, SHOW_DELAY)
}
function onCardLeave() {
  clearHoverTimers()
  hideTimer = setTimeout(() => { hoveredIndex.value = null; previewRect.value = null }, HIDE_DELAY)
}
function onPreviewEnter() { clearHoverTimers() }
function onPreviewLeave() { clearHoverTimers(); hoveredIndex.value = null; previewRect.value = null }
function clearHoverTimers() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}
onUnmounted(clearHoverTimers)

const previewStyle = computed(() => {
  if (!previewRect.value) return {}
  const rect = previewRect.value
  const margin = 8
  let left = rect.left + rect.width / 2 - PREVIEW_WIDTH / 2
  if (left < margin) left = margin
  if (left + PREVIEW_WIDTH > window.innerWidth - margin) left = window.innerWidth - margin - PREVIEW_WIDTH
  return {
    position: 'fixed' as const,
    left: `${left}px`,
    top:  `${rect.top - 16}px`,
    width: `${PREVIEW_WIDTH}px`,
    zIndex: 9999,
  }
})
</script>

<template>
  <div class="nap">

    <!-- Header -->
    <AppHeader transparent sticky>
      <template #logo><span class="nap__logo">NOTFLEX</span></template>
      <template #navigation>
        <a href="/browse"             class="nap__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"             class="nap__nav-link">{{ t('nav.series') }}</a>
        <a href="/films"              class="nap__nav-link">{{ t('nav.films') }}</a>
        <a href="/new-and-popular"    class="nap__nav-link is-active">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"            class="nap__nav-link">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="nap__nav-link">{{ t('nav.browseByLanguage') }}</a>
      </template>
      <template #action>
        <ProfileMenu />
      </template>
    </AppHeader>

    <!-- Page header + tabs -->
    <div class="nap__header">
      <h1 class="title-1-bold nap__title">New &amp; Popular</h1>

      <div class="nap__tabs" role="tablist">
        <button
          role="tab"
          class="nap__tab"
          :class="{ 'is-active': activeTab === 'new' }"
          @click="activeTab = 'new'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
          New
        </button>
        <button
          role="tab"
          class="nap__tab"
          :class="{ 'is-active': activeTab === 'top10' }"
          @click="activeTab = 'top10'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.49 15a9 9 0 1 1-.18-4.99" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Top 10
        </button>
      </div>
    </div>

    <!-- ── Tab: New ───────────────────────────────────────────── -->
    <div v-show="activeTab === 'new'" class="nap__content">

      <!-- Type filter -->
      <div class="nap__type-filter">
        <button
          v-for="opt in ([
            { label: 'All', value: 'all' },
            { label: 'Movies', value: 'movie' },
            { label: 'Series', value: 'series' },
          ] as const)"
          :key="opt.value"
          class="nap__type-btn"
          :class="{ 'is-active': typeFilter === opt.value }"
          @click="typeFilter = opt.value"
        >
          {{ opt.label }}
        </button>

        <span v-if="!newPending" class="caption-1-regular nap__count">
          {{ newTotal.toLocaleString() }} titles
        </span>
      </div>

      <!-- Grid -->
      <div v-if="newPending" class="nap__state">
        <span class="body-regular nap__state-text">Loading...</span>
      </div>

      <template v-else-if="newMovies.length">
        <div class="nap__grid">
          <div
            v-for="(movie, i) in newMovies"
            :key="movie.id"
            class="nap__card"
            @mouseenter="onCardEnter(i, $event)"
            @mouseleave="onCardLeave"
            @click="movie.id && navigateTo(`/watch/${movie.id}`)"
          >
            <MovieCard
              variant="more-like-this"
              :image="movie.image ?? ''"
              :title="movie.title ?? ''"
              :badge="movie.badge ?? ''"
            />
          </div>
        </div>

        <div v-if="newPages > 1" class="nap__pagination">
          <button class="nap__page-btn" :disabled="newPage <= 1" @click="newPage--">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="caption-1-medium nap__page-info">{{ newPage }} / {{ newPages }}</span>
          <button class="nap__page-btn" :disabled="newPage >= newPages" @click="newPage++">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </template>

      <div v-else class="nap__state">
        <span class="body-regular nap__state-text">No content found.</span>
      </div>
    </div>

    <!-- ── Tab: Top 10 ────────────────────────────────────────── -->
    <div v-show="activeTab === 'top10'" class="nap__content nap__content--top10">
      <div class="nap__top10-intro">
        <p class="body-regular nap__top10-desc">
          The most-watched movies and series on Notflex, ranked by rating.
        </p>
      </div>
      <MovieBlock title="Top 10 Movies Today"  variant="top10" :items="TOP10_FILMS" />
      <MovieBlock title="Top 10 Series Today"  variant="top10" :items="TOP10_SERIES" />
    </div>

    <AppFooter variant="home" v-model:lang="lang" />

    <!-- Preview card -->
    <Teleport to="body">
      <Transition name="mpc-pop">
        <div
          v-if="activeTab === 'new' && hoveredItem && previewRect"
          :style="previewStyle"
          @mouseenter="onPreviewEnter"
          @mouseleave="onPreviewLeave"
        >
          <MoviePreviewCard
            :image="hoveredItem.image ?? ''"
            :title="hoveredItem.title ?? ''"
            :rating="hoveredItem.rating ?? ''"
            :seasons="hoveredItem.duration ?? ''"
            quality="HD"
            :description="hoveredItem.description ?? ''"
            :tags="hoveredItem.tags ?? []"
            :is-new="true"
            @play="hoveredItem.id && navigateTo(`/watch/${hoveredItem.id}`)"
          />
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style lang="scss" scoped>
.nap {
  min-height: 100vh;
  background-color: token("color-background-base");

  &__logo {
    font-family: token("font-family-logo");
    font-size: 28px;
    color: token("color-action-brand");
    letter-spacing: 2px;
  }

  &__nav-link {
    @include typography-variant("small-body-regular");
    color: token("color-text-secondary");
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s ease;
    &:hover     { color: token("color-text-primary"); }
    &.is-active { font-weight: var(--font-weight-medium); color: token("color-text-primary"); }
  }

  // ── Page header ────────────────────────────────────────────────
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 96px token("layout-margin") token("dm-24");
    gap: token("dm-16");
  }

  &__title { color: token("color-text-primary"); }

  // ── Tabs ───────────────────────────────────────────────────────
  &__tabs {
    display: flex;
    gap: token("dm-4");
    background: rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    padding: 4px;
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: token("dm-6");
    padding: 8px 18px;
    border: none;
    border-radius: 6px;
    background: none;
    color: token("color-text-secondary");
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover { color: token("color-text-primary"); }

    &.is-active {
      background: rgba(255, 255, 255, 0.12);
      color: token("color-text-primary");
    }
  }

  // ── Content area ───────────────────────────────────────────────
  &__content {
    padding: 0 token("layout-margin") token("dm-64");

    &--top10 {
      padding-top: token("dm-16");
      padding-left: 0;
      padding-right: 0;
    }
  }

  // ── Type filter ────────────────────────────────────────────────
  &__type-filter {
    display: flex;
    align-items: center;
    gap: token("dm-8");
    margin-bottom: token("dm-20");
  }

  &__type-btn {
    padding: 6px 16px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    background: none;
    color: token("color-text-secondary");
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

    &:hover { color: token("color-text-primary"); border-color: rgba(255, 255, 255, 0.3); }

    &.is-active {
      background: token("color-text-primary");
      color: token("color-background-base");
      border-color: token("color-text-primary");
    }
  }

  &__count {
    margin-left: auto;
    color: token("color-text-secondary");
  }

  // ── Grid ───────────────────────────────────────────────────────
  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: token("dm-12");

    @media (max-width: 1280px) { grid-template-columns: repeat(5, 1fr); }
    @media (max-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
    @media (max-width: 720px)  { grid-template-columns: repeat(3, 1fr); }
  }

  &__card {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    transition: transform 0.18s ease;
    &:hover { transform: scale(1.05); }
  }

  // ── Pagination ─────────────────────────────────────────────────
  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: token("dm-16");
    padding-top: token("dm-40");
  }

  &__page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    color: token("color-text-primary");
    cursor: pointer;
    transition: background 0.15s ease;
    &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.14); }
    &:disabled             { opacity: 0.3; cursor: default; }
  }

  &__page-info { color: token("color-text-secondary"); }

  // ── Top 10 intro ───────────────────────────────────────────────
  &__top10-intro {
    padding: 0 token("layout-margin") token("dm-8");
  }

  &__top10-desc { color: token("color-text-secondary"); }

  // ── States ─────────────────────────────────────────────────────
  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: token("dm-80") 0;
  }

  &__state-text { color: token("color-text-secondary"); }
}

.mpc-pop-enter-active { animation: mpc-pop-in 0.18s ease; }
.mpc-pop-leave-active { animation: mpc-pop-in 0.12s ease reverse; }
@keyframes mpc-pop-in {
  from { opacity: 0; transform: scale(0.92) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>

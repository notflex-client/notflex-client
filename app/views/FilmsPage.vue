<script setup lang="ts">
import type { CatalogMovie } from '~/composables/use-movie-catalog'
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

definePageMeta({ path: '/films' })

const { t } = useI18n()
const { lang } = useLocale()
const { mapMovie } = useMovieCatalog()

interface Genre { id: number; name: string }
interface Tag   { id: number; name: string; slug: string }

const runtimeConfig = useRuntimeConfig()
const apiBase = (runtimeConfig.public.apiUrl as string) || 'http://localhost:8080'

// ── Genres & Tags ─────────────────────────────────────────────
const [{ data: genresData }, { data: tagsData }] = await Promise.all([
  useAsyncData('films-genres', () => $fetch<Genre[]>(`${apiBase}/genres`).catch(() => [] as Genre[])),
  useAsyncData('films-tags',   () => $fetch<Tag[]>(`${apiBase}/tags`).catch(() => [] as Tag[])),
])
const genres = computed(() => genresData.value ?? [])
const tags   = computed(() => tagsData.value   ?? [])

// ── Filters ───────────────────────────────────────────────────
const route           = useRoute()
const initKeyword     = (route.query.keyword as string) || ''
const search          = ref(initKeyword)
const committedSearch = ref(initKeyword)
const selectedGenre   = ref<number | null>(null)
const selectedTag     = ref<string | null>(null)
const page            = ref(1)
const PAGE_SIZE       = 24

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, (val) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { committedSearch.value = val; page.value = 1 }, 400)
})
watch([selectedGenre, selectedTag], () => { page.value = 1 })

// ── Movies ────────────────────────────────────────────────────
const { data: moviesData, pending } = await useAsyncData(
  'films-movies',
  () => $fetch<{ items: CatalogMovie[], itemCount: number, pageCount: number, page: number }>(
    `${apiBase}/movies`,
    {
      query: {
        type: 'movie', page: page.value, pageSize: PAGE_SIZE, sort: 'top',
        ...(committedSearch.value && { keyword:  committedSearch.value }),
        ...(selectedGenre.value   && { genre_id: selectedGenre.value }),
        ...(selectedTag.value     && { tag:      selectedTag.value }),
      },
    }
  ).catch(() => ({ items: [], itemCount: 0, pageCount: 0, page: 1 })),
  { watch: [page, committedSearch, selectedGenre, selectedTag] }
)

const movies     = computed(() => moviesData.value?.items?.map(m => mapMovie(m)) ?? [])
const totalCount = computed(() => moviesData.value?.itemCount ?? 0)
const totalPages = computed(() => moviesData.value?.pageCount ?? 0)

const hasFilters = computed(() =>
  !!committedSearch.value || selectedGenre.value !== null || selectedTag.value !== null
)
function clearFilters() {
  search.value = ''; committedSearch.value = ''
  selectedGenre.value = null; selectedTag.value = null; page.value = 1
}

// ── Preview card ──────────────────────────────────────────────
const PREVIEW_WIDTH = 320
const SHOW_DELAY    = 500
const HIDE_DELAY    = 150

const hoveredIndex = ref<number | null>(null)
const previewRect  = ref<DOMRect | null>(null)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const hoveredItem = computed<MovieBlockItem | null>(() =>
  hoveredIndex.value !== null ? movies.value[hoveredIndex.value] ?? null : null
)

function onCardEnter(index: number, e: MouseEvent) {
  clearHoverTimers()
  const el = e.currentTarget as HTMLElement
  showTimer = setTimeout(() => { hoveredIndex.value = index; previewRect.value = el.getBoundingClientRect() }, SHOW_DELAY)
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
  return { position: 'fixed' as const, left: `${left}px`, top: `${rect.top - 16}px`, width: `${PREVIEW_WIDTH}px`, zIndex: 9999 }
})
</script>

<template>
  <div class="films-page">

    <!-- Header -->
    <AppHeader transparent sticky>
      <template #logo><span class="films-page__logo">NOTFLEX</span></template>
      <template #navigation>
        <a href="/browse"             class="films-page__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"             class="films-page__nav-link">{{ t('nav.series') }}</a>
        <a href="/films"              class="films-page__nav-link is-active">{{ t('nav.films') }}</a>
        <a href="/new-and-popular"    class="films-page__nav-link">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"            class="films-page__nav-link">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="films-page__nav-link">{{ t('nav.browseByLanguage') }}</a>
      </template>
      <template #action>
        <IconButton variant="ghost" size="small" :aria-label="t('action.notifications')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </IconButton>
        <Avatar size="small" :showArrow="true" name="James" />
      </template>
    </AppHeader>

    <!-- Toolbar -->
    <div class="films-page__toolbar">
      <div class="films-page__toolbar-left">
        <h1 class="title-1-bold films-page__heading">Movies</h1>
        <span v-if="!pending" class="caption-1-regular films-page__count">
          {{ totalCount.toLocaleString() }} titles
        </span>
      </div>

      <div class="films-page__filters">
        <div class="films-page__search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="films-page__search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <input v-model="search" class="films-page__search-input" placeholder="Search..." type="search">
        </div>

        <Dropdown
          v-model="selectedGenre"
          :options="genres.map(g => ({ label: g.name, value: g.id }))"
          placeholder="Genre"
          size="small"
          class="films-page__dropdown"
        />

        <Dropdown
          v-model="selectedTag"
          :options="tags.map(tg => ({ label: tg.name, value: tg.slug }))"
          placeholder="Tag"
          size="small"
          class="films-page__dropdown"
        />

        <button v-if="hasFilters" class="films-page__clear-btn" @click="clearFilters">
          Clear
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="films-page__content">
      <div v-if="pending" class="films-page__state">
        <span class="body-regular films-page__state-text">Loading...</span>
      </div>

      <template v-else-if="movies.length">
        <div class="films-page__grid">
          <div
            v-for="(movie, i) in movies"
            :key="movie.id"
            class="films-page__card"
            @mouseenter="onCardEnter(i, $event)"
            @mouseleave="onCardLeave"
            @click="movie.id && navigateTo(`/watch/${movie.id}`)"
          >
            <MovieCard variant="more-like-this" :image="movie.image ?? ''" :title="movie.title ?? ''" />
          </div>
        </div>

        <div v-if="totalPages > 1" class="films-page__pagination">
          <button class="films-page__page-btn" :disabled="page <= 1" @click="page--">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="caption-1-medium films-page__page-info">{{ page }} / {{ totalPages }}</span>
          <button class="films-page__page-btn" :disabled="page >= totalPages" @click="page++">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </template>

      <div v-else class="films-page__state">
        <span class="body-regular films-page__state-text">No movies found.</span>
        <button v-if="hasFilters" class="films-page__clear-btn" @click="clearFilters">Clear filters</button>
      </div>
    </div>

    <AppFooter variant="home" v-model:lang="lang" />

    <!-- Preview -->
    <Teleport to="body">
      <Transition name="mpc-pop">
        <div
          v-if="hoveredItem && previewRect"
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
            :is-new="hoveredItem.isNew ?? false"
            @play="hoveredItem.id && navigateTo(`/watch/${hoveredItem.id}`)"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.films-page {
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

  // ── Toolbar ───────────────────────────────────────────────────
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-16");
    padding: 96px token("layout-margin") token("dm-24");
  }

  &__toolbar-left {
    display: flex;
    align-items: baseline;
    gap: token("dm-10");
    flex-shrink: 0;
  }

  &__heading { color: token("color-text-primary"); }
  &__count   { color: token("color-text-secondary"); }

  &__filters {
    display: flex;
    align-items: center;
    gap: token("dm-8");
  }

  // ── Search ────────────────────────────────────────────────────
  &__search-wrap {
    position: relative;
    width: 220px;
  }

  &__search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: token("color-text-secondary");
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: 7px 10px 7px 30px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    color: token("color-text-primary");
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s ease, background 0.15s ease;

    &::placeholder { color: token("color-text-secondary"); }
    &:focus        { border-color: rgba(255, 255, 255, 0.35); background: rgba(255, 255, 255, 0.10); }
    &::-webkit-search-cancel-button { display: none; }
  }

  // ── Dropdowns ─────────────────────────────────────────────────
  &__dropdown {
    flex-shrink: 0;
    width: auto !important;

    :deep(.dropdown__trigger) {
      width: auto;
      min-width: 110px;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      color: token("color-text-primary");
      &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.12); }
    }
    :deep(.dropdown__value),
    :deep(.dropdown__chevron) { color: token("color-text-primary"); }
  }

  &__clear-btn {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    cursor: pointer;
    color: token("color-text-secondary");
    font-size: 12px;
    padding: 6px 12px;
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease;
    &:hover { color: token("color-text-primary"); border-color: rgba(255, 255, 255, 0.3); }
  }

  // ── Grid ─────────────────────────────────────────────────────
  &__content {
    padding: 0 token("layout-margin") token("dm-64");
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    padding: token("dm-36") 0;
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

  // ── Pagination ────────────────────────────────────────────────
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

  // ── States ────────────────────────────────────────────────────
  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: token("dm-16");
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

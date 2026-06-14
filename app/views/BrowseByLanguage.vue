<script setup lang="ts">
import type { CatalogMovie } from '~/composables/use-movie-catalog'
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

definePageMeta({ path: '/browse-by-language' })

const { t } = useI18n()
const { lang } = useLocale()
const { mapMovie } = useMovieCatalog()

const runtimeConfig = useRuntimeConfig()
const apiBase = (runtimeConfig.public.apiUrl as string) || 'http://localhost:8080'

// ── Languages ──────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'ko', label: '한국어',       flag: '🇰🇷' },
  { code: 'ja', label: '日本語',       flag: '🇯🇵' },
  { code: 'zh', label: '中文',         flag: '🇨🇳' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
  { code: 'th', label: 'ภาษาไทย',     flag: '🇹🇭' },
  { code: 'hi', label: 'हिन्दी',        flag: '🇮🇳' },
  { code: 'ar', label: 'العربية',     flag: '🇸🇦' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
]

// ── Filter state ───────────────────────────────────────────────
const selectedLang = ref<string | null>(null)
const page         = ref(1)
const PAGE_SIZE    = 24

watch(selectedLang, () => { page.value = 1 })

const selectedLabel = computed(() =>
  selectedLang.value ? LANGUAGES.find(l => l.code === selectedLang.value)?.label ?? '' : 'All Languages'
)

// ── Movies ─────────────────────────────────────────────────────
const { data: moviesData, pending } = await useAsyncData(
  'browse-lang-movies',
  () => $fetch<{ items: CatalogMovie[], itemCount: number, pageCount: number }>(
    `${apiBase}/movies`,
    {
      query: {
        sort: 'top',
        page: page.value,
        pageSize: PAGE_SIZE,
        ...(selectedLang.value && { language: selectedLang.value }),
      },
    }
  ).catch(() => ({ items: [], itemCount: 0, pageCount: 0 })),
  { watch: [page, selectedLang] }
)

const movies     = computed(() => moviesData.value?.items?.map(m => mapMovie(m)) ?? [])
const totalCount = computed(() => moviesData.value?.itemCount ?? 0)
const totalPages = computed(() => moviesData.value?.pageCount ?? 0)

// ── Preview ────────────────────────────────────────────────────
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
  <div class="blp">

    <!-- Header -->
    <AppHeader transparent sticky>
      <template #logo><span class="blp__logo">NOTFLEX</span></template>
      <template #navigation>
        <a href="/browse"             class="blp__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"             class="blp__nav-link">{{ t('nav.series') }}</a>
        <a href="/films"              class="blp__nav-link">{{ t('nav.films') }}</a>
        <a href="/new-and-popular"    class="blp__nav-link">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"            class="blp__nav-link">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="blp__nav-link is-active">{{ t('nav.browseByLanguage') }}</a>
      </template>
      <template #action>
        <ProfileMenu />
      </template>
    </AppHeader>

    <!-- Toolbar -->
    <div class="blp__toolbar">
      <div class="blp__toolbar-top">
        <h1 class="title-1-bold blp__heading">Browse by Language</h1>
        <span v-if="!pending" class="caption-1-regular blp__count">
          {{ totalCount.toLocaleString() }} titles
          <template v-if="selectedLang"> in {{ selectedLabel }}</template>
        </span>
      </div>

      <!-- Language pills -->
      <div class="blp__pills">
        <button
          class="blp__pill"
          :class="{ 'is-active': selectedLang === null }"
          @click="selectedLang = null"
        >
          🌐 All
        </button>
        <button
          v-for="l in LANGUAGES"
          :key="l.code"
          class="blp__pill"
          :class="{ 'is-active': selectedLang === l.code }"
          @click="selectedLang = l.code"
        >
          {{ l.flag }} {{ l.label }}
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="blp__content">
      <!-- Skeleton -->
      <div v-if="pending" class="blp__grid">
        <div v-for="n in PAGE_SIZE" :key="n" class="blp__skeleton" />
      </div>

      <template v-else-if="movies.length">
        <div class="blp__grid">
          <div
            v-for="(movie, i) in movies"
            :key="movie.id"
            class="blp__card"
            @mouseenter="onCardEnter(i, $event)"
            @mouseleave="onCardLeave"
            @click="movie.id && navigateTo(`/watch/${movie.id}`)"
          >
            <MovieCard variant="more-like-this" :image="movie.image ?? ''" :title="movie.title ?? ''" />
          </div>
        </div>

        <div v-if="totalPages > 1" class="blp__pagination">
          <button class="blp__page-btn" :disabled="page <= 1" @click="page--">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="caption-1-medium blp__page-info">{{ page }} / {{ totalPages }}</span>
          <button class="blp__page-btn" :disabled="page >= totalPages" @click="page++">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </template>

      <div v-else class="blp__empty">
        <span class="body-regular blp__empty-text">No titles found for this language.</span>
        <button v-if="selectedLang" class="blp__reset-btn" @click="selectedLang = null">
          Show all languages
        </button>
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
.blp {
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
    padding: 96px token("layout-margin") token("dm-24");
    display: flex;
    flex-direction: column;
    gap: token("dm-20");
  }

  &__toolbar-top {
    display: flex;
    align-items: baseline;
    gap: token("dm-12");
  }

  &__heading { color: token("color-text-primary"); }
  &__count   { color: token("color-text-secondary"); }

  // ── Language pills ─────────────────────────────────────────────
  &__pills {
    display: flex;
    flex-wrap: wrap;
    gap: token("dm-12");
    padding-bottom: token("dm-20");
  }

  &__pill {
    padding: 7px 16px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    background: none;
    color: token("color-text-secondary");
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;

    &:hover { color: token("color-text-primary"); border-color: rgba(255, 255, 255, 0.3); }

    &.is-active {
      background: token("color-text-primary");
      color: token("color-background-base");
      border-color: token("color-text-primary");
    }
  }

  // ── Grid ──────────────────────────────────────────────────────
  &__content {
    padding: 0 token("layout-margin") token("dm-64");
  }

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

  &__skeleton {
    aspect-ratio: 2 / 3;
    border-radius: 4px;
    background: linear-gradient(90deg, token("grey-700") 25%, token("grey-600") 50%, token("grey-700") 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
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

  // ── Empty ─────────────────────────────────────────────────────
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: token("dm-16");
    padding: token("dm-80") 0;
  }

  &__empty-text { color: token("color-text-secondary"); }

  &__reset-btn {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: token("color-text-secondary");
    font-size: 13px;
    padding: 7px 16px;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
    &:hover { color: token("color-text-primary"); border-color: rgba(255, 255, 255, 0.4); }
  }
}

.mpc-pop-enter-active { animation: mpc-pop-in 0.18s ease; }
.mpc-pop-leave-active { animation: mpc-pop-in 0.12s ease reverse; }
@keyframes mpc-pop-in {
  from { opacity: 0; transform: scale(0.92) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>

<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'
import type { DropdownOption } from '~/components/ui/Dropdown.vue'

definePageMeta({ path: '/series' })

const { t } = useI18n()
const { lang } = useLocale()

const HERO_IMAGE = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80'

const { listMovies, mapMovie } = useMovieCatalog()

const { data: topSeries } = await useAsyncData('series-top-movies', () =>
  listMovies({ pageSize: 10, type: 'series', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: newSeries } = await useAsyncData('series-new-movies', () =>
  listMovies({ pageSize: 20, type: 'series', sort: 'new' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: koreanSeries } = await useAsyncData('series-korean-movies', () =>
  listMovies({ pageSize: 20, type: 'series', tag: 'korean', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: originalSeries } = await useAsyncData('series-originals-movies', () =>
  listMovies({ pageSize: 20, type: 'series', tag: 'netflix-originals', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: trendingSeries } = await useAsyncData('series-trending-movies', () =>
  listMovies({ pageSize: 20, type: 'series', tag: 'trending', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)

// ── Genre list ──────────────────────────────────────────────────────────────
const GENRES = computed<DropdownOption[]>(() => [
  { value: '10759', label: t('genre.actionAdventure') },
  { value: '16',    label: t('genre.animation') },
  { value: '35',    label: t('genre.comedy') },
  { value: '99',    label: t('genre.documentary') },
  { value: '18',    label: t('genre.drama') },
  { value: '10751', label: t('genre.family') },
  { value: '10762', label: t('genre.kids') },
  { value: '9648',  label: t('genre.mystery') },
  { value: '10765', label: t('genre.scifiFantasy') },
  { value: '10768', label: t('genre.warPolitics') },
  { value: '37',    label: t('genre.horror') },
])

// ── Genre filter state ──────────────────────────────────────────────────────
const selectedGenre    = ref<string | null>(null)
const genreItems       = ref<MovieBlockItem[]>([])
const genreLoading     = ref(false)

const selectedGenreLabel = computed(
  () => GENRES.value.find(g => g.value === selectedGenre.value)?.label ?? ''
)

watch(selectedGenre, async (genreId) => {
  if (!genreId) {
    genreItems.value = []
    return
  }
  genreLoading.value = true
  try {
    const res = await listMovies({ pageSize: 20, type: 'series', genre_id: genreId })
    genreItems.value = res.items?.map(movie => mapMovie(movie)) ?? []
  } catch {
    genreItems.value = []
  } finally {
    genreLoading.value = false
  }
})

// ── Default rows ────────────────────────────────────────────────────────────
const TOP_PICKS = computed<MovieBlockItem[]>(() => topSeries.value?.items?.map(movie => mapMovie(movie)) ?? [])
const KOREAN = computed<MovieBlockItem[]>(() => koreanSeries.value?.items?.map(movie => mapMovie(movie)) ?? [])
const NETFLIX_ORIGINALS = computed<MovieBlockItem[]>(() => originalSeries.value?.items?.map(movie => mapMovie(movie)) ?? [])
const TOP_10 = computed<MovieBlockItem[]>(() => topSeries.value?.items?.map((movie, index) => mapMovie(movie, index)) ?? [])
const TRENDING = computed<MovieBlockItem[]>(() => trendingSeries.value?.items?.map(movie => mapMovie(movie)) ?? [])
</script>

<template>
  <div class="series-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="series-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a href="/browse"          class="series-page__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"          class="series-page__nav-link is-active">{{ t('nav.series') }}</a>
        <a href="/films"           class="series-page__nav-link">{{ t('nav.films') }}</a>
        <a href="/new-and-popular" class="series-page__nav-link">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"         class="series-page__nav-link">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="series-page__nav-link">{{ t('nav.browseByLanguage') }}</a>
      </template>
      <template #action>
        <IconButton variant="ghost" size="small" :aria-label="t('action.search')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </IconButton>
        <IconButton variant="ghost" size="small" :aria-label="t('action.notifications')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </IconButton>
        <Avatar size="small" :showArrow="true" name="James" />
      </template>
    </AppHeader>

    <!-- ── Hero ────────────────────────────────────────────────── -->
    <HeroBanner variant="home" :image="HERO_IMAGE">
      <div class="series-page__hero-body">

        <div class="series-page__hero-top">
          <template v-if="selectedGenre">
            <button class="series-page__breadcrumb body-regular" @click="selectedGenre = null">{{ t('series.pageTitle') }}</button>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="title-1-bold series-page__page-title">{{ selectedGenreLabel }}</span>
          </template>
          <template v-else>
            <span class="title-1-bold series-page__page-title">{{ t('series.pageTitle') }}</span>
            <Dropdown
              v-model="selectedGenre"
              :options="GENRES"
              :placeholder="t('series.genrePlaceholder')"
              size="small"
              class="series-page__genre-dropdown"
            />
          </template>
        </div>

        <div class="series-page__hero-bottom">
          <TitleCard
            size="full"
            :category="t('series.hero.category')"
            :title="t('series.hero.title')"
            :description="t('series.hero.description')"
          >
            <template #actions>
              <Button variant="light" size="small">
                <template #leading-icon>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M5 3l14 9-14 9V3Z"/>
                  </svg>
                </template>
                {{ t('action.play') }}
              </Button>
              <Button variant="secondary" size="small">
                <template #leading-icon>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 11v5M12 8.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </template>
                {{ t('action.moreInfo') }}
              </Button>
            </template>
          </TitleCard>
        </div>

      </div>
    </HeroBanner>

    <!-- ── Content ─────────────────────────────────────────────── -->
    <div class="series-page__content">

      <template v-if="selectedGenre">
        <div v-if="genreLoading" class="series-page__loading">
          <span class="body-regular series-page__loading-text">{{ t('action.loading') }}</span>
        </div>
        <MovieBlock
          v-else-if="genreItems.length"
          :title="selectedGenreLabel"
          :items="genreItems"
        />
      </template>

      <MovieBlock :title="t('series.rows.topPicks')"         :items="TOP_PICKS" />
      <MovieBlock :title="t('series.rows.top10')"            variant="top10" :items="TOP_10" />
      <MovieBlock :title="t('series.rows.korean')"           :items="KOREAN" />
      <MovieBlock :title="t('series.rows.trending')"         :items="TRENDING" />
      <MovieBlock :title="t('series.rows.netflixOriginals')" :items="NETFLIX_ORIGINALS" />

    </div>

    <!-- ── Footer ──────────────────────────────────────────────── -->
    <AppFooter variant="home" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;
@use "~/assets/scss/mixins/typography" as *;

.series-page {
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

    &:hover   { color: token("color-text-primary"); }
    &.is-active {
      font-weight: var(--font-weight-medium);
      color: token("color-text-primary");
    }
  }

  :deep(.hero-banner) {
    align-items: stretch;
  }

  :deep(.hero-banner__content) {
    max-width: none;
    padding: token("dm-24") token("dm-48") token("dm-56");
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__hero-body {
    display: contents;
  }

  &__hero-top {
    display: flex;
    align-items: center;
    gap: token("dm-12");
  }

  &__breadcrumb {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: token("color-text-secondary");
    transition: color 0.15s ease;
    &:hover { color: var(--white); }
  }

  &__page-title { color: var(--white); }

  &__genre-dropdown {
    width: auto;
    flex-shrink: 0;

    :deep(.dropdown__trigger) {
      width: auto;
      min-width: 120px;
      border: 1px solid rgba(255, 255, 255, 0.55);
      background-color: rgba(0, 0, 0, 0.3);
      color: var(--white);
      white-space: nowrap;

      &:hover:not(:disabled) {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }

    :deep(.dropdown__value),
    :deep(.dropdown__chevron) {
      color: var(--white);
    }
  }

  &__hero-bottom {
    max-width: 520px;
  }

  &__content {
    padding: token("dm-16") 0 token("dm-48");
    display: flex;
    flex-direction: column;
    gap: token("dm-24");
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: token("dm-24") 0;
  }

  &__loading-text { color: token("color-text-secondary"); }
}
</style>

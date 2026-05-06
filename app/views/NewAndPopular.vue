<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

definePageMeta({ path: '/new-and-popular' })

const { t } = useI18n()
const { lang } = useLocale()

const { listMovies, mapMovie } = useMovieCatalog()

const { data: newMovies } = await useAsyncData('new-popular-new-movies', () =>
  listMovies({ pageSize: 20, sort: 'new' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: topFilms } = await useAsyncData('new-popular-top-films', () =>
  listMovies({ pageSize: 10, type: 'movie', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: topSeries } = await useAsyncData('new-popular-top-series', () =>
  listMovies({ pageSize: 10, type: 'series', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: freshMovies } = await useAsyncData('new-popular-fresh-movies', () =>
  listMovies({ pageSize: 20, tag: 'fresh-picks', sort: 'new' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: weekendMovies } = await useAsyncData('new-popular-weekend-movies', () =>
  listMovies({ pageSize: 20, tag: 'weekend', sort: 'new' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)

// ── Mới trên Netflix ────────────────────────────────────────────────────────
const NEW_ON_NETFLIX = computed<MovieBlockItem[]>(() => newMovies.value?.items?.map(movie => ({ ...mapMovie(movie), badge: t('badge.recentlyAdded') })) ?? [])

// ── Top 10 phim ─────────────────────────────────────────────────────────────
const TOP10_FILMS = computed<MovieBlockItem[]>(() => topFilms.value?.items?.map((movie, index) => mapMovie(movie, index)) ?? [])

// ── Top 10 series ────────────────────────────────────────────────────────────
const TOP10_SERIES = computed<MovieBlockItem[]>(() => topSeries.value?.items?.map((movie, index) => mapMovie(movie, index)) ?? [])

// ── Đáng chờ đợi ─────────────────────────────────────────────────────────────
const COMING_SOON = computed<MovieBlockItem[]>(() => freshMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])

// ── Ra mắt tuần tới ──────────────────────────────────────────────────────────
const NEXT_WEEK = computed<MovieBlockItem[]>(() => weekendMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
</script>

<template>
  <div class="new-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="new-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a href="/browse"          class="new-page__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"          class="new-page__nav-link">{{ t('nav.series') }}</a>
        <a href="/films"           class="new-page__nav-link">{{ t('nav.films') }}</a>
        <a href="/new-and-popular" class="new-page__nav-link is-active">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"         class="new-page__nav-link">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="new-page__nav-link">{{ t('nav.browseByLanguage') }}</a>
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

    <!-- ── Content ─────────────────────────────────────────────── -->
    <div class="new-page__content">
      <MovieBlock :title="t('newPopular.rows.newOnNetflix')" :items="NEW_ON_NETFLIX" />
      <MovieBlock :title="t('newPopular.rows.top10Films')"   variant="top10" :items="TOP10_FILMS" />
      <MovieBlock :title="t('newPopular.rows.top10Series')"  variant="top10" :items="TOP10_SERIES" />
      <MovieBlock :title="t('newPopular.rows.comingSoon')"   :items="COMING_SOON" />
      <MovieBlock :title="t('newPopular.rows.nextWeek')"     :items="NEXT_WEEK" />
    </div>

    <!-- ── Footer ──────────────────────────────────────────────── -->
    <AppFooter variant="home" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;
@use "~/assets/scss/mixins/typography" as *;

.new-page {
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
    &.is-active {
      font-weight: var(--font-weight-medium);
      color: token("color-text-primary");
    }
  }

  &__content {
    padding: token("dm-80") 0 token("dm-48");
    display: flex;
    flex-direction: column;
    gap: token("dm-32");
  }
}
</style>

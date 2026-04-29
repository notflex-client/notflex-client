<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

definePageMeta({ path: '/new-and-popular' })

const { t } = useI18n()
const lang = ref('en')

function thumb(seed: number) {
  return `https://picsum.photos/seed/${seed}/300/170`
}

// ── Mới trên Netflix ────────────────────────────────────────────────────────
const NEW_ON_NETFLIX = computed<MovieBlockItem[]>(() => [
  { image: thumb(810), badge: t('shared.badge.newSeason') },
  { image: thumb(811), badge: t('shared.badge.newSeason') },
  { image: thumb(812), badge: t('shared.badge.newEpisode') },
  { image: thumb(813) },
  { image: thumb(814), badge: t('shared.badge.newEpisode') },
  { image: thumb(815) },
  { image: thumb(816), badge: t('shared.badge.newSeason') },
  { image: thumb(817) },
])

// ── Top 10 phim ─────────────────────────────────────────────────────────────
const TOP10_FILMS = computed<MovieBlockItem[]>(() => [
  { image: thumb(821), rank: 1,  badge: t('shared.badge.newlyAdded') },
  { image: thumb(822), rank: 2 },
  { image: thumb(823), rank: 3,  badge: t('shared.badge.newlyAdded') },
  { image: thumb(824), rank: 4,  badge: t('shared.badge.newlyAdded') },
  { image: thumb(825), rank: 5 },
  { image: thumb(826), rank: 6,  badge: t('shared.badge.newlyAdded') },
  { image: thumb(827), rank: 7 },
  { image: thumb(828), rank: 8 },
  { image: thumb(829), rank: 9 },
  { image: thumb(830), rank: 10 },
])

// ── Top 10 series ────────────────────────────────────────────────────────────
const TOP10_SERIES = computed<MovieBlockItem[]>(() => [
  { image: thumb(831), rank: 1 },
  { image: thumb(832), rank: 2,  badge: t('shared.badge.newEpisode') },
  { image: thumb(833), rank: 3 },
  { image: thumb(834), rank: 4 },
  { image: thumb(835), rank: 5 },
  { image: thumb(836), rank: 6,  badge: t('shared.badge.newEpisode') },
  { image: thumb(837), rank: 7 },
  { image: thumb(838), rank: 8 },
  { image: thumb(839), rank: 9 },
  { image: thumb(840), rank: 10 },
])

// ── Đáng chờ đợi ─────────────────────────────────────────────────────────────
const COMING_SOON: MovieBlockItem[] = [
  { image: thumb(841) },
  { image: thumb(842) },
  { image: thumb(843) },
  { image: thumb(844) },
  { image: thumb(845) },
  { image: thumb(846) },
  { image: thumb(847) },
]

// ── Ra mắt tuần tới ──────────────────────────────────────────────────────────
const NEXT_WEEK: MovieBlockItem[] = [
  { image: thumb(851) },
  { image: thumb(852) },
  { image: thumb(853) },
]
</script>

<template>
  <div class="new-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="new-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a href="/browse"          class="new-page__nav-link">{{ t('shared.nav.home') }}</a>
        <a href="/series"          class="new-page__nav-link">{{ t('shared.nav.series') }}</a>
        <a href="/films"           class="new-page__nav-link">{{ t('shared.nav.films') }}</a>
        <a href="/new-and-popular" class="new-page__nav-link is-active">{{ t('shared.nav.newAndPopular') }}</a>
        <a href="/my-list"         class="new-page__nav-link">{{ t('shared.nav.myList') }}</a>
        <a href="/browse-by-language" class="new-page__nav-link">{{ t('shared.nav.browseByLanguage') }}</a>
      </template>
      <template #action>
        <IconButton variant="ghost" size="small" :aria-label="t('shared.action.search')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </IconButton>
        <IconButton variant="ghost" size="small" :aria-label="t('shared.action.notifications')">
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

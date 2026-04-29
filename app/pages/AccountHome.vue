<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

definePageMeta({ path: '/browse' })

const { t } = useI18n()
const lang = ref('en')

const NAV_LINKS = computed(() => [
  { label: t('shared.nav.home'),            active: true },
  { label: t('shared.nav.series'),          href: '/series' },
  { label: t('shared.nav.films'),           href: '/films' },
  { label: t('shared.nav.newAndPopular'),   href: '/new-and-popular' },
  { label: t('shared.nav.myList'),          href: '/my-list' },
  { label: t('shared.nav.browseByLanguage'), href: '/browse-by-language' },
])

const HERO_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80'

function thumb(seed: number) {
  return `https://picsum.photos/seed/${seed}/300/170`
}

const MATCHED = computed<MovieBlockItem[]>(() => [
  { image: thumb(10), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(20), badge: t('shared.badge.leavingSoon') },
  { image: thumb(30) },
  { image: thumb(40), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(50) },
  { image: thumb(60), badge: t('shared.badge.recentlyAdded') },
])

const NEW_ON_NETFLIX = computed<MovieBlockItem[]>(() => [
  { image: thumb(11), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(21), badge: t('shared.badge.leavingSoon') },
  { image: thumb(31) },
  { image: thumb(41), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(51) },
  { image: thumb(61) },
])

const TOP_10 = computed<MovieBlockItem[]>(() => [
  { image: thumb(12), badge: t('shared.badge.recentlyAdded'), rank: 1 },
  { image: thumb(22), badge: t('shared.badge.recentlyAdded'), rank: 2 },
  { image: thumb(32),                                          rank: 3 },
  { image: thumb(42),                                          rank: 4 },
  { image: thumb(52), badge: t('shared.badge.recentlyAdded'), rank: 5 },
  { image: thumb(62),                                          rank: 6 },
  { image: thumb(72),                                          rank: 7 },
])

const CONTINUE: MovieBlockItem[] = [
  { image: thumb(13), progress: 45 },
  { image: thumb(23), progress: 20 },
  { image: thumb(33), progress: 72 },
  { image: thumb(43), progress: 10 },
]

const THINK_YOULL_LOVE = computed<MovieBlockItem[]>(() => [
  { image: thumb(14), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(24), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(34), badge: t('shared.badge.leavingSoon') },
  { image: thumb(44), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(54) },
  { image: thumb(64), badge: t('shared.badge.recentlyAdded') },
])

const ANIMATION = computed<MovieBlockItem[]>(() => [
  { image: thumb(15), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(25), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(35), badge: t('shared.badge.leavingSoon') },
  { image: thumb(45), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(55) },
  { image: thumb(65) },
])

const INSPIRING = computed<MovieBlockItem[]>(() => [
  { image: thumb(16) },
  { image: thumb(26), badge: t('shared.badge.leavingSoon') },
  { image: thumb(36), badge: t('shared.badge.leavingSoon') },
  { image: thumb(46) },
  { image: thumb(56), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(66) },
])

const WATCH_ONE_WEEKEND = computed<MovieBlockItem[]>(() => [
  { image: thumb(17), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(27), badge: t('shared.badge.leavingSoon') },
  { image: thumb(37) },
  { image: thumb(47), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(57) },
  { image: thumb(67) },
])

const CRITICALLY_ACCLAIMED = computed<MovieBlockItem[]>(() => [
  { image: thumb(18), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(28) },
  { image: thumb(38), badge: t('shared.badge.leavingSoon') },
  { image: thumb(48) },
  { image: thumb(58) },
  { image: thumb(68) },
])

const FRESH_PICKS = computed<MovieBlockItem[]>(() => [
  { image: thumb(19), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(29) },
  { image: thumb(39), badge: t('shared.badge.leavingSoon') },
  { image: thumb(49), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(59) },
  { image: thumb(69) },
])
</script>

<template>
  <div class="browse-page">

    <!-- ── Header ─────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="browse-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a
          v-for="link in NAV_LINKS"
          :key="link.label"
          :href="link.href ?? '#'"
          class="browse-page__nav-link"
          :class="{ 'is-active': link.active }"
        >{{ link.label }}</a>
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

    <!-- ── Hero ───────────────────────────────────────────── -->
    <HeroBanner variant="home" :image="HERO_IMAGE">
      <div class="browse-page__hero-inner">
        <div class="browse-page__hero-left">
          <TitleCard
            size="full"
            :category="t('browse.hero.category')"
            :title="t('browse.hero.title')"
            :description="t('browse.hero.description')"
          />
        </div>
        <div class="browse-page__rating" :aria-label="`Rating: ${t('browse.hero.rating')}`">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.49 15a9 9 0 1 1-.18-4.99" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="small-body-regular browse-page__rating-label">{{ t('browse.hero.rating') }}</span>
        </div>
      </div>
    </HeroBanner>

    <!-- ── Movie rows ─────────────────────────────────────── -->
    <div class="browse-page__content">
      <MovieBlock :title="t('browse.rows.matched')"          :items="MATCHED" />
      <MovieBlock :title="t('browse.rows.newOnNetflix')"     :items="NEW_ON_NETFLIX" />
      <MovieBlock :title="t('browse.rows.top10')"            variant="top10"    :items="TOP_10" />
      <MovieBlock :title="t('browse.rows.thinkYoullLove')"  :items="THINK_YOULL_LOVE" />
      <MovieBlock :title="t('browse.rows.continueWatching', { name: 'James' })" variant="continue" :items="CONTINUE" />
      <MovieBlock :title="t('browse.rows.animation')"        :items="ANIMATION" />
      <MovieBlock :title="t('browse.rows.inspiring')"        :items="INSPIRING" />
      <MovieBlock :title="t('browse.rows.watchOneWeekend')"  :items="WATCH_ONE_WEEKEND" />
      <MovieBlock :title="t('browse.rows.criticallyAcclaimed')" :items="CRITICALLY_ACCLAIMED" />
      <MovieBlock :title="t('browse.rows.freshPicks')"       :items="FRESH_PICKS" />
    </div>

    <!-- ── Footer ────────────────────────────────────────── -->
    <AppFooter variant="home" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;
@use "~/assets/scss/mixins/typography" as *;

.browse-page {
  background-color: token("color-background-base");

  // ── Logo ──────────────────────────────────────────────────
  &__logo {
    font-family: token("font-family-logo");
    font-size: 28px;
    color: token("color-action-brand");
    letter-spacing: 2px;
  }

  // ── Nav links ─────────────────────────────────────────────
  &__nav-link {
    @include typography-variant("small-body-regular");
    color: token("color-text-secondary");
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s ease;

    &:hover {
      color: token("color-text-primary");
    }

    &.is-active {
      font-weight: var(--font-weight-medium);
      color: token("color-text-primary");
    }
  }

  // ── Hero inner: TitleCard (left) + Rating (right) ─────────
  :deep(.hero-banner__content) {
    max-width: none;
  }

  &__hero-inner {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: token("dm-24");
    width: 100%;
  }

  &__hero-left {
    max-width: 520px;
  }

  // ── Rating badge ──────────────────────────────────────────
  &__rating {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: token("dm-8");
    padding-left: token("dm-12");
    border-left: 3px solid token("color-text-secondary");
    color: token("color-text-primary");
    padding-bottom: token("dm-4");
  }

  // ── Movie rows ────────────────────────────────────────────
  &__content {
    padding: token("dm-16") 0 token("dm-48");
    display: flex;
    flex-direction: column;
    gap: token("dm-24");
  }
}
</style>

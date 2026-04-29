<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'
import type { DropdownOption } from '~/components/ui/Dropdown.vue'

definePageMeta({ path: '/series' })

const { t } = useI18n()
const lang = ref('en')

const HERO_IMAGE = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80'

function thumb(seed: number) {
  return `https://picsum.photos/seed/${seed}/300/170`
}

// ── Genre list ──────────────────────────────────────────────────────────────
const GENRES = computed<DropdownOption[]>(() => [
  { value: '10759', label: t('shared.genre.actionAdventure') },
  { value: '16',    label: t('shared.genre.animation') },
  { value: '35',    label: t('shared.genre.comedy') },
  { value: '99',    label: t('shared.genre.documentary') },
  { value: '18',    label: t('shared.genre.drama') },
  { value: '10751', label: t('shared.genre.family') },
  { value: '10762', label: t('shared.genre.kids') },
  { value: '9648',  label: t('shared.genre.mystery') },
  { value: '10765', label: t('shared.genre.scifiFantasy') },
  { value: '10768', label: t('shared.genre.warPolitics') },
  { value: '37',    label: t('shared.genre.horror') },
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
    const res = await $fetch<{ items: Array<{ thumbnail?: string; title?: string; badge?: string }> }>(
      '/series',
      { query: { genreId } }
    )
    genreItems.value = res.items.map(item => ({
      image: item.thumbnail ?? '',
      title: item.title ?? '',
      badge: item.badge ?? '',
    }))
  } catch {
    genreItems.value = Array.from({ length: 8 }, (_, i) => ({
      image: thumb((genreId as unknown as number) * 10 + i + 1),
    }))
  } finally {
    genreLoading.value = false
  }
})

// ── Default rows ────────────────────────────────────────────────────────────
const TOP_PICKS = computed<MovieBlockItem[]>(() => [
  { image: thumb(101) },
  { image: thumb(102), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(103) },
  { image: thumb(104), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(105) },
  { image: thumb(106), badge: t('shared.badge.leavingSoon') },
])

const KOREAN = computed<MovieBlockItem[]>(() => [
  { image: thumb(201), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(202) },
  { image: thumb(203), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(204) },
  { image: thumb(205), badge: t('shared.badge.leavingSoon') },
  { image: thumb(206) },
])

const NETFLIX_ORIGINALS = computed<MovieBlockItem[]>(() => [
  { image: thumb(301), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(302), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(303) },
  { image: thumb(304), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(305) },
  { image: thumb(306) },
])

const TOP_10: MovieBlockItem[] = [
  { image: thumb(401), rank: 1 },
  { image: thumb(402), rank: 2 },
  { image: thumb(403), rank: 3 },
  { image: thumb(404), rank: 4 },
  { image: thumb(405), rank: 5 },
  { image: thumb(406), rank: 6 },
  { image: thumb(407), rank: 7 },
]

const TRENDING = computed<MovieBlockItem[]>(() => [
  { image: thumb(501) },
  { image: thumb(502), badge: t('shared.badge.recentlyAdded') },
  { image: thumb(503) },
  { image: thumb(504) },
  { image: thumb(505) },
  { image: thumb(506), badge: t('shared.badge.leavingSoon') },
])
</script>

<template>
  <div class="series-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="series-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a href="/browse"          class="series-page__nav-link">{{ t('shared.nav.home') }}</a>
        <a href="/series"          class="series-page__nav-link is-active">{{ t('shared.nav.series') }}</a>
        <a href="/films"           class="series-page__nav-link">{{ t('shared.nav.films') }}</a>
        <a href="/new-and-popular" class="series-page__nav-link">{{ t('shared.nav.newAndPopular') }}</a>
        <a href="/my-list"         class="series-page__nav-link">{{ t('shared.nav.myList') }}</a>
        <a href="/browse-by-language" class="series-page__nav-link">{{ t('shared.nav.browseByLanguage') }}</a>
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
                {{ t('shared.action.play') }}
              </Button>
              <Button variant="secondary" size="small">
                <template #leading-icon>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 11v5M12 8.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </template>
                {{ t('shared.action.moreInfo') }}
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
          <span class="body-regular series-page__loading-text">{{ t('shared.action.loading') }}</span>
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

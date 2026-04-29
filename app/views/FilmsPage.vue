<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'
import type { DropdownOption } from '~/components/ui/Dropdown.vue'

definePageMeta({ path: '/films' })

const { t } = useI18n()
const lang = ref('en')

const HERO_IMAGE = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=80'

function thumb(seed: number) {
  return `https://picsum.photos/seed/${seed}/300/170`
}

// ── Genre list ──────────────────────────────────────────────────────────────
const GENRES = computed<DropdownOption[]>(() => [
  { value: '28',    label: t('genre.action') },
  { value: '12',    label: t('genre.adventure') },
  { value: '16',    label: t('genre.animation') },
  { value: '35',    label: t('genre.comedy') },
  { value: '80',    label: t('genre.crime') },
  { value: '99',    label: t('genre.documentary') },
  { value: '18',    label: t('genre.drama') },
  { value: '10751', label: t('genre.family') },
  { value: '14',    label: t('genre.fantasy') },
  { value: '27',    label: t('genre.horror') },
  { value: '10749', label: t('genre.romance') },
  { value: '878',   label: t('genre.scifi') },
  { value: '53',    label: t('genre.thriller') },
  { value: '10752', label: t('genre.war') },
])

// ── Genre filter state ──────────────────────────────────────────────────────
const selectedGenre      = ref<string | null>(null)
const genreItems         = ref<MovieBlockItem[]>([])
const genreLoading       = ref(false)

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
      '/films',
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
  { image: thumb(711) },
  { image: thumb(712), badge: t('badge.recentlyAdded') },
  { image: thumb(713) },
  { image: thumb(714), badge: t('badge.recentlyAdded') },
  { image: thumb(715) },
  { image: thumb(716), badge: t('badge.leavingSoon') },
])

const ACTION = computed<MovieBlockItem[]>(() => [
  { image: thumb(721), badge: t('badge.recentlyAdded') },
  { image: thumb(722) },
  { image: thumb(723) },
  { image: thumb(724), badge: t('badge.recentlyAdded') },
  { image: thumb(725) },
  { image: thumb(726), badge: t('badge.leavingSoon') },
])

const ROMANCE = computed<MovieBlockItem[]>(() => [
  { image: thumb(731) },
  { image: thumb(732), badge: t('badge.recentlyAdded') },
  { image: thumb(733), badge: t('badge.leavingSoon') },
  { image: thumb(734) },
  { image: thumb(735), badge: t('badge.recentlyAdded') },
  { image: thumb(736) },
])

const TOP_10: MovieBlockItem[] = [
  { image: thumb(741), rank: 1 },
  { image: thumb(742), rank: 2 },
  { image: thumb(743), rank: 3 },
  { image: thumb(744), rank: 4 },
  { image: thumb(745), rank: 5 },
  { image: thumb(746), rank: 6 },
  { image: thumb(747), rank: 7 },
]

const AWARD_WINNING = computed<MovieBlockItem[]>(() => [
  { image: thumb(751), badge: t('badge.recentlyAdded') },
  { image: thumb(752) },
  { image: thumb(753), badge: t('badge.recentlyAdded') },
  { image: thumb(754) },
  { image: thumb(755), badge: t('badge.leavingSoon') },
  { image: thumb(756) },
])

const NETFLIX_FILMS = computed<MovieBlockItem[]>(() => [
  { image: thumb(761), badge: t('badge.recentlyAdded') },
  { image: thumb(762), badge: t('badge.recentlyAdded') },
  { image: thumb(763) },
  { image: thumb(764) },
  { image: thumb(765), badge: t('badge.leavingSoon') },
  { image: thumb(766) },
])
</script>

<template>
  <div class="films-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="films-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a href="/browse"          class="films-page__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"          class="films-page__nav-link">{{ t('nav.series') }}</a>
        <a href="/films"           class="films-page__nav-link is-active">{{ t('nav.films') }}</a>
        <a href="/new-and-popular" class="films-page__nav-link">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"         class="films-page__nav-link">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="films-page__nav-link">{{ t('nav.browseByLanguage') }}</a>
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
      <div class="films-page__hero-body">

        <div class="films-page__hero-top">
          <template v-if="selectedGenre">
            <button class="films-page__breadcrumb body-regular" @click="selectedGenre = null">{{ t('films.pageTitle') }}</button>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="title-1-bold films-page__page-title">{{ selectedGenreLabel }}</span>
          </template>
          <template v-else>
            <span class="title-1-bold films-page__page-title">{{ t('films.pageTitle') }}</span>
            <Dropdown
              v-model="selectedGenre"
              :options="GENRES"
              :placeholder="t('films.genrePlaceholder')"
              size="small"
              class="films-page__genre-dropdown"
            />
          </template>
        </div>

        <div class="films-page__hero-bottom">
          <TitleCard
            size="full"
            :category="t('films.hero.category')"
            :title="t('films.hero.title')"
            :description="t('films.hero.description')"
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
    <div class="films-page__content">

      <template v-if="selectedGenre">
        <div v-if="genreLoading" class="films-page__loading">
          <span class="body-regular films-page__loading-text">{{ t('action.loading') }}</span>
        </div>
        <MovieBlock
          v-else-if="genreItems.length"
          :title="selectedGenreLabel"
          :items="genreItems"
        />
      </template>

      <MovieBlock :title="t('films.rows.topPicks')"     :items="TOP_PICKS" />
      <MovieBlock :title="t('films.rows.top10')"        variant="top10" :items="TOP_10" />
      <MovieBlock :title="t('films.rows.action')"       :items="ACTION" />
      <MovieBlock :title="t('films.rows.romance')"      :items="ROMANCE" />
      <MovieBlock :title="t('films.rows.awardWinning')" :items="AWARD_WINNING" />
      <MovieBlock :title="t('films.rows.netflixFilms')" :items="NETFLIX_FILMS" />

    </div>

    <!-- ── Footer ──────────────────────────────────────────────── -->
    <AppFooter variant="home" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;
@use "~/assets/scss/mixins/typography" as *;

.films-page {
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

  :deep(.hero-banner) { align-items: stretch; }

  :deep(.hero-banner__content) {
    max-width: none;
    padding: token("dm-24") token("dm-48") token("dm-56");
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__hero-body { display: contents; }

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

      &:hover:not(:disabled) { background-color: rgba(0, 0, 0, 0.5); }
    }

    :deep(.dropdown__value),
    :deep(.dropdown__chevron) { color: var(--white); }
  }

  &__hero-bottom { max-width: 520px; }

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

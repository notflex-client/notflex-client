<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'
import type { FdmData } from '~/components/ui/FilmDetailModal.vue'

definePageMeta({ path: '/browse' })

const { t } = useI18n()
const { lang } = useLocale()

const showDetail = ref(false)
const DEMO_FILM: FdmData = {
  type: 'series',
  title: 'House of Ninjas',
  image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80',
  year: '2024',
  rating: 'TV-MA',
  quality: 'HD',
  isNew: true,
  rank: '#2 in TV Shows Today',
  description: 'Years after retiring from their formidable ninja lives, a dysfunctional family must return to shadowy missions to counteract a string of looming threats.',
  cast: ['Kento Kaku', 'Yosuke Eguchi', 'Tae Kimura', 'Kengo Kora', 'Aju Makita'],
  genres: ['TV Dramas', 'Japanese', 'TV Thrillers'],
  tags: ['Dark', 'Suspenseful', 'Exciting'],
  maturity: ['smoking', 'violence'],
  seasons: [
    {
      value: 's1',
      label: 'Season 1',
      episodes: [
        { number: 1, title: 'The Offer', duration: '55m', description: 'While Haru Tawara develops a crush on a mysterious young woman at work, an unusual opportunity arises at his father\'s financially struggling brewery.', image: `https://picsum.photos/seed/ep1/300/170` },
        { number: 2, title: 'The Trail', duration: '52m', description: 'Haru accompanies Karen to investigate a whistleblower\'s apartment. Meanwhile, several other Tawaras are tempted to step out of their ordinary lives.', image: `https://picsum.photos/seed/ep2/300/170` },
        { number: 3, title: 'The Flower', duration: '53m', description: 'Haru and Yoko\'s respective missions take unexpected turns. Nagi\'s mischievous adventures start attracting unwanted attention.', image: `https://picsum.photos/seed/ep3/300/170` },
        { number: 4, title: 'The Resurrection', duration: '52m', description: 'Karen confides in Haru about a longstanding suspicion. In the meantime, Soichi receives a shocking phone call that keeps him up at night.', image: `https://picsum.photos/seed/ep4/300/170` },
        { number: 5, title: 'The Confession', duration: '51m', description: 'As Riku probes into his family\'s secrets, information about Gentenkai — a peculiar cult — reminds the Tawaras of a tragedy from six years ago.', image: `https://picsum.photos/seed/ep5/300/170` },
        { number: 6, title: 'The Stranger', duration: '55m', description: 'An unexpected reunion stirs up more questions about the Tawara household. Soichi and Yoko inch closer to a sinister conspiracy.', image: `https://picsum.photos/seed/ep6/300/170` },
      ],
    },
  ],
  moreLikeThis: Array.from({ length: 6 }, (_, i) => ({
    image: `https://picsum.photos/seed/more${i}/300/170`,
    rating: 'TV-MA',
    year: '2024',
    description: 'Before he was a protector, Kenshin was a fearsome assassin known as Battosai. But when he meets the gentle Tomoe Yukishiro, his story begins to change.',
  })),
  trailers: [
    { image: `https://picsum.photos/seed/tr1/300/170`, title: 'Season 1 Trailer 1: House of Ninjas' },
    { image: `https://picsum.photos/seed/tr2/300/170`, title: 'Season 1 Trailer 2: House of Ninjas' },
    { image: `https://picsum.photos/seed/tr3/300/170`, title: 'Season 1 Trailer 3: House of Ninjas' },
  ],
}

const PROFILES = [
  { value: 'james', name: 'James', image: 'https://i.pravatar.cc/150?img=11' },
  { value: 'sarah', name: 'Sarah', image: 'https://i.pravatar.cc/150?img=47' },
]
const activeProfile = ref('james')

const NAV_LINKS = computed(() => [
  { label: t('nav.home'),            active: true },
  { label: t('nav.series'),          href: '/series' },
  { label: t('nav.films'),           href: '/films' },
  { label: t('nav.newAndPopular'),   href: '/new-and-popular' },
  { label: t('nav.myList'),          href: '/my-list' },
  { label: t('nav.browseByLanguage'), href: '/browse-by-language' },
])

const HERO_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80'

const { listMovies, mapMovie } = useMovieCatalog()

const { data: topMovies } = await useAsyncData('browse-top-movies', () =>
  listMovies({ pageSize: 10, sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: newMovies } = await useAsyncData('browse-new-movies', () =>
  listMovies({ pageSize: 20, sort: 'new' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: seriesMovies } = await useAsyncData('browse-series-movies', () =>
  listMovies({ pageSize: 20, type: 'series', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: animationMovies } = await useAsyncData('browse-animation-movies', () =>
  listMovies({ pageSize: 20, tag: 'animation', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: weekendMovies } = await useAsyncData('browse-weekend-movies', () =>
  listMovies({ pageSize: 20, tag: 'weekend', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: acclaimedMovies } = await useAsyncData('browse-acclaimed-movies', () =>
  listMovies({ pageSize: 20, tag: 'critically-acclaimed', sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)
const { data: freshMovies } = await useAsyncData('browse-fresh-movies', () =>
  listMovies({ pageSize: 20, tag: 'fresh-picks', sort: 'new' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)

const heroMovie = computed(() => topMovies.value?.items?.[0] ?? null)
const MATCHED = computed<MovieBlockItem[]>(() => topMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
const NEW_ON_NETFLIX = computed<MovieBlockItem[]>(() => newMovies.value?.items?.map(movie => ({ ...mapMovie(movie), badge: t('badge.recentlyAdded') })) ?? [])
const TOP_10 = computed<MovieBlockItem[]>(() => topMovies.value?.items?.map((movie, index) => mapMovie(movie, index)) ?? [])
const CONTINUE = computed<MovieBlockItem[]>(() => topMovies.value?.items?.slice(0, 4).map(movie => ({ ...mapMovie(movie), progress: 35 })) ?? [])
const THINK_YOULL_LOVE = computed<MovieBlockItem[]>(() => seriesMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
const ANIMATION = computed<MovieBlockItem[]>(() => animationMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
const INSPIRING = computed<MovieBlockItem[]>(() => newMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
const WATCH_ONE_WEEKEND = computed<MovieBlockItem[]>(() => weekendMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
const CRITICALLY_ACCLAIMED = computed<MovieBlockItem[]>(() => acclaimedMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
const FRESH_PICKS = computed<MovieBlockItem[]>(() => freshMovies.value?.items?.map(movie => mapMovie(movie)) ?? [])
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
        <AvatarPopover
          :profiles="PROFILES"
          :active-profile="activeProfile"
          @select-profile="activeProfile = $event"
          @sign-out="navigateTo('/login')"
        >
          <template #trigger="{ triggerProps }">
            <Avatar
              size="small"
              :show-arrow="true"
              :name="PROFILES.find(p => p.value === activeProfile)?.name ?? ''"
              :image="PROFILES.find(p => p.value === activeProfile)?.image ?? ''"
              v-bind="(triggerProps as any)"
            />
          </template>
        </AvatarPopover>
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
          >
            <template #actions>
              <Button variant="light" size="large" @click="navigateTo(`/watch/${heroMovie?.id ?? 'demo'}`)">
                <template #leading-icon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 9-14 9V3Z"/></svg>
                </template>
                {{ t('action.play') }}
              </Button>
              <Button variant="ghost" size="large" @click="showDetail = true">
                <template #leading-icon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                </template>
                {{ t('action.moreInfo') }}
              </Button>
            </template>
          </TitleCard>
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

    <!-- ── Film Detail Modal ─────────────────────────────── -->
    <Transition name="fdm-fade">
      <FilmDetailModal v-if="showDetail" :data="DEMO_FILM" @close="showDetail = false" />
    </Transition>

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

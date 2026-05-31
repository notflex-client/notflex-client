<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'
import type { FdmData } from '~/components/ui/FilmDetailModal.vue'
import type { CatalogMovie } from '~/composables/use-movie-catalog'

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
const searchOpen = ref(false)

const authStore = useAuthStore()

function onMenuAction(action: string) {
  if (action === 'account') navigateTo('/account')
}

async function onSignOut() {
  await authStore.logout()
  navigateTo('/login')
}

const NAV_LINKS = computed(() => [
  { label: t('nav.home'),            active: true },
  { label: t('nav.series'),          href: '/series' },
  { label: t('nav.films'),           href: '/films' },
  { label: t('nav.newAndPopular'),   href: '/new-and-popular' },
  { label: t('nav.myList'),          href: '/my-list' },
  { label: t('nav.browseByLanguage'), href: '/browse-by-language' },
])

const FALLBACK_HERO_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80'

const runtimeConfig = useRuntimeConfig()
const apiBase = (runtimeConfig.public.apiUrl as string) || 'http://localhost:8080'

function normalizeImageUrl(url: string | undefined | null) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${apiBase}${url}`
}

interface Tag { id: number; name: string; slug: string }
interface TagRow { tag: Tag; items: MovieBlockItem[] }

const { listMovies, mapMovie } = useMovieCatalog()
const { listBanners } = useBanners()
const { listWatchHistory, progressPercent } = useWatchHistory()

const { data: banners } = await useAsyncData('browse-banners', () =>
  listBanners('browse').catch(() => []),
)

const { data: watchHistory } = await useAsyncData('browse-watch-history', () =>
  authStore.isLoggedIn ? listWatchHistory().catch(() => []) : Promise.resolve([]),
)

const { data: topMovies } = await useAsyncData('browse-top-movies', () =>
  listMovies({ pageSize: 10, sort: 'top' }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 }))
)

const { data: tagRows } = await useAsyncData('browse-tag-rows-v2', async () => {
  const tags = await $fetch<Tag[]>(`${apiBase}/tags`).catch(() => [] as Tag[])
  if (!tags.length) return [] as TagRow[]
  const results = await Promise.all(
    tags.map(tag =>
      $fetch<{ items: CatalogMovie[] }>(`${apiBase}/movies`, {
        query: { tag: tag.slug, pageSize: 20, sort: 'top' },
      }).catch(() => ({ items: [] }))
    )
  )
  return tags
    .map((tag, i) => ({
      tag,
      items: (results[i]?.items ?? []).map(movie => mapMovie(movie)),
    }))
    .filter(row => row.items.length > 0)
})

const featuredBanner = computed(() => banners.value?.[0] ?? null)
const heroMovie = computed(() => topMovies.value?.items?.[0] ?? null)
const heroImage = computed(() => normalizeImageUrl(featuredBanner.value?.image_url) || FALLBACK_HERO_IMAGE)
const heroTargetId = computed(() => featuredBanner.value?.movie_id || heroMovie.value?.id || null)
const heroTitle = computed(() => featuredBanner.value?.title || featuredBanner.value?.movie?.title || heroMovie.value?.title || t('browse.hero.title'))
const heroDescription = computed(() => featuredBanner.value?.description || featuredBanner.value?.movie?.description || heroMovie.value?.description || t('browse.hero.description'))
const heroCategory = computed(() => {
  const movie = featuredBanner.value?.movie ?? heroMovie.value
  if (movie?.type === 'series') return 'SERIES'
  if (movie?.type === 'movie') return 'PHIM'
  return t('browse.hero.category')
})


const CONTINUE = computed<MovieBlockItem[]>(() => {
  const items = watchHistory.value ?? []
  const unique = new Map<string, typeof items[number]>()
  for (const item of items) {
    if (!item.movie) continue
    if (item.is_completed) continue
    if (!unique.has(item.movie_id)) unique.set(item.movie_id, item)
  }
  return Array.from(unique.values()).slice(0, 10).map((item) => ({
    ...mapMovie(item.movie!),
    progress: progressPercent(item),
  }))
})
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
        <IconButton variant="ghost" size="small" :aria-label="t('action.search')" @click="searchOpen = true">
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
          @menu-action="onMenuAction"
          @sign-out="onSignOut"
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
    <HeroBanner variant="home" :image="heroImage">
      <div class="browse-page__hero-inner">
        <div class="browse-page__hero-left">
          <TitleCard
            size="full"
            :category="heroCategory"
            :title="heroTitle"
            :description="heroDescription"
          >
            <template #actions>
              <Button variant="light" size="large" :disabled="!heroTargetId" @click="heroTargetId && navigateTo(`/watch/${heroTargetId}`)">
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
      <AiRecommendationSection />
      <MovieBlock
        v-for="row in (tagRows ?? [])"
        :key="row.tag.id"
        :title="row.tag.name"
        :variant="row.tag.slug === 'top-10' ? 'top10' : 'default'"
        :items="row.items"
      />
      <MovieBlock :title="t('browse.rows.continueWatching', { name: 'James' })" variant="continue" :items="CONTINUE" />
      
    </div>

    <!-- ── Footer ────────────────────────────────────────── -->
    <AppFooter variant="home" v-model:lang="lang" />

    <!-- ── Film Detail Modal ─────────────────────────────── -->
    <Transition name="fdm-fade">
      <FilmDetailModal v-if="showDetail" :data="DEMO_FILM" @close="showDetail = false" />
    </Transition>

    <SearchOverlay :open="searchOpen" @close="searchOpen = false" />

  </div>
</template>

<style lang="scss" scoped>
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

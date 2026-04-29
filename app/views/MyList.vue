<script setup lang="ts">
import type { DropdownOption } from '~/components/ui/Dropdown.vue'

definePageMeta({ path: '/my-list' })

const { t } = useI18n()
const { lang } = useLocale()

// ── Genre filter ────────────────────────────────────────────────────────────
const GENRES = computed<DropdownOption[]>(() => [
  { value: 'all',   label: t('genre.all') },
  { value: '28',    label: t('genre.action') },
  { value: '12',    label: t('genre.adventure') },
  { value: '16',    label: t('genre.animation') },
  { value: '35',    label: t('genre.comedy') },
  { value: '18',    label: t('genre.drama') },
  { value: '27',    label: t('genre.horror') },
  { value: '10749', label: t('genre.romance') },
  { value: '878',   label: t('genre.scifi') },
  { value: '53',    label: t('genre.thriller') },
  { value: '99',    label: t('genre.documentary') },
])

interface ListItem {
  id:        string
  image:     string
  title?:    string
  badge?:    string
  genreId?:  string
}

const selectedGenre = ref<string>('all')
const items         = ref<ListItem[]>([])
const loading       = ref(false)

async function fetchList(genreId: string) {
  loading.value = true
  try {
    const query = genreId !== 'all' ? { genreId } : {}
    const res = await $fetch<{ items: ListItem[] }>('/my-list', { query })
    items.value = res.items
  } catch {
    items.value = Array.from({ length: 12 }, (_, i) => ({
      id:    String(i + 1),
      image: `https://picsum.photos/seed/${900 + i}/300/170`,
      badge: i % 4 === 0 ? t('badge.newSeason') : i % 5 === 0 ? t('badge.newEpisode') : '',
    }))
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchList('all'))

watch(selectedGenre, (val) => fetchList(val))
</script>

<template>
  <div class="mylist-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="mylist-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a href="/browse"             class="mylist-page__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"             class="mylist-page__nav-link">{{ t('nav.series') }}</a>
        <a href="/films"              class="mylist-page__nav-link">{{ t('nav.films') }}</a>
        <a href="/new-and-popular"    class="mylist-page__nav-link">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"            class="mylist-page__nav-link is-active">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="mylist-page__nav-link">{{ t('nav.browseByLanguage') }}</a>
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

    <!-- ── Page header ─────────────────────────────────────────── -->
    <div class="mylist-page__header">
      <span class="title-1-bold mylist-page__title">{{ t('myList.pageTitle') }}</span>
      <Dropdown
        v-model="selectedGenre"
        :options="GENRES"
        :placeholder="t('myList.genrePlaceholder')"
        size="small"
        class="mylist-page__genre-dropdown"
      />
    </div>

    <!-- ── Grid ────────────────────────────────────────────────── -->
    <div class="mylist-page__body">

      <div v-if="loading" class="mylist-page__grid">
        <div v-for="n in 12" :key="n" class="mylist-page__skeleton" />
      </div>

      <div v-else-if="!items.length" class="mylist-page__empty">
        <span class="body-regular mylist-page__empty-text">{{ t('myList.empty') }}</span>
        <span class="caption-1-regular mylist-page__empty-sub">{{ t('myList.emptySub') }}</span>
      </div>

      <div v-else class="mylist-page__grid">
        <MovieCard
          v-for="item in items"
          :key="item.id"
          variant="more-like-this"
          :image="item.image"
          :title="item.title ?? ''"
          :badge="item.badge ?? ''"
        />
      </div>

    </div>

    <!-- ── Footer ──────────────────────────────────────────────── -->
    <AppFooter variant="home" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;
@use "~/assets/scss/tools/mq" as *;
@use "~/assets/scss/mixins/typography" as *;

$px:  token("dm-48");
$gap: token("dm-4");

.mylist-page {
  background-color: token("color-background-base");
  min-height: 100vh;

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

  &__header {
    padding: token("dm-80") $px token("dm-24");
    display: flex;
    align-items: center;
    gap: token("dm-24");
  }

  &__title { color: token("color-text-primary"); }

  &__genre-dropdown {
    width: auto;
    flex-shrink: 0;

    :deep(.dropdown__trigger) {
      width: auto;
      min-width: 130px;
      white-space: nowrap;
    }
  }

  &__body {
    padding: 0 $px token("dm-48");
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: $gap;

    @include down(desktop) { grid-template-columns: repeat(4, 1fr); }
    @include down(tablet)  { grid-template-columns: repeat(2, 1fr); }
  }

  &__skeleton {
    aspect-ratio: 16 / 9;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      token("grey-700") 25%,
      token("grey-600") 50%,
      token("grey-700") 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  &__empty {
    padding: token("dm-64") 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: token("dm-8");
  }

  &__empty-text { color: token("color-text-primary"); }

  &__empty-sub  { color: token("color-text-secondary"); }
}
</style>

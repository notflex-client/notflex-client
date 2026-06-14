<script setup lang="ts">
definePageMeta({ path: '/my-list', authRequired: true })

const { t } = useI18n()
const { lang } = useLocale()
const { listFavorites, removeFavorite } = useFavorites()

const { data: favoritesData, refresh } = await useAsyncData('my-list-favorites', () =>
  listFavorites({ pageSize: 50 }).catch(() => ({ items: [], page: 1, itemCount: 0, pageCount: 0 })),
)

const favorites = computed(() => favoritesData.value?.items ?? [])
const loading = ref(false)

async function onRemove(movieId: string) {
  try {
    await removeFavorite(movieId)
    await refresh()
  } catch {}
}
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
        <ProfileMenu />
      </template>
    </AppHeader>

    <!-- ── Page header ─────────────────────────────────────────── -->
    <div class="mylist-page__header">
      <span class="title-1-bold mylist-page__title">{{ t('myList.pageTitle') }}</span>
    </div>

    <!-- ── Grid ────────────────────────────────────────────────── -->
    <div class="mylist-page__body">

      <div v-if="loading" class="mylist-page__grid">
        <div v-for="n in 12" :key="n" class="mylist-page__skeleton" />
      </div>

      <div v-else-if="!favorites.length" class="mylist-page__empty">
        <span class="body-regular mylist-page__empty-text">{{ t('myList.empty') }}</span>
        <span class="caption-1-regular mylist-page__empty-sub">{{ t('myList.emptySub') }}</span>
      </div>

      <div v-else class="mylist-page__grid">
        <div
          v-for="fav in favorites"
          :key="fav.movie_id"
          class="mylist-page__item"
        >
          <NuxtLink :to="`/watch/${fav.movie_id}`">
            <MovieCard
              variant="more-like-this"
              :image="fav.movie?.poster_url || fav.movie?.banner_url || ''"
              :title="fav.movie?.title ?? ''"
            />
          </NuxtLink>
          <button class="mylist-page__remove" :aria-label="t('myList.remove')" @click="onRemove(fav.movie_id)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>

    <!-- ── Footer ──────────────────────────────────────────────── -->
    <AppFooter variant="home" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
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

  &__item {
    position: relative;

    &:hover .mylist-page__remove { opacity: 1; }
  }

  &__remove {
    position: absolute;
    top: token("dm-8");
    right: token("dm-8");
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid token("grey-600");
    color: token("color-text-primary");
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s ease, background-color 0.15s ease;

    &:hover { background: rgba(229, 9, 20, 0.9); }
  }
}
</style>

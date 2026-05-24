<script setup lang="ts">
import type { CatalogMovie } from '~/composables/use-movie-catalog'

const { t } = useI18n()
const { lang } = useLocale()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const keyword = ref((route.query.q as string) ?? '')
const results = ref<CatalogMovie[]>([])
const loading = ref(false)
const searched = ref(false)
const itemCount = ref(0)

const inputRef = ref<HTMLInputElement>()

async function search(q?: string) {
  const query = (q ?? keyword.value).trim()
  if (!query) return

  keyword.value = query
  router.replace({ query: { q: query } })
  loading.value = true
  searched.value = true
  try {
    const data = await $api<{ items: CatalogMovie[]; itemCount: number }>('/movies', {
      params: { keyword: query, pageSize: 50 },
    })
    results.value = data.items ?? []
    itemCount.value = data.itemCount ?? 0
  } catch {
    results.value = []
    itemCount.value = 0
  } finally {
    loading.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    search()
  }
}

function clear() {
  keyword.value = ''
  results.value = []
  searched.value = false
  itemCount.value = 0
  router.replace({ query: {} })
  inputRef.value?.focus()
}

function openMovie(movie: CatalogMovie) {
  navigateTo(`/watch/${movie.id}`)
}

watch(() => route.query.q, (q) => {
  if (q && typeof q === 'string' && q !== keyword.value) {
    keyword.value = q
    search(q)
  }
}, { immediate: true })
</script>

<template>
  <main class="search-page">
    <AppHeader sticky>
      <template #logo>
        <span class="search-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <NuxtLink to="/browse" class="search-page__nav-link">{{ t('nav.home') }}</NuxtLink>
      </template>
    </AppHeader>

    <div class="search-page__content">
      <!-- ── Search bar ────────────────────────────────── -->
      <div class="search-page__bar">
        <div class="search-page__input-wrap">
          <svg class="search-page__input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            ref="inputRef"
            v-model="keyword"
            type="text"
            class="search-page__input"
            :placeholder="t('search.placeholder')"
            autocomplete="off"
            @keydown="handleKeydown"
          />
          <button v-if="keyword" type="button" class="search-page__clear" @click="clear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <Button variant="brand" size="large" :disabled="!keyword.trim() || loading" @click="search()">
          {{ t('search.button') }}
        </Button>
      </div>

      <!-- ── Results count ─────────────────────────────── -->
      <p v-if="searched && !loading" class="body-regular search-page__count">
        {{ itemCount > 0 ? t('search.resultCount', { count: itemCount, keyword: keyword }) : t('search.noResults', { keyword: keyword }) }}
      </p>

      <!-- ── Loading ───────────────────────────────────── -->
      <div v-if="loading" class="search-page__loading">
        <span class="body-regular">{{ t('search.loading') }}</span>
      </div>

      <!-- ── Results grid ──────────────────────────────── -->
      <div v-if="results.length" class="search-page__grid">
        <div
          v-for="movie in results"
          :key="movie.id"
          class="search-page__card"
          @click="openMovie(movie)"
        >
          <div class="search-page__poster">
            <img
              v-if="movie.poster_url || movie.banner_url"
              :src="movie.poster_url || movie.banner_url || ''"
              :alt="movie.title"
              class="search-page__poster-img"
            />
            <div v-else class="search-page__poster-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 3l14 9-14 9V3Z" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
          </div>
          <div class="search-page__meta">
            <span class="body-medium">{{ movie.title }}</span>
            <div class="search-page__meta-row">
              <span v-if="movie.release_year" class="small-body-regular search-page__muted">{{ movie.release_year }}</span>
              <span v-if="movie.rating" class="search-page__rating-badge">{{ movie.rating }}</span>
              <span v-if="movie.type === 'series'" class="search-page__type-badge">Series</span>
            </div>
            <p v-if="movie.description" class="small-body-regular search-page__desc">{{ movie.description }}</p>
          </div>
        </div>
      </div>

      <!-- ── Empty state (no search yet) ───────────────── -->
      <div v-if="!searched && !loading" class="search-page__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="body-regular search-page__muted">{{ t('search.hint') }}</span>
      </div>
    </div>

    <AppFooter variant="home" v-model:lang="lang" />
  </main>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.search-page {
  min-height: 100vh;
  background: token("color-background-base");
  color: token("color-text-primary");

  &__logo {
    font-family: token("font-family-logo");
    font-size: 28px;
    color: token("color-action-brand");
    letter-spacing: 2px;
  }

  &__nav-link {
    color: token("color-text-secondary");
    text-decoration: none;
    &:hover { color: token("color-text-primary"); }
  }

  &__content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px token("layout-margin") token("dm-64");
    display: flex;
    flex-direction: column;
    gap: token("dm-24");
  }

  // ── Search bar ──────────────────────────────────────
  &__bar {
    display: flex;
    gap: token("dm-12");
    align-items: stretch;
  }

  &__input-wrap {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input-icon {
    position: absolute;
    left: 16px;
    color: token("color-text-secondary");
    pointer-events: none;
  }

  &__input {
    width: 100%;
    padding: 14px 44px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    color: token("color-text-primary");
    font-size: 16px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &::placeholder {
      color: token("color-text-secondary");
    }

    &:focus {
      border-color: token("color-action-brand");
      box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.25);
    }
  }

  &__clear {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: token("color-text-secondary");
    cursor: pointer;
    padding: 4px;
    display: flex;
    &:hover { color: token("color-text-primary"); }
  }

  // ── Results ─────────────────────────────────────────
  &__count {
    color: token("color-text-secondary");
  }

  &__loading {
    padding: token("dm-48") 0;
    text-align: center;
    color: token("color-text-secondary");
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: token("dm-16");
  }

  &__card {
    display: flex;
    gap: token("dm-12");
    padding: token("dm-12");
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.12);
    }
  }

  &__poster {
    width: 100px;
    height: 140px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
  }

  &__poster-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__poster-empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: token("color-text-secondary");
  }

  &__meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__meta-row {
    display: flex;
    align-items: center;
    gap: token("dm-8");
    flex-wrap: wrap;
  }

  &__rating-badge {
    padding: 2px 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    font-size: 11px;
    color: token("color-text-secondary");
  }

  &__type-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    background: rgba(229, 9, 20, 0.2);
    color: #e50914;
  }

  &__desc {
    color: token("color-text-secondary");
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__muted {
    color: token("color-text-secondary");
  }

  // ── Empty state ─────────────────────────────────────
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: token("dm-16");
    padding: token("dm-64") 0;
    color: token("color-text-secondary");
  }
}
</style>

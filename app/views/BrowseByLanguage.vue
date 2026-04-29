<script setup lang="ts">
import type { DropdownOption } from '~/components/ui/Dropdown.vue'

definePageMeta({ path: '/browse-by-language' })

const { t } = useI18n()
const lang = ref('en')

// ── Language options ────────────────────────────────────────────────────────
const ORIGINAL_LANGS = computed<DropdownOption[]>(() => [
  { value: 'all', label: t('browseLang.lang.allLangs') },
  { value: 'en',  label: t('browseLang.lang.en') },
  { value: 'ko',  label: t('browseLang.lang.ko') },
  { value: 'ja',  label: t('browseLang.lang.ja') },
  { value: 'zh',  label: t('browseLang.lang.zh') },
  { value: 'es',  label: t('browseLang.lang.es') },
  { value: 'fr',  label: t('browseLang.lang.fr') },
  { value: 'de',  label: t('browseLang.lang.de') },
  { value: 'it',  label: t('browseLang.lang.it') },
  { value: 'pt',  label: t('browseLang.lang.pt') },
  { value: 'th',  label: t('browseLang.lang.th') },
  { value: 'hi',  label: t('browseLang.lang.hi') },
  { value: 'ar',  label: t('browseLang.lang.ar') },
])

const AUDIO_LANGS = computed<DropdownOption[]>(() => [
  { value: 'vi',  label: t('browseLang.lang.vi') },
  { value: 'en',  label: t('browseLang.lang.en') },
  { value: 'ko',  label: t('browseLang.lang.ko') },
  { value: 'ja',  label: t('browseLang.lang.ja') },
  { value: 'zh',  label: t('browseLang.lang.zh') },
  { value: 'fr',  label: t('browseLang.lang.fr') },
  { value: 'es',  label: t('browseLang.lang.es') },
])

// ── Filter state ────────────────────────────────────────────────────────────
const originalLang = ref<string>('all')
const audioLang    = ref<string>('en')

interface BrowseItem {
  id:     string
  image:  string
  title?: string
  badge?: string
}

const items   = ref<BrowseItem[]>([])
const loading = ref(false)

async function fetchItems() {
  loading.value = true
  try {
    const query: Record<string, string> = { audioLang: audioLang.value }
    if (originalLang.value !== 'all') query.originalLang = originalLang.value

    const res = await $fetch<{ items: BrowseItem[] }>('/browse/by-language', { query })
    items.value = res.items
  } catch {
    const seed = originalLang.value === 'all' ? 0 : originalLang.value.charCodeAt(0)
    items.value = Array.from({ length: 18 }, (_, i) => ({
      id:    String(i + 1),
      image: `https://picsum.photos/seed/${seed * 7 + 950 + i}/300/170`,
      badge: i % 5 === 1 ? t('badge.top10') : '',
    }))
  } finally {
    loading.value = false
  }
}

onMounted(fetchItems)
watch([originalLang, audioLang], fetchItems)
</script>

<template>
  <div class="browse-lang-page">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="browse-lang-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <a href="/browse"             class="browse-lang-page__nav-link">{{ t('nav.home') }}</a>
        <a href="/series"             class="browse-lang-page__nav-link">{{ t('nav.series') }}</a>
        <a href="/films"              class="browse-lang-page__nav-link">{{ t('nav.films') }}</a>
        <a href="/new-and-popular"    class="browse-lang-page__nav-link">{{ t('nav.newAndPopular') }}</a>
        <a href="/my-list"            class="browse-lang-page__nav-link">{{ t('nav.myList') }}</a>
        <a href="/browse-by-language" class="browse-lang-page__nav-link is-active">{{ t('nav.browseByLanguage') }}</a>
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

    <!-- ── Page header: title + language filters ───────────────── -->
    <div class="browse-lang-page__header">
      <span class="title-1-bold browse-lang-page__title">{{ t('browseLang.pageTitle') }}</span>

      <div class="browse-lang-page__filters">
        <span class="small-body-regular browse-lang-page__filter-label">
          {{ t('browseLang.filterLabel') }}
        </span>
        <Dropdown
          v-model="originalLang"
          :options="ORIGINAL_LANGS"
          :placeholder="t('browseLang.originalLangPlaceholder')"
          size="small"
          class="browse-lang-page__dropdown"
        />
        <Dropdown
          v-model="audioLang"
          :options="AUDIO_LANGS"
          :placeholder="t('browseLang.audioPlaceholder')"
          size="small"
          class="browse-lang-page__dropdown"
        />
      </div>
    </div>

    <!-- ── Grid ────────────────────────────────────────────────── -->
    <div class="browse-lang-page__body">

      <div v-if="loading" class="browse-lang-page__grid">
        <div v-for="n in 18" :key="n" class="browse-lang-page__skeleton" />
      </div>

      <div v-else-if="!items.length" class="browse-lang-page__empty">
        <span class="body-regular">{{ t('browseLang.empty') }}</span>
        <span class="caption-1-regular browse-lang-page__empty-sub">{{ t('browseLang.emptySub') }}</span>
      </div>

      <div v-else class="browse-lang-page__grid">
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

$px: token("dm-48");

.browse-lang-page {
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
    padding: token("dm-80") $px token("dm-32");
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-24");
    flex-wrap: wrap;
  }

  &__title { color: token("color-text-primary"); }

  &__filters {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    flex-shrink: 0;
  }

  &__filter-label { color: token("color-text-secondary"); }

  &__dropdown {
    width: auto;
    flex-shrink: 0;

    :deep(.dropdown__trigger) {
      width: auto;
      min-width: 150px;
      white-space: nowrap;
    }
  }

  &__body {
    padding: 0 $px token("dm-48");
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: token("dm-4");

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
    gap: token("dm-8");
    color: token("color-text-primary");
  }

  &__empty-sub { color: token("color-text-secondary"); }
}
</style>

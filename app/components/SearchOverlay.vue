<script setup lang="ts">
import type { CatalogMovie, CatalogMovieList } from '~/composables/use-movie-catalog'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { $api } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const apiBase = (runtimeConfig.public.apiUrl as string) || 'http://localhost:8080'

const keyword = ref('')
const results = ref<CatalogMovie[]>([])
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.open, async (val) => {
  if (val) {
    await nextTick()
    inputRef.value?.focus()
  } else {
    keyword.value = ''
    results.value = []
  }
})

watch(keyword, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!val.trim()) {
    results.value = []
    return
  }
  debounceTimer = setTimeout(search, 300)
})

async function search() {
  loading.value = true
  try {
    const res = await $api<CatalogMovieList>('/movies', { params: { keyword: keyword.value, pageSize: 12 } })
    results.value = res.items ?? []
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

function normalizeImage(url: string | null | undefined) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${apiBase}${url}`
}

function goToMovie(id: string) {
  emit('close')
  navigateTo(`/watch/${id}`)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="search-overlay" @click.self="emit('close')">
        <div class="search-overlay__panel">
          <div class="search-overlay__input-row">
            <svg class="search-overlay__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input
              ref="inputRef"
              v-model="keyword"
              type="text"
              placeholder="Tìm phim, series, diễn viên..."
              class="search-overlay__input"
            >
            <button class="search-overlay__close" @click="emit('close')">
              ESC
            </button>
          </div>

          <div class="search-overlay__results">
            <p v-if="loading" class="search-overlay__hint">
              Đang tìm...
            </p>
            <p v-else-if="keyword && !results.length" class="search-overlay__hint">
              Không tìm thấy kết quả cho "{{ keyword }}"
            </p>
            <p v-else-if="!keyword" class="search-overlay__hint">
              Gõ để bắt đầu tìm kiếm
            </p>

            <div v-if="results.length" class="search-overlay__grid">
              <button
                v-for="movie in results"
                :key="movie.id"
                class="search-overlay__item"
                @click="goToMovie(movie.id)"
              >
                <img
                  v-if="movie.poster_url || movie.banner_url"
                  :src="normalizeImage(movie.poster_url || movie.banner_url)"
                  :alt="movie.title"
                  class="search-overlay__poster"
                >
                <div v-else class="search-overlay__poster search-overlay__poster--empty" />
                <span class="search-overlay__title">{{ movie.title }}</span>
                <span class="search-overlay__year">{{ movie.release_year || '' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1500;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;

  &__panel {
    width: min(800px, 90vw);
    background: token("color-background-base");
    border: 1px solid token("grey-700");
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
  }

  &__input-row {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    padding: token("dm-16");
    border-bottom: 1px solid token("grey-700");
  }

  &__icon { color: token("color-text-secondary"); }

  &__input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: token("color-text-primary");
    font-size: 16px;

    &::placeholder { color: token("color-text-secondary"); }
  }

  &__close {
    background: none;
    border: 1px solid token("grey-600");
    border-radius: 4px;
    padding: 4px 8px;
    color: token("color-text-secondary");
    font-size: 11px;
    cursor: pointer;
    &:hover { color: token("color-text-primary"); }
  }

  &__results {
    padding: token("dm-16");
    overflow-y: auto;
  }

  &__hint {
    color: token("color-text-secondary");
    text-align: center;
    padding: token("dm-32") 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: token("dm-12");
  }

  &__item {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 4px;

    &:hover .search-overlay__poster { transform: scale(1.05); }
  }

  &__poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: 6px;
    transition: transform 0.15s ease;

    &--empty {
      background: token("grey-700");
    }
  }

  &__title {
    color: token("color-text-primary");
    font-size: 13px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__year {
    color: token("color-text-secondary");
    font-size: 11px;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

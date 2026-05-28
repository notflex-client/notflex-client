<script setup lang="ts">
import type { CatalogMovie, CatalogMovieList } from '~/composables/use-movie-catalog'

const props = defineProps<{ open: boolean }>()
const emit  = defineEmits<{ close: [] }>()

const { $api } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const apiBase = (runtimeConfig.public.apiUrl as string) || 'http://localhost:8080'

const keyword  = ref('')
const results  = ref<CatalogMovie[]>([])
const loading  = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
let debounce:  ReturnType<typeof setTimeout> | null = null

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
  if (debounce) clearTimeout(debounce)
  if (!val.trim()) { results.value = []; return }
  debounce = setTimeout(search, 300)
})

async function search() {
  loading.value = true
  try {
    const res = await $api<CatalogMovieList>('/movies', { params: { keyword: keyword.value, pageSize: 8 } })
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

function onSubmit() {
  if (!keyword.value.trim()) return
  emit('close')
  navigateTo(`/films?keyword=${encodeURIComponent(keyword.value.trim())}`)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'Enter')  onSubmit()
}

onMounted(()   => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="so-fade">
      <div v-if="open" class="so" @click.self="emit('close')">
        <div class="so__panel">

          <!-- Input -->
          <div class="so__input-row">
            <svg class="so__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.6"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <input
              ref="inputRef"
              v-model="keyword"
              type="text"
              placeholder="Tìm phim, series, diễn viên..."
              class="so__input"
              @keydown.enter.prevent="onSubmit"
            >
            <button class="so__esc" @click="emit('close')">ESC</button>
          </div>

          <!-- Suggestions -->
          <div class="so__body">

            <!-- Loading -->
            <div v-if="loading" class="so__hint">
              <svg class="so__spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="12"/>
              </svg>
              Đang tìm...
            </div>

            <!-- Empty keyword -->
            <p v-else-if="!keyword" class="so__hint">Gõ để bắt đầu tìm kiếm</p>

            <!-- No results -->
            <p v-else-if="!results.length" class="so__hint">
              Không tìm thấy kết quả cho "{{ keyword }}"
            </p>

            <!-- Suggestion list -->
            <template v-else>
              <button
                v-for="movie in results"
                :key="movie.id"
                class="so__item"
                @click="goToMovie(movie.id)"
              >
                <div class="so__thumb">
                  <img
                    v-if="movie.poster_url || movie.banner_url"
                    :src="normalizeImage(movie.poster_url || movie.banner_url)"
                    :alt="movie.title"
                    class="so__img"
                  >
                  <div v-else class="so__img so__img--empty">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                </div>

                <div class="so__info">
                  <span class="so__title">{{ movie.title }}</span>
                  <div class="so__meta">
                    <span v-if="movie.release_year" class="so__year">{{ movie.release_year }}</span>
                    <span class="so__type">{{ movie.type === 'series' ? 'Series' : 'Movie' }}</span>
                  </div>
                </div>

                <svg class="so__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <!-- See all results -->
              <button class="so__see-all" @click="onSubmit">
                Xem tất cả kết quả cho "{{ keyword }}"
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </template>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.so {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1500;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;

  &__panel {
    width: min(640px, 92vw);
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  }

  // ── Input ─────────────────────────────────────────────────────
  &__input-row {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    padding: 14px token("dm-16");
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  &__search-icon { color: token("color-text-secondary"); flex-shrink: 0; }

  &__input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: token("color-text-primary");
    font-size: 16px;
    &::placeholder { color: token("color-text-secondary"); }
  }

  &__esc {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 3px 8px;
    color: token("color-text-secondary");
    font-size: 11px;
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.15s;
    &:hover { color: token("color-text-primary"); }
  }

  // ── Body ──────────────────────────────────────────────────────
  &__body { display: flex; flex-direction: column; }

  &__hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: token("dm-8");
    padding: token("dm-32") token("dm-16");
    color: token("color-text-secondary");
    font-size: 14px;
  }

  &__spinner {
    animation: spin 0.8s linear infinite;
    color: token("color-text-secondary");
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  // ── Suggestion item ───────────────────────────────────────────
  &__item {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    padding: 10px token("dm-16");
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: background 0.12s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &:hover { background: rgba(255, 255, 255, 0.06); }
    &:last-of-type { border-bottom: none; }
  }

  &__thumb {
    width: 44px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.06);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;

    &--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.2);
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    color: token("color-text-primary");
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: token("dm-8");
  }

  &__year, &__type {
    font-size: 12px;
    color: token("color-text-secondary");
  }

  &__type {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    padding: 1px 6px;
  }

  &__arrow {
    color: rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
    transition: color 0.12s, transform 0.12s;

    .so__item:hover & {
      color: rgba(255, 255, 255, 0.6);
      transform: translateX(2px);
    }
  }

  // ── See all ───────────────────────────────────────────────────
  &__see-all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: token("dm-6");
    width: 100%;
    padding: 12px token("dm-16");
    background: none;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: token("color-action-brand");
    font-size: 13px;
    cursor: pointer;
    transition: background 0.12s;

    &:hover { background: rgba(229, 9, 20, 0.08); }
  }
}

.so-fade-enter-active, .so-fade-leave-active { transition: opacity 0.15s ease; }
.so-fade-enter-from,  .so-fade-leave-to      { opacity: 0; }
</style>

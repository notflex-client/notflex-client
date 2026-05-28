import type { CatalogMovieList } from './use-movie-catalog'

export function useRecommendations() {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

  async function listRecommendations() {
    if (!import.meta.client) {
      // Skip on SSR — token not available server-side
      return { items: [], source: 'pending' }
    }

    if (authStore.isLoggedIn) {
      try {
        const res = await $api<{ items: CatalogMovieList['items'], source: string, cached?: boolean }>('/recommendations/me')
        return { items: res.items ?? [], source: res.source }
      } catch {}
    }

    try {
      const res = await $api<{ items: CatalogMovieList['items'], source: string }>('/recommendations')
      return { items: res.items ?? [], source: res.source }
    } catch {
      const fallback = await $api<CatalogMovieList>('/movies', { params: { pageSize: 12, sort: 'top' } })
      return { items: fallback.items ?? [], source: 'fallback-top-rated' }
    }
  }

  return { listRecommendations }
}

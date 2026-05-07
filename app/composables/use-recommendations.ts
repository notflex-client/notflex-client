import type { CatalogMovieList } from './use-movie-catalog'

export function useRecommendations() {
  const { $api } = useNuxtApp()

  async function listRecommendations() {
    try {
      const res = await $api<{ items: CatalogMovieList['items']; source: string }>('/recommendations')
      return { items: res.items ?? [], source: res.source }
    } catch {
      const fallback = await $api<CatalogMovieList>('/movies', { params: { pageSize: 12, sort: 'top' } })
      return { items: fallback.items ?? [], source: 'fallback-top-rated' }
    }
  }

  return { listRecommendations }
}

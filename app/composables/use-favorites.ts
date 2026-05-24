import type { CatalogMovie } from './use-movie-catalog'

export interface FavoriteItem {
  user_id: string
  movie_id: string
  movie?: CatalogMovie
  created_at: string
}

export interface FavoriteList {
  items: FavoriteItem[]
  page: number
  itemCount: number
  pageCount: number
}

export function useFavorites() {
  const { $api } = useNuxtApp()

  async function listFavorites(params?: { page?: number; pageSize?: number }) {
    return $api<FavoriteList>('/favorites', { params })
  }

  async function addFavorite(movieId: string) {
    return $api<FavoriteItem>(`/favorites/${movieId}`, { method: 'POST' })
  }

  async function removeFavorite(movieId: string) {
    return $api<boolean>(`/favorites/${movieId}`, { method: 'DELETE' })
  }

  return { listFavorites, addFavorite, removeFavorite }
}

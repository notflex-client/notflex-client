import type { CatalogMovie } from './use-movie-catalog'

export interface Banner {
  id: string
  movie_id: string | null
  movie?: CatalogMovie | null
  title: string
  description: string
  image_url: string
  link_url: string
  position: number
  is_active: boolean
}

export function useBanners() {
  const { $api } = useNuxtApp()

  async function listBanners() {
    return $api<Banner[]>('/banners')
  }

  return { listBanners }
}

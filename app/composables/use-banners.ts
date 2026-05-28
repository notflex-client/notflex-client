import type { CatalogMovie } from './use-movie-catalog'

export interface Banner {
  id: string
  movie_id: string | null
  movie?: CatalogMovie | null
  title: string
  description: string
  image_url: string
  link_url: string
  page: string
  position: number
  is_active: boolean
}

export type BannerPage = 'browse' | 'films' | 'series' | 'new-and-popular'

export function useBanners() {
  const { $api } = useNuxtApp()

  async function listBanners(page?: BannerPage) {
    return $api<Banner[]>('/banners', { params: page ? { page } : undefined })
  }

  return { listBanners }
}

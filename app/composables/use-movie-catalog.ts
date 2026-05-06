import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

export interface CatalogTag {
  id: number
  name: string
  slug: string
}

export interface CatalogMovie {
  id: string
  title: string
  type?: 'movie' | 'series'
  description?: string | null
  poster_url?: string | null
  banner_url?: string | null
  rating?: string | null
  release_year?: number | null
  avg_rating?: number
  duration_mins?: number | null
  tags?: CatalogTag[]
}

export interface CatalogMovieList {
  items: CatalogMovie[]
  page: number
  itemCount: number
  pageCount: number
}

export function useMovieCatalog() {
  const { $api } = useNuxtApp()

  function mapMovie(movie: CatalogMovie, index?: number): MovieBlockItem {
    return {
      image: movie.poster_url || movie.banner_url || '',
      title: movie.title,
      rank: typeof index === 'number' ? index + 1 : undefined,
      rating: movie.rating || undefined,
      description: movie.description || undefined,
      tags: movie.tags?.map(tag => tag.name) ?? [],
      isNew: true,
    }
  }

  async function listMovies(params: Record<string, string | number | undefined>) {
    return $api<CatalogMovieList>('/movies', { params })
  }

  return { listMovies, mapMovie }
}

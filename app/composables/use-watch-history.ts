import type { CatalogMovie } from './use-movie-catalog'

export interface WatchHistoryItem {
  id: string
  user_id: string
  movie_id: string
  movie?: CatalogMovie
  watch_duration: number
  is_completed: boolean
  watched_at: string
}

export function useWatchHistory() {
  const { $api } = useNuxtApp()

  async function listWatchHistory() {
    return $api<WatchHistoryItem[]>('/watch-history')
  }

  function progressPercent(item: WatchHistoryItem) {
    const totalSeconds = (item.movie?.duration_mins ?? 0) * 60
    if (totalSeconds <= 0) return item.is_completed ? 100 : 0
    const pct = (item.watch_duration / totalSeconds) * 100
    return Math.max(1, Math.min(99, Math.round(pct)))
  }

  return { listWatchHistory, progressPercent }
}

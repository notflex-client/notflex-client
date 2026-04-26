<script setup lang="ts">
import type { MovieBlockItem } from '~/components/ui/MovieBlock.vue'

// Shared placeholder items (no real images — grey thumbnails)
const defaultItems: MovieBlockItem[] = [
  { badge: 'Recently Added', duration: '1h 45m' },
  { duration: '2h 18m' },
  { badge: 'Leaving Soon', duration: '1h 30m' },
  { duration: '2h 05m' },
  { badge: 'Recently Added', duration: '1h 52m' },
  { duration: '1h 38m' },
  { duration: '2h 10m' },
  { badge: 'Recently Added', duration: '1h 59m' },
]

const firstItems: MovieBlockItem[] = [
  { badge: 'Recently Added', duration: '1h 45m' },
  { duration: '2h 18m' },
  { badge: 'Leaving Soon', duration: '1h 30m' },
  { duration: '2h 05m' },
  { badge: 'Recently Added', duration: '1h 52m' },
  { duration: '1h 38m' },
  { badge: 'Recently Added', duration: '2h 10m' },
  { duration: '1h 59m' },
]

const top10Items: MovieBlockItem[] = [
  { rank: 1, badge: 'Recently Added' },
  { rank: 2, badge: 'Recently Added' },
  { rank: 3 },
  { rank: 4 },
  { rank: 5 },
  { rank: 6 },
  { rank: 7 },
]

const continueItems: MovieBlockItem[] = [
  { progress: 20 },
  { progress: 55 },
  { progress: 75 },
  { progress: 90 },
  { progress: 10 },
]
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Default Block</h3>
      <p class="ds-block__desc">No title, small cards (160px). Used for standalone rows.</p>
      <MovieBlock variant="default" :items="defaultItems" />
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Home Page First Block</h3>
      <p class="ds-block__desc">Title + 200px cards. Used as the first content row under the hero.</p>
      <MovieBlock variant="first" title="Matched to You" :items="firstItems" />
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Home Page Default Block</h3>
      <p class="ds-block__desc">Title + 200px cards. Standard row for most categories.</p>
      <MovieBlock variant="first" title="New on Netflix" :items="defaultItems" />
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Home Page TOP 10</h3>
      <p class="ds-block__desc">Title + portrait cards with large rank number.</p>
      <MovieBlock variant="top10" title="Top 10 movies in the U.S. Today" :items="top10Items" />
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Home Page Continue Watching</h3>
      <p class="ds-block__desc">Title + wide cards with red progress bar.</p>
      <MovieBlock variant="continue" title="Continue Watching for James" :items="continueItems" />
    </div>

  </div>
</template>

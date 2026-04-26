<template>
  <div class="ds-section">

    <!-- Default -->
    <div class="ds-block">
      <h3 class="ds-block__title">Default</h3>
      <div class="mc-row">
        <MovieCard variant="default" />
      </div>
    </div>

    <!-- More Like This -->
    <div class="ds-block">
      <h3 class="ds-block__title">More Like This (Default / Hover)</h3>
      <div class="mc-row">
        <MovieCard variant="more-like-this" duration="2h 18m" />
        <MovieCard variant="more-like-this" duration="2h 18m" show-play />
      </div>
    </div>

    <!-- Episode Preview -->
    <div class="ds-block">
      <h3 class="ds-block__title">Episode Preview (Default / Hover)</h3>
      <div class="mc-row">
        <MovieCard variant="episode" duration="2h 18m" />
        <MovieCard variant="episode" duration="2h 18m" show-play />
      </div>
    </div>

    <!-- Trailer Preview -->
    <div class="ds-block">
      <h3 class="ds-block__title">Trailer Preview</h3>
      <div class="mc-row">
        <MovieCard variant="trailer" title="Season 1 Trailer 1: House of Ninjas" />
      </div>
    </div>

    <!-- Player Preview -->
    <div class="ds-block">
      <h3 class="ds-block__title">Player Preview</h3>
      <div class="mc-row">
        <MovieCard variant="player" duration="51:29" />
      </div>
    </div>

    <!-- TOP10 -->
    <div class="ds-block">
      <h3 class="ds-block__title">TOP10</h3>
      <div class="mc-row mc-row--top10">
        <MovieCard variant="top10" :rank="1" badge="Recently Added" />
        <MovieCard variant="top10" :rank="2" />
        <MovieCard variant="top10" :rank="3" />
      </div>
    </div>

    <!-- Continue Watching -->
    <div class="ds-block">
      <h3 class="ds-block__title">Continue Watching</h3>
      <div class="mc-row">
        <MovieCard variant="continue" :progress="35" />
        <MovieCard variant="continue" :progress="70" />
        <MovieCard variant="continue" :progress="90" />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.mc-row {
  display: flex;
  gap: var(--dm-12);
  flex-wrap: wrap;

  // Standard cards: fixed width
  > * { width: 220px; }

  // TOP10 cards: wider to accommodate rank number
  &--top10 > * { width: 200px; }
}
</style>

<template>
  <div class="ds-section">

    <!-- ── State showcase ─────────────────────────────────── -->
    <div class="ds-block">
      <h3 class="ds-block__title">List of Next Episodes</h3>
      <p class="ds-block__desc">
        Four visual states: the current (active) episode in default and focused,
        plus other episodes in default and hover.
      </p>

      <div class="ep-demo-box">

        <div class="ep-state-row">
          <EpisodeItem
            :number="1"
            title="Episode 1"
            description="With the promise of money, a poor kid from Fukuoka joins a sumo training stable, but his cocky attitude doesn't score him any points."
            :active="true"
          />
          <span class="caption-1-regular ep-state-label">Current Episode Default</span>
        </div>

        <div class="ep-state-row">
          <EpisodeItem
            :number="1"
            title="Episode 1"
            description="With the promise of money, a poor kid from Fukuoka joins a sumo training stable, but his cocky attitude doesn't score him any points."
            :active="true"
            :focused="true"
          />
          <span class="caption-1-regular ep-state-label">Current Episode Focus</span>
        </div>

        <div class="ep-state-row">
          <EpisodeItem
            :number="2"
            title="Episode 2"
            description="Faced with a brutal regimen and harsh seniors, Kiyoshi must decide how much he's willing to sacrifice to chase his dream."
          />
          <span class="caption-1-regular ep-state-label">Other Episode Default</span>
        </div>

        <div class="ep-state-row ep-force-hover">
          <EpisodeItem
            :number="2"
            title="Episode 2"
            description="Faced with a brutal regimen and harsh seniors, Kiyoshi must decide how much he's willing to sacrifice to chase his dream."
          />
          <span class="caption-1-regular ep-state-label">Other Episode Hover</span>
        </div>

      </div>
    </div>

    <!-- ── Sanctuary example ──────────────────────────────── -->
    <div class="ds-block">
      <h3 class="ds-block__title">Sanctuary</h3>
      <div class="ep-list">
        <EpisodeItem
          :number="1"
          title="Episode 1"
          description="With the promise of money, a poor kid from Fukuoka joins a sumo training stable, but his cocky attitude doesn't score him any points."
          :active="true"
          :focused="true"
        />
        <EpisodeItem
          :number="2"
          title="Episode 2"
          description="Faced with a brutal regimen and harsh seniors, Kiyoshi must decide how much he's willing to sacrifice."
          duration="46m"
        />
        <EpisodeItem
          :number="3"
          title="Episode 3"
          description="As Kiyoshi climbs the rankings, old rivalries resurface. A confrontation forces him to reveal his true motives."
          duration="49m"
        />
        <EpisodeItem
          :number="4"
          title="Episode 4"
          description="The path to the top is narrowing. One last chance changes everything Kiyoshi thought he knew."
          duration="45m"
        />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

// ── State showcase demo box ────────────────────────────────────
.ep-demo-box {
  background-color: token("grey-800");
  border-radius: 8px;
  overflow: hidden;
  max-width: 780px;
}

.ep-state-row {
  display: flex;
  align-items: center;

  :deep(.episode-item) {
    flex: 1;
  }
}

.ep-state-label {
  flex-shrink: 0;
  width: 200px;
  padding: 0 token("dm-24");
  color: token("color-text-secondary");
}

// Simulated hover state for demo
.ep-force-hover :deep(.episode-item) {
  background-color: token("grey-700");
}

// ── Sanctuary list ─────────────────────────────────────────────
.ep-list {
  background-color: token("grey-800");
  border-radius: 6px;
  overflow: hidden;
  max-width: 640px;
}
</style>

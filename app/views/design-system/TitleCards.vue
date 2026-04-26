<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Title Preview — All sizes</h3>
      <div style="background: #141414; border-radius: 8px; padding: 32px; display: flex; align-items: flex-end; gap: 48px; overflow-x: auto;">

        <!-- full -->
        <TitleCard
          size="full"
          category="SERIES"
          title="HOUSE OF NINJAS"
          rank-label="#2 in TV Shows Today"
          description="Years after retiring from their formidable ninja lives, a dysfunctional family must return to shadowy missions to counteract a string of looming threats."
        />

        <!-- medium -->
        <TitleCard
          size="medium"
          category="SERIES"
          title="HOUSE OF NINJAS"
        />

        <!-- compact -->
        <TitleCard
          size="compact"
          category="SERIES"
          title="HOUSE OF NINJAS"
        />

        <!-- title-only -->
        <TitleCard
          size="title-only"
          title="HOUSE OF NINJAS"
        />

        <!-- mini -->
        <TitleCard
          size="mini"
          category="SERIES"
          title="HOUSE OF NINJAS"
        />

      </div>
    </div>

  </div>
</template>

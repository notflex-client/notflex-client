<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Movie Preview — Series</h3>
      <p class="ds-block__desc">Expanded hover card for a TV series. Shows actions, rating badges, and genre tags.</p>
      <div class="mpc-demo-row">
        <MoviePreviewCard
          title="House of Ninjas"
          year="2024"
          rating="TV-MA"
          seasons="3 Seasons"
          quality="HD"
          :is-new="true"
          description="Before he was a protector, Kenshin was a fearsome assassin known as Battosai. But when he meets the gentle Tomoe Yukishiro, his story begins to change."
          :tags="['Violent', 'Dark', 'Action']"
        />
        <MoviePreviewCard
          title="Space Force"
          year="2021"
          rating="TV-MA"
          seasons="2 Seasons"
          quality="HD"
          description="A decorated pilot with dreams of running the Air Force is made the four-star general of a new military branch: the Space Force."
          :tags="['Witty', 'Comedy', 'Workplace']"
        />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Movie Preview — Film</h3>
      <p class="ds-block__desc">Film variant with runtime instead of seasons.</p>
      <div class="mpc-demo-row">
        <MoviePreviewCard
          title="The Brothers Sun"
          year="2024"
          rating="TV-MA"
          seasons="1h 52m"
          quality="HD"
          :is-new="true"
          description="After a shocking attack on their father, a notorious gangster's two sons navigate the line between family loyalty and the life they've built in America."
          :tags="['Crime', 'Dark', 'Suspenseful']"
        />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.mpc-demo-row {
  display: flex;
  gap: var(--dm-24);
  flex-wrap: wrap;
}
</style>

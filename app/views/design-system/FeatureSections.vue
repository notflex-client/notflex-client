<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Feature Section — Text left, Image right (default)</h3>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <FeatureSection
          title="Enjoy on your TV."
          description="Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more."
          image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
        />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Feature Section — Text right, Image left (reverse)</h3>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <FeatureSection
          title="Download your shows to watch offline."
          description="Save your favorites easily and always have something to watch."
          image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
          reverse
        />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Feature Section — Watch everywhere</h3>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <FeatureSection
          title="Watch everywhere."
          description="Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV."
          image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"
        />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Feature Section — Kids</h3>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <FeatureSection
          title="Create profiles for kids."
          description="Send kids on adventures with their favorite characters in a space made just for them — free with your membership."
          image="https://occ-0-2433-2430.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABVr8nYuAg0mP3TW9xDiOsUKIZBjEGfEME4GnbpMtHW7qvPR7_A8VW2tnoAjZ4LPVjqJNIFq3XBkpCKnRHVTLj7YN.png"
          reverse
        />
      </div>
    </div>

  </div>
</template>

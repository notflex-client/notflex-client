<template>
  <div class="ds-section">

    <!-- Home variant -->
    <div class="ds-block">
      <h3 class="ds-block__title">Home — show hero</h3>
      <p class="ds-block__desc">Full-bleed show poster. TitleCard at bottom-left. Gradient left + bottom.</p>
      <HeroBanner
        variant="home"
        image="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80"
        class="hb-demo-rounded"
      >
        <TitleCard
          size="full"
          category="SERIES"
          title="HOUSE OF NINJAS"
          rank-label="#2 in TV Shows Today"
          description="Years after retiring from their formidable ninja lives, a dysfunctional family must return to shadowy missions to counteract a string of looming threats."
        />
      </HeroBanner>
    </div>

    <!-- Preview variant -->
    <div class="ds-block">
      <h3 class="ds-block__title">Preview — movie still</h3>
      <p class="ds-block__desc">Shorter section with compact TitleCard.</p>
      <HeroBanner
        variant="preview"
        image="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=80"
        class="hb-demo-rounded"
      >
        <TitleCard size="compact" category="FILM" title="DARK WATERS" />
      </HeroBanner>
    </div>

    <!-- Landing variant -->
    <div class="ds-block">
      <h3 class="ds-block__title">Landing — sign-up hero</h3>
      <p class="ds-block__desc">Full viewport height, centered. Radial dark center.</p>
      <HeroBanner
        variant="landing"
        image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80"
        min-height="600px"
        class="hb-demo-rounded"
      >
        <div class="hb-landing">
          <svg class="hb-landing__logo" viewBox="0 0 300 60" aria-label="NOTFLEX">
            <text x="0" y="50" font-family="Arial Black,sans-serif" font-size="54" font-weight="900" fill="#E50914">NOTFLEX</text>
          </svg>
          <h1 class="title-1-bold hb-landing__headline">Unlimited movies, TV shows, and more</h1>
          <p class="headline-1-regular hb-landing__sub">Watch anywhere. Cancel anytime.</p>
          <p class="body-regular hb-landing__cta-label">Ready to watch? Enter your email to create or restart your membership.</p>
          <div class="hb-landing__form">
            <InputField label="Email address" class="hb-landing__input" />
            <Button variant="brand" size="large">Get Started</Button>
          </div>
        </div>
      </HeroBanner>
    </div>

    <!-- Auth variant -->
    <div class="ds-block">
      <h3 class="ds-block__title">Auth — sign-in overlay</h3>
      <p class="ds-block__desc">Full viewport height, solid dark overlay. Form card centered.</p>
      <HeroBanner
        variant="auth"
        image="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1400&q=80"
        min-height="500px"
        class="hb-demo-rounded"
      >
        <div class="hb-auth-form">
          <h2 class="title-2-bold hb-auth-form__title">Sign In</h2>
          <div class="hb-auth-form__fields">
            <InputField label="Email or phone number" />
            <InputField label="Password" type="password" />
            <Button variant="brand" size="large" block>Sign In</Button>
          </div>
        </div>
      </HeroBanner>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.hb-demo-rounded { border-radius: 8px; overflow: hidden; }

// ── Landing content ─────────────────────────────────────────────
.hb-landing {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;

  &__logo {
    width: 180px;
    height: auto;
    margin-bottom: token("dm-24");
  }

  &__headline {
    color: token("white");
    margin: 0 0 token("dm-16");
  }

  &__sub {
    color: token("white");
    margin: 0 0 token("dm-16");
  }

  &__cta-label {
    color: token("white");
    margin: 0 0 token("dm-20");
  }

  &__form {
    display: flex;
    gap: token("dm-12");
    justify-content: center;
    width: 100%;
    max-width: 600px;
  }

  &__input { flex: 1; }
}

// ── Auth form card ──────────────────────────────────────────────
.hb-auth-form {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: token("dm-48") token("dm-64");
  max-width: 450px;
  width: 100%;
  color: token("white");

  &__title {
    color: token("white");
    margin: 0 0 token("dm-28");
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
  }
}
</style>

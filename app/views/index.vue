<script setup lang="ts">
const heroEmail = ref('')
const faqEmail  = ref('')
const { lang, LANG_OPTIONS } = useLocale()

const FAQ_ITEMS = [
  {
    id: 'q1',
    q: 'What is Netflix?',
    a: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want—all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!",
  },
  {
    id: 'q2',
    q: 'How much does Netflix cost?',
    a: 'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from USD 6.99 to USD 22.99 a month. No extra costs, no contracts.',
  },
  {
    id: 'q3',
    q: 'Where can I watch?',
    a: 'Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at notflex.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.',
  },
  {
    id: 'q4',
    q: 'How do I cancel?',
    a: 'Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees—start or stop your account anytime.',
  },
  {
    id: 'q5',
    q: 'What can I watch on Netflix?',
    a: 'Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.',
  },
  {
    id: 'q6',
    q: 'Is Netflix good for kids?',
    a: "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space. Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see.",
  },
]

function getStarted(emailVal: string) {
  navigateTo(`/signup?email=${encodeURIComponent(emailVal)}`)
}
</script>

<template>
  <div class="lp">

    <!-- ── Header ─────────────────────────────────────────── -->
    <!-- #action slot already wrapped in flex by AppHeader -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="lp-logo">NOTFLEX</span>
      </template>
      <template #action>
        <Dropdown v-model="lang" :options="LANG_OPTIONS" size="small" />
        <Button variant="brand" size="small">Sign In</Button>
      </template>
    </AppHeader>

    <!-- ── Hero ───────────────────────────────────────────── -->
    <HeroBanner variant="landing" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <div class="flex flex-col items-center gap-3 w-full">
        <h1 class="title-1-bold">Unlimited movies, TV shows, and more</h1>
        <span class="headline-2-regular">Watch anywhere. Cancel anytime.</span>
        <span class="body-regular">Ready to watch? Enter your email to create or restart your membership.</span>
        <div class="flex gap-2 w-full mt-2 items-start">
          <InputField v-model="heroEmail" label="Email address" type="email" autocomplete="email" class="flex-1 min-w-0" />
          <Button variant="brand" size="large" @click="getStarted(heroEmail)">
            Get Started
            <template #trailing-icon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </template>
          </Button>
        </div>
      </div>
    </HeroBanner>

    <!-- ── Promo Banner ────────────────────────────────────── -->
    <div class="lp-promo">
      <span class="lp-promo__icon" aria-hidden="true">🍿</span>
      <div class="lp-promo__body">
        <span class="body-medium lp-promo__heading">The Netflix you love for just $6.99.</span>
        <span class="body-regular lp-promo__sub">
          Get the Standard with ads plan.
          <a href="#" class="lp-promo__link">
            Learn More
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </span>
      </div>
    </div>

    <!-- ── Feature Sections ────────────────────────────────── -->
    <FeatureSection
      title="Enjoy on your TV"
      description="Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more."
      image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
    />

    <FeatureSection
      title="Watch everywhere"
      description="Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV."
      image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"
      :reverse="true"
    />

    <FeatureSection
      title="Create profiles for kids"
      description="Send kids on adventures with their favorite characters in a space made just for them—free with your membership."
      image="https://occ-0-2433-2430.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABVr8nYuAg0mP3TW9xDiOsUKIZBjEGfEME4GnbpMtHW7qvPR7_A8VW2tnoAjZ4LPVjqJNIFq3XBkpCKnRHVTLj7YN.png"
    />

    <FeatureSection
      title="Download your shows to watch offline"
      description="Watch on a plane, train, or submarine..."
      image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
      :reverse="true"
    />

    <!-- ── FAQ ────────────────────────────────────────────── -->
    <section class="lp-faq">
      <div class="max-w-[660px] mx-auto flex flex-col items-center gap-5 text-center">
        <h2 class="title-2-bold">Frequently Asked Questions</h2>

        <div class="w-full text-left flex flex-col gap-2">
          <Accordion v-for="item in FAQ_ITEMS" :key="item.id" :title="item.q">
            {{ item.a }}
          </Accordion>
        </div>

        <span class="body-regular">Ready to watch? Enter your email to create or restart your membership.</span>
        <div class="flex gap-2 w-full items-start">
          <InputField v-model="faqEmail" label="Email address" type="email" autocomplete="email" class="flex-1 min-w-0" />
          <Button variant="brand" size="large" @click="getStarted(faqEmail)">
            Get Started
            <template #trailing-icon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </template>
          </Button>
        </div>
      </div>
    </section>

    <!-- ── Footer ─────────────────────────────────────────── -->
    <AppFooter variant="landing" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.lp {
  background-color: token("color-background-base");
}

// Logo text in header slot
.lp-logo {
  font-family: token("font-family-logo");
  font-size: 28px;
  color: token("color-action-brand");
  letter-spacing: 2px;
}

// Promo banner — no component for this
.lp-promo {
  display: flex;
  align-items: center;
  gap: token("dm-20");
  padding: token("dm-16") token("dm-40");
  background: linear-gradient(to right, #0c0c2e, token("grey-900") 60%);
  border-top: 1px solid token("color-border-subtle");
  border-bottom: 1px solid token("color-border-subtle");

  &__icon {
    font-size: 40px;
    line-height: 1;
    flex-shrink: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: token("dm-4");
  }

  &__heading { color: token("color-text-primary"); }
  &__sub     { color: token("color-text-secondary"); }

  &__link {
    color: #4da6ff;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: token("dm-4");
    &:hover { text-decoration: underline; }
  }
}

// FAQ section wrapper
.lp-faq {
  padding: token("dm-80") token("dm-20");
  border-top: 1px solid token("color-border-subtle");
}
</style>

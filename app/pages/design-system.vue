<script setup lang="ts">
import Colors from '~/views/design-system/Colors.vue'
import Typography from '~/views/design-system/Typography.vue'
import Spacing from '~/views/design-system/Spacing.vue'
import Dropdowns from '~/views/design-system/Dropdowns.vue'
import InputFields from '~/views/design-system/InputFields.vue'
import Buttons from '~/views/design-system/Buttons.vue'
import Checkboxes from '~/views/design-system/Checkboxes.vue'
import IconButtons from '~/views/design-system/IconButtons.vue'
import Headers from '~/views/design-system/Headers.vue'
import Footers from '~/views/design-system/Footers.vue'
import Accordions from '~/views/design-system/Accordions.vue'
import FeatureSections from '~/views/design-system/FeatureSections.vue'
import TitleCards from '~/views/design-system/TitleCards.vue'
import HeroBanners from '~/views/design-system/HeroBanners.vue'
import MovieCards from '~/views/design-system/MovieCards.vue'
import MovieBlocks from '~/views/design-system/MovieBlocks.vue'
import EpisodeItems from '~/views/design-system/EpisodeItems.vue'
import MoviePreviewCards from '~/views/design-system/MoviePreviewCards.vue'
import Badges from '~/views/design-system/Badges.vue'
import Sliders from '~/views/design-system/Sliders.vue'
import PlayerControls from '~/views/design-system/PlayerControls.vue'
import Avatars from '~/views/design-system/Avatars.vue'

const tabs = ['Colors', 'Typography', 'Spacing', 'Dropdown', 'Input Fields', 'Buttons', 'Checkboxes', 'Icon Buttons', 'Header', 'Footer', 'Accordion', 'Feature Section', 'Title Card', 'Hero Banner', 'Movie Card', 'Movie Block', 'Episode Item', 'Movie Preview', 'Badge', 'Slider', 'Player Controls', 'Avatar'] as const
type Tab = (typeof tabs)[number]

const route = useRoute()
const router = useRouter()
const activeTab = ref<Tab>((route.query.tab as Tab) || 'Colors')

function setTab(tab: Tab) {
  activeTab.value = tab
  router.replace({ query: { tab } })
}
</script>

<template>
  <div class="ds-layout">
    <aside class="ds-sidebar">
      <div class="ds-sidebar__header">
        <span class="ds-sidebar__logo">NOTFLEX</span>
        <p class="ds-sidebar__sub">Design System</p>
      </div>
      <nav class="ds-sidebar__nav">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="ds-nav-item"
          :class="{ 'is-active': activeTab === tab }"
          @click="setTab(tab)"
        >
          {{ tab }}
        </button>
      </nav>
    </aside>

    <main class="ds-main">
      <header class="ds-main__header">
        <h2 class="title-2-medium">{{ activeTab }}</h2>
      </header>
      <div class="ds-main__body">
        <Colors v-if="activeTab === 'Colors'" />
        <Typography v-else-if="activeTab === 'Typography'" />
        <Spacing v-else-if="activeTab === 'Spacing'" />
        <Dropdowns v-else-if="activeTab === 'Dropdown'" />
        <InputFields v-else-if="activeTab === 'Input Fields'" />
        <Buttons v-else-if="activeTab === 'Buttons'" />
        <Checkboxes v-else-if="activeTab === 'Checkboxes'" />
        <IconButtons v-else-if="activeTab === 'Icon Buttons'" />
        <Headers v-else-if="activeTab === 'Header'" />
        <Footers v-else-if="activeTab === 'Footer'" />
        <Accordions v-else-if="activeTab === 'Accordion'" />
        <FeatureSections v-else-if="activeTab === 'Feature Section'" />
        <TitleCards v-else-if="activeTab === 'Title Card'" />
        <HeroBanners v-else-if="activeTab === 'Hero Banner'" />
        <MovieCards v-else-if="activeTab === 'Movie Card'" />
        <MovieBlocks v-else-if="activeTab === 'Movie Block'" />
        <EpisodeItems v-else-if="activeTab === 'Episode Item'" />
        <MoviePreviewCards v-else-if="activeTab === 'Movie Preview'" />
        <Badges v-else-if="activeTab === 'Badge'" />
        <Sliders v-else-if="activeTab === 'Slider'" />
        <PlayerControls v-else-if="activeTab === 'Player Controls'" />
        <Avatars v-else-if="activeTab === 'Avatar'" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.ds-layout {
  display: flex;
  min-height: 100vh;
  background-color: token("color-background-base");
  color: token("color-text-primary");
}

// ── Sidebar ──────────────────────────────────────
.ds-sidebar {
  width: 220px;
  flex-shrink: 0;
  background-color: token("color-background-surface");
  border-right: 1px solid token("color-border-subtle");
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;

  &__header {
    padding: token("dm-24") token("dm-20");
    border-bottom: 1px solid token("color-border-subtle");
  }

  &__logo {
    font-family: token("font-family-logo");
    font-size: 28px;
    color: token("color-action-brand");
    letter-spacing: 2px;
  }

  &__sub {
    margin-top: token("dm-4");
    font-size: token("typo-regular-font-size-caption-1");
    color: token("color-text-secondary");
  }

  &__nav {
    display: flex;
    flex-direction: column;
    padding: token("dm-8") 0;
  }
}

.ds-nav-item {
  text-align: left;
  padding: token("dm-8") token("dm-20");
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  font-size: token("typo-regular-font-size-body");
  color: token("color-text-secondary");
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: token("color-text-primary");
    background-color: token("color-background-highlight");
  }

  &.is-active {
    color: token("color-text-primary");
    border-left-color: token("color-action-brand");
    background-color: token("color-background-highlight");
    font-weight: token("font-weight-medium");
  }
}

// ── Main ─────────────────────────────────────────
.ds-main {
  flex: 1;
  overflow-y: auto;
  height: 100vh;

  &__header {
    padding: token("dm-24") token("dm-32") token("dm-16");
    border-bottom: 1px solid token("color-border-subtle");
  }

  &__body {
    padding: token("dm-32");
  }
}
</style>

<style lang="scss">
// ── Shared design system styles (unscoped so sub-views inherit) ───
.ds-section {
  display: flex;
  flex-direction: column;
  gap: token("dm-40");
}

.ds-block {
  &__title {
    font-size: token("typo-medium-font-size-headline-2");
    font-weight: token("font-weight-medium");
    color: token("color-text-primary");
    margin-bottom: token("dm-16");
    padding-bottom: token("dm-8");
    border-bottom: 1px solid token("color-border-subtle");
  }

  &__desc {
    font-size: token("typo-regular-font-size-body");
    color: token("color-text-secondary");
    margin-bottom: token("dm-16");
  }
}

.ds-label {
  font-size: token("typo-regular-font-size-caption-1");
  color: token("color-text-secondary");
  margin-bottom: token("dm-8");
}

.ds-row {
  display: flex;
  flex-wrap: wrap;
  &--gap { gap: token("dm-24"); }
}

// Swatches
.ds-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: token("dm-16");

  &--row { gap: token("dm-8"); }
}

.ds-swatch {
  display: flex;
  flex-direction: column;
  gap: token("dm-8");

  &__color {
    width: 120px;
    height: 80px;
    border-radius: 6px;
  }

  &__name {
    font-size: token("typo-regular-font-size-caption-1");
    color: token("color-text-primary");
  }

  &__var {
    font-size: token("typo-regular-font-size-caption-2");
    color: token("color-text-secondary");
  }

  &--sm &__color {
    width: 48px;
    height: 40px;
  }

  &--checker &__color {
    background-image: repeating-conic-gradient(#555 0% 25%, #333 0% 50%);
    background-size: 12px 12px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: inherit;
    }
  }
}

// Semantic rows
.ds-semantic-group {
  margin-bottom: token("dm-20");

  &__label {
    font-size: token("typo-regular-font-size-caption-1");
    font-weight: token("font-weight-medium");
    color: token("color-text-secondary");
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: token("dm-8");
  }
}

.ds-semantic-rows {
  display: flex;
  flex-wrap: wrap;
  gap: token("dm-8");
}

.ds-semantic-row {
  display: flex;
  align-items: center;
  gap: token("dm-8");
  padding: token("dm-6") token("dm-12");
  background-color: token("color-background-surface");
  border: 1px solid token("color-border-subtle");
  border-radius: 4px;

  &__swatch {
    width: 20px;
    height: 20px;
    border-radius: 3px;
    border: 1px solid token("color-border-subtle");
    flex-shrink: 0;
  }

  &__name {
    font-size: token("typo-regular-font-size-caption-1");
    color: token("color-text-secondary");
  }
}

// Typography
.ds-typo-list {
  display: flex;
  flex-direction: column;
  gap: token("dm-4");
}

.ds-typo-row {
  display: flex;
  align-items: baseline;
  gap: token("dm-24");
  padding: token("dm-8") 0;
  border-bottom: 1px solid token("color-border-subtle");

  &__name {
    width: 200px;
    flex-shrink: 0;
    font-size: 11px;
    color: token("color-text-secondary");
  }
}

// Spacing
.ds-spacing-list {
  display: flex;
  flex-direction: column;
  gap: token("dm-8");
}

.ds-spacing-row {
  display: flex;
  align-items: center;
  gap: token("dm-16");

  &__name {
    width: 80px;
    flex-shrink: 0;
    font-size: 11px;
    color: token("color-text-secondary");
  }

  &__bar-wrap {
    flex: 1;
  }

  &__bar {
    height: 8px;
    background-color: token("color-action-brand");
    border-radius: 2px;
    min-width: 2px;
  }

  &__value {
    width: 60px;
    flex-shrink: 0;
    font-size: 11px;
    color: token("color-text-secondary");
    text-align: right;
  }
}
</style>

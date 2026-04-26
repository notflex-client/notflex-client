<script setup lang="ts">
const baseColors = [
  { label: 'Black', var: '--black' },
  { label: 'White', var: '--white' },
  { label: 'Red (brand)', var: '--red' },
]

const secondaryColors = [
  { label: 'Red 100', var: '--secondary-red-100' },
  { label: 'Red 200', var: '--secondary-red-200' },
  { label: 'Red 300', var: '--secondary-red-300' },
  { label: 'Blue 100', var: '--secondary-blue-100' },
  { label: 'Blue 200', var: '--secondary-blue-200' },
  { label: 'Blue 300', var: '--secondary-blue-300' },
  { label: 'Green', var: '--secondary-green' },
]

const greySteps = [10, 20, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900]

const overlayWhite = [15, 20, 30, 35, 50, 70]
const overlayBlack = [30, 60, 90]

const semanticGroups = [
  {
    title: 'Background',
    tokens: ['color-background-base', 'color-background-surface', 'color-background-elevated', 'color-background-overlay', 'color-background-highlight'],
  },
  {
    title: 'Text',
    tokens: ['color-text-primary', 'color-text-secondary', 'color-text-disabled', 'color-text-inverse', 'color-text-on-brand'],
  },
  {
    title: 'Action',
    tokens: ['color-action-brand', 'color-action-brand-hover', 'color-action-brand-press', 'color-action-neutral', 'color-action-disabled'],
  },
  {
    title: 'Border',
    tokens: ['color-border-subtle', 'color-border-default', 'color-border-strong'],
  },
  {
    title: 'Status',
    tokens: ['color-status-info', 'color-status-success', 'color-status-warning', 'color-status-error'],
  },
  {
    title: 'Media',
    tokens: ['color-media-badge-new', 'color-media-badge-top10', 'color-media-progress', 'color-media-rating-match', 'color-media-overlay-bottom'],
  },
]
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Primary</h3>
      <div class="ds-swatches">
        <div v-for="c in baseColors" :key="c.var" class="ds-swatch">
          <div class="ds-swatch__color" :style="{ background: `var(${c.var})`, border: c.var === '--white' ? '1px solid #333' : 'none' }" />
          <p class="ds-swatch__name">{{ c.label }}</p>
          <code class="ds-swatch__var">{{ c.var }}</code>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Secondary</h3>
      <div class="ds-swatches">
        <div v-for="c in secondaryColors" :key="c.var" class="ds-swatch">
          <div class="ds-swatch__color" :style="{ background: `var(${c.var})` }" />
          <p class="ds-swatch__name">{{ c.label }}</p>
          <code class="ds-swatch__var">{{ c.var }}</code>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Grey Scale</h3>
      <div class="ds-swatches ds-swatches--row">
        <div v-for="step in greySteps" :key="step" class="ds-swatch ds-swatch--sm">
          <div class="ds-swatch__color" :style="{ background: `var(--grey-${step})` }" />
          <code class="ds-swatch__var">{{ step }}</code>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Overlay White</h3>
      <div class="ds-swatches ds-swatches--row">
        <div v-for="step in overlayWhite" :key="step" class="ds-swatch ds-swatch--sm ds-swatch--checker">
          <div class="ds-swatch__color" :style="{ background: `var(--overlay-white-${step})` }" />
          <code class="ds-swatch__var">{{ step }}%</code>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Overlay Black</h3>
      <div class="ds-swatches ds-swatches--row">
        <div v-for="step in overlayBlack" :key="step" class="ds-swatch ds-swatch--sm ds-swatch--checker">
          <div class="ds-swatch__color" :style="{ background: `var(--overlay-black-${step})` }" />
          <code class="ds-swatch__var">{{ step }}%</code>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Semantic Tokens</h3>
      <div v-for="group in semanticGroups" :key="group.title" class="ds-semantic-group">
        <p class="ds-semantic-group__label">{{ group.title }}</p>
        <div class="ds-semantic-rows">
          <div v-for="token in group.tokens" :key="token" class="ds-semantic-row">
            <div class="ds-semantic-row__swatch" :style="{ background: `var(--${token})` }" />
            <code class="ds-semantic-row__name">{{ token }}</code>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

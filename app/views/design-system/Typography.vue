<script setup lang="ts">
const regularVariants = [
  'caption-2-regular', 'caption-1-regular', 'small-body-regular',
  'body-regular', 'headline-2-regular', 'headline-1-regular',
  'title-4-regular', 'title-3-regular', 'title-2-regular',
  'title-1-regular', 'large-title-regular',
]

const mediumVariants = [
  'caption-2-medium', 'caption-1-medium', 'small-body-medium',
  'body-medium', 'headline-2-medium', 'headline-1-medium',
  'title-4-medium', 'title-3-medium', 'title-2-medium',
  'title-1-medium', 'large-title-medium',
]

const boldVariants = [
  'title-2-bold', 'title-1-bold', 'large-title-bold',
]
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Regular (400) — Netflix Sans</h3>
      <div class="ds-typo-list">
        <div v-for="v in regularVariants" :key="v" class="ds-typo-row">
          <code class="ds-typo-row__name">.{{ v }}</code>
          <span :class="v">The quick brown fox</span>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Medium (500) — Netflix Sans</h3>
      <div class="ds-typo-list">
        <div v-for="v in mediumVariants" :key="v" class="ds-typo-row">
          <code class="ds-typo-row__name">.{{ v }}</code>
          <span :class="v">The quick brown fox</span>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Bold (700) — Netflix Sans</h3>
      <div class="ds-typo-list">
        <div v-for="v in boldVariants" :key="v" class="ds-typo-row">
          <code class="ds-typo-row__name">.{{ v }}</code>
          <span :class="v">The quick brown fox</span>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Logo — Bebas Neue</h3>
      <div class="ds-typo-list">
        <div class="ds-typo-row">
          <code class="ds-typo-row__name">.logo</code>
          <span class="logo" style="font-size: 48px">NOTFLEX</span>
        </div>
      </div>
    </div>

  </div>
</template>

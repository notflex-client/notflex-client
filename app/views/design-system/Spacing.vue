<script setup lang="ts">
const dmSteps = [2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 68, 72, 80, 88, 96, 112, 128, 144, 160, 184, 200, 240, 280]
</script>

<template>
  <div class="ds-section">
    <div class="ds-block">
      <h3 class="ds-block__title">DM Scale — <code>token("dm-{n}")</code> → <code>var(--dm-{n})</code></h3>
      <div class="ds-spacing-list">
        <div v-for="step in dmSteps" :key="step" class="ds-spacing-row">
          <code class="ds-spacing-row__name">dm-{{ step }}</code>
          <div class="ds-spacing-row__bar-wrap">
            <div class="ds-spacing-row__bar" :style="{ width: `${Math.min(step, 280)}px` }" />
          </div>
          <span class="ds-spacing-row__value">{{ step }}px</span>
        </div>
      </div>
    </div>
  </div>
</template>

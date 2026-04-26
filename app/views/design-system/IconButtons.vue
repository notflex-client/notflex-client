<script setup lang="ts">
// Play icon SVG
const iconPlay = `<path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>`
const iconSkip = `<path d="M5 6l7 6-7 6V6zm9-1v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
const iconVolume = `<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><path d="M16.5 12c0-1.8-1-3.3-2.5-4.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
const iconAdd = `<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
const iconInfo = `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 11v5M12 8.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
const iconThumb = `<path d="M7 22V11M2 13h5M15 2H9a2 2 0 00-2 2v5h8l2-5-2-2zM17 11h2a2 2 0 012 2v7a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
const iconChevron = `<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`

const variants = ['ghost', 'overlay', 'outline', 'brand', 'light'] as const
const sizes    = ['large', 'medium', 'small'] as const
</script>

<template>
  <div class="ds-section">

    <!-- Video Player Controls -->
    <div class="ds-block">
      <h3 class="ds-block__title">Video Player — ghost</h3>
      <div style="background: #1a1a1a; padding: 24px; border-radius: 8px; display: flex; gap: 8px; align-items: center;">
        <IconButton variant="ghost" size="large">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" v-html="iconPlay" />
        </IconButton>
        <IconButton variant="ghost" size="large">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" v-html="iconSkip" />
        </IconButton>
        <IconButton variant="ghost" size="large">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" v-html="iconVolume" />
        </IconButton>
        <IconButton variant="ghost" size="large" disabled>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" v-html="iconAdd" />
        </IconButton>
      </div>
    </div>

    <!-- Movie Preview Circles -->
    <div class="ds-block">
      <h3 class="ds-block__title">Movie Preview — overlay circle</h3>
      <div style="background: #1a1a1a; padding: 24px; border-radius: 8px; display: flex; gap: 8px; align-items: center;">
        <IconButton variant="overlay" size="medium" shape="circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" v-html="iconPlay" />
        </IconButton>
        <IconButton variant="overlay" size="medium" shape="circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" v-html="iconAdd" />
        </IconButton>
        <IconButton variant="overlay" size="medium" shape="circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" v-html="iconThumb" />
        </IconButton>
        <IconButton variant="overlay" size="medium" shape="circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" v-html="iconInfo" />
        </IconButton>
        <IconButton variant="overlay" size="small" shape="circle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" v-html="iconChevron" />
        </IconButton>
      </div>
    </div>

    <!-- All Variants × Sizes -->
    <div class="ds-block">
      <h3 class="ds-block__title">Variants × Sizes</h3>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="v in variants" :key="v">
          <p class="ds-label" style="text-transform: capitalize;">{{ v }}</p>
          <div style="display: flex; gap: 12px; align-items: center; background: #222; padding: 12px; border-radius: 6px;">
            <IconButton v-for="s in sizes" :key="s" :variant="v" :size="s" shape="circle">
              <svg :width="s === 'large' ? 24 : s === 'medium' ? 20 : 16" :height="s === 'large' ? 24 : s === 'medium' ? 20 : 16" viewBox="0 0 24 24" fill="none" v-html="iconPlay" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

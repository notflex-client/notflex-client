<script setup lang="ts">
const variants = ['brand', 'secondary', 'ghost', 'light'] as const
const sizes    = ['large', 'small'] as const
</script>

<template>
  <div class="ds-section">

    <!-- Action Buttons -->
    <div class="ds-block">
      <h3 class="ds-block__title">Action Buttons</h3>
      <div style="display: flex; flex-direction: column; gap: 32px;">

        <div v-for="size in sizes" :key="size">
          <p class="ds-label" style="text-transform: capitalize;">{{ size }}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
            <Button v-for="v in variants" :key="v" :variant="v" :size="size">
              {{ v }}
            </Button>
          </div>
        </div>

      </div>
    </div>

    <!-- With Icons -->
    <div class="ds-block">
      <h3 class="ds-block__title">With Icons</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">

        <Button variant="brand" size="large">
          <template #trailing-icon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          Get Started
        </Button>

        <Button variant="light" size="large">
          <template #leading-icon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 3L13 8L5 13V3Z"/>
            </svg>
          </template>
          Play
        </Button>

        <Button variant="secondary" size="large">
          <template #leading-icon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 7V11M8 5.5V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </template>
          More Info
        </Button>

      </div>
    </div>

    <!-- Block (full-width) -->
    <div class="ds-block">
      <h3 class="ds-block__title">Block (full width)</h3>
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
        <Button variant="brand" size="large" block>Sign In</Button>
        <Button variant="secondary" size="large" block>Use a Sign-In Code</Button>
        <Button variant="ghost" size="large" block>Manage Profiles</Button>
      </div>
    </div>

    <!-- Disabled -->
    <div class="ds-block">
      <h3 class="ds-block__title">Disabled</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
        <Button v-for="v in variants" :key="v" :variant="v" size="large" disabled>
          {{ v }}
        </Button>
      </div>
    </div>

  </div>
</template>

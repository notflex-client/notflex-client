<script setup lang="ts">
const props = defineProps({
  title:       { type: String, required: true },
  category:    { type: String, default: '' },          // 'SERIES' | 'FILM' | 'LIMITED SERIES'
  description: { type: String, default: '' },
  rankLabel:   { type: String, default: '' },          // '#2 in TV Shows Today'
  size:        { type: String as PropType<'full' | 'medium' | 'compact' | 'title-only' | 'mini'>, default: 'full' },
})
</script>

<template>
  <!-- Mini: inline logo + title -->
  <div v-if="size === 'mini'" class="title-card title-card-mini">
    <svg class="title-card__n" width="20" height="20" viewBox="0 0 111 152" fill="none" aria-hidden="true">
      <path d="M0 0h28.5l54 139.5V0H111v152H83L28.5 12V152H0V0Z" fill="#E50914"/>
    </svg>
    <span class="title-card__title-mini">{{ title }}</span>
  </div>

  <!-- All other sizes -->
  <div v-else class="title-card" :class="`title-card-${size}`">

    <!-- Netflix N + category -->
    <div v-if="size !== 'title-only'" class="title-card__meta">
      <svg class="title-card__n" width="24" height="24" viewBox="0 0 111 152" fill="none" aria-hidden="true">
        <path d="M0 0h28.5l54 139.5V0H111v152H83L28.5 12V152H0V0Z" fill="#E50914"/>
      </svg>
      <span v-if="category" class="title-card__category">{{ category }}</span>
    </div>

    <!-- Show title -->
    <h1 class="title-card__title">{{ title }}</h1>

    <!-- Rank badge — full only -->
    <div v-if="rankLabel && size === 'full'" class="title-card__rank">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect width="20" height="20" rx="2" fill="#E50914"/>
        <path d="M4 15V5l4 8 4-8v10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 5v10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>{{ rankLabel }}</span>
    </div>

    <!-- Description — full only -->
    <p v-if="description && size === 'full'" class="title-card__desc">{{ description }}</p>

    <!-- Buttons — full / medium / compact (overridable via #actions slot) -->
    <div v-if="size !== 'title-only'" class="title-card__actions">
      <slot name="actions">
        <Button variant="light" size="small">
          <template #leading-icon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M5 3l14 9-14 9V3Z"/>
            </svg>
          </template>
          Play
        </Button>
        <Button variant="secondary" size="small">
          <template #leading-icon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 11v5M12 8.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </template>
          More Info
        </Button>
      </slot>
    </div>

  </div>
</template>

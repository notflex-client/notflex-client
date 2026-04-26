<script setup lang="ts">
defineProps({
  image:       { type: String, default: '' },
  title:       { type: String, default: '' },
  year:        { type: String, default: '' },
  rating:      { type: String, default: '' },       // "TV-MA"
  seasons:     { type: String, default: '' },       // "3 Seasons" | "1h 45m"
  quality:     { type: String, default: 'HD' },
  description: { type: String, default: '' },
  tags:        { type: Array as PropType<string[]>, default: () => [] },
  isNew:       { type: Boolean, default: false },
})

const emit = defineEmits<{
  play:     []
  add:      []
  like:     []
  collapse: []
}>()
</script>

<template>
  <div class="mpc">

    <!-- Poster with play overlay -->
    <div class="mpc__poster">
      <img v-if="image" :src="image" class="mpc__img" alt="" />
      <div class="mpc__poster-overlay">
        <button class="mpc__play-btn" type="button" aria-label="Play" @click="emit('play')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5 3l14 9-14 9V3Z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="mpc__body">

      <!-- Action buttons -->
      <div class="mpc__actions">
        <div class="mpc__actions-left">
          <IconButton variant="light" shape="circle" size="medium" @click="emit('play')" aria-label="Play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M5 3l14 9-14 9V3Z"/>
            </svg>
          </IconButton>
          <IconButton variant="outline" shape="circle" size="medium" @click="emit('add')" aria-label="Add to list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </IconButton>
          <IconButton variant="outline" shape="circle" size="medium" aria-label="Like">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h11.2a2 2 0 0 0 1.96-1.6l1.6-7A2 2 0 0 0 16.8 11H13V6a3 3 0 0 0-3-3L7 11"/>
            </svg>
          </IconButton>
        </div>
        <IconButton variant="outline" shape="circle" size="medium" @click="emit('collapse')" aria-label="More info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </IconButton>
      </div>

      <!-- Meta badges -->
      <div class="mpc__meta">
        <Badge v-if="isNew" variant="new">New</Badge>
        <Badge v-if="rating" variant="rating">{{ rating }}</Badge>
        <span v-if="seasons" class="mpc__seasons">{{ seasons }}</span>
        <Badge v-if="quality" variant="quality">{{ quality }}</Badge>
      </div>

      <!-- Description -->
      <p v-if="description" class="mpc__desc">{{ description }}</p>

      <!-- Genre tags -->
      <div v-if="tags.length" class="mpc__tags">
        <template v-for="(tag, i) in tags" :key="tag">
          <span class="mpc__tag">{{ tag }}</span>
          <span v-if="i < tags.length - 1" class="mpc__dot" aria-hidden="true">•</span>
        </template>
      </div>

    </div>
  </div>
</template>

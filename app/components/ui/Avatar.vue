<script setup lang="ts">
export interface AvatarProfile {
  value: string
  name:  string
  image?: string
}

const props = defineProps({
  size:      { type: String as PropType<'small' | 'large'>, default: 'large' },
  image:     { type: String, default: '' },
  name:      { type: String, default: '' },
  add:       { type: Boolean, default: false },
  showArrow: { type: Boolean, default: false },
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <!-- ── Add Profile ─────────────────────────────────────── -->
  <Button
    v-if="add"
    variant="ghost"
    size="large"
    class="avatar"
    :class="[`avatar-${size}`, 'avatar-add']"
    type="button"
    :aria-label="'Add Profile'"
    @click="emit('click', $event)"
  >
    <span class="avatar__add-wrap">
      <svg class="avatar__add-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10.25" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
    <span v-if="size === 'large'" class="caption-1-regular avatar__name">Add Profile</span>
  </Button>

  <!-- ── Regular avatar ──────────────────────────────────── -->
  <Button
    v-else
    variant="ghost"
    size="large"
    class="avatar"
    :class="[`avatar-${size}`]"
    type="button"
    :aria-label="name"
    @click="emit('click', $event)"
  >
    <span class="avatar__frame">
      <img v-if="image" :src="image" class="avatar__img" :alt="name" />
      <span v-else class="avatar__placeholder" aria-hidden="true" />
    </span>
    <span v-if="name && size === 'large'" class="caption-1-regular avatar__name">{{ name }}</span>

    <!-- Small trigger arrow (header profile switcher) -->
    <svg
      v-if="showArrow"
      class="avatar__arrow"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </Button>
</template>

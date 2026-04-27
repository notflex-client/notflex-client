<script setup lang="ts">
const props = defineProps({
  title:   { type: String, default: '' },
  open:    { type: Boolean, default: false },
})

const isOpen = ref(props.open)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="accordion" :class="{ 'is-open': isOpen }">

    <Button variant="ghost" size="large" class="accordion__header" type="button" :aria-expanded="isOpen" @click="toggle">
      <span class="accordion__title">
        <slot name="title">{{ title }}</slot>
      </span>

      <span class="accordion__icon" aria-hidden="true">
        <!-- Plus -->
        <svg v-if="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
        </svg>
        <!-- Close -->
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
        </svg>
      </span>
    </Button>

    <div class="accordion__body">
      <div class="accordion__content">
        <div class="accordion__inner">
          <slot />
        </div>
      </div>
    </div>

  </div>
</template>

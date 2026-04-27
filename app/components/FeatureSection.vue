<script setup lang="ts">
const props = defineProps({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  reverse:     { type: Boolean, default: false },
})
</script>

<template>
  <section class="feature-section" :class="{ 'is-reverse': reverse }">
    <div class="feature-section__inner">

      <div class="feature-section__text">
        <h2 class="title-1-bold feature-section__title">
          <slot name="title">{{ title }}</slot>
        </h2>
        <span class="headline-2-regular feature-section__desc">
          <slot name="description">{{ description }}</slot>
        </span>
      </div>

      <div class="feature-section__media">
        <slot name="media">
          <img v-if="image" :src="image" :alt="title" class="feature-section__img" />
        </slot>
      </div>

    </div>
  </section>
</template>

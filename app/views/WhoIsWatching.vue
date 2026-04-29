<script setup lang="ts">
definePageMeta({ path: '/who-is-watching' })

const PROFILES = [
  { value: 'jennifer', name: 'Jennifer', image: 'https://www.figma.com/api/mcp/asset/bf2e085b-39c5-4cc0-842a-2b62a01d6422' },
  { value: 'bill',     name: 'Bill',     image: 'https://www.figma.com/api/mcp/asset/98955b16-70e9-48e6-8ee4-0077decc80d7' },
  { value: 'alise',    name: 'Alise',    image: 'https://www.figma.com/api/mcp/asset/ffe5c9d2-aef6-4c23-8264-35a124e3107e' },
  { value: 'james',    name: 'James',    image: 'https://www.figma.com/api/mcp/asset/3652841e-b89a-4d86-98a4-b9322e061693' },
]

function selectProfile(value: string) {
  navigateTo('/browse')
}
</script>

<template>
  <div class="profiles-page">
    <div class="profiles-page__header-grad" aria-hidden="true" />

    <div class="profiles-page__body">
      <span class="large-title-regular profiles-page__title">Who's watching?</span>

      <div class="profiles-page__list">
        <Avatar
          v-for="p in PROFILES"
          :key="p.value"
          :name="p.name"
          :image="p.image"
          size="large"
          @click="selectProfile(p.value)"
        />
        <Avatar :add="true" size="large" />
      </div>
    </div>

    <Button variant="ghost" size="small" class="profiles-page__manage">
      Manage Profiles
    </Button>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.profiles-page {
  position: relative;
  min-height: 100vh;
  background-color: token("grey-900");
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: token("dm-64");

  // ── Header gradient ────────────────────────────────────────
  &__header-grad {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 68px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
    pointer-events: none;
  }

  // ── Center block (title + list) ────────────────────────────
  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: token("dm-32");
  }

  &__title {
    color: token("color-text-primary");
  }

  // ── Profile row ────────────────────────────────────────────
  &__list {
    display: flex;
    align-items: flex-start;
    gap: token("dm-28");
    flex-wrap: wrap;
    justify-content: center;
  }

  // ── Avatar size override: Figma = 144px, component default = 80px
  :deep(.avatar__frame),
  :deep(.avatar__add-wrap) {
    width: 144px;
    height: 144px;
  }

  // ── Manage Profiles button: muted grey per design ──────────
  &__manage {
    --btn-color: var(--color-text-secondary);
    --btn-border: 1px solid var(--color-text-secondary);
    --btn-border-hover: 1px solid var(--color-text-primary);
  }
}
</style>

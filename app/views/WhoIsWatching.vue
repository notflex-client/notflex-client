<script setup lang="ts">
import type { UserProfile } from '~/stores/auth'

definePageMeta({ path: '/who-is-watching', authRequired: true })

const authStore = useAuthStore()
const { listProfiles } = useProfiles()

const profiles = computed(() => authStore.profiles)
const canAdd = computed(() => authStore.canAddProfile)

// Pull the freshest list (covers a hard refresh landing straight on this page).
await useAsyncData('who-is-watching-profiles', () => listProfiles().catch(() => authStore.profiles))

function selectProfile(profile: UserProfile) {
  authStore.selectProfile(profile)
  navigateTo('/browse')
}

function manageProfiles() {
  navigateTo('/account?section=profiles')
}
</script>

<template>
  <div class="profiles-page">
    <div class="profiles-page__header-grad" aria-hidden="true" />

    <div class="profiles-page__body">
      <span class="large-title-regular profiles-page__title">Who's watching?</span>

      <div class="profiles-page__list">
        <Avatar
          v-for="p in profiles"
          :key="p.id"
          :name="p.name"
          :image="p.avatar_url ?? ''"
          size="large"
          @click="selectProfile(p)"
        />
        <Avatar v-if="canAdd" :add="true" size="large" @click="manageProfiles" />
      </div>
    </div>

    <Button variant="ghost" size="small" class="profiles-page__manage" @click="manageProfiles">
      Manage Profiles
    </Button>
  </div>
</template>

<style lang="scss" scoped>
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

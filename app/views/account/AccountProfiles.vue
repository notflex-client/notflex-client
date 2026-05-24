<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()

const profiles = computed(() => {
  if (authStore.profiles.length) return authStore.profiles
  if (authStore.user) return [{ id: authStore.user.id, name: authStore.user.full_name, image: authStore.user.avatar_url ?? '' }]
  return []
})
</script>

<template>
  <div class="account-profiles">
    <div>
      <h2 class="h2-bold">{{ t('account.profiles.title') }}</h2>
      <p class="body-regular account-profiles__muted">{{ t('account.profiles.subtitle') }}</p>
    </div>

    <!-- Parental controls + Transfer -->
    <article class="account-profiles__card">
      <button class="account-profiles__action-item" @click="alert(t('account.devices.comingSoon'))">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <div class="account-profiles__action-text">
          <span class="body-regular">{{ t('account.profiles.parentalControls') }}</span>
          <span class="small-body-regular account-profiles__muted">{{ t('account.profiles.parentalControlsDesc') }}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="account-profiles__chevron" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <button class="account-profiles__action-item" @click="navigateTo('/account/transfer-profile')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 12h8M12 8l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="account-profiles__action-text">
          <span class="body-regular">{{ t('account.profiles.transfer') }}</span>
          <span class="small-body-regular account-profiles__muted">{{ t('account.profiles.transferDesc') }}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="account-profiles__chevron" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </article>

    <!-- Profile list -->
    <div>
      <h3 class="title-4-medium" style="margin-bottom: 16px;">{{ t('account.profiles.profileSettings') }}</h3>
      <article class="account-profiles__card">
        <button
          v-for="profile in profiles"
          :key="profile.id"
          class="account-profiles__profile-item"
        >
          <div class="account-profiles__avatar">
            <img v-if="profile.image" :src="profile.image" class="account-profiles__avatar-img" alt="" />
            <span v-else class="account-profiles__avatar-placeholder">
              {{ profile.name?.charAt(0)?.toUpperCase() ?? '?' }}
            </span>
          </div>
          <span class="body-regular">{{ profile.name }}</span>
          <span
            v-if="profile.id === authStore.user?.id"
            class="account-profiles__your-badge small-body-regular"
          >{{ t('account.profiles.yourProfile') }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="account-profiles__chevron" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.account-profiles {
  display: flex;
  flex-direction: column;
  gap: token("dm-24");

  &__card {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    overflow: hidden;
  }

  &__action-item {
    display: flex;
    align-items: center;
    gap: token("dm-16");
    padding: token("dm-16") token("dm-24");
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: token("color-text-primary");
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease;

    &:last-child { border-bottom: none; }
    &:hover { background: rgba(255, 255, 255, 0.04); }
  }

  &__action-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  &__profile-item {
    display: flex;
    align-items: center;
    gap: token("dm-16");
    padding: token("dm-12") token("dm-24");
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: token("color-text-primary");
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease;

    &:last-child { border-bottom: none; }
    &:hover { background: rgba(255, 255, 255, 0.04); }
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__avatar-img { width: 100%; height: 100%; object-fit: cover; }

  &__avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    font-size: 16px;
    font-weight: 700;
    color: token("color-text-primary");
  }

  &__your-badge {
    padding: 2px 10px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: token("color-text-secondary");
  }

  &__muted { color: token("color-text-secondary"); }

  &__chevron {
    margin-left: auto;
    flex-shrink: 0;
    color: token("color-text-secondary");
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  subscription: any | null
  subStatus: string
  statusLabel: string
  statusClass: string
}>()

const emit = defineEmits<{
  (e: 'navigate', section: string): void
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const dateFmt = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })
</script>

<template>
  <div class="account-overview">
    <h2 class="h2-bold">{{ t('account.menu.overview') }}</h2>

    <!-- Profile card -->
    <article class="account-overview__card">
      <h3 class="title-4-medium">{{ t('account.profile.title') }}</h3>
      <div class="account-overview__profile">
        <div class="account-overview__avatar">
          <img
            v-if="authStore.user?.avatar_url"
            :src="authStore.user.avatar_url"
            class="account-overview__avatar-img"
            alt=""
          />
          <span v-else class="account-overview__avatar-placeholder">
            {{ authStore.user?.full_name?.charAt(0)?.toUpperCase() ?? '?' }}
          </span>
        </div>
        <div class="account-overview__profile-info">
          <span class="title-3-medium">{{ authStore.user?.full_name ?? '—' }}</span>
          <span class="body-regular account-overview__muted">{{ authStore.user?.email ?? '—' }}</span>
        </div>
      </div>
    </article>

    <!-- Subscription summary -->
    <article class="account-overview__card">
      <div class="account-overview__card-header">
        <h3 class="title-4-medium">{{ t('account.overview.subscriptionSummary') }}</h3>
        <span class="account-overview__badge" :class="statusClass">{{ statusLabel }}</span>
      </div>

      <template v-if="subscription">
        <div class="account-overview__row">
          <span class="account-overview__muted">{{ t('account.overview.currentPlan') }}</span>
          <strong>{{ subscription.plan?.name ?? '—' }}</strong>
        </div>
        <div class="account-overview__row">
          <span class="account-overview__muted">{{ t('account.subscription.price') }}</span>
          <strong>{{ subscription.plan?.price ? money.format(subscription.plan.price) : '—' }}</strong>
        </div>
        <div class="account-overview__row">
          <span class="account-overview__muted">{{ t('account.subscription.period') }}</span>
          <strong>
            {{ subscription.end_date ? dateFmt.format(new Date(subscription.end_date)) : '—' }}
          </strong>
        </div>
      </template>
      <template v-else>
        <p class="body-regular account-overview__muted">{{ t('account.subscription.noSub') }}</p>
      </template>
    </article>

    <!-- Quick actions -->
    <article class="account-overview__card">
      <h3 class="title-4-medium">{{ t('account.overview.quickActions') }}</h3>
      <div class="account-overview__actions">
        <button class="account-overview__action-item" @click="emit('navigate', 'membership')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 10h20" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span class="body-regular">{{ t('account.overview.managePlan') }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="account-overview__chevron" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="account-overview__action-item" @click="emit('navigate', 'security')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="body-regular">{{ t('account.profile.changePassword') }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="account-overview__chevron" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="account-overview__action-item" @click="emit('navigate', 'profiles')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="body-regular">{{ t('account.menu.profiles') }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="account-overview__chevron" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.account-overview {
  display: flex;
  flex-direction: column;
  gap: token("dm-24");

  &__card {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
    padding: token("dm-24");
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
  }

  &__card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-12");
  }

  &__badge {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &.is-active { background: rgba(70, 211, 105, 0.18); color: #46d369; }
    &.is-free { background: rgba(255, 255, 255, 0.12); color: token("color-text-secondary"); }
    &.is-cancelled { background: rgba(229, 9, 20, 0.18); color: #e50914; }
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: token("dm-16");
  }

  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 8px;
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
    font-size: 24px;
    font-weight: 700;
    color: token("color-text-primary");
  }

  &__profile-info { display: flex; flex-direction: column; gap: 2px; }

  &__row {
    display: flex;
    justify-content: space-between;
    gap: token("dm-16");
  }

  &__muted { color: token("color-text-secondary"); }

  &__actions {
    display: flex;
    flex-direction: column;
  }

  &__action-item {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    padding: token("dm-16") 0;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: token("color-text-primary");
    cursor: pointer;
    text-align: left;
    transition: color 0.15s ease;

    &:last-child { border-bottom: none; }
    &:hover { color: token("color-action-brand"); }
  }

  &__chevron { margin-left: auto; color: token("color-text-secondary"); }
}
</style>

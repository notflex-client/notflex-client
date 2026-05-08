<script setup lang="ts">
import AccountOverview from '~/views/account/AccountOverview.vue'
import AccountMembership from '~/views/account/AccountMembership.vue'
import AccountSecurity from '~/views/account/AccountSecurity.vue'
import AccountDevices from '~/views/account/AccountDevices.vue'
import AccountProfiles from '~/views/account/AccountProfiles.vue'

const { t } = useI18n()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { lang } = useLocale()

const activeSection = ref('overview')

const menuItems = computed(() => [
  { key: 'overview', label: t('account.menu.overview'), icon: 'home' },
  { key: 'membership', label: t('account.menu.membership'), icon: 'card' },
  { key: 'security', label: t('account.menu.security'), icon: 'shield' },
  { key: 'devices', label: t('account.menu.devices'), icon: 'monitor' },
  { key: 'profiles', label: t('account.menu.profiles'), icon: 'users' },
])

const { data: subscriptionData } = await useAsyncData('account-subscription', () =>
  $api<{ subscription: any | null; status: string }>('/subscription/me').catch(() => ({ subscription: null, status: 'free' }))
)
const { data: paymentsData } = await useAsyncData('account-payments', () =>
  $api<any[]>('/payments').catch(() => [])
)

const subscription = computed(() => subscriptionData.value?.subscription ?? null)
const subStatus = computed(() => subscriptionData.value?.status ?? 'free')
const recentPayments = computed(() => (paymentsData.value ?? []).slice(0, 5))

const statusLabel = computed(() => {
  const s = subStatus.value
  if (s === 'active') return t('account.subscription.active')
  if (s === 'cancelled') return t('account.subscription.cancelled')
  return t('account.subscription.free')
})

const statusClass = computed(() => {
  const s = subStatus.value
  if (s === 'active') return 'is-active'
  if (s === 'cancelled') return 'is-cancelled'
  return 'is-free'
})
</script>

<template>
  <main class="account-page">
    <AppHeader sticky>
      <template #logo>
        <NuxtLink to="/browse" class="account-page__back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="body-regular">{{ t('account.backToNotflex') }}</span>
        </NuxtLink>
      </template>
    </AppHeader>

    <div class="account-page__layout">
      <!-- Sidebar -->
      <aside class="account-page__sidebar">
        <button
          v-for="item in menuItems"
          :key="item.key"
          class="account-page__menu-item"
          :class="{ 'is-active': activeSection === item.key }"
          @click="activeSection = item.key"
        >
          <!-- Home -->
          <svg v-if="item.icon === 'home'" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Card -->
          <svg v-else-if="item.icon === 'card'" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 10h20" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <!-- Shield -->
          <svg v-else-if="item.icon === 'shield'" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Monitor -->
          <svg v-else-if="item.icon === 'monitor'" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <!-- Users -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ item.label }}</span>
        </button>
      </aside>

      <!-- Content -->
      <div class="account-page__content">
        <AccountOverview
          v-if="activeSection === 'overview'"
          :subscription="subscription"
          :sub-status="subStatus"
          :status-label="statusLabel"
          :status-class="statusClass"
          @navigate="activeSection = $event"
        />
        <AccountMembership
          v-else-if="activeSection === 'membership'"
          :subscription="subscription"
          :sub-status="subStatus"
          :status-label="statusLabel"
          :status-class="statusClass"
          :payments="recentPayments"
        />
        <AccountSecurity v-else-if="activeSection === 'security'" />
        <AccountDevices v-else-if="activeSection === 'devices'" />
        <AccountProfiles v-else-if="activeSection === 'profiles'" />
      </div>
    </div>

    <AppFooter variant="home" v-model:lang="lang" />
  </main>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.account-page {
  min-height: 100vh;
  background: token("color-background-base");
  color: token("color-text-primary");

  &__back-link {
    display: inline-flex;
    align-items: center;
    gap: token("dm-8");
    color: token("color-text-secondary");
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover { color: token("color-text-primary"); }
  }

  // ── Layout ──────────────────────────────────────────────────
  &__layout {
    display: flex;
    max-width: 1080px;
    margin: 0 auto;
    padding: 96px token("layout-margin") token("dm-64");
    gap: token("dm-48");
    min-height: calc(100vh - 200px);
  }

  // ── Sidebar ─────────────────────────────────────────────────
  &__sidebar {
    width: 240px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: sticky;
    top: 96px;
    align-self: flex-start;
  }

  &__menu-item {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    padding: 12px 16px;
    border-radius: 8px;
    background: none;
    border: none;
    color: token("color-text-secondary");
    cursor: pointer;
    text-align: left;
    font-size: 15px;
    transition: all 0.15s ease;

    &:hover {
      color: token("color-text-primary");
      background: rgba(255, 255, 255, 0.06);
    }

    &.is-active {
      color: token("color-text-primary");
      background: rgba(255, 255, 255, 0.1);
      font-weight: 600;
    }
  }

  // ── Content ─────────────────────────────────────────────────
  &__content {
    flex: 1;
    min-width: 0;
  }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 768px) {
  .account-page {
    &__layout {
      flex-direction: column;
      padding-top: 80px;
      gap: token("dm-24");
    }

    &__sidebar {
      width: 100%;
      flex-direction: row;
      overflow-x: auto;
      position: static;
      gap: 4px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    &__menu-item {
      white-space: nowrap;
      padding: 8px 16px;
      font-size: 14px;
    }
  }
}
</style>

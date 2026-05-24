<script setup lang="ts">
const { t } = useI18n()

const devices = [
  { id: 1, name: 'Chrome — Windows', type: 'web', lastAccess: new Date(), current: true },
  { id: 2, name: 'Safari — iPhone 15', type: 'mobile', lastAccess: new Date(Date.now() - 86400000 * 2) },
  { id: 3, name: 'Smart TV — Samsung', type: 'tv', lastAccess: new Date(Date.now() - 86400000 * 5) },
]

const dateFmt = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })

function handleSignOutAll() {
  alert(t('account.devices.comingSoon'))
}
</script>

<template>
  <div class="account-devices">
    <h2 class="h2-bold">{{ t('account.devices.title') }}</h2>

    <article class="account-devices__card">
      <div v-for="device in devices" :key="device.id" class="account-devices__item">
        <div class="account-devices__icon">
          <!-- Web -->
          <svg v-if="device.type === 'web'" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <!-- Mobile -->
          <svg v-else-if="device.type === 'mobile'" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <!-- TV -->
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 22h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="account-devices__info">
          <span class="body-regular">{{ device.name }}</span>
          <span class="small-body-regular account-devices__muted">
            <template v-if="device.current">{{ t('account.devices.currentDevice') }}</template>
            <template v-else>{{ t('account.devices.lastAccess') }}: {{ dateFmt.format(device.lastAccess) }}</template>
          </span>
        </div>
        <svg v-if="!device.current" width="16" height="16" viewBox="0 0 24 24" fill="none" class="account-devices__chevron" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </article>

    <Button variant="ghost" size="large" @click="handleSignOutAll">
      {{ t('account.devices.signOutAll') }}
    </Button>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.account-devices {
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

  &__item {
    display: flex;
    align-items: center;
    gap: token("dm-16");
    padding: token("dm-16") token("dm-24");
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    &:last-child { border-bottom: none; }
  }

  &__icon {
    flex-shrink: 0;
    color: token("color-text-secondary");
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  &__muted { color: token("color-text-secondary"); }

  &__chevron {
    flex-shrink: 0;
    color: token("color-text-secondary");
  }
}
</style>

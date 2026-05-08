<script setup lang="ts">
import ChangePasswordModal from '~/views/account/ChangePasswordModal.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const changePasswordRef = ref<InstanceType<typeof ChangePasswordModal> | null>(null)
</script>

<template>
  <div class="account-security">
    <h2 class="h2-bold">{{ t('account.security.title') }}</h2>

    <article class="account-security__card">
      <div class="account-security__item">
        <div>
          <span class="body-regular account-security__muted">{{ t('account.security.email') }}</span>
          <p class="title-4-medium">{{ authStore.user?.email ?? '—' }}</p>
        </div>
      </div>

      <div class="account-security__divider" />

      <div class="account-security__item">
        <div>
          <span class="body-regular account-security__muted">{{ t('account.security.password') }}</span>
          <p class="body-regular account-security__muted">{{ t('account.security.changePasswordDesc') }}</p>
        </div>
        <Button variant="ghost" size="large" @click="changePasswordRef?.open()">
          {{ t('account.profile.changePassword') }}
        </Button>
      </div>
    </article>

    <ChangePasswordModal ref="changePasswordRef" />
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.account-security {
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

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-16");
  }

  &__divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  &__muted { color: token("color-text-secondary"); }
}
</style>

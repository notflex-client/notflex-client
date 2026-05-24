<script setup lang="ts">
import type { AuthUser } from '~/stores/auth'

const { t } = useI18n()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { errorMsg: profileError, formErrors: profileFieldErrors, setErrors: setProfileErrors, clearErrors: clearProfileErrors } = useResponseError()
const { errorMsg: passwordError, formErrors: passwordFieldErrors, setErrors: setPasswordErrors, clearErrors: clearPasswordErrors } = useResponseError()

const activeTab = ref<'profile' | 'password'>('profile')

const fullName = ref(authStore.user?.full_name ?? '')
const avatarUrl = ref(authStore.user?.avatar_url ?? '')
const profileLoading = ref(false)
const profileSaved = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const passwordLoading = ref(false)
const passwordSaved = ref(false)

async function saveProfile() {
  profileLoading.value = true
  profileSaved.value = false
  clearProfileErrors()
  try {
    const data = await $api<AuthUser>('/auth/me', {
      method: 'PUT',
      body: { full_name: fullName.value, avatar_url: avatarUrl.value || null },
    })
    authStore.updateUser(data)
    profileSaved.value = true
  } catch (err: any) {
    setProfileErrors(err.data ?? err)
  } finally {
    profileLoading.value = false
  }
}

async function savePassword() {
  passwordSaved.value = false
  clearPasswordErrors()
  if (newPassword.value !== confirmPassword.value) {
    setPasswordErrors({ details: { confirmPassword: t('account.errorMismatch') } })
    return
  }
  passwordLoading.value = true
  try {
    await $api('/auth/change-password', {
      method: 'POST',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    })
    passwordSaved.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    setPasswordErrors(err.data ?? err)
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <main class="account-page">
    <AppHeader sticky>
      <template #logo>
        <NuxtLink to="/browse" class="account-page__logo">NOTFLEX</NuxtLink>
      </template>
      <template #navigation>
        <NuxtLink to="/browse" class="account-page__nav-link">{{ t('account.home') }}</NuxtLink>
        <NuxtLink to="/billing" class="account-page__nav-link">{{ t('account.billing') }}</NuxtLink>
      </template>
    </AppHeader>

    <section class="account-page__content">
      <header class="account-page__header">
        <span class="caption-2-regular account-page__eyebrow">{{ t('account.eyebrow') }}</span>
        <h1 class="h1-bold">{{ t('account.title') }}</h1>
        <p class="body-regular account-page__subtitle">{{ authStore.user?.email }}</p>
      </header>

      <nav class="account-page__tabs">
        <button :class="['account-page__tab', { 'account-page__tab--active': activeTab === 'profile' }]" @click="activeTab = 'profile'">
          {{ t('account.tabProfile') }}
        </button>
        <button :class="['account-page__tab', { 'account-page__tab--active': activeTab === 'password' }]" @click="activeTab = 'password'">
          {{ t('account.tabPassword') }}
        </button>
      </nav>

      <article v-if="activeTab === 'profile'" class="account-page__card">
        <h2 class="title-3-medium">{{ t('account.profileTitle') }}</h2>
        <p class="body-regular account-page__desc">{{ t('account.profileDesc') }}</p>

        <div class="flex flex-col gap-4">
          <InputField v-model="fullName" :label="t('account.fullNameLabel')" :error="profileFieldErrors.full_name" />
          <InputField v-model="avatarUrl" :label="t('account.avatarLabel')" :error="profileFieldErrors.avatar_url" />
          <p v-if="profileError" class="account-page__api-error">{{ profileError }}</p>
          <p v-if="profileSaved" class="account-page__api-success">{{ t('account.savedProfile') }}</p>
          <Button variant="brand" size="large" :block="true" :disabled="profileLoading" @click="saveProfile">
            {{ profileLoading ? t('account.saving') : t('account.save') }}
          </Button>
        </div>
      </article>

      <article v-else class="account-page__card">
        <h2 class="title-3-medium">{{ t('account.passwordTitle') }}</h2>
        <p class="body-regular account-page__desc">{{ t('account.passwordDesc') }}</p>

        <div class="flex flex-col gap-4">
          <InputField v-model="currentPassword" :label="t('account.currentPasswordLabel')" type="password" autocomplete="current-password" :error="passwordFieldErrors.currentPassword" />
          <div class="account-page__field-wrap">
            <InputField v-model="newPassword" :label="t('account.newPasswordLabel')" :type="showNewPassword ? 'text' : 'password'" autocomplete="new-password" :error="passwordFieldErrors.newPassword" />
            <button class="account-page__toggle-pass caption-1-medium" @click="showNewPassword = !showNewPassword">
              {{ showNewPassword ? t('account.hide') : t('account.show') }}
            </button>
          </div>
          <InputField v-model="confirmPassword" :label="t('account.confirmPasswordLabel')" type="password" autocomplete="new-password" :error="passwordFieldErrors.confirmPassword" />
          <p v-if="passwordError" class="account-page__api-error">{{ passwordError }}</p>
          <p v-if="passwordSaved" class="account-page__api-success">{{ t('account.savedPassword') }}</p>
          <Button variant="brand" size="large" :block="true" :disabled="passwordLoading" @click="savePassword">
            {{ passwordLoading ? t('account.saving') : t('account.changePassword') }}
          </Button>
        </div>
      </article>
    </section>

    <AppFooter />
  </main>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.account-page {
  min-height: 100vh;
  background: token("color-background-base");
  color: token("color-text-primary");

  &__logo {
    font-family: token("font-family-logo");
    font-size: 28px;
    color: token("color-action-brand");
    letter-spacing: 2px;
    text-decoration: none;
  }

  &__nav-link {
    color: token("color-text-secondary");
    text-decoration: none;
    &:hover { color: token("color-text-primary"); }
  }

  &__content {
    max-width: 720px;
    padding: 128px token("layout-margin") token("dm-64");
    display: flex;
    flex-direction: column;
    gap: token("dm-24");
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: token("dm-4");
  }

  &__eyebrow {
    color: token("color-action-brand");
    text-transform: uppercase;
  }

  &__subtitle {
    color: token("color-text-secondary");
  }

  &__tabs {
    display: flex;
    gap: token("dm-8");
    border-bottom: 1px solid token("grey-600");
  }

  &__tab {
    background: none;
    border: none;
    padding: token("dm-12") token("dm-16");
    color: token("color-text-secondary");
    cursor: pointer;
    border-bottom: 2px solid transparent;

    &--active {
      color: token("color-text-primary");
      border-bottom-color: token("color-action-brand");
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
    padding: token("dm-24");
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.06);
  }

  &__desc {
    color: token("color-text-secondary");
    margin: 0;
  }

  &__field-wrap {
    position: relative;
  }

  &__toggle-pass {
    position: absolute;
    top: 50%;
    right: token("dm-12");
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: token("color-text-primary");
    padding: 0;

    &:hover { color: token("color-text-secondary"); }
  }

  &__api-error {
    margin: 0;
    color: #e87c03;
  }

  &__api-success {
    margin: 0;
    color: #2ea043;
  }
}
</style>

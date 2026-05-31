<script setup lang="ts">
definePageMeta({ authRequired: false, guestOnly: true })

const { t } = useI18n()
const { $api } = useNuxtApp()
const { lang } = useLocale()
const { setErrors, clearErrors } = useResponseError()
const route = useRoute()

const token = ref('')
const newPassword = ref('')
const firstLoading = ref(true)
const submitLoading = ref(false)
const isValidToken = ref(false)
const isSuccessful = ref(false)

async function checkToken(tk: string) {
  try {
    const resp = await $api<{ isValid: boolean }>(`/auth/forgot-password/token/${tk}`)
    isValidToken.value = resp.isValid
  } catch {
    isValidToken.value = false
  } finally {
    firstLoading.value = false
  }
}

async function submit() {
  submitLoading.value = true
  clearErrors()
  try {
    await $api('/auth/forgot-password/reset', {
      method: 'POST',
      body: { token: token.value, newPassword: newPassword.value },
    })
    isSuccessful.value = true
  } catch (err: any) {
    setErrors(err.data ?? err)
    if (err.data?.details?.token) isValidToken.value = false
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  const tk = route.params.token
  if (tk) {
    token.value = String(tk)
    checkToken(token.value)
  } else {
    navigateTo('/forgot-password')
  }
})
</script>

<template>
  <div>
    <AppHeader transparent sticky>
      <template #logo>
        <span class="auth-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">

      <AuthCard v-if="firstLoading" :title="t('resetPassword.title')">
        <div class="reset-loading">
          <svg class="reset-loading__spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" />
          </svg>
        </div>
      </AuthCard>

      <AuthCard
        v-else-if="isValidToken && !isSuccessful"
        :title="t('resetPassword.title')"
        :description="t('resetPassword.description')"
      >
        <InputField
          v-model="newPassword"
          :label="t('resetPassword.newPasswordLabel')"
          type="password"
          autocomplete="new-password"
          @keydown.enter="submit"
        >
          <template #icon>
            <Icon name="lucide:lock" />
          </template>
        </InputField>

        <Button variant="brand" size="large" :block="true" :disabled="submitLoading" @click="submit">
          {{ submitLoading ? t('resetPassword.resetting') : t('resetPassword.resetButton') }}
        </Button>
      </AuthCard>

      <AuthCard v-else-if="isSuccessful" :title="t('resetPassword.successTitle')">
        <p class="auth-card__notice">
          {{ t('resetPassword.successDesc') }}
        </p>

        <Button variant="brand" size="large" :block="true" @click="navigateTo('/login')">
          {{ t('resetPassword.loginNow') }}
        </Button>
      </AuthCard>

      <AuthCard v-else :title="t('resetPassword.invalidTitle')">
        <p class="auth-card__notice">
          {{ t('resetPassword.invalidDesc') }}
        </p>

        <Button variant="brand" size="large" :block="true" @click="navigateTo('/forgot-password')">
          {{ t('resetPassword.requestNew') }}
        </Button>

        <NuxtLink to="/login" class="auth-card__forgot">
          {{ t('resetPassword.backToLogin') }}
        </NuxtLink>
      </AuthCard>

    </HeroBanner>

    <AppFooter variant="auth" v-model:lang="lang" />
  </div>
</template>

<style lang="scss" scoped>
.auth-logo {
  font-family: token("font-family-logo");
  font-size: 28px;
  color: token("color-action-brand");
  letter-spacing: 2px;
}

.reset-loading {
  display: flex;
  justify-content: center;
  padding: token("dm-32") 0;
}

.reset-loading__spinner {
  color: token("color-action-brand");
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>

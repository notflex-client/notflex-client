<script setup lang="ts">
definePageMeta({ authRequired: false, guestOnly: true })

const { t } = useI18n()
const { $api } = useNuxtApp()
const { lang } = useLocale()
const { setErrors, clearErrors } = useResponseError()
const route = useRoute()

const token = ref('')
const newPassword = ref('')
const showPassword = ref(false)
const firstLoading = ref(true)
const submitLoading = ref(false)
const isValidToken = ref(false)
const isSuccessful = ref(false)

async function checkToken(t: string) {
  try {
    const resp = await $api<{ isValid: boolean }>(`/auth/forgot-password/token/${t}`)
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
  const t = route.params.token
  if (t) {
    token.value = String(t)
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
        <span class="rp-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <div class="auth-card">

        <!-- State 1: Đang kiểm tra token -->
        <template v-if="firstLoading">
          <div class="auth-card__loading">
            <svg class="auth-card__spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" />
            </svg>
          </div>
        </template>

        <!-- State 2: Form nhập mật khẩu mới -->
        <template v-else-if="isValidToken && !isSuccessful">
          <span class="title-2-bold">{{ t('resetPassword.title') }}</span>
          <p class="body-regular auth-card__desc">{{ t('resetPassword.description') }}</p>

          <div class="flex flex-col gap-4">
            <div class="auth-card__field-wrap">
              <InputField
                v-model="newPassword"
                :label="t('resetPassword.newPasswordLabel')"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                @keydown.enter="submit"
              />
              <button class="auth-card__toggle-pass caption-1-medium" @click="showPassword = !showPassword">
                {{ showPassword ? t('resetPassword.hide') : t('resetPassword.show') }}
              </button>
            </div>
            <Button variant="brand" size="large" :block="true" :disabled="submitLoading" @click="submit">
              {{ submitLoading ? t('resetPassword.resetting') : t('resetPassword.resetButton') }}
            </Button>
          </div>
        </template>

        <!-- State 3: Thành công -->
        <template v-else-if="isSuccessful">
          <span class="title-2-bold">{{ t('resetPassword.successTitle') }}</span>
          <p class="body-regular auth-card__desc">{{ t('resetPassword.successDesc') }}</p>
          <Button variant="brand" size="large" :block="true" @click="navigateTo('/login')">
            {{ t('resetPassword.loginNow') }}
          </Button>
        </template>

        <!-- State 4: Token không hợp lệ / hết hạn -->
        <template v-else>
          <span class="title-2-bold">{{ t('resetPassword.invalidTitle') }}</span>
          <p class="body-regular auth-card__desc">{{ t('resetPassword.invalidDesc') }}</p>
          <Button variant="ghost" size="large" :block="true" @click="navigateTo('/forgot-password')">
            {{ t('resetPassword.requestNew') }}
          </Button>
          <Button variant="ghost" size="large" :block="true" @click="navigateTo('/login')">
            {{ t('resetPassword.backToLogin') }}
          </Button>
        </template>

      </div>
    </HeroBanner>

    <AppFooter variant="auth" v-model:lang="lang" />
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.rp-logo {
  font-family: token("font-family-logo");
  font-size: 28px;
  color: token("color-action-brand");
  letter-spacing: 2px;
}

.auth-card {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: token("dm-48") token("dm-64");
  max-width: 450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: token("dm-16");

  &__desc {
    color: token("color-text-secondary");
    margin: 0;
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: token("dm-32") 0;
  }

  &__spinner {
    color: token("color-action-brand");
    animation: spin 1s linear infinite;
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
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>

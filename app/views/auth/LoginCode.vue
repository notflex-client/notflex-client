<script setup lang="ts">
import type { AuthUser } from '~/stores/auth'

const { t } = useI18n()
const { lang } = useLocale()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { errorMsg, formErrors, setErrors, clearErrors } = useResponseError()

const step = ref<'email' | 'otp'>('email')
const email = ref('')
const requestId = ref('')
const otp = ref('')
const submitLoading = ref(false)
const resendLoading = ref(false)
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(timer!)
  }, 1000)
}

async function requestCode() {
  submitLoading.value = true
  clearErrors()
  try {
    const res = await $api<{ id: string }>('/auth/login-code', {
      method: 'POST',
      body: { email: email.value },
    })
    requestId.value = res.id
    step.value = 'otp'
    startCountdown()
  } catch (err: unknown) {
    setErrors((err as { data?: unknown }).data ?? err)
  } finally {
    submitLoading.value = false
  }
}

async function confirmCode() {
  if (otp.value.length !== 6) {
    setErrors({ details: { verifyCode: t('loginCode.errorIncomplete') } })
    return
  }
  submitLoading.value = true
  clearErrors()
  try {
    const data = await $api<{ token: string, user: AuthUser }>('/auth/login-code/confirm', {
      method: 'POST',
      body: { id: requestId.value, verifyCode: otp.value },
    })
    authStore.login(data.token, data.user)
    navigateTo('/who-is-watching')
  } catch (err: unknown) {
    setErrors((err as { data?: unknown }).data ?? err)
  } finally {
    submitLoading.value = false
  }
}

async function resend() {
  if (countdown.value > 0) return
  resendLoading.value = true
  otp.value = ''
  clearErrors()
  try {
    const res = await $api<{ id: string }>('/auth/login-code', {
      method: 'POST',
      body: { email: email.value },
    })
    requestId.value = res.id
    startCountdown()
  } catch (err: unknown) {
    setErrors((err as { data?: unknown }).data ?? err)
  } finally {
    resendLoading.value = false
  }
}

function changeEmail() {
  step.value = 'email'
  otp.value = ''
  requestId.value = ''
  clearErrors()
  if (timer) { clearInterval(timer); timer = null }
}

watch(otp, (val) => {
  const cleaned = val.replace(/\D/g, '').slice(0, 6)
  if (cleaned !== val) otp.value = cleaned
})

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div>
    <AppHeader transparent sticky>
      <template #logo>
        <span class="auth-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <AuthCard
        v-if="step === 'email'"
        :title="t('loginCode.title')"
        :description="t('loginCode.description')"
      >
        <InputField
          v-model="email"
          :label="t('loginCode.emailLabel')"
          type="email"
          autocomplete="email"
          :error="formErrors.email"
          @keydown.enter="requestCode"
        >
          <template #icon>
            <Icon name="lucide:mail" />
          </template>
        </InputField>

        <p v-if="errorMsg" class="auth-card__api-error">
          {{ errorMsg }}
        </p>

        <Button variant="brand" size="large" :block="true" :disabled="submitLoading" @click="requestCode">
          {{ submitLoading ? t('loginCode.sending') : t('loginCode.sendCode') }}
        </Button>

        <NuxtLink to="/login" class="auth-card__forgot">
          {{ t('loginCode.backToLogin') }}
        </NuxtLink>
      </AuthCard>

      <AuthCard
        v-else
        :title="t('loginCode.otpTitle')"
      >
        <p class="auth-card__notice">
          {{ t('loginCode.sentTo') }}<br>
          <span class="auth-card__email">{{ email }}</span>
        </p>

        <InputField
          v-model="otp"
          :label="t('loginCode.codeLabel')"
          type="text"
          autocomplete="one-time-code"
          :error="formErrors.verifyCode"
          @keydown.enter="confirmCode"
        >
          <template #icon>
            <Icon name="lucide:lock" />
          </template>
        </InputField>

        <p v-if="errorMsg" class="auth-card__api-error">
          {{ errorMsg }}
        </p>

        <Button
          variant="brand"
          size="large"
          :block="true"
          :disabled="submitLoading || otp.length !== 6"
          @click="confirmCode"
        >
          {{ submitLoading ? t('loginCode.verifying') : t('loginCode.signIn') }}
        </Button>

        <template #footer>
          <span>
            {{ t('loginCode.noCode') }}
            <button
              class="auth-card__link auth-card__resend-btn"
              :disabled="countdown > 0 || resendLoading"
              @click="resend"
            >
              {{ countdown > 0 ? t('loginCode.resendIn', { s: countdown }) : t('loginCode.resend') }}
            </button>
          </span>
          <span>
            {{ t('loginCode.wrongEmail') }}
            <button class="auth-card__link auth-card__resend-btn" @click="changeEmail">
              {{ t('loginCode.changeEmail') }}
            </button>
          </span>
        </template>
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

.auth-card__resend-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  &:disabled { color: token("color-text-secondary"); cursor: default; text-decoration: none; }
}
</style>

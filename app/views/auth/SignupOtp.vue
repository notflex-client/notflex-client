<script setup lang="ts">
definePageMeta({ path: '/signup-otp' })

const { t } = useI18n()
const { lang } = useLocale()
const { $api } = useNuxtApp()
const route = useRoute()
const email = computed(() => (route.query.email as string) || '')
const requestId = ref((route.query.id as string) || '')

const otp = ref('')
const error = ref('')
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

async function submit() {
  if (otp.value.length !== 6) {
    error.value = t('otp.errorIncomplete')
    return
  }
  submitLoading.value = true
  error.value = ''
  try {
    await $api('/registration/verify', {
      method: 'POST',
      body: { id: requestId.value, verifyCode: otp.value },
    })
    navigateTo(`/signup-final?id=${requestId.value}`)
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    error.value = e.data?.message || t('otp.errorInvalid')
  } finally {
    submitLoading.value = false
  }
}

async function resend() {
  if (countdown.value > 0 || !email.value) return
  resendLoading.value = true
  error.value = ''
  otp.value = ''
  try {
    const res = await $api<{ id: string }>('/registration/request', {
      method: 'POST',
      body: { email: email.value },
    })
    requestId.value = res.id
    startCountdown()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    error.value = e.data?.message || t('otp.errorResend')
  } finally {
    resendLoading.value = false
  }
}

onMounted(startCountdown)
onUnmounted(() => { if (timer) clearInterval(timer) })

watch(otp, (val) => {
  error.value = ''
  const cleaned = val.replace(/\D/g, '').slice(0, 6)
  if (cleaned !== val) otp.value = cleaned
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
      <AuthCard :title="t('otp.title')">
        <p class="auth-card__notice">
          {{ t('otp.sentTo') }}<br>
          <span class="auth-card__email">{{ email || t('otp.yourEmail') }}</span>
        </p>

        <InputField
          v-model="otp"
          :label="t('otp.codeLabel')"
          type="text"
          autocomplete="one-time-code"
          :error="error"
          @keydown.enter="submit"
        >
          <template #icon>
            <Icon name="lucide:lock" />
          </template>
        </InputField>

        <Button
          variant="brand"
          size="large"
          :block="true"
          :disabled="submitLoading || otp.length !== 6"
          @click="submit"
        >
          {{ submitLoading ? t('otp.verifying') : t('otp.continue') }}
        </Button>

        <template #footer>
          <span>
            {{ t('otp.noCode') }}
            <button
              class="auth-card__link auth-card__resend-btn"
              :disabled="countdown > 0 || resendLoading"
              @click="resend"
            >
              {{ countdown > 0 ? t('otp.resendIn', { s: countdown }) : t('otp.resend') }}
            </button>
          </span>
          <span>
            {{ t('otp.wrongEmail') }}
            <NuxtLink to="/signup" class="auth-card__link">{{ t('otp.goBack') }}</NuxtLink>
          </span>
        </template>
      </AuthCard>
    </HeroBanner>

    <AppFooter variant="auth" v-model:lang="lang" />
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

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

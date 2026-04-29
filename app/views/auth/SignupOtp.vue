<script setup lang="ts">
definePageMeta({ path: '/signup-otp' })

const { t } = useI18n()
const lang     = ref('en')
const route    = useRoute()
const email    = computed(() => (route.query.email as string) || '')
const requestId = ref((route.query.id as string) || '')

const otp            = ref('')
const error          = ref('')
const submitLoading  = ref(false)
const resendLoading  = ref(false)
const countdown      = ref(0)
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
    await $fetch('/registration/verify-registration', {
      method: 'POST',
      body: { id: requestId.value, verifyCode: otp.value },
    })
    navigateTo(`/signup-final?id=${requestId.value}`)
  } catch (err: any) {
    error.value = err.data?.message || t('otp.errorInvalid')
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
    const res = await $fetch<{ id: string }>('/registration/request', {
      method: 'POST',
      body: { email: email.value },
    })
    requestId.value = res.id
    startCountdown()
  } catch (err: any) {
    error.value = err.data?.message || t('otp.errorResend')
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

    <!-- ── Header ─────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="auth-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <!-- ── Auth Hero ──────────────────────────────────────── -->
    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <div class="auth-card">

        <span class="title-2-bold">{{ t('otp.title') }}</span>

        <span class="body-regular auth-card__desc">
          {{ t('otp.sentTo') }}<br>
          <span class="auth-card__email">{{ email || t('otp.yourEmail') }}</span>
        </span>

        <div class="flex flex-col gap-4">
          <InputField
            v-model="otp"
            :label="t('otp.codeLabel')"
            type="text"
            autocomplete="one-time-code"
            :error="error"

          />
          <Button
            variant="brand"
            size="large"
            :block="true"
            :disabled="submitLoading || otp.length !== 6"
            @click="submit"
          >
            {{ submitLoading ? t('otp.verifying') : t('otp.continue') }}
          </Button>
        </div>

        <span class="caption-1-regular auth-card__resend">
          {{ t('otp.noCode') }}
          <button
            class="auth-card__resend-btn caption-1-regular"
            :disabled="countdown > 0 || resendLoading"
            @click="resend"
          >
            {{ countdown > 0 ? t('otp.resendIn', { s: countdown }) : t('otp.resend') }}
          </button>
        </span>

        <span class="caption-1-regular auth-card__back">
          {{ t('otp.wrongEmail') }}
          <NuxtLink to="/signup" class="auth-card__link">{{ t('otp.goBack') }}</NuxtLink>
        </span>

      </div>
    </HeroBanner>

    <!-- ── Footer ─────────────────────────────────────────── -->
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
    text-align: center;
    line-height: 1.6;
  }

  &__email {
    color: token("color-text-primary");
    font-weight: 700;
  }



  &__resend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: token("dm-4");
    flex-wrap: wrap;
    color: token("color-text-secondary");
    text-align: center;
  }

  &__resend-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: token("color-text-primary");
    text-decoration: underline;

    &:disabled {
      color: token("color-text-secondary");
      text-decoration: none;
      cursor: default;
    }
  }

  &__back {
    text-align: center;
    color: token("color-text-secondary");
  }

  &__link {
    color: token("color-text-primary");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}
</style>

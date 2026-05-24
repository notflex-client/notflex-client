<script setup lang="ts">
definePageMeta({ authRequired: false, guestOnly: true })

const { t } = useI18n()
const { $api } = useNuxtApp()
const { lang } = useLocale()
const { setErrors, clearErrors } = useResponseError()

const email = ref('')
const loading = ref(false)
const success = ref(false)
const seconds = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

function startCountdown(resetPasswordTime: number) {
  seconds.value = Math.max(0, Math.floor(resetPasswordTime + 300 - Date.now() / 1000))
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--
    } else {
      clearInterval(interval!)
      interval = null
    }
  }, 1000)
}

async function submit() {
  if (seconds.value > 0) return
  loading.value = true
  clearErrors()
  try {
    const resp = await $api<{ success: boolean; resetPasswordTime?: number }>('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    success.value = true
    if (resp.resetPasswordTime) startCountdown(resp.resetPasswordTime)
  } catch (err: any) {
    setErrors(err.data ?? err)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  success.value = false
  email.value = ''
  seconds.value = 0
  if (interval) { clearInterval(interval); interval = null }
  clearErrors()
}

onUnmounted(() => { if (interval) clearInterval(interval) })
</script>

<template>
  <div>
    <AppHeader transparent sticky>
      <template #logo>
        <span class="fp-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <div class="auth-card">

        <!-- State 1: Form nhập email -->
        <template v-if="!success">
          <span class="title-2-bold">{{ t('forgotPassword.title') }}</span>
          <p class="body-regular auth-card__desc">{{ t('forgotPassword.description') }}</p>

          <div class="flex flex-col gap-4">
            <InputField
              v-model="email"
              :label="t('forgotPassword.emailLabel')"
              type="email"
              autocomplete="email"
              @keydown.enter="submit"
            />
            <Button variant="brand" size="large" :block="true" :disabled="loading" @click="submit">
              {{ loading ? t('forgotPassword.sending') : t('forgotPassword.sendLink') }}
            </Button>
          </div>

          <NuxtLink to="/login" class="auth-card__forgot body-regular">
            {{ t('forgotPassword.backToLogin') }}
          </NuxtLink>
        </template>

        <!-- State 2: Thành công, kiểm tra hộp thư -->
        <template v-else>
          <span class="title-2-bold">{{ t('forgotPassword.checkInboxTitle') }}</span>
          <p class="body-regular auth-card__desc">
            {{ t('forgotPassword.checkInboxDesc') }} <strong>{{ email }}</strong>.
            {{ t('forgotPassword.checkSpam') }}
          </p>

          <Button variant="brand" size="large" :block="true" @click="() => window.location.href = `mailto:${email}`">
            {{ t('forgotPassword.openInbox') }}
          </Button>

          <p class="caption-1-regular auth-card__resend">
            {{ t('forgotPassword.cantFind') }}
            <button v-if="seconds <= 0" class="auth-card__link-btn" @click="submit">
              {{ t('forgotPassword.resendLink') }}
            </button>
            <span v-else class="auth-card__countdown">
              {{ t('forgotPassword.resendIn', { s: seconds }) }}
            </span>
          </p>

          <p class="caption-1-regular auth-card__resend">
            {{ t('forgotPassword.wrongEmail') }}
            <button class="auth-card__link-btn" @click="resetForm">
              {{ t('forgotPassword.changeEmail') }}
            </button>
          </p>
        </template>

      </div>
    </HeroBanner>

    <AppFooter variant="auth" v-model:lang="lang" />
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.fp-logo {
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

  &__forgot {
    text-align: center;
    color: token("color-text-secondary");
    text-decoration: none;

    &:hover { color: token("color-text-primary"); }
  }

  &__resend {
    color: token("color-text-secondary");
    text-align: center;
  }

  &__link-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: token("color-text-primary");
    font-size: inherit;
    text-decoration: underline;

    &:hover { color: token("color-text-secondary"); }
  }

  &__countdown {
    color: token("color-text-secondary");
  }
}
</style>

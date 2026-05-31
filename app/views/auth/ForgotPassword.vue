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
    const resp = await $api<{ success: boolean, resetPasswordTime?: number }>('/auth/forgot-password', {
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
        <span class="auth-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <AuthCard
        v-if="!success"
        :title="t('forgotPassword.title')"
        :description="t('forgotPassword.description')"
      >
        <InputField
          v-model="email"
          :label="t('forgotPassword.emailLabel')"
          type="email"
          autocomplete="email"
          @keydown.enter="submit"
        >
          <template #icon>
            <Icon name="lucide:mail" />
          </template>
        </InputField>

        <Button variant="brand" size="large" :block="true" :disabled="loading" @click="submit">
          {{ loading ? t('forgotPassword.sending') : t('forgotPassword.sendLink') }}
        </Button>

        <NuxtLink to="/login" class="auth-card__forgot">
          {{ t('forgotPassword.backToLogin') }}
        </NuxtLink>
      </AuthCard>

      <AuthCard v-else :title="t('forgotPassword.checkInboxTitle')">
        <p class="auth-card__notice">
          {{ t('forgotPassword.checkInboxDesc') }} <span class="auth-card__email">{{ email }}</span>.
          {{ t('forgotPassword.checkSpam') }}
        </p>

        <Button variant="brand" size="large" :block="true" @click="() => window.location.href = `mailto:${email}`">
          {{ t('forgotPassword.openInbox') }}
        </Button>

        <template #footer>
          <span>
            {{ t('forgotPassword.cantFind') }}
            <button
              v-if="seconds <= 0"
              class="auth-card__link auth-card__resend-btn"
              @click="submit"
            >
              {{ t('forgotPassword.resendLink') }}
            </button>
            <span v-else>{{ t('forgotPassword.resendIn', { s: seconds }) }}</span>
          </span>
          <span>
            {{ t('forgotPassword.wrongEmail') }}
            <button class="auth-card__link auth-card__resend-btn" @click="resetForm">
              {{ t('forgotPassword.changeEmail') }}
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
}
</style>

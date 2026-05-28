<script setup lang="ts">
import type { AuthUser } from '~/stores/auth'

const { t } = useI18n()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { errorMsg, setErrors, clearErrors } = useResponseError()

const email    = ref('')
const password = ref('')
const remember = ref(false)
const loading  = ref(false)
const { lang } = useLocale()

async function signIn() {
  loading.value = true
  clearErrors()
  try {
    const data = await $api<{ token: string, user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value, remember: remember.value },
    })
    authStore.login(data.token, data.user)
    navigateTo('/browse')
  } catch (err: unknown) {
    const e = err as { data?: unknown }
    setErrors(e.data ?? err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <AppHeader transparent sticky>
      <template #logo>
        <span class="auth-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <AuthCard :title="t('login.title')">
        <InputField
          v-model="email"
          :label="t('login.emailLabel')"
          type="email"
          autocomplete="email"
        >
          <template #icon>
            <Icon name="lucide:mail" />
          </template>
        </InputField>

        <InputField
          v-model="password"
          :label="t('login.passwordLabel')"
          type="password"
          autocomplete="current-password"
        >
          <template #icon>
            <Icon name="lucide:lock" />
          </template>
        </InputField>

        <p v-if="errorMsg" class="auth-card__api-error">
          {{ errorMsg }}
        </p>

        <Button variant="brand" size="large" :block="true" :disabled="loading" @click="signIn">
          {{ loading ? '...' : t('login.signIn') }}
        </Button>

        <div class="auth-card__or">
          <span class="caption-1-regular">OR</span>
        </div>

        <Button variant="ghost" size="large" :block="true" class="auth-card__outline-btn" @click="navigateTo('/login-code')">
          <template #leading-icon>
            <Icon name="lucide:qr-code" size="18" />
          </template>
          {{ t('login.signInCode') }}
        </Button>

        <NuxtLink to="/forgot-password" class="auth-card__forgot body-regular">
          {{ t('login.forgotPassword') }}
        </NuxtLink>

        <Checkbox v-model="remember" :label="t('login.rememberMe')" />

        <template #footer>
          <span>
            {{ t('login.newToNetflix') }}
            <NuxtLink to="/signup" class="auth-card__link">{{ t('login.signUpNow') }}</NuxtLink>
          </span>
        </template>

        <template #disclaimer>
          {{ t('login.recaptcha') }}
          <a href="#" class="auth-card__link">{{ t('login.learnMore') }}</a>
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
</style>

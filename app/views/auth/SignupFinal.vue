<script setup lang="ts">
import type { AuthUser } from '~/stores/auth'

definePageMeta({ path: '/signup-final' })

const { t } = useI18n()
const { lang } = useLocale()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const route     = useRoute()
const requestId = computed(() => (route.query.id as string) || '')

const name            = ref('')
const password        = ref('')
const confirmPassword = ref('')
const nameError       = ref('')
const passwordError   = ref('')
const confirmError    = ref('')
const error           = ref('')
const submitLoading   = ref(false)

async function submit() {
  nameError.value     = ''
  passwordError.value = ''
  confirmError.value  = ''
  error.value         = ''

  if (!name.value.trim()) {
    nameError.value = t('final.errorName')
    return
  }
  if (password.value.length < 8) {
    passwordError.value = t('final.errorPasswordLength')
    return
  }
  if (password.value !== confirmPassword.value) {
    confirmError.value = t('final.errorPasswordMatch')
    return
  }

  submitLoading.value = true
  try {
    const res = await $api<{ token: string, user?: AuthUser }>('/registration/confirm', {
      method: 'POST',
      body: {
        id:       requestId.value,
        fullName: name.value.trim(),
        password: password.value,
      },
    })
    if (res.user) {
      authStore.login(res.token, res.user)
    } else {
      authStore.token = res.token
      localStorage.setItem('token', res.token)
    }
    navigateTo('/plans?from=signup')
  } catch (err: unknown) {
    const data = (err as { data?: { message?: string, errors?: { name?: string[], password?: string[] } } }).data
    if (data?.errors) {
      nameError.value     = data.errors.name?.[0]     || ''
      passwordError.value = data.errors.password?.[0] || ''
    }
    error.value = data?.message || t('final.errorGeneric')
  } finally {
    submitLoading.value = false
  }
}

watch([name, password, confirmPassword], () => {
  if (nameError.value || passwordError.value || confirmError.value || error.value) {
    nameError.value     = ''
    passwordError.value = ''
    confirmError.value  = ''
    error.value         = ''
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
      <AuthCard :title="t('final.title')">
        <InputField
          v-model="name"
          :label="t('final.nameLabel')"
          autocomplete="name"
          :error="nameError"
        >
          <template #icon>
            <Icon name="lucide:user" />
          </template>
        </InputField>

        <InputField
          v-model="password"
          :label="t('final.passwordLabel')"
          type="password"
          autocomplete="new-password"
          :error="passwordError"
        >
          <template #icon>
            <Icon name="lucide:lock" />
          </template>
        </InputField>

        <InputField
          v-model="confirmPassword"
          :label="t('final.confirmLabel')"
          type="password"
          autocomplete="new-password"
          :error="confirmError"
        >
          <template #icon>
            <Icon name="lucide:lock" />
          </template>
        </InputField>

        <p v-if="error" class="auth-card__api-error">
          {{ error }}
        </p>

        <Button variant="brand" size="large" :block="true" :disabled="submitLoading" @click="submit">
          {{ submitLoading ? t('final.creating') : t('final.create') }}
        </Button>

        <template #footer>
          <span>
            {{ t('final.alreadyHave') }}
            <NuxtLink to="/login" class="auth-card__link">{{ t('final.signIn') }}</NuxtLink>
          </span>
        </template>

        <template #disclaimer>
          {{ t('final.terms') }}
          <a href="#" class="auth-card__link">{{ t('final.termsLink') }}</a>
          {{ t('final.and') }}
          <a href="#" class="auth-card__link">{{ t('final.privacyLink') }}</a>
          {{ t('final.termsEnd') }}
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
</style>

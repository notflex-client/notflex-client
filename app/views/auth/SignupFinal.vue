<script setup lang="ts">
definePageMeta({ path: '/signup-final' })

const { t } = useI18n()
const lang      = ref('en')
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
  nameError.value    = ''
  passwordError.value = ''
  confirmError.value = ''
  error.value        = ''

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
    const res = await $fetch<{ token: string }>('/registration/confirm', {
      method: 'POST',
      body: {
        id:       requestId.value,
        name:     name.value.trim(),
        password: password.value,
      },
    })
    if (res.token) localStorage.setItem('token', res.token)
    navigateTo('/browse')
  } catch (err: any) {
    const data = err.data
    if (data?.errors) {
      nameError.value    = data.errors.name?.[0]     || ''
      passwordError.value = data.errors.password?.[0] || ''
    }
    error.value = data?.message || t('final.errorGeneric')
  } finally {
    submitLoading.value = false
  }
}

watch([name, password, confirmPassword], () => {
  if (nameError.value || passwordError.value || confirmError.value || error.value) {
    nameError.value    = ''
    passwordError.value = ''
    confirmError.value = ''
    error.value        = ''
  }
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

        <span class="title-2-bold">{{ t('final.title') }}</span>

        <div class="flex flex-col gap-4">
          <InputField
            v-model="name"
            :label="t('final.nameLabel')"
            type="text"
            autocomplete="name"
            :error="nameError"
          />

          <InputField
            v-model="password"
            type="password"
            :label="t('final.passwordLabel')"
            autocomplete="new-password"
            :error="passwordError"
          />

          <InputField
            v-model="confirmPassword"
            type="password"
            :label="t('final.confirmLabel')"
            autocomplete="new-password"
            :error="confirmError"
          />

          <span v-if="error" class="caption-1-regular auth-card__error">{{ error }}</span>

          <Button
            variant="brand"
            size="large"
            :block="true"
            :disabled="submitLoading"
            @click="submit"
          >
            {{ submitLoading ? t('final.creating') : t('final.create') }}
          </Button>
        </div>

        <span class="caption-2-regular auth-card__terms">
          {{ t('final.terms') }}
          <a href="#" class="auth-card__terms-link">{{ t('final.termsLink') }}</a>
          {{ t('final.and') }}
          <a href="#" class="auth-card__terms-link">{{ t('final.privacyLink') }}</a>{{ t('final.termsEnd') }}
        </span>

        <span class="caption-1-regular auth-card__new">
          {{ t('final.alreadyHave') }}
          <NuxtLink to="/login" class="auth-card__signup-link">{{ t('final.signIn') }}</NuxtLink>
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

  &__error {
    color: token("color-action-brand");
    text-align: center;
  }

  &__terms {
    color: token("color-text-secondary");
    text-align: center;
    opacity: 0.7;
  }

  &__terms-link {
    color: token("color-text-secondary");
    &:hover { text-decoration: underline; }
  }

  &__new { color: token("color-text-secondary"); }

  &__signup-link {
    color: token("color-text-primary");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}
</style>

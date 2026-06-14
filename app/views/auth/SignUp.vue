<script setup lang="ts">
definePageMeta({ path: '/signup' })

const { t } = useI18n()
const { lang } = useLocale()
const { $api } = useNuxtApp()
const v = useValidators()
const email = ref('')
const error = ref('')
const emailErr = ref('')
const submitLoading = ref(false)

async function submit() {
  error.value = ''
  emailErr.value = v.email(email.value)
  if (emailErr.value) return
  submitLoading.value = true
  try {
    const res = await $api<{ id: string }>('/registration/request', {
      method: 'POST',
      body: { email: email.value },
    })
    navigateTo(`/signup-otp?email=${encodeURIComponent(email.value)}&id=${res.id}`)
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    error.value = e.data?.message || t('signup.errorGeneric')
  } finally {
    submitLoading.value = false
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
      <AuthCard :title="t('signup.title')">
        <InputField
          v-model="email"
          :label="t('signup.emailLabel')"
          type="email"
          autocomplete="email"
          :error="emailErr"
          @input="emailErr = ''"
          @keydown.enter="submit"
        >
          <template #icon>
            <Icon name="lucide:mail" />
          </template>
        </InputField>

        <p v-if="error" class="auth-card__api-error">
          {{ error }}
        </p>

        <Button variant="brand" size="large" :block="true" :disabled="submitLoading" @click="submit">
          {{ submitLoading ? '...' : t('signup.continue') }}
        </Button>

        <template #footer>
          <span>
            {{ t('signup.alreadyHave') }}
            <NuxtLink to="/login" class="auth-card__link">{{ t('signup.signIn') }}</NuxtLink>
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
</style>

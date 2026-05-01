<script setup lang="ts">
definePageMeta({ path: '/signup' })

const { t } = useI18n()
const { lang } = useLocale()
const { $api } = useNuxtApp()
const email = ref('')
const error = ref('')
const submitLoading = ref(false)

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function submit() {
  error.value = ''
  if (!validateEmail(email.value)) {
    error.value = t('signup.errorEmail')
    return
  }
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

    <!-- ── Header ─────────────────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="signup-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <!-- ── Auth Hero ──────────────────────────────────────── -->
    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <div class="auth-card">

        <span class="title-2-bold">{{ t('signup.title') }}</span>

        <div class="flex flex-col gap-4">
          <InputField
            v-model="email"
            :label="t('signup.emailLabel')"
            type="email"
            autocomplete="email"
            :error="error"
          />
          <Button
            variant="brand"
            size="large"
            :block="true"
            :loading="submitLoading"
            @click="submit"
          >
            {{ t('signup.continue') }}
          </Button>
        </div>

        <span class="caption-1-regular auth-card__have-account">
          {{ t('signup.alreadyHave') }}
          <NuxtLink to="/login" class="auth-card__signin-link">{{ t('signup.signIn') }}</NuxtLink>
        </span>

      </div>
    </HeroBanner>

    <!-- ── Footer ─────────────────────────────────────────── -->
    <AppFooter v-model:lang="lang" variant="auth" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.signup-logo {
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

  &__have-account { color: token("color-text-secondary"); }

  &__signin-link {
    color: token("color-text-primary");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}
</style>

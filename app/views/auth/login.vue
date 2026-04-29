<script setup lang="ts">
definePageMeta({ path: '/login' })

const { t } = useI18n()
const email    = ref('')
const password = ref('')
const remember = ref(false)
const lang     = ref('en')

function signIn() {
  navigateTo('/browse')
}
</script>

<template>
  <div>

    <!-- ── Header: logo only ──────────────────────────────── -->
    <AppHeader transparent sticky>
      <template #logo>
        <span class="login-logo">NOTFLEX</span>
      </template>
    </AppHeader>

    <!-- ── Auth Hero ──────────────────────────────────────── -->
    <HeroBanner variant="auth" image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80">
      <div class="auth-card">

        <span class="title-2-bold">{{ t('login.title') }}</span>

        <!-- Fields -->
        <div class="flex flex-col gap-4">
          <InputField v-model="email" :label="t('login.emailLabel')" type="email" autocomplete="email" />
          <InputField v-model="password" :label="t('login.passwordLabel')" type="password" autocomplete="current-password" />
          <Button variant="brand" size="large" :block="true" @click="signIn">{{ t('login.signIn') }}</Button>
        </div>

        <!-- OR divider -->
        <div class="auth-card__or">
          <span class="caption-1-regular">OR</span>
        </div>

        <Button variant="ghost" size="large" :block="true">{{ t('login.signInCode') }}</Button>

        <a href="#" class="auth-card__forgot body-regular">{{ t('login.forgotPassword') }}</a>

        <Checkbox v-model="remember" :label="t('login.rememberMe')" />

        <span class="caption-1-regular auth-card__new">
          {{ t('login.newToNetflix') }}
          <NuxtLink to="/signup" class="auth-card__signup-link">{{ t('login.signUpNow') }}</NuxtLink>
        </span>

        <span class="caption-2-regular auth-card__captcha">
          {{ t('login.recaptcha') }}
          <a href="#" class="auth-card__captcha-link">{{ t('login.learnMore') }}</a>
        </span>

      </div>
    </HeroBanner>

    <!-- ── Footer ─────────────────────────────────────────── -->
    <AppFooter variant="auth" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.login-logo {
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

  &__or {
    display: flex;
    align-items: center;
    gap: token("dm-8");
    color: token("color-text-secondary");

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: token("grey-600");
    }
  }

  &__forgot {
    text-align: center;
    color: token("color-text-secondary");
    text-decoration: none;
    &:hover { color: token("color-text-primary"); }
  }

  &__new { color: token("color-text-secondary"); }

  &__signup-link {
    color: token("color-text-primary");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  &__captcha {
    color: token("color-text-secondary");
    opacity: 0.7;
  }

  &__captcha-link {
    color: token("color-text-secondary");
    &:hover { text-decoration: underline; }
  }
}
</style>

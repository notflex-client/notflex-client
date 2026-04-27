<script setup lang="ts">
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

        <h1 class="title-2-bold">Sign In</h1>

        <!-- Fields -->
        <div class="flex flex-col gap-4">
          <InputField v-model="email" label="Email or phone number" type="email" autocomplete="email" />
          <InputField v-model="password" label="Password" type="password" autocomplete="current-password" />
          <Button variant="brand" size="large" :block="true" @click="signIn">Sign In</Button>
        </div>

        <!-- OR divider -->
        <div class="auth-card__or">
          <span class="caption-1-regular">OR</span>
        </div>

        <Button variant="ghost" size="large" :block="true">Use a Sign-In Code</Button>

        <a href="#" class="auth-card__forgot body-regular">Forgot Password?</a>

        <Checkbox v-model="remember" label="Remember me" />

        <span class="caption-1-regular auth-card__new">
          New to Netflix?
          <NuxtLink to="/signup" class="auth-card__signup-link">Sign up now.</NuxtLink>
        </span>

        <span class="caption-2-regular auth-card__captcha">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
          <a href="#" class="auth-card__captcha-link">Learn more.</a>
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

  // ── OR divider ──────────────────────────────────────────
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

  // ── Forgot password ─────────────────────────────────────
  &__forgot {
    text-align: center;
    color: token("color-text-secondary");
    text-decoration: none;
    &:hover { color: token("color-text-primary"); }
  }

  // ── New to Netflix ──────────────────────────────────────
  &__new { color: token("color-text-secondary"); }

  &__signup-link {
    color: token("color-text-primary");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  // ── reCAPTCHA note ──────────────────────────────────────
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

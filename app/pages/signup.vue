<script setup lang="ts">
definePageMeta({ authRequired: false })

const route   = useRoute()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { errorMsg, formErrors, setErrors, clearErrors } = useResponseError()

const lang     = ref('en')
const step     = ref<1 | 2 | 3>(1)
const loading  = ref(false)

// Step 1
const email = ref((route.query.email as string) ?? '')
// Step 2
const requestId = ref('')
const otp       = ref('')
// Step 3
const fullName  = ref('')
const password  = ref('')

// ── Step 1: gửi OTP ──────────────────────────────────────
async function sendOtp() {
  loading.value = true
  clearErrors()
  try {
    const data: any = await $api('/registration/request', {
      method: 'POST',
      body: { email: email.value },
    })
    requestId.value = data.id
    step.value = 2
  } catch (err: any) {
    setErrors(err.data ?? err)
  } finally {
    loading.value = false
  }
}

// ── Step 2: xác minh OTP ─────────────────────────────────
async function verifyOtp() {
  loading.value = true
  clearErrors()
  try {
    await $api('/registration/verify', {
      method: 'POST',
      body: { id: requestId.value, verifyCode: otp.value },
    })
    step.value = 3
  } catch (err: any) {
    setErrors(err.data ?? err)
  } finally {
    loading.value = false
  }
}

// ── Step 3: tạo tài khoản ────────────────────────────────
async function confirmRegistration() {
  loading.value = true
  clearErrors()
  try {
    const data: any = await $api('/registration/confirm', {
      method: 'POST',
      body: { id: requestId.value, fullName: fullName.value, password: password.value },
    })
    authStore.login(data.token, data.user)
    navigateTo('/browse')
  } catch (err: any) {
    setErrors(err.data ?? err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>

    <!-- Header -->
    <AppHeader transparent sticky>
      <template #logo>
        <NuxtLink to="/" class="signup-logo">NOTFLEX</NuxtLink>
      </template>
    </AppHeader>

    <!-- Auth Hero -->
    <HeroBanner
      variant="auth"
      image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80"
    >
      <div class="auth-card">

        <!-- ── Bước 1: Nhập email ─────────────────────────── -->
        <template v-if="step === 1">
          <h1 class="title-2-bold">Create your account</h1>
          <p class="body-regular auth-card__sub">
            Enter your email to get started.
          </p>

          <div class="flex flex-col gap-4">
            <InputField
              v-model="email"
              label="Email address"
              type="email"
              autocomplete="email"
              :error="formErrors.email"
            />

            <p v-if="errorMsg" class="auth-card__api-error">{{ errorMsg }}</p>

            <Button
              variant="brand"
              size="large"
              :block="true"
              :disabled="loading || !email"
              @click="sendOtp"
            >
              {{ loading ? 'Sending...' : 'Send Verification Code' }}
            </Button>
          </div>

          <span class="caption-1-regular auth-card__new">
            Already have an account?
            <NuxtLink to="/login" class="auth-card__link">Sign in.</NuxtLink>
          </span>
        </template>

        <!-- ── Bước 2: Nhập OTP ──────────────────────────── -->
        <template v-else-if="step === 2">
          <h1 class="title-2-bold">Check your email</h1>
          <p class="body-regular auth-card__sub">
            We sent a 6-digit code to <strong>{{ email }}</strong>.
            Enter it below.
          </p>

          <div class="flex flex-col gap-4">
            <InputField
              v-model="otp"
              label="Verification code"
              type="text"
              autocomplete="one-time-code"
              :error="formErrors.verifyCode"
            />

            <p v-if="errorMsg" class="auth-card__api-error">{{ errorMsg }}</p>

            <Button
              variant="brand"
              size="large"
              :block="true"
              :disabled="loading || otp.length !== 6"
              @click="verifyOtp"
            >
              {{ loading ? 'Verifying...' : 'Verify Code' }}
            </Button>
          </div>

          <button class="auth-card__resend caption-1-regular" @click="step = 1">
            ← Change email or resend code
          </button>
        </template>

        <!-- ── Bước 3: Tạo tài khoản ─────────────────────── -->
        <template v-else>
          <h1 class="title-2-bold">Finish signing up</h1>
          <p class="body-regular auth-card__sub">
            Set your name and password.
          </p>

          <div class="flex flex-col gap-4">
            <InputField
              v-model="fullName"
              label="Full name"
              type="text"
              autocomplete="name"
              :error="formErrors.fullName"
            />
            <InputField
              v-model="password"
              label="Password"
              type="password"
              autocomplete="new-password"
              :error="formErrors.password"
            />

            <p v-if="errorMsg" class="auth-card__api-error">{{ errorMsg }}</p>

            <Button
              variant="brand"
              size="large"
              :block="true"
              :disabled="loading || !fullName || !password"
              @click="confirmRegistration"
            >
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </Button>
          </div>
        </template>

        <!-- Step indicator -->
        <div class="auth-card__steps">
          <span
            v-for="n in 3" :key="n"
            class="auth-card__step-dot"
            :class="{ 'is-active': step === n, 'is-done': step > n }"
          />
        </div>

      </div>
    </HeroBanner>

    <AppFooter variant="auth" v-model:lang="lang" />

  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/tools/token" as *;

.signup-logo {
  font-family: token("font-family-logo");
  font-size: 28px;
  color: token("color-action-brand");
  letter-spacing: 2px;
  text-decoration: none;
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

  &__sub    { color: token("color-text-secondary"); }
  &__new    { color: token("color-text-secondary"); }

  &__link {
    color: token("color-text-primary");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  &__api-error {
    margin: 0;
    font-size: 13px;
    color: #e87c03;
  }

  &__resend {
    background: none;
    border: none;
    padding: 0;
    color: token("color-text-secondary");
    cursor: pointer;
    text-align: left;
    &:hover { color: token("color-text-primary"); }
  }

  &__steps {
    display: flex;
    justify-content: center;
    gap: token("dm-8");
    margin-top: token("dm-8");
  }

  &__step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: token("grey-600");
    transition: background-color 0.2s;

    &.is-active { background-color: token("color-action-brand"); }
    &.is-done   { background-color: token("grey-400"); }
  }
}
</style>

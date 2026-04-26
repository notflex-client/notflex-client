<script setup lang="ts">
const email = ref('')
const emailFocus = ref('focused@example.com')
const emailPhone = ref('')
const emailPhoneFocus = ref('user@example.com')
const password = ref('')
const passwordFocus = ref('secret')
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Email</h3>
      <div class="ds-row ds-row--gap" style="align-items: flex-start">
        <div style="width: 240px">
          <p class="ds-label">Default</p>
          <InputField v-model="email" label="Email address" type="email" />
        </div>
        <div style="width: 240px">
          <p class="ds-label">Filled</p>
          <InputField v-model="emailFocus" label="Email address" type="email" />
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Email or Phone</h3>
      <div class="ds-row ds-row--gap" style="align-items: flex-start">
        <div style="width: 240px">
          <p class="ds-label">Default</p>
          <InputField v-model="emailPhone" label="Email or phone number" />
        </div>
        <div style="width: 240px">
          <p class="ds-label">Filled</p>
          <InputField v-model="emailPhoneFocus" label="Email or phone number" />
        </div>
        <div style="width: 240px">
          <p class="ds-label">Error</p>
          <InputField
            v-model="emailPhone"
            label="Email or phone number"
            error="Please enter a valid email or phone number."
          />
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Password</h3>
      <div class="ds-row ds-row--gap" style="align-items: flex-start">
        <div style="width: 240px">
          <p class="ds-label">Default</p>
          <InputField v-model="password" label="Password" type="password" />
        </div>
        <div style="width: 240px">
          <p class="ds-label">Filled</p>
          <InputField v-model="passwordFocus" label="Password" type="password" />
        </div>
        <div style="width: 240px">
          <p class="ds-label">Error</p>
          <InputField
            v-model="password"
            label="Password"
            type="password"
            error="Your password must contain between 4 and 60 characters."
          />
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Patterns</h3>
      <p class="ds-block__desc">Ready to watch? Enter your email to create or restart your membership.</p>
      <div style="display: flex; gap: 8px; max-width: 480px; margin-bottom: 32px">
        <InputField v-model="email" label="Email address" type="email" style="flex: 1" />
        <Button variant="brand" size="large">
          Get Started &rsaquo;
        </Button>
      </div>

      <div style="max-width: 300px; display: flex; flex-direction: column; gap: 16px">
        <InputField v-model="emailPhone" label="Email or phone number" />
        <InputField v-model="password" label="Password" type="password" />
        <Button variant="brand" size="large" block>Sign In</Button>
        <p style="text-align: center; color: var(--color-text-secondary); font-size: 13px">OR</p>
        <Button variant="secondary" size="large" block>Use a Sign-In Code</Button>
      </div>
    </div>

  </div>
</template>

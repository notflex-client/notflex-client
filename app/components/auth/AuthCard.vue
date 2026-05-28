<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="auth-card">
    <header class="auth-card__header">
      <h1 class="auth-card__title">
        {{ title }}
      </h1>
      <p v-if="description" class="auth-card__description">
        {{ description }}
      </p>
    </header>

    <div class="auth-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="auth-card__footer">
      <slot name="footer" />
    </footer>

    <p v-if="$slots.disclaimer" class="auth-card__disclaimer">
      <slot name="disclaimer" />
    </p>
  </div>
</template>

<style lang="scss">
@use "~/assets/scss/tools/token" as *;

.auth-card {
  width: min(440px, calc(100vw - 32px));
  background: linear-gradient(180deg, rgba(30, 30, 30, 0.92), rgba(15, 15, 15, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 40px 40px 32px;
  display: flex;
  flex-direction: column;
  gap: token("dm-20");
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);

  @media (max-width: 480px) {
    padding: 32px 24px 24px;
    border-radius: 12px;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
  }

  &__title {
    margin: 0;
    color: token("color-text-primary");
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    letter-spacing: -0.5px;
  }

  &__description {
    margin: 0;
    color: token("color-text-secondary");
    font-size: 14px;
    text-align: center;
    line-height: 1.5;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: token("dm-12");
    text-align: center;
    color: token("color-text-secondary");
    font-size: 14px;
  }

  &__disclaimer {
    margin: 0;
    color: token("grey-500");
    font-size: 11px;
    line-height: 1.4;
    text-align: center;

    a { color: token("color-text-secondary"); &:hover { text-decoration: underline; } }
  }

  // ── Utility classes used by auth pages via slot ─────────
  &__api-error {
    margin: 0;
    font-size: 13px;
    color: #e87c03;
    text-align: center;
  }

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
      background-color: rgba(255, 255, 255, 0.12);
    }

    span { font-size: 12px; letter-spacing: 2px; }
  }

  &__forgot {
    text-align: center;
    color: token("color-text-secondary");
    text-decoration: none;
    font-size: 14px;
    &:hover { color: token("color-text-primary"); }
  }

  &__link {
    color: token("color-text-primary");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  &__outline-btn {
    border: 1px solid token("color-action-brand") !important;
    color: token("color-text-primary") !important;

    &:hover { background: rgba(229, 9, 20, 0.08) !important; }
  }

  &__field-wrap {
    position: relative;
  }

  &__field-toggle {
    position: absolute;
    top: 18px;
    right: 16px;
    background: none;
    border: none;
    color: token("color-text-primary");
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    z-index: 2;
    &:hover { color: token("color-text-secondary"); }
  }

  &__success {
    margin: 0;
    text-align: center;
    color: #2ea043;
    font-size: 13px;
  }

  &__notice {
    margin: 0;
    text-align: center;
    color: token("color-text-secondary");
    font-size: 14px;
    line-height: 1.5;
  }

  &__email {
    color: token("color-text-primary");
    font-weight: 700;
  }
}
</style>

<script setup lang="ts">
const { $api } = useNuxtApp()

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })

const { data: subscriptionData } = await useAsyncData('billing-subscription', () =>
  $api<{ subscription: any | null; status: string }>('/subscription/me').catch(() => ({ subscription: null, status: 'free' }))
)
const { data: paymentsData } = await useAsyncData('billing-payments', () =>
  $api<any[]>('/payments').catch(() => [])
)

const subscription = computed(() => subscriptionData.value?.subscription ?? null)
const payments = computed(() => paymentsData.value ?? [])
</script>

<template>
  <main class="billing-page">
    <AppHeader sticky>
      <template #logo>
        <span class="billing-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <NuxtLink to="/browse" class="billing-page__nav-link">Trang chủ</NuxtLink>
        <NuxtLink to="/plans" class="billing-page__nav-link">Gói cước</NuxtLink>
      </template>
    </AppHeader>

    <section class="billing-page__content">
      <div>
        <span class="caption-2-regular billing-page__eyebrow">Billing</span>
        <h1 class="h1-bold">Tài khoản & thanh toán</h1>
      </div>

      <article class="billing-page__card">
        <div class="billing-page__row">
          <span>Gói hiện tại</span>
          <strong>{{ subscription?.plan?.name || 'Free' }}</strong>
        </div>
        <div class="billing-page__row">
          <span>Trạng thái</span>
          <strong>{{ subscription?.status || 'free' }}</strong>
        </div>
        <div class="billing-page__row">
          <span>Hạn dùng</span>
          <strong>{{ subscription?.end_date ? date.format(new Date(subscription.end_date)) : '—' }}</strong>
        </div>
        <Button variant="brand" @click="navigateTo('/plans')">Nâng cấp / gia hạn</Button>
      </article>

      <article class="billing-page__card">
        <h2 class="title-4-medium">Lịch sử thanh toán</h2>
        <div v-if="!payments.length" class="billing-page__empty">Chưa có giao dịch.</div>
        <div v-for="payment in payments" :key="payment.id" class="billing-page__payment">
          <div>
            <strong>{{ payment.subscription?.plan?.name || 'Subscription' }}</strong>
            <p>{{ payment.created_at ? date.format(new Date(payment.created_at)) : '' }}</p>
          </div>
          <div>
            <strong>{{ money.format(payment.amount || 0) }}</strong>
            <p>{{ payment.status }}</p>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.billing-page {
  min-height: 100vh;
  background: token("color-background-base");
  color: token("color-text-primary");

  &__logo {
    font-family: token("font-family-logo");
    font-size: 28px;
    color: token("color-action-brand");
    letter-spacing: 2px;
  }

  &__nav-link {
    color: token("color-text-secondary");
    text-decoration: none;
  }

  &__content {
    max-width: 980px;
    padding: 128px token("layout-margin") token("dm-64");
    display: flex;
    flex-direction: column;
    gap: token("dm-24");
  }

  &__eyebrow {
    color: token("color-action-brand");
    text-transform: uppercase;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
    padding: token("dm-24");
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.08);
  }

  &__row,
  &__payment {
    display: flex;
    justify-content: space-between;
    gap: token("dm-16");
  }

  &__row span,
  &__payment p,
  &__empty {
    color: token("color-text-secondary");
  }
}
</style>

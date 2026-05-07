<script setup lang="ts">
import type { SubscriptionPlan } from '~/components/subscription/PlanCard.vue'

const { $api } = useNuxtApp()
const authStore = useAuthStore()

const selectedPlan = ref<SubscriptionPlan | null>(null)
const checkoutOpen = ref(false)
const checkoutLoading = ref(false)

const { data: plansData, refresh: refreshPlans } = await useAsyncData('subscription-plans', () =>
  $api<SubscriptionPlan[]>('/subscription/plans').catch(() => [])
)
const { data: subscriptionData, refresh: refreshSubscription } = await useAsyncData('my-subscription', () =>
  $api<{ subscription: any | null; status: string }>('/subscription/me').catch(() => ({ subscription: null, status: 'free' }))
)

const plans = computed(() => plansData.value ?? [])
const activePlanId = computed(() => subscriptionData.value?.subscription?.plan_id ?? 0)

function openCheckout(plan: SubscriptionPlan) {
  selectedPlan.value = plan
  checkoutOpen.value = true
}

async function checkout(payload: { plan_id: number; payment_method: string }) {
  checkoutLoading.value = true
  try {
    await $api('/subscription/checkout', { method: 'POST', body: payload })
    const profile = await $api<any>('/auth/me')
    authStore.updateUser(profile)
    await Promise.all([refreshPlans(), refreshSubscription()])
    checkoutOpen.value = false
  } finally {
    checkoutLoading.value = false
  }
}
</script>

<template>
  <main class="plans-page">
    <AppHeader sticky>
      <template #logo>
        <span class="plans-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <NuxtLink to="/browse" class="plans-page__nav-link">Trang chủ</NuxtLink>
        <NuxtLink to="/billing" class="plans-page__nav-link">Thanh toán</NuxtLink>
      </template>
    </AppHeader>

    <section class="plans-page__hero">
      <span class="caption-2-regular plans-page__eyebrow">Subscription</span>
      <h1 class="h1-bold">Chọn gói xem phim premium</h1>
      <p class="body-regular">Mở khóa toàn bộ nội dung premium, lịch sử xem và gợi ý AI cá nhân hóa cho tài khoản Notflex của bạn.</p>
    </section>

    <section class="plans-page__list">
      <SubscriptionPlanCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        :active="plan.id === activePlanId"
        @select="openCheckout"
      />
    </section>

    <CheckoutModal
      :open="checkoutOpen"
      :plan="selectedPlan"
      :loading="checkoutLoading"
      @close="checkoutOpen = false"
      @checkout="checkout"
    />
  </main>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.plans-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(229, 9, 20, 0.24), transparent 34%), token("color-background-base");
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

  &__hero {
    max-width: 860px;
    padding: 128px token("layout-margin") token("dm-32");
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
  }

  &__eyebrow {
    color: token("color-action-brand");
    text-transform: uppercase;
  }

  &__hero p {
    color: token("color-text-secondary");
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: token("dm-20");
    padding: 0 token("layout-margin") token("dm-64");
  }
}
</style>

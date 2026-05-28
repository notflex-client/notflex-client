<script setup lang="ts">
import type { SubscriptionPlan } from '~/components/subscription/PlanCard.vue'

const { $api } = useNuxtApp()
const route = useRoute()

const checkoutLoading = ref(false)
const canceledMsg = ref('')

const { data: plansData } = await useAsyncData('subscription-plans', () =>
  $api<SubscriptionPlan[]>('/subscription/plans').catch(() => []),
)
const { data: subscriptionData } = await useAsyncData('my-subscription', () =>
  $api<{ subscription: any | null, status: string }>('/subscription/me').catch(() => ({ subscription: null, status: 'free' })),
)

const plans = computed(() => plansData.value ?? [])
const activePlanId = computed(() => subscriptionData.value?.subscription?.plan_id ?? 0)

onMounted(() => {
  if (route.query.status === 'canceled') {
    canceledMsg.value = 'Thanh toán đã bị hủy. Bạn có thể thử lại bất cứ lúc nào.'
  }
})

async function openCheckout(plan: SubscriptionPlan) {
  checkoutLoading.value = true
  canceledMsg.value = ''
  try {
    const res = await $api<{ url: string }>('/subscription/stripe-checkout', {
      method: 'POST',
      body: { plan_id: plan.id },
    })
    if (res.url) {
      window.location.href = res.url
    }
  } catch (err: any) {
    canceledMsg.value = err?.data?.message ?? 'Không thể tạo phiên thanh toán. Vui lòng thử lại.'
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

    <p v-if="canceledMsg" class="plans-page__notice">
      {{ canceledMsg }}
    </p>

    <section class="plans-page__list">
      <PlanCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        :active="plan.id === activePlanId"
        @select="openCheckout"
      />
    </section>
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

  &__notice {
    max-width: 860px;
    margin: 0 token("layout-margin") token("dm-16");
    padding: token("dm-12") token("dm-16");
    border-radius: 8px;
    background: rgba(232, 124, 3, 0.15);
    border: 1px solid rgba(232, 124, 3, 0.4);
    color: #e87c03;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: token("dm-20");
    padding: 0 token("layout-margin") token("dm-64");
  }
}
</style>

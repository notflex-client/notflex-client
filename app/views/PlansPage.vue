<script setup lang="ts">
import type { SubscriptionPlan } from '~/components/subscription/PlanCard.vue'

const { $api } = useNuxtApp()
const route = useRoute()

const fromSignup = computed(() => route.query.from === 'signup')
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

// Savings badge: prefer a percentage stated in the plan description, otherwise
// derive it by comparing the plan's per-day price against the shortest plan.
const savingsByPlanId = computed<Record<number, number>>(() => {
  const map: Record<number, number> = {}
  const list = plans.value
  const baseline = [...list]
    .filter(p => p.duration_days > 0)
    .sort((a, b) => a.duration_days - b.duration_days)[0]
  const basePerDay = baseline ? baseline.price / baseline.duration_days : 0

  for (const plan of list) {
    const fromDescription = plan.description?.match(/(\d+)\s*%/)?.[1]
    if (fromDescription) {
      map[plan.id] = Number(fromDescription)
      continue
    }
    if (basePerDay && baseline && plan.duration_days > baseline.duration_days) {
      const pct = Math.round((1 - (plan.price / plan.duration_days) / basePerDay) * 100)
      if (pct > 0) map[plan.id] = pct
    }
  }
  return map
})

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
    <SiteHeader v-if="!fromSignup" />

    <section class="plans-page__hero">
      <span v-if="!fromSignup" class="plans-page__crown">
        <Icon name="lucide:crown" />
      </span>
      <h1 class="h1-bold plans-page__title">
        <template v-if="fromSignup">Bước cuối cùng — chọn gói của bạn</template>
        <template v-else>Chọn gói xem phim <span class="plans-page__title-accent">premium</span></template>
      </h1>
      <p class="body-regular">
        {{ fromSignup
          ? 'Đăng ký gói để mở khóa toàn bộ nội dung premium không giới hạn. Có thể bỏ qua và xem miễn phí ngay bây giờ.'
          : 'Mở khóa toàn bộ nội dung premium, lịch sử xem và gợi ý AI cá nhân hóa cho tài khoản Notflex của bạn.'
        }}
      </p>
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
        :savings="savingsByPlanId[plan.id]"
        @select="openCheckout"
      />
    </section>

    <div v-if="fromSignup" class="plans-page__skip">
      <button class="plans-page__skip-btn" @click="navigateTo('/browse')">
        Quyết định sau
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.plans-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(229, 9, 20, 0.24), transparent 34%), token("color-background-base");
  color: token("color-text-primary");
  display: flex;
  flex-direction: column;
  align-items: center;

  &__hero {
    width: 100%;
    max-width: 860px;
    padding: token("dm-96") token("layout-margin") token("dm-112");
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: token("dm-16");
  }

  &__crown {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid rgba(229, 9, 20, 0.4);
    background: rgba(229, 9, 20, 0.08);
    color: token("color-action-brand");
    font-size: 26px;
  }

  &__title-accent {
    font-weight: var(--font-weight-regular);
    color: token("color-text-secondary");
  }

  &__hero p {
    max-width: 560px;
    color: token("color-text-secondary");
  }

  &__notice {
    width: 100%;
    max-width: 960px;
    margin-bottom: token("dm-16");
    padding: token("dm-12") token("dm-16");
    border-radius: 8px;
    background: rgba(232, 124, 3, 0.15);
    border: 1px solid rgba(232, 124, 3, 0.4);
    color: #e87c03;
    text-align: center;
  }

  &__list {
    width: 100%;
    max-width: 960px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: token("dm-20");
    padding: 0 token("layout-margin") token("dm-32");
  }

  &__skip {
    padding-bottom: token("dm-64");
  }

  &__skip-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: token("color-text-secondary");
    text-decoration: underline;
    text-underline-offset: 3px;
    font-size: 14px;
    padding: token("dm-8") token("dm-12");
    transition: color 0.15s ease;

    &:hover {
      color: token("color-text-primary");
    }
  }
}
</style>

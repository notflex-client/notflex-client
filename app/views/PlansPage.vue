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
    <AppHeader v-if="!fromSignup" sticky>
      <template #logo>
        <span class="plans-page__logo">NOTFLEX</span>
      </template>
      <template #navigation>
        <NuxtLink to="/browse" class="plans-page__nav-link">Trang chủ</NuxtLink>
        <NuxtLink to="/billing" class="plans-page__nav-link">Thanh toán</NuxtLink>
      </template>
    </AppHeader>

    <section class="plans-page__hero">
      
      <h1 class="h1-bold">
        {{ fromSignup ? 'Bước cuối cùng — chọn gói của bạn' : 'Chọn gói xem phim premium' }}
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
  justify-content: center;

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
    width: 100%;
    max-width: 860px;
    padding: token("dm-40") token("layout-margin") token("dm-40");
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: token("dm-16");
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

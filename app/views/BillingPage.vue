<script setup lang="ts">
const { $api } = useNuxtApp()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const { lang } = useLocale()

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })

const { data: subscriptionData, refresh: refreshSubscription } = await useAsyncData('billing-subscription', () =>
  $api<{ subscription: any | null, status: string }>('/subscription/me').catch(() => ({ subscription: null, status: 'free' })),
)
const { data: paymentsData, refresh: refreshPayments } = await useAsyncData('billing-payments', () =>
  $api<any[]>('/payments').catch(() => []),
)

const subscription = computed(() => subscriptionData.value?.subscription ?? null)
const payments = computed(() => paymentsData.value ?? [])

// ── Derived display values ───────────────────────────────
const isActive = computed(() => (subscription.value?.status ?? 'free') === 'active')
const planName = computed(() => subscription.value?.plan?.name || 'Free')
const planDesc = computed(() =>
  subscription.value?.plan?.description || t('billing.planDescDefault'),
)
const priceLabel = computed(() => money.format(subscription.value?.plan?.price ?? 0))
const cycleLabel = computed(() => ((subscription.value?.plan?.duration_days ?? 30) >= 365 ? t('billing.year') : t('billing.month')))
const endLabel = computed(() => (subscription.value?.end_date ? date.format(new Date(subscription.value.end_date)) : '—'))
const statusLabel = computed(() => (isActive.value ? t('billing.statusActive') : (subscription.value?.status || '—')))

const paymentSuccess = ref(false)

onMounted(async () => {
  if (route.query.status !== 'success') return

  const sessionId = route.query.session_id as string | undefined
  if (sessionId) {
    try {
      await $api('/subscription/stripe-verify', {
        method: 'POST',
        body: { session_id: sessionId },
      })
    } catch {}
  }

  paymentSuccess.value = true
  try {
    const profile = await $api<any>('/auth/me')
    authStore.updateUser(profile)
  } catch {}
  await Promise.all([refreshSubscription(), refreshPayments()])
  setTimeout(() => navigateTo('/billing', { replace: true }), 100)
})
</script>

<template>
  <main class="billing-page">
    <SiteHeader :transparent="false" />

    <section class="billing-page__content w-full mx-auto flex flex-col gap-24">

      <!-- ── Page header ─────────────────────────────────────── -->
      <header class="flex flex-col gap-8">
        <h1 class="h1-bold">{{ t('billing.title') }}</h1>
        <p class="body-regular text-secondary">{{ t('billing.subtitle') }}</p>
      </header>

      <!-- ── Success alert ───────────────────────────────────── -->
      <div v-if="paymentSuccess" class="bill-alert flex items-start gap-12">
        <Icon name="lucide:circle-check" class="bill-alert__icon" size="22" />
        <div class="flex flex-col gap-4 flex-1">
          <strong class="body-medium">{{ t('billing.successTitle') }}</strong>
          <span class="small-body-regular text-secondary">{{ t('billing.successDesc', { plan: planName }) }}</span>
        </div>
        <button class="bill-alert__close" :aria-label="t('action.close')" @click="paymentSuccess = false">
          <Icon name="lucide:x" size="18" />
        </button>
      </div>

      <!-- ── Two-column layout ───────────────────────────────── -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-24">

        <!-- LEFT — current plan -->
        <section class="bill-card md:col-span-2 flex flex-col gap-20">
          <span class="bill-eyebrow">{{ t('billing.planEyebrow') }}</span>

          <div class="flex items-center gap-16">
            <span class="bill-plan-icon">
              <Icon name="lucide:crown" size="26" />
            </span>
            <div class="flex items-center flex-wrap gap-12">
              <span class="title-2-bold">{{ planName }}</span>
              <span v-if="isActive" class="bill-badge bill-badge--plan">{{ t('billing.planBadge') }}</span>
            </div>
          </div>

          <p class="body-regular text-secondary">{{ planDesc }}</p>

          <div class="flex flex-col gap-12">
            <div class="bill-row flex items-center justify-between gap-16">
              <span class="bill-row__label flex items-center gap-8">
                <Icon name="lucide:activity" size="18" /> {{ t('billing.status') }}
              </span>
              <strong :class="isActive ? 'text-success' : 'text-secondary'">{{ statusLabel }}</strong>
            </div>
            <div class="bill-row flex items-center justify-between gap-16">
              <span class="bill-row__label flex items-center gap-8">
                <Icon name="lucide:calendar" size="18" /> {{ t('billing.endDate') }}
              </span>
              <strong>{{ endLabel }}</strong>
            </div>
            <div class="bill-row flex items-center justify-between gap-16">
              <span class="bill-row__label flex items-center gap-8">
                <Icon name="lucide:wallet" size="18" /> {{ t('billing.price') }}
              </span>
              <strong>{{ priceLabel }} <span class="text-secondary">/ {{ cycleLabel }}</span></strong>
            </div>
          </div>

          <Button variant="brand" size="large" :block="true" @click="navigateTo('/plans')">
            <template #leading-icon>
              <Icon name="lucide:crown" size="18" />
            </template>
            {{ t('billing.upgrade') }}
          </Button>

          <div class="bill-secure flex items-center gap-12">
            <Icon name="lucide:shield-check" size="20" class="bill-secure__icon" />
            <div class="flex flex-col gap-4">
              <strong class="small-body-medium">{{ t('billing.secureTitle') }}</strong>
              <span class="caption-1-regular text-secondary">{{ t('billing.secureDesc') }}</span>
            </div>
          </div>
        </section>

        <!-- RIGHT — payment method + history -->
        <div class="flex flex-col gap-24">

          <section class="bill-card flex flex-col gap-16">
            <span class="bill-eyebrow">{{ t('billing.paymentMethod') }}</span>
            <div class="flex items-center gap-12">
              <span class="bill-visa">VISA</span>
              <span class="body-regular flex-1">•••• •••• •••• 4242</span>
              <Icon name="lucide:circle-check" size="20" class="text-success" />
            </div>
            <button class="bill-link flex items-center justify-between gap-12">
              <span>{{ t('billing.managePayment') }}</span>
              <Icon name="lucide:chevron-right" size="18" />
            </button>
          </section>

          <section class="bill-card flex flex-col gap-16">
            <span class="bill-eyebrow">{{ t('billing.history') }}</span>

            <p v-if="!payments.length" class="body-regular text-secondary">{{ t('billing.noHistory') }}</p>

            <div
              v-for="payment in payments"
              :key="payment.id"
              class="bill-history flex items-center justify-between gap-12"
            >
              <div class="flex flex-col gap-4">
                <strong class="bill-history__name">{{ payment.subscription?.plan?.name || 'Subscription' }}</strong>
                <span class="caption-1-regular text-secondary">{{ payment.created_at ? date.format(new Date(payment.created_at)) : '' }}</span>
              </div>
              <div class="flex flex-col items-end gap-4">
                <strong>{{ money.format(payment.amount || 0) }}</strong>
                <span class="bill-badge bill-badge--success">{{ payment.status === 'success' ? t('billing.statusSuccess') : payment.status }}</span>
              </div>
            </div>

            <button v-if="payments.length" class="bill-link flex items-center justify-between gap-12">
              <span>{{ t('billing.viewAll') }}</span>
              <Icon name="lucide:chevron-right" size="18" />
            </button>
          </section>

        </div>
      </div>
    </section>

    <AppFooter v-model:lang="lang" variant="home" />
  </main>
</template>

<style scoped lang="scss">
.billing-page {
  min-height: 100vh;
  background: token("color-background-base");
  color: token("color-text-primary");

  // arbitrary container width — not expressible via the dm-scale utilities.
  // Top padding clears the sticky header (~68px) with a small gap.
  &__content {
    max-width: 1120px;
    padding: token("dm-80") token("dm-24") token("dm-64");
  }
}

// ── Eyebrow label ─────────────────────────────────────────
.bill-eyebrow {
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: token("color-text-secondary");
}

// ── Card surface ──────────────────────────────────────────
.bill-card {
  padding: token("dm-24");
  border-radius: 16px;
  background: token("color-background-surface");
  border: 1px solid token("color-border-subtle");
}

// ── Success alert ─────────────────────────────────────────
.bill-alert {
  padding: token("dm-16") token("dm-20");
  border-radius: 12px;
  background: token("color-status-success-surface");
  border: 1px solid rgba(70, 211, 105, 0.35);

  &__icon { color: token("color-status-success"); flex-shrink: 0; margin-top: 2px; }

  &__close {
    background: none;
    border: none;
    color: token("color-text-secondary");
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    &:hover { color: token("color-text-primary"); }
  }
}

// ── Plan icon (gradient crown) ────────────────────────────
.bill-plan-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, #7b2ff7, #b14bff);
}

// ── Detail rows ───────────────────────────────────────────
.bill-row {
  padding: token("dm-12") 0;
  border-bottom: 1px solid token("color-border-subtle");
  &:last-child { border-bottom: none; }

  &__label { color: token("color-text-secondary"); }
}

// ── Secure footer ─────────────────────────────────────────
.bill-secure {
  padding-top: token("dm-16");
  border-top: 1px solid token("color-border-subtle");
  &__icon { color: token("color-status-success"); flex-shrink: 0; }
}

// ── VISA chip ─────────────────────────────────────────────
.bill-visa {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #fff;
  color: #1a1f71;
  font-weight: 800;
  font-style: italic;
  font-size: 13px;
  letter-spacing: 0.5px;
}

// ── Link row button ───────────────────────────────────────
.bill-link {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: token("dm-12") 0 0;
  margin-top: token("dm-4");
  border-top: 1px solid token("color-border-subtle");
  color: token("color-text-primary");
  font-size: 14px;
  &:hover { color: token("color-action-brand"); }
}

// ── Payment history ───────────────────────────────────────
.bill-history {
  &__name { color: #b388ff; }
}

// ── Badges ────────────────────────────────────────────────
.bill-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  line-height: 1.4;

  &--plan {
    background: rgba(123, 47, 247, 0.18);
    color: #c79bff;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  &--success {
    background: token("color-status-success-surface");
    color: token("color-status-success");
  }
}
</style>

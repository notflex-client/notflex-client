<script setup lang="ts">
const props = defineProps<{
  subscription: any | null
  subStatus: string
  statusLabel: string
  statusClass: string
  payments: any[]
}>()

const { t } = useI18n()

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const dateFmt = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })

function durationLabel(days: number) {
  if (days >= 365) return `${Math.round(days / 365)} ${t('account.subscription.year')}`
  if (days >= 30) return `${Math.round(days / 30)} ${t('account.subscription.month')}`
  return `${days} ${t('account.subscription.day')}`
}
</script>

<template>
  <div class="account-membership">
    <h2 class="h2-bold">{{ t('account.menu.membership') }}</h2>

    <!-- Subscription details -->
    <article class="account-membership__card">
      <div class="account-membership__card-header">
        <h3 class="title-4-medium">{{ t('account.subscription.title') }}</h3>
        <span class="account-membership__badge" :class="statusClass">{{ statusLabel }}</span>
      </div>

      <template v-if="subscription">
        <div class="account-membership__row">
          <span class="account-membership__muted">{{ t('account.subscription.plan') }}</span>
          <strong>{{ subscription.plan?.name ?? '—' }}</strong>
        </div>
        <div class="account-membership__row">
          <span class="account-membership__muted">{{ t('account.subscription.price') }}</span>
          <strong>{{ subscription.plan?.price ? money.format(subscription.plan.price) : '—' }}</strong>
        </div>
        <div class="account-membership__row">
          <span class="account-membership__muted">{{ t('account.subscription.cycle') }}</span>
          <strong>{{ subscription.plan?.duration_days ? durationLabel(subscription.plan.duration_days) : '—' }}</strong>
        </div>
        <div class="account-membership__row">
          <span class="account-membership__muted">{{ t('account.subscription.period') }}</span>
          <strong>
            {{ subscription.start_date ? dateFmt.format(new Date(subscription.start_date)) : '—' }}
            –
            {{ subscription.end_date ? dateFmt.format(new Date(subscription.end_date)) : '—' }}
          </strong>
        </div>
        <Button variant="ghost" size="large" @click="navigateTo('/plans')">
          {{ t('account.subscription.upgrade') }}
        </Button>
      </template>

      <template v-else>
        <p class="body-regular account-membership__muted">{{ t('account.subscription.noSub') }}</p>
        <Button variant="brand" size="large" @click="navigateTo('/plans')">
          {{ t('account.subscription.choosePlan') }}
        </Button>
      </template>
    </article>

    <!-- Payment history -->
    <article class="account-membership__card">
      <h3 class="title-4-medium">{{ t('account.payments.title') }}</h3>

      <div v-if="!payments.length" class="body-regular account-membership__muted">
        {{ t('account.payments.empty') }}
      </div>

      <div v-for="payment in payments" :key="payment.id" class="account-membership__payment">
        <div>
          <strong>{{ payment.subscription?.plan?.name || 'Subscription' }}</strong>
          <p class="small-body-regular account-membership__muted">
            {{ payment.created_at ? dateFmt.format(new Date(payment.created_at)) : '' }}
          </p>
        </div>
        <div class="account-membership__payment-right">
          <strong>{{ money.format(payment.amount || 0) }}</strong>
          <span class="small-body-regular account-membership__muted">{{ payment.status }}</span>
        </div>
      </div>

      <NuxtLink v-if="payments.length" to="/billing" class="account-membership__view-all body-regular">
        {{ t('account.payments.viewAll') }} &rarr;
      </NuxtLink>
    </article>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.account-membership {
  display: flex;
  flex-direction: column;
  gap: token("dm-24");

  &__card {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
    padding: token("dm-24");
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
  }

  &__card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-12");
  }

  &__badge {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &.is-active { background: rgba(70, 211, 105, 0.18); color: #46d369; }
    &.is-free { background: rgba(255, 255, 255, 0.12); color: token("color-text-secondary"); }
    &.is-cancelled { background: rgba(229, 9, 20, 0.18); color: #e50914; }
  }

  &__row {
    display: flex;
    justify-content: space-between;
    gap: token("dm-16");
  }

  &__muted { color: token("color-text-secondary"); }

  &__payment {
    display: flex;
    justify-content: space-between;
    gap: token("dm-16");
  }

  &__payment-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  &__view-all {
    color: token("color-action-brand");
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}
</style>

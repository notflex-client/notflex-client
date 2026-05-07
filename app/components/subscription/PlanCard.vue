<script setup lang="ts">
export interface SubscriptionPlan {
  id: number
  name: string
  price: number
  duration_days: number
  description?: string | null
}

const props = defineProps<{
  plan: SubscriptionPlan
  active?: boolean
}>()

const emit = defineEmits<{
  select: [plan: SubscriptionPlan]
}>()

const priceLabel = computed(() =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(props.plan.price)
)

const cycleLabel = computed(() => props.plan.duration_days >= 365 ? 'năm' : 'tháng')
</script>

<template>
  <article class="plan-card" :class="{ 'is-active': active }">
    <div class="plan-card__header">
      <span class="title-4-medium">{{ plan.name }}</span>
      <span v-if="active" class="caption-2-regular plan-card__current">Đang dùng</span>
    </div>

    <div class="plan-card__price">
      <span class="h1-bold">{{ priceLabel }}</span>
      <span class="body-regular">/{{ cycleLabel }}</span>
    </div>

    <p class="body-regular plan-card__description">
      {{ plan.description || 'Xem phim premium không giới hạn, hỗ trợ profile và gợi ý AI cá nhân hóa.' }}
    </p>

    <ul class="plan-card__features">
      <li>Không giới hạn phim premium</li>
      <li>Lưu lịch sử xem và tiếp tục xem</li>
      <li>Gợi ý AI theo sở thích</li>
    </ul>

    <Button :variant="active ? 'secondary' : 'brand'" block :disabled="active" @click="emit('select', plan)">
      {{ active ? 'Gói hiện tại' : 'Chọn gói' }}
    </Button>
  </article>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.plan-card {
  display: flex;
  flex-direction: column;
  gap: token("dm-16");
  padding: token("dm-24");
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(36, 36, 36, 0.96), rgba(16, 16, 16, 0.96));

  &.is-active {
    border-color: token("color-action-brand");
  }

  &__header,
  &__price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-12");
  }

  &__current {
    color: token("color-action-brand");
  }

  &__description {
    color: token("color-text-secondary");
    min-height: 48px;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
    color: token("color-text-secondary");
    padding-left: token("dm-20");
    flex: 1;
  }
}
</style>

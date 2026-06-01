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
  savings?: number
}>()

const emit = defineEmits<{
  select: [plan: SubscriptionPlan]
}>()

const priceLabel = computed(() =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(props.plan.price)
)

const cycleLabel = computed(() => props.plan.duration_days >= 365 ? 'năm' : 'tháng')

const features = computed(() => [
  { icon: props.active ? 'lucide:gem' : 'lucide:play-circle', label: 'Không giới hạn phim premium' },
  { icon: 'lucide:history', label: 'Lưu lịch sử xem và tiếp tục xem' },
  { icon: 'lucide:sparkles', label: 'Gợi ý AI theo sở thích' },
])
</script>

<template>
  <article class="plan-card" :class="{ 'is-active': active }">
    <div class="plan-card__header">
      <span class="title-4-medium plan-card__name">{{ plan.name }}</span>
      <span v-if="active" class="plan-card__badge plan-card__badge--current">
        <Icon name="lucide:star" class="plan-card__badge-icon" />
        Đang dùng
      </span>
      <span v-else-if="savings" class="plan-card__badge plan-card__badge--save">
        Tiết kiệm {{ savings }}%
      </span>
    </div>

    <div class="plan-card__price">
      <span class="h1-bold">{{ priceLabel }}</span>
      <span class="body-regular">/{{ cycleLabel }}</span>
    </div>

    <p class="body-regular plan-card__description">
      {{ plan.description || 'Xem phim premium không giới hạn, hỗ trợ profile và gợi ý AI cá nhân hóa.' }}
    </p>

    <ul class="plan-card__features">
      <li v-for="feature in features" :key="feature.label">
        <Icon :name="feature.icon" class="plan-card__feature-icon" />
        <span>{{ feature.label }}</span>
      </li>
    </ul>

    <Button :variant="active ? 'secondary' : 'brand'" block :disabled="active" @click="emit('select', plan)">
      <template v-if="active" #leading-icon>
        <Icon name="lucide:lock" />
      </template>
      {{ active ? 'Gói hiện tại' : 'Chọn gói' }}
    </Button>
  </article>
</template>

<style scoped lang="scss">
.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: token("dm-16");
  padding: token("dm-24");
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(36, 36, 36, 0.96), rgba(16, 16, 16, 0.96));

  &.is-active {
    border-color: token("color-action-brand");
    box-shadow: 0 0 0 1px token("color-action-brand"), 0 -12px 48px -14px rgba(229, 9, 20, 0.65);
  }

  &.is-active::before {
    content: "";
    position: absolute;
    top: -1px;
    left: token("dm-24");
    right: token("dm-24");
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, token("color-action-brand"), transparent);
    filter: blur(0.5px);
  }

  &__header,
  &__price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-12");
  }

  &__name {
    font-weight: var(--font-weight-bold);
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
  }

  &__badge-icon {
    width: 13px;
    height: 13px;
  }

  &__badge--save {
    color: token("color-action-brand");
    background: rgba(229, 9, 20, 0.14);
  }

  &__badge--current {
    color: token("color-action-brand");
    border: 1px solid rgba(229, 9, 20, 0.5);
    background: rgba(229, 9, 20, 0.08);
  }

  &__description {
    color: token("color-text-secondary");
    min-height: 48px;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: token("dm-12");
    color: token("color-text-secondary");
    padding-left: 0;
    list-style: none;
    flex: 1;
  }

  &__features li {
    display: flex;
    align-items: center;
    gap: token("dm-12");
  }

  &__feature-icon {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    color: token("color-text-secondary");
  }

  &.is-active &__feature-icon {
    color: token("color-action-brand");
  }
}
</style>

<script setup lang="ts">
import type { SubscriptionPlan } from './PlanCard.vue'

const props = defineProps<{
  open: boolean
  plan: SubscriptionPlan | null
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  checkout: [payload: { plan_id: number; payment_method: string }]
}>()

const paymentMethod = ref('mock-card')
const cardNumber = ref('4242 4242 4242 4242')
const cardName = ref('Notflex Subscriber')

const priceLabel = computed(() =>
  props.plan ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(props.plan.price) : ''
)

function checkout() {
  if (!props.plan) return
  emit('checkout', { plan_id: props.plan.id, payment_method: paymentMethod.value })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="checkout-fade">
      <div v-if="open && plan" class="checkout-modal">
        <div class="checkout-modal__backdrop" @click="emit('close')" />
        <section class="checkout-modal__panel">
          <button class="checkout-modal__close" type="button" @click="emit('close')">×</button>
          <div>
            <span class="caption-2-regular checkout-modal__eyebrow">Thanh toán mock</span>
            <h2 class="h1-bold">Đăng ký {{ plan.name }}</h2>
            <p class="body-regular checkout-modal__muted">Luồng này mô phỏng thanh toán để phục vụ demo đồ án.</p>
          </div>

          <div class="checkout-modal__grid">
            <label class="checkout-modal__field">
              <span>Phương thức</span>
              <select v-model="paymentMethod">
                <option value="mock-card">Thẻ nội địa demo</option>
                <option value="mock-momo">MoMo demo</option>
                <option value="mock-vnpay">VNPay demo</option>
              </select>
            </label>
            <label class="checkout-modal__field">
              <span>Số thẻ</span>
              <input v-model="cardNumber" />
            </label>
            <label class="checkout-modal__field checkout-modal__field--full">
              <span>Tên chủ thẻ</span>
              <input v-model="cardName" />
            </label>
          </div>

          <div class="checkout-modal__summary">
            <span>{{ plan.name }}</span>
            <strong>{{ priceLabel }}</strong>
          </div>

          <Button block :disabled="loading" @click="checkout">
            {{ loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký' }}
          </Button>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.checkout-modal {
  position: fixed;
  inset: 0;
  z-index: 10000;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
  }

  &__panel {
    position: relative;
    width: min(720px, calc(100vw - 32px));
    margin: 8vh auto;
    display: flex;
    flex-direction: column;
    gap: token("dm-24");
    padding: token("dm-32");
    border-radius: 20px;
    background: token("color-background-base");
    color: token("color-text-primary");
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 20px;
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 28px;
    cursor: pointer;
  }

  &__eyebrow {
    color: token("color-action-brand");
    text-transform: uppercase;
  }

  &__muted {
    color: token("color-text-secondary");
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: token("dm-16");
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
    color: token("color-text-secondary");

    &--full {
      grid-column: 1 / -1;
    }

    input,
    select {
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.08);
      color: token("color-text-primary");
    }
  }

  &__summary {
    display: flex;
    justify-content: space-between;
    padding: token("dm-16");
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>

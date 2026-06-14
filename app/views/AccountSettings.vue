<script setup lang="ts">
import type { AuthUser } from '~/stores/auth'

type Section = 'profile' | 'profiles' | 'security' | 'billing'

const { t } = useI18n()
const { lang } = useLocale()
const { $api } = useNuxtApp()
const route = useRoute()
const authStore = useAuthStore()
const { errorMsg: profileError, formErrors: profileFieldErrors, setErrors: setProfileErrors, clearErrors: clearProfileErrors } = useResponseError()
const { errorMsg: passwordError, formErrors: passwordFieldErrors, setErrors: setPasswordErrors, clearErrors: clearPasswordErrors } = useResponseError()
const vd = useValidators()

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })

// ── Active section (sidebar) ──────────────────────────────
const section = ref<Section>(
  route.path === '/billing' || route.query.section === 'billing'
    ? 'billing'
    : route.query.section === 'security'
      ? 'security'
      : route.query.section === 'profiles'
        ? 'profiles'
        : 'profile',
)

const NAV = [
  { key: 'profile' as Section, label: 'account.navProfile', icon: 'lucide:user' },
  { key: 'profiles' as Section, label: 'account.navProfiles', icon: 'lucide:users' },
  { key: 'security' as Section, label: 'account.navSecurity', icon: 'lucide:shield' },
  { key: 'billing' as Section, label: 'account.navBilling', icon: 'lucide:credit-card' },
]

const userName = computed(() => authStore.user?.full_name || 'Bạn')
const userEmail = computed(() => authStore.user?.email || '')
const userInitial = computed(() => userName.value.trim().charAt(0).toUpperCase() || 'U')

// ── Profile ───────────────────────────────────────────────
const fullName = ref(authStore.user?.full_name ?? '')
const avatarUrl = ref(authStore.user?.avatar_url ?? '')
const profileLoading = ref(false)
const profileSaved = ref(false)

async function saveProfile() {
  profileSaved.value = false
  clearProfileErrors()
  if (vd.required(fullName.value)) {
    setProfileErrors({ details: { full_name: vd.required(fullName.value) } })
    return
  }
  profileLoading.value = true
  try {
    const data = await $api<AuthUser>('/auth/me', {
      method: 'PUT',
      body: { full_name: fullName.value, avatar_url: avatarUrl.value || null },
    })
    authStore.updateUser(data)
    profileSaved.value = true
  } catch (err: any) {
    setProfileErrors(err.data ?? err)
  } finally {
    profileLoading.value = false
  }
}

// ── Security (password) ───────────────────────────────────
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordLoading = ref(false)
const passwordSaved = ref(false)

async function savePassword() {
  passwordSaved.value = false
  clearPasswordErrors()
  const errs: Record<string, string> = {}
  if (vd.required(currentPassword.value)) errs.currentPassword = vd.required(currentPassword.value)
  const strong = vd.passwordStrong(newPassword.value)
  if (strong) errs.newPassword = strong
  if (newPassword.value !== confirmPassword.value) errs.confirmPassword = t('account.errorMismatch')
  if (Object.keys(errs).length) {
    setPasswordErrors({ details: errs })
    return
  }
  passwordLoading.value = true
  try {
    await $api('/auth/change-password', {
      method: 'POST',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    })
    passwordSaved.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    setPasswordErrors(err.data ?? err)
  } finally {
    passwordLoading.value = false
  }
}

// ── Billing ───────────────────────────────────────────────
const { data: subscriptionData, refresh: refreshSubscription } = await useAsyncData('account-subscription', () =>
  $api<{ subscription: any | null, status: string }>('/subscription/me').catch(() => ({ subscription: null, status: 'free' })),
)
const { data: paymentsData, refresh: refreshPayments } = await useAsyncData('account-payments', () =>
  $api<any[]>('/payments').catch(() => []),
)

const subscription = computed(() => subscriptionData.value?.subscription ?? null)
const payments = computed(() => paymentsData.value ?? [])

const isActive = computed(() => (subscription.value?.status ?? 'free') === 'active')
const planName = computed(() => subscription.value?.plan?.name || 'Free')
const planDesc = computed(() => subscription.value?.plan?.description || t('billing.planDescDefault'))
const priceLabel = computed(() => money.format(subscription.value?.plan?.price ?? 0))
const cycleLabel = computed(() => ((subscription.value?.plan?.duration_days ?? 30) >= 365 ? t('billing.year') : t('billing.month')))
const endLabel = computed(() => (subscription.value?.end_date ? date.format(new Date(subscription.value.end_date)) : '—'))
const statusLabel = computed(() => (isActive.value ? t('billing.statusActive') : (subscription.value?.status || '—')))
const paymentSuccess = ref(false)

onMounted(async () => {
  if (route.query.status !== 'success') return

  section.value = 'billing'
  const sessionId = route.query.session_id as string | undefined
  if (sessionId) {
    try {
      await $api('/subscription/stripe-verify', { method: 'POST', body: { session_id: sessionId } })
    } catch {}
  }

  paymentSuccess.value = true
  try {
    const profile = await $api<any>('/auth/me')
    authStore.updateUser(profile)
  } catch {}
  await Promise.all([refreshSubscription(), refreshPayments()])
  setTimeout(() => navigateTo('/account', { replace: true }), 100)
})
</script>

<template>
  <main class="account-page">
    <SiteHeader :transparent="false" />

    <section class="account-page__content w-full mx-auto flex flex-col gap-24">

      <!-- ── Page header ─────────────────────────────────────── -->
      <header class="flex flex-col gap-8">
        <h1 class="h1-bold">{{ t('account.title') }}</h1>
        <p class="body-regular text-secondary">{{ t('account.subtitle') }}</p>
      </header>

      <!-- ── Sidebar + content ───────────────────────────────── -->
      <div class="flex flex-col md:flex-row gap-24">

        <!-- SIDEBAR -->
        <aside class="account-sidebar w-full md:w-[280px] shrink-0 flex flex-col gap-20">
          <div class="account-sidebar__user flex items-center gap-12">
            <span class="account-sidebar__avatar">{{ userInitial }}</span>
            <div class="flex flex-col gap-4 min-w-0">
              <strong class="small-body-medium">{{ userName }}</strong>
              <span class="caption-1-regular text-secondary account-sidebar__email">{{ userEmail }}</span>
            </div>
          </div>

          <nav class="flex flex-col gap-4">
            <button
              v-for="item in NAV"
              :key="item.key"
              type="button"
              class="account-nav__item flex items-center gap-12"
              :class="{ 'is-active': section === item.key }"
              @click="section = item.key"
            >
              <Icon :name="item.icon" size="18" />
              <span>{{ t(item.label) }}</span>
            </button>
          </nav>
        </aside>

        <!-- MAIN -->
        <div class="flex-1 min-w-0 flex flex-col gap-24">

          <!-- ───────── HỒ SƠ ───────── -->
          <article v-if="section === 'profile'" class="account-card flex flex-col gap-16">
            <div class="flex flex-col gap-4">
              <h2 class="title-3-medium">{{ t('account.profileTitle') }}</h2>
              <p class="body-regular text-secondary">{{ t('account.profileDesc') }}</p>
            </div>
            <InputField v-model="fullName" :label="t('account.fullNameLabel')" :error="profileFieldErrors.full_name" />
            <p v-if="profileError" class="account-card__api-error">{{ profileError }}</p>
            <p v-if="profileSaved" class="account-card__api-success">{{ t('account.savedProfile') }}</p>
            <Button variant="brand" size="large" :block="true" :disabled="profileLoading" @click="saveProfile">
              {{ profileLoading ? t('account.saving') : t('account.save') }}
            </Button>
          </article>

          <!-- ───────── HỒ SƠ XEM (multi-profile) ───────── -->
          <ProfilesManager v-else-if="section === 'profiles'" />

          <!-- ───────── BẢO MẬT ───────── -->
          <article v-else-if="section === 'security'" class="account-card flex flex-col gap-16">
            <div class="flex flex-col gap-4">
              <h2 class="title-3-medium">{{ t('account.passwordTitle') }}</h2>
              <p class="body-regular text-secondary">{{ t('account.passwordDesc') }}</p>
            </div>
            <InputField v-model="currentPassword" :label="t('account.currentPasswordLabel')" type="password" autocomplete="current-password" :error="passwordFieldErrors.currentPassword" />
            <InputField v-model="newPassword" :label="t('account.newPasswordLabel')" type="password" autocomplete="new-password" :error="passwordFieldErrors.newPassword" />
            <InputField v-model="confirmPassword" :label="t('account.confirmPasswordLabel')" type="password" autocomplete="new-password" :error="passwordFieldErrors.confirmPassword" />
            <p v-if="passwordError" class="account-card__api-error">{{ passwordError }}</p>
            <p v-if="passwordSaved" class="account-card__api-success">{{ t('account.savedPassword') }}</p>
            <Button variant="brand" size="large" :block="true" :disabled="passwordLoading" @click="savePassword">
              {{ passwordLoading ? t('account.saving') : t('account.changePassword') }}
            </Button>
          </article>

          <!-- ───────── BILLING ───────── -->
          <template v-else>
            <!-- success alert -->
            <div v-if="paymentSuccess" class="bill-alert flex items-start gap-12">
              <Icon name="lucide:circle-check" class="bill-alert__icon" size="22" />
              <div class="flex flex-col gap-4 flex-1">
                <strong class="body-medium">{{ t('billing.successTitle') }}</strong>
                <span class="small-body-regular text-secondary">{{ t('billing.successDesc', { plan: planName }) }}</span>
              </div>
              <button type="button" class="bill-alert__close" :aria-label="t('action.close')" @click="paymentSuccess = false">
                <Icon name="lucide:x" size="18" />
              </button>
            </div>

            <!-- plan card -->
            <section class="account-card account-card--plan flex flex-col gap-20">
              <span class="bill-eyebrow">{{ t('billing.planEyebrow') }}</span>

              <div class="flex items-center gap-16">
                <span class="bill-plan-icon"><Icon name="lucide:crown" size="26" /></span>
                <div class="flex items-center flex-wrap gap-12">
                  <span class="title-2-bold">{{ planName }}</span>
                  <span v-if="isActive" class="bill-badge bill-badge--plan">{{ t('billing.planBadge') }}</span>
                </div>
              </div>

              <p class="body-regular text-secondary">{{ planDesc }}</p>

              <div class="flex flex-col gap-12">
                <div class="bill-row flex items-center justify-between gap-16">
                  <span class="bill-row__label flex items-center gap-8"><Icon name="lucide:activity" size="18" /> {{ t('billing.status') }}</span>
                  <strong :class="isActive ? 'text-success' : 'text-secondary'">{{ statusLabel }}</strong>
                </div>
                <div class="bill-row flex items-center justify-between gap-16">
                  <span class="bill-row__label flex items-center gap-8"><Icon name="lucide:calendar" size="18" /> {{ t('billing.endDate') }}</span>
                  <strong>{{ endLabel }}</strong>
                </div>
                <div class="bill-row flex items-center justify-between gap-16">
                  <span class="bill-row__label flex items-center gap-8"><Icon name="lucide:wallet" size="18" /> {{ t('billing.price') }}</span>
                  <strong>{{ priceLabel }} <span class="text-secondary">/ {{ cycleLabel }}</span></strong>
                </div>
              </div>

              <Button variant="brand" size="large" :block="true" @click="navigateTo('/plans')">
                <template #leading-icon><Icon name="lucide:crown" size="18" /></template>
                {{ t('billing.upgrade') }}
              </Button>
            </section>

            <!-- secure payment + saved card -->
            <section class="account-card flex flex-col md:flex-row md:items-center justify-between gap-16">
              <div class="flex items-center gap-12">
                <Icon name="lucide:shield-check" size="22" class="bill-secure__icon" />
                <div class="flex flex-col gap-4">
                  <strong class="small-body-medium">{{ t('billing.secureTitle') }}</strong>
                  <span class="caption-1-regular text-secondary">{{ t('billing.secureDesc') }}</span>
                </div>
              </div>
              <button type="button" class="bill-pm flex items-center gap-12" :aria-label="t('billing.managePayment')">
                <span class="bill-visa">VISA</span>
                <span class="body-regular">•••• •••• •••• 4242</span>
                <Icon name="lucide:chevron-right" size="18" />
              </button>
            </section>

            <!-- history -->
            <section class="account-card flex flex-col gap-16">
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
              <button v-if="payments.length" type="button" class="bill-link flex items-center justify-between gap-12">
                <span>{{ t('billing.viewAll') }}</span>
                <Icon name="lucide:chevron-right" size="18" />
              </button>
            </section>
          </template>

        </div>
      </div>
    </section>

    <AppFooter v-model:lang="lang" variant="home" />
  </main>
</template>

<style lang="scss" scoped>
.account-page {
  min-height: 100vh;
  background: token("color-background-base");
  color: token("color-text-primary");
  overflow-x: clip; // chặn tràn ngang (clip không phá position:sticky của header)

  // arbitrary container width — not expressible via the dm-scale utilities.
  &__content {
    max-width: 1120px;
    padding: token("dm-32") token("dm-24") token("dm-64");

    h1 { font-size: 30px; line-height: 1.25; margin: 0; }
  }
}

// ── Sidebar ───────────────────────────────────────────────
.account-sidebar {
  &__user {
    padding-bottom: token("dm-16");
    border-bottom: 1px solid token("color-border-subtle");
  }

  &__avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #e50914, #b1060f);
    color: #fff;
    font-weight: 700;
    font-size: 18px;
  }

  &__email { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}

.account-nav__item {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: token("dm-12") token("dm-16");
  border-radius: 10px;
  color: token("color-text-secondary");
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover { background: token("color-background-highlight"); color: token("color-text-primary"); }

  &.is-active {
    background: token("color-background-elevated");
    color: token("color-text-primary");
    font-weight: var(--font-weight-medium);
  }
}

// ── Card surface (shared by all sections) ─────────────────
.account-card {
  padding: token("dm-24");
  border-radius: 16px;
  background: token("color-background-surface");
  border: 1px solid token("color-border-subtle");

  // Highlighted plan card — red glow + top accent streak
  &--plan {
    position: relative;
    overflow: hidden;
    border-color: rgba(229, 9, 20, 0.45);
    box-shadow: 0 0 0 1px rgba(229, 9, 20, 0.16), 0 20px 55px -24px rgba(229, 9, 20, 0.55);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 28%;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 70, 70, 0.95) 75%, transparent);
    }
  }

  &__api-error   { margin: 0; color: #e87c03; }
  &__api-success { margin: 0; color: token("color-status-success"); }
}

// ── Billing visuals ───────────────────────────────────────
.bill-eyebrow {
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: token("color-text-secondary");
}

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

.bill-row {
  padding: token("dm-12") 0;
  border-bottom: 1px solid token("color-border-subtle");
  &:last-child { border-bottom: none; }
  &__label { color: token("color-text-secondary"); }
}

.bill-secure__icon { color: token("color-text-secondary"); flex-shrink: 0; }

.bill-pm {
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  color: token("color-text-primary");
  &:hover { color: token("color-action-brand"); }
}

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

.bill-history__name { color: #b388ff; }

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

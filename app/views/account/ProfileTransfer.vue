<script setup lang="ts">
const { t } = useI18n()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { lang } = useLocale()

type Step = 'select' | 'confirm' | 'email' | 'success'

const step = ref<Step>('select')
const selectedProfile = ref<{ id: string; name: string; image?: string | null } | null>(null)
const targetEmail = ref('')
const loading = ref(false)
const error = ref('')

const profiles = computed(() => {
  if (authStore.profiles.length) return authStore.profiles
  if (authStore.user) return [{ id: authStore.user.id, name: authStore.user.full_name, image: authStore.user.avatar_url ?? '' }]
  return []
})

function selectProfile(profile: { id: string; name: string; image?: string | null }) {
  selectedProfile.value = profile
  step.value = 'confirm'
}

function switchProfile() {
  selectedProfile.value = null
  step.value = 'select'
}

function startTransfer() {
  step.value = 'email'
}

async function confirmTransfer() {
  if (!targetEmail.value.trim() || !selectedProfile.value) return

  loading.value = true
  error.value = ''

  try {
    await $api('/profile/transfer', {
      method: 'POST',
      body: {
        profileId: selectedProfile.value.id,
        targetEmail: targetEmail.value.trim(),
      },
    })
    step.value = 'success'
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || t('signup.errorGeneric')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="transfer-page">
    <AppHeader sticky>
      <template #logo>
        <NuxtLink to="/account" class="transfer-page__back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="body-regular">{{ t('account.back') }}</span>
        </NuxtLink>
      </template>
    </AppHeader>

    <div class="transfer-page__container">

      <!-- Step: Select profile -->
      <div v-if="step === 'select'" class="transfer-page__card">
        <h1 class="h2-bold">{{ t('account.transfer.step1') }}</h1>
        <p class="body-regular transfer-page__muted">{{ t('account.profiles.transferDesc') }}</p>

        <div class="transfer-page__profile-list">
          <button
            v-for="profile in profiles"
            :key="profile.id"
            class="transfer-page__profile-item"
            @click="selectProfile(profile)"
          >
            <div class="transfer-page__avatar">
              <img v-if="profile.image" :src="profile.image" class="transfer-page__avatar-img" alt="" />
              <span v-else class="transfer-page__avatar-placeholder">
                {{ profile.name?.charAt(0)?.toUpperCase() ?? '?' }}
              </span>
            </div>
            <span class="body-regular">{{ profile.name }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="transfer-page__chevron" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Step: Confirm (Netflix-style info page) -->
      <div v-else-if="step === 'confirm'" class="transfer-page__card transfer-page__card-center">
        <h1 class="h2-bold">{{ t('account.transfer.title') }}</h1>

        <!-- Selected profile -->
        <div class="transfer-page__selected-profile">
          <div class="transfer-page__avatar transfer-page__avatar-lg">
            <img v-if="selectedProfile?.image" :src="selectedProfile.image" class="transfer-page__avatar-img" alt="" />
            <span v-else class="transfer-page__avatar-placeholder">
              {{ selectedProfile?.name?.charAt(0)?.toUpperCase() ?? '?' }}
            </span>
          </div>
          <span class="title-3-medium">{{ selectedProfile?.name }}</span>
        </div>

        <button class="transfer-page__text-link body-regular" @click="switchProfile">
          {{ t('account.transfer.switchProfile') }}
        </button>

        <Button variant="brand" size="large" class="transfer-page__full-btn" @click="startTransfer">
          {{ t('account.transfer.startButton') }}
        </Button>

        <button class="transfer-page__text-link body-regular" @click="switchProfile">
          {{ t('account.transfer.learnMore') }}
        </button>

        <!-- Benefits -->
        <div class="transfer-page__benefits-section">
          <h2 class="title-4-medium">{{ t('account.transfer.simplified') }}</h2>

          <div class="transfer-page__benefit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <p class="body-regular">{{ t('account.transfer.benefit1') }}</p>
          </div>

          <div class="transfer-page__benefit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <p class="body-regular">{{ t('account.transfer.benefit2') }}</p>
          </div>

          <div class="transfer-page__benefit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <p class="body-regular">{{ t('account.transfer.benefit3') }}</p>
          </div>

          <p class="small-body-regular transfer-page__muted" style="font-style: italic;">
            {{ t('account.transfer.note') }}
          </p>
        </div>
      </div>

      <!-- Step: Enter email -->
      <div v-else-if="step === 'email'" class="transfer-page__card transfer-page__card-center">
        <h1 class="h2-bold">{{ t('account.transfer.step2') }}</h1>

        <div class="transfer-page__selected-profile">
          <div class="transfer-page__avatar">
            <img v-if="selectedProfile?.image" :src="selectedProfile.image" class="transfer-page__avatar-img" alt="" />
            <span v-else class="transfer-page__avatar-placeholder">
              {{ selectedProfile?.name?.charAt(0)?.toUpperCase() ?? '?' }}
            </span>
          </div>
          <span class="body-regular">{{ selectedProfile?.name }}</span>
        </div>

        <div class="transfer-page__form">
          <label class="transfer-page__label small-body-regular" for="target-email">
            {{ t('account.transfer.emailLabel') }}
          </label>
          <input
            id="target-email"
            v-model="targetEmail"
            type="email"
            class="transfer-page__input body-regular"
            :placeholder="t('account.transfer.emailPlaceholder')"
            @keyup.enter="confirmTransfer"
          />
          <p v-if="error" class="small-body-regular transfer-page__error">{{ error }}</p>
        </div>

        <Button
          variant="brand"
          size="large"
          class="transfer-page__full-btn"
          :disabled="!targetEmail.trim() || loading"
          @click="confirmTransfer"
        >
          {{ loading ? t('account.transfer.confirming') : t('account.transfer.confirm') }}
        </Button>

        <button class="transfer-page__text-link body-regular" @click="step = 'confirm'">
          {{ t('account.back') }}
        </button>
      </div>

      <!-- Step: Success -->
      <div v-else-if="step === 'success'" class="transfer-page__card transfer-page__card-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="transfer-page__success-icon" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="#46d369" stroke-width="1.5"/>
          <path d="M8 12l3 3 5-5" stroke="#46d369" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1 class="h2-bold">{{ t('account.transfer.success') }}</h1>
        <p class="body-regular transfer-page__muted">{{ t('account.transfer.successDesc') }}</p>

        <Button variant="ghost" size="large" @click="navigateTo('/account')">
          {{ t('account.transfer.backToProfiles') }}
        </Button>
      </div>

    </div>

    <AppFooter variant="home" v-model:lang="lang" />
  </main>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.transfer-page {
  min-height: 100vh;
  background: token("color-background-base");
  color: token("color-text-primary");

  &__back-link {
    display: inline-flex;
    align-items: center;
    gap: token("dm-8");
    color: token("color-text-secondary");
    text-decoration: none;
    transition: color 0.15s ease;
    &:hover { color: token("color-text-primary"); }
  }

  &__container {
    max-width: 600px;
    margin: 0 auto;
    padding: 96px token("layout-margin") token("dm-64");
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
  }

  &__card-center {
    align-items: center;
    text-align: center;
  }

  // ── Profile select ──────────────────────────────────────────
  &__profile-list {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    overflow: hidden;
    margin-top: token("dm-8");
  }

  &__profile-item {
    display: flex;
    align-items: center;
    gap: token("dm-16");
    padding: token("dm-12") token("dm-24");
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: token("color-text-primary");
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease;

    &:last-child { border-bottom: none; }
    &:hover { background: rgba(255, 255, 255, 0.06); }
  }

  // ── Avatar ──────────────────────────────────────────────────
  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__avatar-lg {
    width: 80px;
    height: 80px;
    border-radius: 8px;
  }

  &__avatar-img { width: 100%; height: 100%; object-fit: cover; }

  &__avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    font-size: 16px;
    font-weight: 700;
    color: token("color-text-primary");
  }

  &__avatar-lg &__avatar-placeholder { font-size: 28px; }

  // ── Selected profile ────────────────────────────────────────
  &__selected-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: token("dm-8");
    margin: token("dm-8") 0;
  }

  // ── Links & buttons ─────────────────────────────────────────
  &__text-link {
    background: none;
    border: none;
    color: token("color-action-brand");
    cursor: pointer;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  &__full-btn { width: 100%; max-width: 360px; }

  &__chevron {
    margin-left: auto;
    flex-shrink: 0;
    color: token("color-text-secondary");
  }

  // ── Benefits ────────────────────────────────────────────────
  &__benefits-section {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
    margin-top: token("dm-24");
    padding-top: token("dm-24");
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
    width: 100%;
  }

  &__benefit {
    display: flex;
    gap: token("dm-16");
    align-items: flex-start;

    svg { flex-shrink: 0; color: token("color-text-secondary"); margin-top: 2px; }
  }

  // ── Form ────────────────────────────────────────────────────
  &__form {
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
    width: 100%;
    max-width: 360px;
    text-align: left;
  }

  &__label { color: token("color-text-secondary"); }

  &__input {
    padding: 14px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    color: token("color-text-primary");
    outline: none;
    transition: border-color 0.15s ease;

    &::placeholder { color: token("color-text-secondary"); opacity: 0.6; }
    &:focus { border-color: token("color-action-brand"); }
  }

  &__error { color: #e50914; }

  &__muted { color: token("color-text-secondary"); }

  // ── Success ─────────────────────────────────────────────────
  &__success-icon { margin-bottom: token("dm-8"); }
}
</style>

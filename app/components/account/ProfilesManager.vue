<script setup lang="ts">
import type { UserProfile } from '~/stores/auth'
import { PROFILE_AVATARS } from '~/composables/use-profiles'

const { t } = useI18n()
const authStore = useAuthStore()
const { listProfiles, createProfile, updateProfile, deleteProfile } = useProfiles()
const { errorMsg, formErrors, setErrors, clearErrors } = useResponseError()

const profiles = computed<UserProfile[]>(() => authStore.profiles)
const canAdd = computed(() => authStore.canAddProfile)

// Load the live list once on mount (auth/me may not have run for this page).
await useAsyncData('account-profiles', () => listProfiles().catch(() => authStore.profiles))

// ── Editor modal state ─────────────────────────────────────
type EditorMode = 'create' | 'edit'
const editorOpen = ref(false)
const editorMode = ref<EditorMode>('create')
const editingId = ref<string | null>(null)
const draftName = ref('')
const draftAvatar = ref<string>(PROFILE_AVATARS[0]!)
const draftKids = ref(false)
const saving = ref(false)
const deleting = ref(false)

function openCreate() {
  editorMode.value = 'create'
  editingId.value = null
  draftName.value = ''
  draftAvatar.value = PROFILE_AVATARS[0]!
  draftKids.value = false
  clearErrors()
  editorOpen.value = true
}

function openEdit(profile: UserProfile) {
  editorMode.value = 'edit'
  editingId.value = profile.id
  draftName.value = profile.name
  draftAvatar.value = profile.avatar_url || PROFILE_AVATARS[0]!
  draftKids.value = !!profile.is_kids
  clearErrors()
  editorOpen.value = true
}

function closeEditor() {
  if (saving.value || deleting.value) return
  editorOpen.value = false
}

async function save() {
  saving.value = true
  clearErrors()
  const payload = { name: draftName.value.trim(), avatar_url: draftAvatar.value, is_kids: draftKids.value }
  try {
    if (editorMode.value === 'create') await createProfile(payload)
    else if (editingId.value) await updateProfile(editingId.value, payload)
    editorOpen.value = false
  } catch (err: any) {
    setErrors(err.data ?? err)
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!editingId.value) return
  deleting.value = true
  clearErrors()
  try {
    await deleteProfile(editingId.value)
    editorOpen.value = false
  } catch (err: any) {
    setErrors(err.data ?? err)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <article class="account-card profiles-mgr flex flex-col gap-16">
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-12">
        <h2 class="title-3-medium">{{ t('account.profiles.title') }}</h2>
        <span class="caption-1-regular text-secondary">{{ profiles.length }} / {{ authStore.maxProfiles }}</span>
      </div>
      <p class="body-regular text-secondary">{{ t('account.profiles.subtitle') }}</p>
      <p v-if="!canAdd" class="small-body-regular profiles-mgr__limit">{{ t('account.profiles.limitNote') }}</p>
    </div>

    <ul class="profiles-mgr__list">
      <li v-for="p in profiles" :key="p.id">
        <button type="button" class="profiles-mgr__item" @click="openEdit(p)">
          <span class="profiles-mgr__avatar">
            <img v-if="p.avatar_url" :src="p.avatar_url" :alt="p.name" />
            <span v-else class="profiles-mgr__avatar-fallback">{{ p.name.charAt(0).toUpperCase() }}</span>
          </span>
          <span class="profiles-mgr__name body-regular">
            {{ p.name }}
            <span v-if="p.is_kids" class="profiles-mgr__kids">{{ t('account.profiles.kids') }}</span>
          </span>
          <Icon name="lucide:pencil" size="18" class="profiles-mgr__edit-icon" />
        </button>
      </li>

      <li v-if="canAdd">
        <button type="button" class="profiles-mgr__item profiles-mgr__item--add" @click="openCreate">
          <span class="profiles-mgr__avatar profiles-mgr__avatar--add">
            <Icon name="lucide:plus" size="22" />
          </span>
          <span class="profiles-mgr__name body-regular">{{ t('account.profiles.add') }}</span>
        </button>
      </li>
    </ul>

    <button type="button" class="profiles-mgr__transfer" @click="navigateTo('/account/transfer-profile')">
      <Icon name="lucide:arrow-left-right" size="18" />
      <span class="body-regular">{{ t('account.profiles.transfer') }}</span>
      <Icon name="lucide:chevron-right" size="16" class="profiles-mgr__transfer-chevron" />
    </button>

    <!-- ── Editor modal ─────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="editorOpen" class="profiles-modal" @click.self="closeEditor">
        <div class="profiles-modal__panel account-card flex flex-col gap-20" role="dialog" aria-modal="true">
          <header class="flex items-center justify-between gap-12">
            <h3 class="title-3-medium">{{ editorMode === 'create' ? t('account.profiles.addTitle') : t('account.profiles.editTitle') }}</h3>
            <button type="button" class="profiles-modal__close" :aria-label="t('action.close')" @click="closeEditor">
              <Icon name="lucide:x" size="20" />
            </button>
          </header>

          <div class="profiles-modal__avatars">
            <button
              v-for="url in PROFILE_AVATARS"
              :key="url"
              type="button"
              class="profiles-modal__avatar-pick"
              :class="{ 'is-active': draftAvatar === url }"
              @click="draftAvatar = url"
            >
              <img :src="url" alt="" />
            </button>
          </div>

          <InputField v-model="draftName" :label="t('account.profiles.nameLabel')" :error="formErrors.name" />

          <Checkbox v-model="draftKids" :label="t('account.profiles.kidsLabel')" />

          <p v-if="errorMsg" class="account-card__api-error">{{ errorMsg }}</p>
          <p v-if="formErrors.id" class="account-card__api-error">{{ formErrors.id }}</p>

          <div class="flex flex-col gap-12">
            <Button variant="brand" size="large" :block="true" :disabled="saving || !draftName.trim()" @click="save">
              {{ saving ? t('account.saving') : t('account.save') }}
            </Button>
            <Button
              v-if="editorMode === 'edit'"
              variant="ghost"
              size="large"
              :block="true"
              :disabled="deleting || profiles.length <= 1"
              class="profiles-modal__delete"
              @click="remove"
            >
              {{ deleting ? t('account.saving') : t('account.profiles.delete') }}
            </Button>
          </div>
        </div>
      </div>
    </Teleport>
  </article>
</template>

<style scoped lang="scss">
.profiles-mgr {
  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: token("dm-16");
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: token("dm-8");
    width: 110px;
    padding: token("dm-12");
    background: none;
    border: 1px solid transparent;
    border-radius: 12px;
    color: token("color-text-primary");
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;

    &:hover { background: token("color-background-highlight"); border-color: token("color-border-subtle"); }
  }

  &__avatar {
    position: relative;
    width: 72px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img { width: 100%; height: 100%; object-fit: cover; }

    &--add {
      border: 1px dashed token("color-border-subtle");
      color: token("color-text-secondary");
    }
  }

  &__avatar-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: token("color-background-elevated");
    font-weight: 700;
    font-size: 24px;
  }

  &__name {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    text-align: center;
  }

  &__kids {
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 999px;
    background: token("color-background-elevated");
    color: token("color-text-secondary");
  }

  &__edit-icon { color: token("color-text-secondary"); }

  &__limit { color: token("color-action-brand"); margin: 0; }

  &__transfer {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    width: 100%;
    padding: token("dm-12") token("dm-16");
    background: none;
    border: 1px solid token("color-border-subtle");
    border-radius: 12px;
    color: token("color-text-primary");
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover { background: token("color-background-highlight"); }
  }

  &__transfer-chevron { margin-left: auto; color: token("color-text-secondary"); }
}

// ── Modal ───────────────────────────────────────────────────
.profiles-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: token("dm-16");
  background: rgba(0, 0, 0, 0.7);

  &__panel { width: 100%; max-width: 440px; }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    color: token("color-text-secondary");
    padding: 0;
    &:hover { color: token("color-text-primary"); }
  }

  &__avatars {
    display: flex;
    flex-wrap: wrap;
    gap: token("dm-12");
  }

  &__avatar-pick {
    width: 56px;
    height: 56px;
    border-radius: 10px;
    overflow: hidden;
    padding: 0;
    background: none;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease;

    img { width: 100%; height: 100%; object-fit: cover; display: block; }

    &:hover { transform: scale(1.05); }
    &.is-active { border-color: token("color-action-brand"); }
  }

  &__delete {
    --btn-color: var(--color-status-error, #e87c03);
  }
}
</style>

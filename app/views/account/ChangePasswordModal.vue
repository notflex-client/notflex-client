<script setup lang="ts">
const { $api } = useNuxtApp()
const { t } = useI18n()
const { formErrors, errorMsg, setErrors, clearErrors } = useResponseError()

const open = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const rePassword = ref('')
const saveLoading = ref(false)

function reset() {
  oldPassword.value = ''
  newPassword.value = ''
  rePassword.value = ''
  clearErrors()
  saveLoading.value = false
}

function openModal() {
  reset()
  open.value = true
}

function close() {
  open.value = false
  reset()
}

async function submit() {
  clearErrors()

  if (newPassword.value !== rePassword.value) {
    formErrors.value = { rePassword: t('account.changePassword.mismatch') }
    return
  }

  saveLoading.value = true
  try {
    await $api('/auth/change-password', {
      method: 'POST',
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        rePassword: rePassword.value,
      },
    })
    close()
  } catch (e: any) {
    setErrors(e)
  } finally {
    saveLoading.value = false
  }
}

defineExpose({ open: openModal, close })
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="cp-modal">
        <div class="cp-modal__backdrop" @click="close" />
        <section class="cp-modal__panel">
          <button class="cp-modal__close" type="button" @click="close">&times;</button>

          <h2 class="title-2-bold">{{ t('account.changePassword.title') }}</h2>

          <p v-if="errorMsg && Object.keys(formErrors).length === 0" class="cp-modal__error body-regular">
            {{ errorMsg }}
          </p>

          <form class="cp-modal__form" autocomplete="off" @submit.prevent="submit">
            <InputField
              v-model="oldPassword"
              type="password"
              :label="t('account.changePassword.oldPassword')"
              :error="formErrors.oldPassword"
              autocomplete="current-password"
            />
            <InputField
              v-model="newPassword"
              type="password"
              :label="t('account.changePassword.newPassword')"
              :error="formErrors.newPassword"
              autocomplete="new-password"
            />
            <InputField
              v-model="rePassword"
              type="password"
              :label="t('account.changePassword.confirmPassword')"
              :error="formErrors.rePassword"
              autocomplete="new-password"
            />
          </form>

          <div class="cp-modal__actions">
            <Button variant="ghost" size="large" @click="close">{{ t('account.changePassword.cancel') }}</Button>
            <Button variant="brand" size="large" :disabled="saveLoading" @click="submit">
              {{ saveLoading ? t('account.changePassword.saving') : t('account.changePassword.save') }}
            </Button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.cp-modal {
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
    width: min(480px, calc(100vw - 32px));
    margin: 12vh auto;
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

  &__error {
    color: #e87c03;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: token("dm-12");
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

import { ref } from 'vue'

export function useResponseError() {
  const errorCode = ref<string | null>(null)
  const errorMsg = ref<string | null>(null)
  const formErrors = ref<Record<string, string>>({})

  function setErrors(error: any) {
    const errorData = error?.data || error
    if (errorData?.code) errorCode.value = errorData.code
    if (errorData?.message) errorMsg.value = errorData.message
    if (errorData?.details) formErrors.value = errorData.details
  }

  function clearErrors() {
    errorCode.value = null
    errorMsg.value = null
    formErrors.value = {}
  }

  return { errorCode, errorMsg, formErrors, setErrors, clearErrors }
}

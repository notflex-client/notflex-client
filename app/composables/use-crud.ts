import { computed, reactive, ref, toRaw, watch } from 'vue'
import { useResponseError } from '~/composables/error'

function deepClone<T>(val: T): T {
  return structuredClone(toRaw(val))
}

function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function resolveDefault<T>(defaultFormModel: T | (() => T)): T {
  return typeof defaultFormModel === 'function'
    ? (defaultFormModel as () => T)()
    : deepClone(defaultFormModel)
}

export function useCrud<TModel extends Record<string, any>>(options: {
  endpoint: string
  defaultFormModel: TModel | (() => TModel)
  serialize?: (model: TModel) => any
  deserialize?: (data: any) => TModel
}) {
  const { $api } = useNuxtApp()
  const { errorCode, errorMsg, formErrors, setErrors, clearErrors } = useResponseError()

  const model = ref<TModel>(resolveDefault(options.defaultFormModel))
  const formModel = reactive<TModel>(resolveDefault(options.defaultFormModel))

  const loadLoading = ref(false)
  const saveLoading = ref(false)
  const deleteLoading = ref(false)

  const isUpdate = computed(() => !!formModel.id)
  const isCreate = computed(() => !formModel.id)
  const isModified = ref(false)

  watch(
    () => [model.value, formModel],
    () => {
      const defaults = resolveDefault(options.defaultFormModel) as Record<string, any>
      isModified.value = Object.keys(defaults).some(
        key => !deepEqual((toRaw(model.value) as any)[key], (toRaw(formModel) as any)[key]),
      )
    },
    { deep: true, immediate: true },
  )

  function reset() {
    clearErrors()
    const defaults = resolveDefault(options.defaultFormModel)
    Object.keys(formModel).forEach(key => delete formModel[key])
    Object.assign(formModel, defaults)
  }

  async function load(id?: string) {
    loadLoading.value = true
    clearErrors()
    try {
      let data: any = await $api<TModel>(`${options.endpoint}/${id || formModel.id}`)
      if (options.deserialize) data = options.deserialize(data)
      model.value = data
      Object.assign(formModel, deepClone(data))
    } catch (e: any) {
      setErrors(e)
      throw e
    } finally {
      loadLoading.value = false
    }
  }

  async function save() {
    saveLoading.value = true
    clearErrors()
    try {
      const id = formModel.id
      const method = id ? 'PUT' : 'POST'
      const payload = options.serialize ? options.serialize(formModel as TModel) : toRaw(formModel)
      let data: any = await $api<TModel>(id ? `${options.endpoint}/${id}` : options.endpoint, {
        method,
        body: payload,
      })
      if (options.deserialize) data = options.deserialize(data)
      Object.assign(model.value, deepClone(data))
      Object.assign(formModel, deepClone(data))
      return data
    } catch (e: any) {
      setErrors(e)
      throw e
    } finally {
      saveLoading.value = false
    }
  }

  async function del(id?: string) {
    deleteLoading.value = true
    clearErrors()
    try {
      await $api(`${options.endpoint}/${id || formModel.id}`, { method: 'DELETE' })
    } catch (e: any) {
      setErrors(e)
      throw e
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    errorCode, errorMsg, formErrors,
    model, formModel,
    loadLoading, saveLoading, deleteLoading,
    isUpdate, isCreate, isModified,
    reset, load, save, del,
    setErrors, clearErrors,
  }
}

export type CrudResult<TModel extends Record<string, any>> = ReturnType<typeof useCrud<TModel>>

import { computed, reactive, ref, toRaw } from 'vue'

type PaginationResponse<TItem> = {
  items: TItem[]
  itemCount: number
  pageCount: number
}

type PaginationFilter = {
  page?: number
  pageSize?: number
} & Record<string, any>

function deepClone<T>(val: T): T {
  return structuredClone(val)
}

function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function omitKeys<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k))) as Partial<T>
}

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

function resolveDefault<T>(val: T | (() => T)): T {
  return typeof val === 'function' ? (val as () => T)() : deepClone(val)
}

export function useList<TItem, TFilter extends PaginationFilter>(options: {
  endpoint: string
  defaultFilter: TFilter | (() => TFilter)
  normalize?: (response: any) => PaginationResponse<TItem>
}) {
  const { $api } = useNuxtApp()

  const filter = reactive<TFilter>(deepClone(resolveDefault(options.defaultFilter)))

  const items = ref<TItem[]>([])
  const itemCount = ref(0)
  const pageCount = ref(0)

  const firstLoading = ref(true)
  const listLoading = ref(false)

  const page = computed(() => Number(filter.page ?? 1))
  const pageSize = computed(() => Number(filter.pageSize ?? 0))
  const isEmpty = computed(() => itemCount.value === 0 && !firstLoading.value)

  const isSearchEmpty = computed(() => {
    if (listLoading.value || items.value.length > 0) return false
    const currentFilter = omitKeys(toRaw(filter), ['page', 'pageSize'])
    const defaults = omitKeys(resolveDefault(options.defaultFilter), ['page', 'pageSize'])
    return !deepEqual(currentFilter, defaults)
  })

  const firstItemOfPage = computed(() =>
    !itemCount.value ? 0 : (page.value - 1) * pageSize.value + 1,
  )
  const lastItemOfPage = computed(() =>
    (page.value - 1) * pageSize.value + (items.value.length || 0),
  )

  let controller: AbortController | null = null

  async function load() {
    if (controller) controller.abort()
    controller = new AbortController()
    const signal = controller.signal

    try {
      listLoading.value = true
      const response = await $api(options.endpoint, {
        method: 'GET',
        query: toRaw(filter),
        signal,
      })
      const normalized = options.normalize
        ? options.normalize(response)
        : (response as PaginationResponse<TItem>)
      items.value = normalized.items ?? []
      itemCount.value = normalized.itemCount ?? 0
      pageCount.value = normalized.pageCount ?? 0
    } catch (error: any) {
      if (error.name === 'AbortError') return
      throw error
    } finally {
      if (!signal.aborted) {
        listLoading.value = false
        firstLoading.value = false
      }
    }
  }

  async function search() {
    filter.page = 1
    await load()
  }

  const searchDebounced = debounce(search, 300)

  function reset() {
    const defaults = resolveDefault(options.defaultFilter)
    Object.keys(filter).forEach(k => delete (filter as any)[k])
    Object.assign(filter, defaults)
    items.value = []
    itemCount.value = 0
    pageCount.value = 0
    firstLoading.value = true
    listLoading.value = false
  }

  return {
    filter, items, itemCount, pageCount,
    firstItemOfPage, lastItemOfPage,
    firstLoading, listLoading,
    isEmpty, isSearchEmpty,
    load, reset, search, searchDebounced,
  }
}

export type ListResult<TItem, TFilter extends PaginationFilter> = ReturnType<typeof useList<TItem, TFilter>>

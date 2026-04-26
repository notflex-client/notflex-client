<script setup lang="ts">
import * as select from '@zag-js/select'
import { useMachine, normalizeProps } from '@zag-js/vue'

export interface DropdownOption {
  label: string
  value: string | number
}

const props = defineProps({
  modelValue: { type: [String, Number] as PropType<string | number | null>, default: null },
  options:     { type: Array as PropType<DropdownOption[]>, default: () => [] },
  placeholder: { type: String, default: 'Select...' },
  size:        { type: String as PropType<'large' | 'small'>, default: 'large' },
  disabled:    { type: Boolean, default: false },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const id = useId()

const context = computed(() => ({
  id,
  collection: select.collection({ items: props.options }),
  value:    props.modelValue != null ? [String(props.modelValue)] : [],
  disabled: props.disabled,
  positioning: { sameWidth: true },
  onValueChange(details: select.ValueChangeDetails) {
    emit('update:modelValue', details.items[0]?.value ?? null)
  },
}))

const service = useMachine(select.machine as any, context as any)
const api = computed(() => select.connect(service as any, normalizeProps) as ReturnType<typeof select.connect>)
</script>

<template>
  <div class="dropdown" :class="{ [`dropdown-${size}`]: size !== 'large', 'is-open': api.open, 'is-disabled': disabled }">
    <button class="dropdown__trigger" type="button" v-bind="api.getTriggerProps()">
      <span class="dropdown__value">
        <slot name="value" :api="api">
          {{ api.valueAsString || placeholder }}
        </slot>
      </span>
      <svg class="dropdown__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Teleport to="body">
      <div v-bind="api.getPositionerProps()">
        <ul class="dropdown__list" v-bind="api.getContentProps()">
          <li
            v-for="item in options"
            :key="item.value"
            class="dropdown__item"
            v-bind="api.getItemProps({ item })"
          >
            <slot name="item" :item="item">{{ item.label }}</slot>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

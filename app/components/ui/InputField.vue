<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  autocomplete: { type: String, default: 'off' },
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type !== 'password') return props.type
  return showPassword.value ? 'text' : 'password'
})

const isPassword = computed(() => props.type === 'password')

const rootClass = computed(() => ({
  'input-field': true,
  'is-error': !!props.error,
  'is-disabled': props.disabled,
  'has-toggle': isPassword.value,
}))
</script>

<template>
  <div :class="rootClass">
    <div class="input-field__wrap">
      <input
        class="input-field__control"
        :type="inputType"
        :value="modelValue"
        :disabled="disabled"
        :autocomplete="autocomplete"
        placeholder=" "
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <label class="input-field__label">{{ label }}</label>

      <Button
        v-if="isPassword"
        variant="ghost"
        size="small"
        type="button"
        class="input-field__eye"
        tabindex="-1"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? 'Hide' : 'Show' }}
      </Button>
    </div>

    <span v-if="error" class="input-field__error">
      <svg class="input-field__error-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
        <path d="M7 4v3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="7" cy="10" r="0.75" fill="currentColor" />
      </svg>
      {{ error }}
    </span>
  </div>
</template>

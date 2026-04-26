<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label:      { type: String, default: '' },
  disabled:   { type: Boolean, default: false },
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const id = useId()
</script>

<template>
  <label
    class="checkbox"
    :class="{ 'is-disabled': disabled }"
    :for="id"
  >
    <input
      :id="id"
      class="checkbox__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="checkbox__box">
      <svg class="checkbox__check" width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
        <path d="M1 3.5L4 6.5L10 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>

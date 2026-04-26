<script setup lang="ts">
const checked1 = ref(false)
const checked2 = ref(true)
const checked3 = ref(false)
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Checkbox</h3>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <Checkbox v-model="checked1" label="Remember me (unchecked)" />
        <Checkbox v-model="checked2" label="Remember me (checked)" />
        <Checkbox :model-value="false" label="Disabled unchecked" disabled />
        <Checkbox :model-value="true" label="Disabled checked" disabled />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Interactive</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <Checkbox v-model="checked3" label="Remember me on this device" />
        <p class="ds-label">Value: {{ checked3 }}</p>
      </div>
    </div>

  </div>
</template>

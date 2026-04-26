<script setup lang="ts">
const lang = ref('en')
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Landing Page</h3>
      <p class="ds-block__desc">4-column links · phone · language selector</p>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppFooter variant="landing" v-model:lang="lang" />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Authentication Page</h3>
      <p class="ds-block__desc">Condensed links · phone · language selector</p>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppFooter variant="auth" v-model:lang="lang" />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Home Page</h3>
      <p class="ds-block__desc">Social icons · links · language · Service Code · copyright</p>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppFooter variant="home" v-model:lang="lang" />
      </div>
    </div>

  </div>
</template>

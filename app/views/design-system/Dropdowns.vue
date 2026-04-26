<script setup lang="ts">
import { ref } from 'vue'

const lang = ref('en')
const pref = ref('original')
const sort = ref('suggestions')

const langOptions = [
  { label: 'English', value: 'en' },
  { label: 'Arabic', value: 'ar' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Spanish', value: 'es' },
  { label: 'Vietnamese', value: 'vi' },
]

const prefOptions = [
  { label: 'Original Language', value: 'original' },
  { label: 'Dubbing', value: 'dubbing' },
  { label: 'Subtitles', value: 'subtitles' },
]

const sortOptions = [
  { label: 'Suggestions for you', value: 'suggestions' },
  { label: 'Year Released', value: 'year' },
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' },
]
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Dropdown</h3>
      <p class="ds-block__desc">Usage: <code>&lt;Dropdown v-model="val" :options="[...]" /&gt;</code></p>
      <div class="ds-row ds-row--gap">
        <div>
          <p class="ds-label">Viewing Preferences</p>
          <Dropdown v-model="pref" :options="prefOptions" />
        </div>
        <div>
          <p class="ds-label">Language Options</p>
          <Dropdown v-model="lang" :options="langOptions" placeholder="Select language" />
        </div>
        <div>
          <p class="ds-label">Suggestions For You</p>
          <Dropdown v-model="sort" :options="sortOptions" />
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">States</h3>
      <div class="ds-row ds-row--gap">
        <div>
          <p class="ds-label">Default</p>
          <Dropdown v-model="lang" :options="langOptions" />
        </div>
        <div>
          <p class="ds-label">Disabled</p>
          <Dropdown v-model="lang" :options="langOptions" disabled />
        </div>
        <div>
          <p class="ds-label">No value (placeholder)</p>
          <Dropdown :model-value="null" :options="langOptions" placeholder="Choose an option" />
        </div>
      </div>
    </div>

  </div>
</template>

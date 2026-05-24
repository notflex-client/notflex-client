<script setup lang="ts">
import type { AvatarProfile } from '~/components/ui/Avatar.vue'

const SAMPLE_PROFILES: AvatarProfile[] = [
  { value: 'jennifer', name: 'Jennifer' },
  { value: 'bill',     name: 'Bill' },
  { value: 'alise',    name: 'Alise' },
  { value: 'james',    name: 'James' },
]

const POPOVER_PROFILES: AvatarProfile[] = [
  { value: 'jennifer', name: 'Jennifer' },
  { value: 'max',      name: 'Max' },
  { value: 'beyonce',  name: 'Beyoncé' },
]

const activeProfile = ref('jennifer')
</script>

<template>
  <div class="ds-section">

    <!-- Small -->
    <div class="ds-block">
      <h3 class="ds-block__title">Small</h3>
      <div class="av-demo-row">
        <Avatar size="small" name="James" />
        <Avatar size="small" name="James" show-arrow />
      </div>
    </div>

    <!-- Large -->
    <div class="ds-block">
      <h3 class="ds-block__title">Large</h3>
      <div class="av-demo-box">

        <!-- Default row -->
        <div class="av-state-row">
          <div class="av-avatars">
            <Avatar size="large" name="James" />
            <Avatar size="large" add />
          </div>
          <span class="caption-1-regular av-state-label">Default</span>
        </div>

        <!-- Hover row (forced) -->
        <div class="av-state-row av-force-hover">
          <div class="av-avatars">
            <Avatar size="large" name="James" />
            <Avatar size="large" add />
          </div>
          <span class="caption-1-regular av-state-label">Hover</span>
        </div>

      </div>
    </div>

    <!-- Sample -->
    <div class="ds-block">
      <h3 class="ds-block__title">Sample</h3>
      <div class="av-sample-row">
        <Avatar
          v-for="p in SAMPLE_PROFILES"
          :key="p.value"
          size="large"
          :name="p.name"
          :image="p.image"
        />
        <Avatar size="large" add />
      </div>
    </div>

    <!-- Avatar Popover -->
    <div class="ds-block">
      <h3 class="ds-block__title">Avatar Popover</h3>
      <p class="ds-block__desc">
        Zag-powered dropdown. Click the trigger avatar to open.
        Profiles and menu items are keyboard-navigable (arrow keys, ESC).
      </p>
      <AvatarPopover
        :profiles="POPOVER_PROFILES"
        :active-profile="activeProfile"
        @select-profile="activeProfile = $event"
      >
        <template #trigger>
          <Avatar size="small" name="Jennifer" show-arrow />
        </template>
      </AvatarPopover>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.av-demo-row {
  display: flex;
  align-items: center;
  gap: token("dm-8");
  background-color: token("grey-800");
  border-radius: 8px;
  padding: token("dm-16") token("dm-20");
  width: fit-content;
}

.av-demo-box {
  background-color: token("grey-800");
  border-radius: 8px;
  overflow: hidden;
  padding: token("dm-20") token("dm-24");
  display: flex;
  flex-direction: column;
  gap: token("dm-20");
  width: fit-content;
}

.av-state-row {
  display: flex;
  align-items: center;
  gap: token("dm-32");
}

.av-avatars {
  display: flex;
  gap: token("dm-20");
}

.av-state-label {
  color: token("color-text-secondary");
  min-width: 80px;
}

// Simulated hover state for demo
.av-force-hover {
  :deep(.avatar__frame)    { filter: brightness(0.65); }
  :deep(.avatar__add-wrap) { background-color: token("grey-600"); border-color: token("white"); }
  :deep(.avatar__name)     { color: token("color-text-primary"); }
}

.av-sample-row {
  display: flex;
  gap: token("dm-20");
  flex-wrap: wrap;
}
</style>

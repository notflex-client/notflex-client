<script lang="ts">
// Module-scope constants — must be outside <script setup> so defineProps can reference them
export interface PopoverMenuItem {
  icon:   'pencil' | 'transfer' | 'account' | 'help'
  label:  string
  action: string
}

const DEFAULT_MENU: PopoverMenuItem[] = [
  { icon: 'pencil',   label: 'Manage Profiles',  action: 'manage-profiles' },
  { icon: 'transfer', label: 'Transfer Profiles', action: 'transfer-profiles' },
  { icon: 'account',  label: 'Account',           action: 'account' },
  { icon: 'help',     label: 'Help Center',       action: 'help' },
]
</script>

<script setup lang="ts">
import * as menu from '@zag-js/menu'
import { useMachine, normalizeProps } from '@zag-js/vue'
import type { AvatarProfile } from './Avatar.vue'

const props = defineProps({
  profiles:      { type: Array as PropType<AvatarProfile[]>, default: () => [] },
  activeProfile: { type: String, default: '' },
  menuItems:     { type: Array as PropType<PopoverMenuItem[]>, default: () => DEFAULT_MENU },
  signOutLabel:  { type: String, default: 'Sign out of Netflix' },
})

const emit = defineEmits<{
  'select-profile': [value: string]
  'menu-action':    [action: string]
  'sign-out':       []
}>()

const id = useId()

const context = computed(() => ({
  id,
  positioning: { placement: 'bottom-end' as const, gutter: 8 },
  onSelect(details: { value: string }) {
    if (details.value.startsWith('profile:')) {
      emit('select-profile', details.value.slice('profile:'.length))
    } else if (details.value === 'sign-out') {
      emit('sign-out')
    } else {
      emit('menu-action', details.value)
    }
  },
}))

const service = useMachine(menu.machine, context)
const api = computed(() => menu.connect(service, normalizeProps))
</script>

<template>
  <div class="avatar-popover-root">

    <!-- ── Trigger slot ─────────────────────────────────── -->
    <slot name="trigger" :trigger-props="api.getTriggerProps()">
      <Button variant="ghost" size="small" class="avatar-popover__fallback-trigger" v-bind="(api.getTriggerProps() as any)">
        Profile ▾
      </Button>
    </slot>

    <!-- ── Panel ────────────────────────────────────────── -->
    <Teleport to="body">
      <div v-bind="api.getPositionerProps()">
        <div class="avatar-popover" v-bind="api.getContentProps()">

          <!-- Profiles -->
          <div class="avatar-popover__profiles">
            <Button
              v-for="p in profiles"
              variant="ghost"
              size="large"
              :key="p.value"
              class="avatar-popover__profile"
              :class="{ 'is-active': activeProfile === p.value }"
              v-bind="(api.getItemProps({ value: `profile:${p.value}` }) as any)"
            >
              <span class="avatar-popover__profile-frame">
                <img v-if="p.image" :src="p.image" class="avatar-popover__profile-img" :alt="p.name" />
                <span v-else class="avatar-popover__profile-placeholder" aria-hidden="true" />
              </span>
              <span class="caption-2-regular avatar-popover__profile-name">{{ p.name }}</span>
            </Button>
          </div>

          <div class="avatar-popover__sep" v-bind="api.getSeparatorProps()" />

          <!-- Menu items -->
          <ul class="avatar-popover__menu" role="none">
            <li
              v-for="item in menuItems"
              :key="item.action"
              class="avatar-popover__item"
              v-bind="api.getItemProps({ value: item.action })"
            >
              <!-- Icons -->
              <svg v-if="item.icon === 'pencil'" class="avatar-popover__icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M12.5 2.5l3 3L5 16H2v-3L12.5 2.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="item.icon === 'transfer'" class="avatar-popover__icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 6h12M3 6l3-3M3 6l3 3M15 12H3M15 12l-3-3M15 12l-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="item.icon === 'account'" class="avatar-popover__icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="6" r="3" stroke="currentColor" stroke-width="1.3"/>
                <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
              <svg v-else-if="item.icon === 'help'" class="avatar-popover__icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.3"/>
                <path d="M9 13v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M6.5 7a2.5 2.5 0 014.8.9c0 1.5-2.3 2-2.3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
              <span class="small-body-regular">{{ item.label }}</span>
            </li>
          </ul>

          <div class="avatar-popover__sep" v-bind="api.getSeparatorProps()" />

          <!-- Sign out -->
          <Button
            variant="ghost"
            size="large"
            class="avatar-popover__sign-out small-body-regular"
            v-bind="(api.getItemProps({ value: 'sign-out' }) as any)"
          >
            {{ signOutLabel }}
          </Button>

        </div>
      </div>
    </Teleport>

  </div>
</template>

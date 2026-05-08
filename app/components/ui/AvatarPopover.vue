<script lang="ts">
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

const open = ref(false)
const rootRef = ref<HTMLElement>()

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function selectItem(value: string) {
  close()
  if (value.startsWith('profile:')) {
    emit('select-profile', value.slice('profile:'.length))
  } else if (value === 'sign-out') {
    emit('sign-out')
  } else {
    emit('menu-action', value)
  }
}

function handleClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside, true))
onUnmounted(() => document.removeEventListener('click', handleClickOutside, true))
</script>

<template>
  <div ref="rootRef" class="avatar-popover-root">

    <!-- ── Trigger slot ─────────────────────────────────── -->
    <div class="avatar-popover__trigger" @click.stop="toggle">
      <slot name="trigger" :trigger-props="{}">
        <Button variant="ghost" size="small" class="avatar-popover__fallback-trigger">
          Profile ▾
        </Button>
      </slot>
    </div>

    <!-- ── Panel ────────────────────────────────────────── -->
    <Transition name="popover-fade">
      <div v-if="open" class="avatar-popover">

        <!-- Profiles -->
        <div class="avatar-popover__profiles">
          <button
            v-for="p in profiles"
            :key="p.value"
            type="button"
            class="avatar-popover__profile"
            :class="{ 'is-active': activeProfile === p.value }"
            @click="selectItem(`profile:${p.value}`)"
          >
            <span class="avatar-popover__profile-frame">
              <img v-if="p.image" :src="p.image" class="avatar-popover__profile-img" :alt="p.name" />
              <span v-else class="avatar-popover__profile-placeholder" aria-hidden="true" />
            </span>
            <span class="caption-2-regular avatar-popover__profile-name">{{ p.name }}</span>
          </button>
        </div>

        <div class="avatar-popover__sep" />

        <!-- Menu items -->
        <ul class="avatar-popover__menu" role="menu">
          <li
            v-for="item in menuItems"
            :key="item.action"
            class="avatar-popover__item"
            role="menuitem"
            tabindex="0"
            @click="selectItem(item.action)"
            @keydown.enter="selectItem(item.action)"
          >
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

        <div class="avatar-popover__sep" />

        <!-- Sign out -->
        <button
          type="button"
          class="avatar-popover__sign-out small-body-regular"
          @click="selectItem('sign-out')"
        >
          {{ signOutLabel }}
        </button>

      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
export interface FooterLink {
  label: string
  href?: string
}

const props = defineProps({
  variant: { type: String as PropType<'landing' | 'auth' | 'home'>, default: 'landing' },
  phone:   { type: String, default: '1-844-505-2993' },
  lang:    { type: String, default: 'en' },
})

const emit = defineEmits<{ 'update:lang': [value: string] }>()

const langOptions = [
  { label: 'English', value: 'en' },
  { label: 'Tiếng Việt', value: 'vi' },
]

// ── Link data per variant ─────────────────────────────────
const landingColumns: FooterLink[][] = [
  [
    { label: 'FAQ' },
    { label: 'Investor Relations' },
    { label: 'Buy Gift Cards' },
    { label: 'Cookie Preferences' },
    { label: 'Legal Notices' },
  ],
  [
    { label: 'Help Center' },
    { label: 'Jobs' },
    { label: 'Ways to Watch' },
    { label: 'Corporate Information' },
    { label: 'Only on Netflix' },
  ],
  [
    { label: 'Account' },
    { label: 'Netflix Shop' },
    { label: 'Terms of Use' },
    { label: 'Contact Us' },
    { label: 'Do Not Sell or Share Personal Information' },
  ],
  [
    { label: 'Media Center' },
    { label: 'Redeem Gift Cards' },
    { label: 'Privacy' },
    { label: 'Speed Test' },
    { label: 'Ad Choices' },
  ],
]

const authColumns: FooterLink[][] = [
  [
    { label: 'FAQ' },
    { label: 'Privacy' },
    { label: 'Ad Choices' },
  ],
  [
    { label: 'Help Center' },
    { label: 'Cookie Preferences' },
  ],
  [
    { label: 'Netflix Shop' },
    { label: 'Corporate Information' },
  ],
  [
    { label: 'Terms of Use' },
    { label: 'Do Not Sell or Share Personal Information' },
  ],
]

const homeColumns: FooterLink[][] = [
  [
    { label: 'Audio Description' },
    { label: 'Investor Relations' },
    { label: 'Privacy' },
    { label: 'Contact Us' },
  ],
  [
    { label: 'Help Center' },
    { label: 'Jobs' },
    { label: 'Legal Notices' },
  ],
  [
    { label: 'Gift Cards' },
    { label: 'Netflix Shop' },
    { label: 'Cookie Preferences' },
    { label: 'Do Not Sell or Share Personal Information' },
  ],
  [
    { label: 'Media Center' },
    { label: 'Terms of Use' },
    { label: 'Ad Choices' },
    { label: 'Corporate Information' },
  ],
]

const columns = computed(() => {
  if (props.variant === 'auth') return authColumns
  if (props.variant === 'home') return homeColumns
  return landingColumns
})

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    svg: '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    name: 'Instagram',
    href: '#',
    svg: '<rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>',
  },
  {
    name: 'Twitter',
    href: '#',
    svg: '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    name: 'YouTube',
    href: '#',
    svg: '<path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 1.95C5.12 20 12 20 12 20s6.88 0 8.6-.47a2.78 2.78 0 001.94-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" stroke-width="1.5"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="currentColor" stroke-width="1.5"/>',
  },
]
</script>

<template>
  <footer class="app-footer">

    <!-- Social icons — home only -->
    <div v-if="variant === 'home'" class="app-footer__social">
      <a
        v-for="s in socialLinks"
        :key="s.name"
        :href="s.href"
        class="app-footer__social-link"
        :aria-label="s.name"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" v-html="s.svg" />
      </a>
    </div>

    <!-- Phone -->
    <p class="body-regular app-footer__phone">
      Questions? Call <a :href="`tel:${phone}`">{{ phone }}</a>
    </p>

    <!-- Link grid -->
    <div class="app-footer__grid">
      <template v-for="(col, ci) in columns" :key="ci">
        <a
          v-for="link in col"
          :key="link.label"
          :href="link.href || '#'"
          class="caption-1-regular app-footer__link"
        >
          {{ link.label }}
        </a>
      </template>
    </div>

    <!-- Language dropdown -->
    <div class="app-footer__lang">
      <Dropdown
        :model-value="lang"
        :options="langOptions"
        size="small"
        placeholder="Language"
        @update:model-value="emit('update:lang', $event as string)"
      />
    </div>

    <!-- Bottom row — home only -->
    <div v-if="variant === 'home'" class="app-footer__bottom">
      <button class="caption-1-regular app-footer__service" type="button">Service Code</button>
      <span class="caption-2-regular app-footer__copyright">© 1997–{{ new Date().getFullYear() }} Netflix, Inc.</span>
    </div>

  </footer>
</template>

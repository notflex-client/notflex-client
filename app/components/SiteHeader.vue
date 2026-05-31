<script setup lang="ts">
// Shared site header for authenticated pages.
// Wraps the AppHeader shell with the standard nav + actions so individual
// pages don't have to re-declare them (previously duplicated across ~6 views).
withDefaults(defineProps<{
  transparent?: boolean
  sticky?: boolean
}>(), {
  transparent: true,
  sticky: true,
})

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

const NAV = [
  { to: '/browse', key: 'nav.home' },
  { to: '/series', key: 'nav.series' },
  { to: '/films', key: 'nav.films' },
  { to: '/new-and-popular', key: 'nav.newAndPopular' },
  { to: '/my-list', key: 'nav.myList' },
  { to: '/browse-by-language', key: 'nav.browseByLanguage' },
]

const isActive = (to: string) => route.path === to
const userName = computed(() => authStore.user?.full_name || 'Bạn')
</script>

<template>
  <AppHeader :transparent="transparent" :sticky="sticky">
    <template #logo>
      <NuxtLink to="/browse" class="site-header__logo">NOTFLEX</NuxtLink>
    </template>

    <template #navigation>
      <a
        v-for="item in NAV"
        :key="item.to"
        :href="item.to"
        class="site-header__nav-link"
        :class="{ 'is-active': isActive(item.to) }"
      >{{ t(item.key) }}</a>
    </template>

    <template #action>
      <IconButton variant="ghost" size="small" :aria-label="t('action.notifications')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </IconButton>
      <Avatar size="small" :show-arrow="true" :name="userName" />
    </template>
  </AppHeader>
</template>

<style scoped lang="scss">
.site-header {
  &__logo {
    font-family: token("font-family-logo");
    font-size: 28px;
    color: token("color-action-brand");
    letter-spacing: 2px;
    text-decoration: none;
  }

  &__nav-link {
    @include typography-variant("small-body-regular");
    color: token("color-text-secondary");
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s ease;

    &:hover     { color: token("color-text-primary"); }
    &.is-active { font-weight: var(--font-weight-medium); color: token("color-text-primary"); }
  }
}
</style>

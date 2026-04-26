<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const props = defineProps({
  transparent:  { type: Boolean, default: false },
  sticky:       { type: Boolean, default: true },
  hideOnScroll: { type: Boolean, default: false },
})

// ── Scroll state ──────────────────────────────────────────
const isScrolled = ref(false)
const isHidden   = ref(false)
const isMenuOpen = ref(false)

let lastScrollY = 0
let scrollHandler: (() => void) | null = null

function setupScroll() {
  removeScroll()
  if (!props.sticky || (!props.transparent && !props.hideOnScroll)) return
  scrollHandler = () => {
    const y = window.scrollY
    isScrolled.value = y > 20
    if (props.hideOnScroll && !isMenuOpen.value) {
      isHidden.value = y > lastScrollY && y > 80
    }
    lastScrollY = y
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
}

function removeScroll() {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
}

onMounted(setupScroll)
onUnmounted(removeScroll)

watch(() => [props.sticky, props.transparent, props.hideOnScroll], setupScroll)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

const headerClass = computed(() => [
  'app-header',
  {
    'is-sticky':      props.sticky,
    'is-transparent': props.transparent && !isScrolled.value,
    'is-scrolled':    props.transparent && isScrolled.value,
    'is-hidden':      props.hideOnScroll && isHidden.value,
  },
])
</script>

<template>
  <header v-bind="attrs" :class="headerClass">
    <div class="app-header__inner">

      <!-- Logo -->
      <div class="app-header__logo">
        <slot name="logo" />
      </div>

      <!-- Desktop nav (optional) -->
      <nav v-if="$slots.navigation" class="app-header__nav">
        <slot name="navigation" />
      </nav>

      <!-- Right actions + mobile toggle -->
      <div class="app-header__right">
        <div class="app-header__actions">
          <slot name="action" />
        </div>
        <IconButton
          v-if="$slots.navigation"
          class="app-header__toggle"
          variant="ghost"
          size="small"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
          @click="toggleMenu"
        >
          <slot v-if="isMenuOpen" name="icon-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </slot>
          <slot v-else name="icon-menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </slot>
        </IconButton>
      </div>

    </div>

    <!-- Mobile dropdown -->
    <div v-if="$slots.navigation" class="app-header__mobile" :class="{ 'is-open': isMenuOpen }">
      <div class="app-header__mobile-body" @click="isMenuOpen = false">
        <slot name="navigation" />
        <slot name="action" />
      </div>
    </div>
  </header>
</template>

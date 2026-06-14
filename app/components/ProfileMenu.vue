<script setup lang="ts">
// Header avatar + profile dropdown, shared across every authenticated page.
const authStore = useAuthStore()
const { listProfiles } = useProfiles()

const popoverProfiles = computed(() =>
  authStore.profiles.map(p => ({ value: p.id, name: p.name, image: p.avatar_url ?? '' })),
)
const activeId = computed(() => authStore.activeProfile?.id ?? authStore.profiles[0]?.id ?? '')
const activeData = computed(() => popoverProfiles.value.find(p => p.value === activeId.value))

// Make sure the list exists even on pages that didn't fetch it.
onMounted(() => {
  if (!authStore.profiles.length) listProfiles().catch(() => {})
})

async function onSelectProfile(id: string) {
  const profile = authStore.profiles.find(p => p.id === id)
  if (!profile || profile.id === authStore.activeProfile?.id) return
  authStore.selectProfile(profile)
  // Refetch profile-scoped data (continue watching, favorites, recommendations)
  // in place — no jarring full-page reload.
  await refreshNuxtData()
}

function onMenuAction(action: string) {
  if (action === 'account') navigateTo('/account')
  else if (action === 'manage-profiles') navigateTo('/account?section=profiles')
  else if (action === 'transfer-profiles') navigateTo('/account/transfer-profile')
  else if (action === 'help') navigateTo('/')
}

async function onSignOut() {
  await authStore.logout()
  navigateTo('/login')
}
</script>

<template>
  <AvatarPopover
    :profiles="popoverProfiles"
    :active-profile="activeId"
    @select-profile="onSelectProfile"
    @menu-action="onMenuAction"
    @sign-out="onSignOut"
  >
    <template #trigger="{ triggerProps }">
      <Avatar
        size="small"
        :show-arrow="true"
        :name="activeData?.name ?? ''"
        :image="activeData?.image ?? ''"
        v-bind="(triggerProps as any)"
      />
    </template>
  </AvatarPopover>
</template>

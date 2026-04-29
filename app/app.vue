<script setup lang="ts">
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { user, token } = storeToRefs(authStore)

async function loadProfile() {
  const data: any = await $api('/auth/me', {
    method: 'GET',
    headers: { 'Cache-Control': 'no-cache' },
  })
  authStore.updateUser(data)
}

onMounted(() => {
  if (!user.value && token.value) {
    loadProfile().catch(() => {
      authStore.logout()
      navigateTo('/login')
    })
  }
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

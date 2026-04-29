export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const authRequired = to.meta.authRequired !== false

  if (import.meta.client) {
    const token = localStorage.getItem('token')
    if (token && !authStore.token) {
      authStore.token = token
    }
    const profileId = localStorage.getItem('profileId')
    if (profileId && !authStore.activeProfile && authStore.user) {
      const profile = authStore.user.profiles.find(p => p.id === profileId)
      if (profile) authStore.activeProfile = profile
    }
  }

  if (authRequired && !authStore.token) {
    return navigateTo('/login')
  }
})

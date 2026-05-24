export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (to.meta.guestOnly && authStore.token) {
    return navigateTo('/browse')
  }

  if (to.meta.authRequired !== false && !authStore.token) {
    return navigateTo('/login')
  }
})

import type { AuthUser } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')

  if (!token || authStore.user) return

  authStore.token = token
  try {
    const { $api } = useNuxtApp()
    const user = await $api<AuthUser>('/auth/me')
    authStore.updateUser(user)
  } catch {
    authStore.token = null
    localStorage.removeItem('token')
    localStorage.removeItem('profileId')
  }
})

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: (config.public.apiUrl as string) || 'http://localhost:8080',

    async onRequest({ options }) {
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
      if (authStore.activeProfile?.id) {
        options.headers.set('X-Profile-Id', authStore.activeProfile.id)
      }
    },

    async onResponseError({ request, response }) {
      const url = typeof request === 'string' ? request : request.url
      switch (response.status) {
        case 401: {
          if (url.includes('/auth/logout')) return
          const authStore = useAuthStore()
          if (!authStore.token) return
          await authStore.logout()
          navigateTo('/login')
          break
        }
        case 400:
        case 403:
        case 404:
        case 500:
          console.error(`API Error ${response.status}:`, response._data?.message || response.statusText)
          break
      }
    },
  })

  return {
    provide: { api },
  }
})

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiUrl as string,

    async onRequest({ options }) {
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },

    async onResponseError({ response }) {
      switch (response.status) {
        case 401: {
          const authStore = useAuthStore()
          authStore.logout()
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

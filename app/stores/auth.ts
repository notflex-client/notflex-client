import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProfile {
  id: string
  name: string
  image?: string
}

export interface AuthUser {
  id: string
  email: string
  profiles: UserProfile[]
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const activeProfile = ref<UserProfile | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const profiles = computed(() => user.value?.profiles ?? [])

  function login(t: string, u: AuthUser) {
    token.value = t
    user.value = u
    localStorage.setItem('token', t)
    if (u.profiles.length === 1) {
      selectProfile(u.profiles[0])
    }
  }

  function logout() {
    token.value = null
    user.value = null
    activeProfile.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('profileId')
  }

  function updateUser(u: AuthUser) {
    user.value = u
  }

  function selectProfile(profile: UserProfile) {
    activeProfile.value = profile
    localStorage.setItem('profileId', profile.id)
  }

  return {
    token,
    user,
    activeProfile,
    isLoggedIn,
    profiles,
    login,
    logout,
    updateUser,
    selectProfile,
  }
})

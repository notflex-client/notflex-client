import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProfile {
  id: string
  name: string
  avatar_url?: string | null
  is_kids?: boolean
}

export interface AuthUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string | null
  role: string
  is_active: boolean
  profiles?: UserProfile[]
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const activeProfile = ref<UserProfile | null>(null)
  const maxProfiles = ref(1)

  const isLoggedIn = computed(() => !!token.value)
  const profiles = computed(() => user.value?.profiles ?? [])
  const canAddProfile = computed(() => profiles.value.length < maxProfiles.value)

  function login(t: string, u: AuthUser) {
    token.value = t
    user.value = u
    localStorage.setItem('token', t)
    if (u.profiles?.length === 1) {
      selectProfile(u.profiles[0]!)
    }
  }

  async function logout() {
    const previousToken = token.value
    token.value = null
    user.value = null
    activeProfile.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('profileId')

    if (previousToken) {
      try {
        await $fetch('/auth/logout', {
          baseURL: (useRuntimeConfig().public.apiUrl as string) || 'http://localhost:8080',
          method: 'DELETE',
          headers: { Authorization: `Bearer ${previousToken}` },
        })
      } catch {}
    }
  }

  function updateUser(u: AuthUser) {
    user.value = u
    restoreActiveProfile()
  }

  function selectProfile(profile: UserProfile) {
    activeProfile.value = profile
    localStorage.setItem('profileId', profile.id)
  }

  // Replace the account's profile list (e.g. after a create/update/delete) and
  // keep activeProfile in sync — refresh it if it was edited, clear it if removed.
  function setProfiles(list: UserProfile[], max?: number) {
    if (user.value) user.value.profiles = list
    if (typeof max === 'number') maxProfiles.value = max
    if (activeProfile.value) {
      const match = list.find(p => p.id === activeProfile.value!.id)
      activeProfile.value = match ?? null
      if (!match) localStorage.removeItem('profileId')
    }
  }

  // Rehydrate the active profile from localStorage after the user is loaded.
  function restoreActiveProfile() {
    if (activeProfile.value) return
    const savedId = localStorage.getItem('profileId')
    if (!savedId) return
    const match = user.value?.profiles?.find(p => p.id === savedId)
    if (match) activeProfile.value = match
  }

  return {
    token,
    user,
    activeProfile,
    maxProfiles,
    isLoggedIn,
    profiles,
    canAddProfile,
    login,
    logout,
    updateUser,
    selectProfile,
    setProfiles,
    restoreActiveProfile,
  }
})

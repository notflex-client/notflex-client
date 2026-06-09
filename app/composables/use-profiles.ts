import type { UserProfile } from '~/stores/auth'

export interface ProfilePayload {
  name: string
  avatar_url?: string | null
  is_kids?: boolean
}

export const MAX_PROFILES = 5

// Preset avatars offered when creating/editing a profile (Netflix-style picker).
export const PROFILE_AVATARS = [
  'https://i.pravatar.cc/150?img=11',
  'https://i.pravatar.cc/150?img=47',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=32',
  'https://i.pravatar.cc/150?img=15',
  'https://i.pravatar.cc/150?img=68',
]

export function useProfiles() {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

  async function listProfiles() {
    const res = await $api<{ items: UserProfile[]; max_profiles: number }>('/profiles')
    authStore.setProfiles(res.items, res.max_profiles)
    return res.items
  }

  async function createProfile(payload: ProfilePayload) {
    const created = await $api<UserProfile>('/profiles', { method: 'POST', body: payload })
    await listProfiles()
    return created
  }

  async function updateProfile(id: string, payload: ProfilePayload) {
    const updated = await $api<UserProfile>(`/profiles/${id}`, { method: 'PUT', body: payload })
    await listProfiles()
    return updated
  }

  async function deleteProfile(id: string) {
    await $api<boolean>(`/profiles/${id}`, { method: 'DELETE' })
    await listProfiles()
  }

  return { listProfiles, createProfile, updateProfile, deleteProfile }
}

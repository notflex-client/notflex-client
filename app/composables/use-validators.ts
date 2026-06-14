// Lightweight client-side validators. Each returns a translated error message,
// or '' when the value is valid — designed to feed InputField's :error prop.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useValidators() {
  const { t } = useI18n()

  function required(v: string | null | undefined): string {
    return !v || !v.trim() ? t('validation.required') : ''
  }

  function email(v: string | null | undefined): string {
    if (!v || !v.trim()) return t('validation.required')
    return EMAIL_RE.test(v.trim()) ? '' : t('validation.email')
  }

  function minLen(v: string | null | undefined, n: number): string {
    if (!v || !v.trim()) return t('validation.required')
    return v.length < n ? t('validation.minLen', { n }) : ''
  }

  // Upper, lower, number and symbol — mirrors the backend StrongPassword rule.
  function passwordStrong(v: string | null | undefined): string {
    if (!v) return t('validation.required')
    if (v.length < 8) return t('validation.minLen', { n: 8 })
    const ok = /[a-z]/.test(v) && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^a-zA-Z0-9]/.test(v)
    return ok ? '' : t('validation.passwordStrong')
  }

  function match(a: string, b: string): string {
    return a !== b ? t('validation.passwordMatch') : ''
  }

  function otp(v: string | null | undefined, n = 6): string {
    if (!v || !v.trim()) return t('validation.required')
    return /^\d+$/.test(v.trim()) && v.trim().length === n ? '' : t('validation.otp', { n })
  }

  return { required, email, minLen, passwordStrong, match, otp }
}

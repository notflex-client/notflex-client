export const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
]

export function useLocale() {
  const { locale, setLocale } = useI18n()

  const lang = computed({
    get: () => locale.value,
    set: (val: string) => setLocale(val as 'en' | 'vi'),
  })

  return { lang, LANG_OPTIONS }
}

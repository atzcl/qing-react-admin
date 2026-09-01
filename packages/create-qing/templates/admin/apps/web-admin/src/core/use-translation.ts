import { useAppSelector } from './app-store'
import { translate } from './i18n'
import type { TranslationKey } from './types'

export function useTranslation() {
  const locale = useAppSelector((state) => state.preferences.locale)
  return (key: TranslationKey, parameters?: Record<string, number | string>) =>
    translate(locale, key, parameters)
}

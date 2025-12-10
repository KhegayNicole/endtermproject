import { useState, useEffect } from 'react'
import { getLanguage, setLanguage, t as translate, getSupportedLanguages } from '../i18n/i18n.js'

export function useTranslation() {
  const [lang, setLangState] = useState(getLanguage())

  const changeLanguage = (newLang) => {
    setLanguage(newLang)
    setLangState(newLang)
    // Trigger re-render by updating state
    window.dispatchEvent(new Event('languagechange'))
  }

  useEffect(() => {
    const handleLanguageChange = () => {
      setLangState(getLanguage())
    }
    window.addEventListener('languagechange', handleLanguageChange)
    return () => window.removeEventListener('languagechange', handleLanguageChange)
  }, [])

  return {
    t: translate,
    language: lang,
    setLanguage: changeLanguage,
    supportedLanguages: getSupportedLanguages(),
  }
}


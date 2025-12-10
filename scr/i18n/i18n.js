import { translations } from './translations.js'

const DEFAULT_LANG = 'en'
const SUPPORTED_LANGS = ['en', 'ru', 'kz']

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem('evrthng_lang')
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      return stored
    }
  } catch (err) {
    console.warn('[i18n] Failed to read stored language', err)
  }
  return DEFAULT_LANG
}

function detectLanguage() {
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.toLowerCase().split('-')[0]
    if (SUPPORTED_LANGS.includes(lang)) {
      return lang
    }
  }
  return DEFAULT_LANG
}

let currentLanguage = getStoredLanguage() || detectLanguage()

export function getLanguage() {
  return currentLanguage
}

export function setLanguage(lang) {
  if (SUPPORTED_LANGS.includes(lang)) {
    currentLanguage = lang
    try {
      localStorage.setItem('evrthng_lang', lang)
    } catch (err) {
      console.warn('[i18n] Failed to save language', err)
    }
  }
}

export function t(key, params = {}) {
  const keys = key.split('.')
  let value = translations[currentLanguage] || translations[DEFAULT_LANG]
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      // Fallback to default language
      value = translations[DEFAULT_LANG]
      for (const k2 of keys) {
        if (value && typeof value === 'object') {
          value = value[k2]
        } else {
          return key
        }
      }
      break
    }
  }
  
  if (typeof value !== 'string') {
    return key
  }
  
  // Simple parameter replacement
  return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? String(params[paramKey]) : match
  })
}

export function getSupportedLanguages() {
  return SUPPORTED_LANGS
}


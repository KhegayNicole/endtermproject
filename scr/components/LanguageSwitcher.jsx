import { useTranslation } from '../hooks/useTranslation.js'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const { language, setLanguage, supportedLanguages } = useTranslation()

  const languageNames = {
    en: 'English',
    ru: 'Русский',
    kz: 'Қазақша',
  }

  return (
    <div className="language-switcher">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  )
}


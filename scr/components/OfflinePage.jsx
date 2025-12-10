import { useOfflineStatus } from '../hooks/useOfflineStatus.js'
import { useTranslation } from '../hooks/useTranslation.js'
import './OfflinePage.css'

export function OfflinePage() {
  const isOffline = useOfflineStatus()
  const { t } = useTranslation()

  if (!isOffline) return null

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="offline-page">
      <div className="offline-content">
        <div className="offline-icon">📡</div>
        <h1 className="offline-title">{t('offline.pageTitle')}</h1>
        <p className="offline-description">{t('offline.pageDesc')}</p>
        <button className="offline-retry-btn" onClick={handleRetry}>
          {t('offline.retry')}
        </button>
      </div>
    </div>
  )
}


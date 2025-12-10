import { useOfflineStatus } from '../hooks/useOfflineStatus.js'
import { useTranslation } from '../hooks/useTranslation.js'
import './OfflineBanner.css'

export function OfflineBanner() {
  const isOffline = useOfflineStatus()
  const { t } = useTranslation()
  if (!isOffline) return null
  return (
    <div className="offline-banner">
      <p>{t('offline.banner')}</p>
    </div>
  )
}


import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar.jsx'
import { OfflineBanner } from './OfflineBanner.jsx'
import { OfflinePage } from './OfflinePage.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useFavorites } from '../hooks/useFavorites.js'
import { useOfflineStatus } from '../hooks/useOfflineStatus.js'
import './RootLayout.css'

export function RootLayout() {
  const { user } = useAuth()
  const { initialize } = useFavorites()
  const isOffline = useOfflineStatus()

  useEffect(() => {
    initialize(user?.uid ?? null)
  }, [initialize, user?.uid])

  return (
    <div className="root-layout">
      <NavBar />
      <OfflineBanner />
      {isOffline && <OfflinePage />}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}


import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { Spinner } from './Spinner.jsx'
import { profileService } from '../services/profileService.js'
import { useOfflineStatus } from '../hooks/useOfflineStatus.js'
import './Profile.css'

export function Profile() {
  const navigate = useNavigate()
  const { user, isLoading, logout } = useAuth()
  const [photoURL, setPhotoURL] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileLoaded, setProfileLoaded] = useState(false)
  const workerRef = useRef(null)
  const isOffline = useOfflineStatus()

  useEffect(() => {
    try {
      workerRef.current = new Worker(new URL('../workers/imageWorker.js', import.meta.url), {
        type: 'module',
      })
    } catch (err) {
      console.warn('[profile] Worker init failed, fallback to direct upload', err)
      workerRef.current = null
    }
    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    if (user?.uid) {
      profileService
        .getProfile(user.uid)
        .then((data) => setPhotoURL(data.photoURL || null))
        .catch((err) => setProfileError(err.message))
        .finally(() => setProfileLoaded(true))
    }
  }, [user])

  if (isLoading || !profileLoaded) {
    return <Spinner />
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !user?.uid) return

    setProfileError('')
    setUploading(true)

    const validTypes = ['image/png', 'image/jpeg']
    if (!validTypes.includes(file.type)) {
      setProfileError('Allowed formats: JPG, JPEG, PNG')
      setUploading(false)
      return
    }

    // Если есть рабочий воркер
    if (workerRef.current) {
      try {
        // Создаём безопасную копию ArrayBuffer
        const original = await file.arrayBuffer()
        const bufferCopy = original.slice(0)

        workerRef.current.onmessage = async ({ data }) => {
          if (!data.success) {
            console.warn('[profile] Worker failed, switching to fallback')
            workerRef.current = null // отключаем воркер полностью

            try {
              const url = await profileService.uploadProfilePhoto(user.uid, file, file.name)
              setPhotoURL(url)
            } catch (err) {
              setProfileError(err.message || 'Upload failed')
            } finally {
              setUploading(false)
            }
            return
          }

          try {
            const url = await profileService.uploadProfilePhoto(user.uid, data.blob, file.name)
            setPhotoURL(url)
          } catch (err) {
            setProfileError(err.message || 'Upload failed')
          } finally {
            setUploading(false)
          }
        }

        // Правильный postMessage
        workerRef.current.postMessage(
          {
            buffer: bufferCopy,
            type: file.type,
          },
          [bufferCopy]
        )

        return
      } catch (err) {
        console.warn('[profile] Worker error → fallback', err)
        workerRef.current = null
      }
    }

    // Fallback — загрузка оригинального файла  
    profileService
      .uploadProfilePhoto(user.uid, file, file.name)
      .then((url) => setPhotoURL(url))
      .catch((err) => setProfileError(err.message || 'Upload failed'))
      .finally(() => setUploading(false))
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {photoURL ? (
            <img src={photoURL} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar placeholder">No photo</div>
          )}
          <div>
            <p className="profile-eyebrow">Signed in as</p>
            <h1 className="profile-title">{user?.email}</h1>
          </div>
        </div>

        <dl className="profile-details">
          <div>
            <dt>User ID</dt>
            <dd>{user?.uid}</dd>
          </div>
          {user?.metadata?.creationTime && (
            <div>
              <dt>Created</dt>
              <dd>{new Date(user.metadata.creationTime).toLocaleString()}</dd>
            </div>
          )}
          {user?.metadata?.lastSignInTime && (
            <div>
              <dt>Last sign-in</dt>
              <dd>{new Date(user.metadata.lastSignInTime).toLocaleString()}</dd>
            </div>
          )}
        </dl>

        <div className="upload-section">
          <label htmlFor="profile-photo">Profile picture (.jpg / .png)</label>
          <input
            id="profile-photo"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
          {isOffline && <p className="offline-warning">You are offline. Upload will resume when online.</p>}
          {profileError && <p className="auth-error">{profileError}</p>}
          <button
            className="profile-upload"
            type="button"
            disabled={uploading || isOffline}
            onClick={() => document.getElementById('profile-photo')?.click()}
          >
            {uploading ? 'Uploading…' : 'Select file to upload'}
          </button>
        </div>

        <button className="profile-logout" type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}
<p className="auth-error">{profileError}</p>}
          <button
            className="profile-upload"
            type="button"
            disabled={uploading || isOffline}
            onClick={() => document.getElementById('profile-photo')?.click()}
          >
            {uploading ? 'Uploading…' : 'Select file to upload'}
          </button>
        </div>

        <button className="profile-logout" type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}



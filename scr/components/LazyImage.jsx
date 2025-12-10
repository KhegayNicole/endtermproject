import { useState, Suspense, lazy } from 'react'
import './LazyImage.css'

const ImageComponent = lazy(() => Promise.resolve({ default: ({ src, alt, className, ...props }) => <img src={src} alt={alt} className={className} {...props} /> }))

function ImageSkeleton({ className }) {
  return <div className={`image-skeleton ${className || ''}`} aria-label="Loading image" />
}

export function LazyImage({ src, alt, className, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className="lazy-image-wrapper">
      {!loaded && !error && <ImageSkeleton className={className} />}
      {error && (
        <div className={`image-error ${className || ''}`}>
          <span>📷</span>
        </div>
      )}
      <Suspense fallback={<ImageSkeleton className={className} />}>
        <ImageComponent
          src={src}
          alt={alt}
          className={`lazy-image ${loaded ? 'loaded' : 'loading'} ${className || ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true)
            setLoaded(true)
          }}
          loading="lazy"
          {...props}
        />
      </Suspense>
    </div>
  )
}


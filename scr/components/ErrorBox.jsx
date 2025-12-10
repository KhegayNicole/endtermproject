import './ErrorBox.css'

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="error-box">
      <p className="error-message">{error}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}


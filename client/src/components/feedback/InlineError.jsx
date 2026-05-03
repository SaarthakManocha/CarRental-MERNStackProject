const InlineError = ({ message = '', onRetry, className = '' }) => {
  if (!message) {
    return null
  }

  return (
    <div className={`inline-error ${className}`.trim()} role="alert" aria-live="polite">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="btn ghost btn-sm" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  )
}

export default InlineError

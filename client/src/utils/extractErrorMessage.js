const extractErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback

  const data = error.response?.data

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const firstError = data.errors[0]

    if (typeof firstError === 'string') {
      return firstError
    }

    if (typeof firstError?.msg === 'string') {
      return firstError.msg
    }
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.'
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.'
  }

  return fallback
}

export default extractErrorMessage

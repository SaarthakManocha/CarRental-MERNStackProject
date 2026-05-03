const requiredVars = ['MONGO_URI', 'JWT_SECRET']

export const getEnv = () => {
  const missing = requiredVars.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return {
    port: Number(process.env.PORT || 5000),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
  }
}

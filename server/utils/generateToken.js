import jwt from 'jsonwebtoken'

export const generateToken = ({ userId, role }, secret, expiresIn = '7d') =>
  jwt.sign({ userId, role }, secret, { expiresIn })

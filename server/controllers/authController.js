import { body } from 'express-validator'

import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]

export const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer',
    })

    const token = generateToken(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    )

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    )

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const getMe = async (req, res) =>
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
    },
  })

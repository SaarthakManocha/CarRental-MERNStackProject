import express from 'express'

import { getMe, login, loginValidators, register, registerValidators } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

router.post('/register', registerValidators, validate, register)
router.post('/login', loginValidators, validate, login)
router.get('/me', protect, getMe)

export default router

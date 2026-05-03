import express from 'express'

import {
  cancelMyBooking,
  createBooking,
  createBookingValidators,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  updateBookingStatusValidators,
} from '../controllers/bookingController.js'
import { protect } from '../middleware/auth.js'
import { roleCheck } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

router.post('/', protect, roleCheck('customer', 'admin'), createBookingValidators, validate, createBooking)
router.get('/my', protect, roleCheck('customer', 'admin'), getMyBookings)
router.patch('/:id/cancel', protect, roleCheck('customer', 'admin'), cancelMyBooking)

router.get('/all', protect, roleCheck('admin'), getAllBookings)
router.patch('/:id/status', protect, roleCheck('admin'), updateBookingStatusValidators, validate, updateBookingStatus)

export default router

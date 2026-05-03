import { body } from 'express-validator'

import Booking from '../models/Booking.js'
import Vehicle from '../models/Vehicle.js'

// Helper: get today at midnight UTC for date comparisons
const todayUTC = () => {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

// Valid status transitions (state machine)
const VALID_TRANSITIONS = {
  active: ['cancelled', 'completed'],
  cancelled: [],
  completed: [],
}

export const createBookingValidators = [
  body('vehicleId').notEmpty().withMessage('vehicleId is required'),
  body('startDate').isISO8601().withMessage('startDate must be a valid ISO date'),
  body('endDate').isISO8601().withMessage('endDate must be a valid ISO date'),
]

export const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, startDate, endDate } = req.body

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid booking dates' })
    }

    if (start > end) {
      return res.status(400).json({ message: 'startDate must be before or equal to endDate' })
    }

    // Reject past dates
    const today = todayUTC()
    if (start < today) {
      return res.status(400).json({ message: 'Cannot book for dates that have already passed' })
    }

    const vehicle = await Vehicle.findById(vehicleId)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: 'Vehicle is currently unavailable' })
    }

    const conflict = await Booking.findOne({
      vehicle: vehicleId,
      status: 'active',
      startDate: { $lte: end },
      endDate: { $gte: start },
    })

    if (conflict) {
      return res.status(409).json({ message: 'Vehicle already booked for overlapping dates' })
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    const totalPrice = days * vehicle.dailyRate

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'active',
    })

    return res.status(201).json({ message: 'Booking created', booking })
  } catch (error) {
    return next(error)
  }
}

export const getMyBookings = async (req, res, next) => {
  try {
    // Auto-complete past active bookings before returning
    const today = todayUTC()
    await Booking.updateMany(
      { user: req.user._id, status: 'active', endDate: { $lt: today } },
      { $set: { status: 'completed' } }
    )

    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 })

    return res.status(200).json({ count: bookings.length, bookings })
  } catch (error) {
    return next(error)
  }
}

export const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' })
    }

    if (booking.status !== 'active') {
      return res.status(409).json({ message: `Booking is already ${booking.status}` })
    }

    // Block cancellation of bookings that have already started
    const today = todayUTC()
    if (booking.startDate <= today) {
      return res.status(409).json({ message: 'Cannot cancel a booking that has already started or is in progress' })
    }

    booking.status = 'cancelled'
    await booking.save()

    return res.status(200).json({ message: 'Booking cancelled', booking })
  } catch (error) {
    return next(error)
  }
}

export const getAllBookings = async (req, res, next) => {
  try {
    // Auto-complete past active bookings globally for admin view
    const today = todayUTC()
    await Booking.updateMany(
      { status: 'active', endDate: { $lt: today } },
      { $set: { status: 'completed' } }
    )

    const bookings = await Booking.find()
      .populate('vehicle')
      .populate('user', 'name email role')
      .sort({ startDate: 1 })

    return res.status(200).json({ count: bookings.length, bookings })
  } catch (error) {
    return next(error)
  }
}

export const updateBookingStatusValidators = [
  body('status')
    .isIn(['active', 'cancelled', 'completed'])
    .withMessage('status must be active, cancelled or completed'),
]

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Enforce state machine transitions
    const allowed = VALID_TRANSITIONS[booking.status] || []
    if (!allowed.includes(status)) {
      return res.status(409).json({
        message: `Cannot transition from '${booking.status}' to '${status}'`,
      })
    }

    booking.status = status
    await booking.save()

    return res.status(200).json({ message: 'Booking status updated', booking })
  } catch (error) {
    return next(error)
  }
}

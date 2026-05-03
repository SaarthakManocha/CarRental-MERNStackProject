import { body, query } from 'express-validator'

import Booking from '../models/Booking.js'
import Vehicle from '../models/Vehicle.js'
import escapeRegex from '../utils/escapeRegex.js'

// Helper: get today at midnight UTC
const todayUTC = () => {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export const createVehicleValidators = [
  body('name').trim().notEmpty().withMessage('Vehicle name is required'),
  body('type').trim().notEmpty().withMessage('Vehicle type is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1950 }).withMessage('Valid year is required'),
  body('dailyRate').isFloat({ min: 1 }).withMessage('dailyRate must be >= 1'),
]

export const updateVehicleValidators = [
  body('name').optional().trim().notEmpty().withMessage('Vehicle name cannot be empty'),
  body('year').optional().isInt({ min: 1950 }).withMessage('year must be valid'),
  body('dailyRate').optional().isFloat({ min: 1 }).withMessage('dailyRate must be >= 1'),
]

export const listVehicleValidators = [
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be >= 0'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be >= 0'),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO date'),
]

export const getVehicles = async (req, res, next) => {
  try {
    const { type, brand, minPrice, maxPrice, isAvailable, startDate, endDate } = req.query

    const filter = {}

    if (type) filter.type = String(type).toLowerCase()
    if (brand) filter.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i')

    if (minPrice || maxPrice) {
      filter.dailyRate = {}
      if (minPrice) filter.dailyRate.$gte = Number(minPrice)
      if (maxPrice) filter.dailyRate.$lte = Number(maxPrice)
    }

    if (typeof isAvailable !== 'undefined') {
      filter.isAvailable = isAvailable === 'true'
    }

    const hasDateRange = Boolean(startDate || endDate)

    if (hasDateRange) {
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Both startDate and endDate are required for date filtering' })
      }

      const parsedStart = new Date(startDate)
      const parsedEnd = new Date(endDate)

      if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
        return res.status(400).json({ message: 'Invalid date range' })
      }

      if (parsedStart > parsedEnd) {
        return res.status(400).json({ message: 'startDate must be before or equal to endDate' })
      }

      const conflictVehicleIds = await Booking.distinct('vehicle', {
        status: 'active',
        startDate: { $lte: parsedEnd },
        endDate: { $gte: parsedStart },
      })

      filter._id = { $nin: conflictVehicleIds }

      if (typeof isAvailable === 'undefined') {
        filter.isAvailable = true
      }
    }

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 })

    return res.status(200).json({ count: vehicles.length, vehicles })
  } catch (error) {
    return next(error)
  }
}

export const getBrands = async (req, res, next) => {
  try {
    const brands = await Vehicle.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          brand: '$_id',
          count: 1,
        },
      },
    ])

    return res.status(200).json({ brands })
  } catch (error) {
    return next(error)
  }
}

export const getVehiclesByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params
    const vehicles = await Vehicle.find({ brand: new RegExp(`^${escapeRegex(brand)}$`, 'i') }).sort({ year: -1 })

    return res.status(200).json({ count: vehicles.length, vehicles })
  } catch (error) {
    return next(error)
  }
}

export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }

    return res.status(200).json({ vehicle })
  } catch (error) {
    return next(error)
  }
}

export const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body)
    return res.status(201).json({ message: 'Vehicle created', vehicle })
  } catch (error) {
    return next(error)
  }
}

export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }

    return res.status(200).json({ message: 'Vehicle updated', vehicle })
  } catch (error) {
    return next(error)
  }
}

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }

    // Block deletion if vehicle has active future bookings
    const activeBookings = await Booking.countDocuments({
      vehicle: req.params.id,
      status: 'active',
      endDate: { $gte: todayUTC() },
    })

    if (activeBookings > 0) {
      return res.status(409).json({
        message: `Cannot delete vehicle with ${activeBookings} active booking(s). Cancel them first.`,
      })
    }

    await Vehicle.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: 'Vehicle deleted' })
  } catch (error) {
    return next(error)
  }
}

export const checkVehicleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' })
    }

    const parsedStart = new Date(startDate)
    const parsedEnd = new Date(endDate)

    if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
      return res.status(400).json({ message: 'Invalid date range' })
    }

    if (parsedStart > parsedEnd) {
      return res.status(400).json({ message: 'startDate must be before or equal to endDate' })
    }

    // Reject past dates
    const today = todayUTC()
    if (parsedStart < today) {
      return res.status(400).json({ message: 'Cannot check availability for dates that have already passed' })
    }

    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }

    if (!vehicle.isAvailable) {
      return res.status(200).json({ available: false, reason: 'Vehicle disabled by admin' })
    }

    const conflict = await Booking.findOne({
      vehicle: id,
      status: 'active',
      startDate: { $lte: parsedEnd },
      endDate: { $gte: parsedStart },
    })

    return res.status(200).json({
      available: !conflict,
      ...(conflict && { reason: 'Date overlap with another active booking' }),
    })
  } catch (error) {
    return next(error)
  }
}

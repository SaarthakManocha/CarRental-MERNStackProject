import mongoose from 'mongoose'

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['sedan', 'suv', 'hatchback', 'luxury', 'sports', 'truck', 'coupe', 'hypercar', 'supercar'],
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1950,
    },
    dailyRate: {
      type: Number,
      required: true,
      min: 1,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },
    transmission: {
      type: String,
      enum: ['automatic', 'manual'],
      default: 'automatic',
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
      default: 'petrol',
    },
    description: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // RR3-inspired stats kept for showroom detail views and filtering.
    stats: {
      topSpeed: { type: Number, min: 0 },
      acceleration: { type: Number, min: 0 },
      braking: { type: Number, min: 0 },
      grip: { type: Number, min: 0 },
      rr3Class: { type: String, trim: true },
      rr3Type: { type: String, trim: true },
      rr3Pr: { type: Number, min: 0 },
    },
  },
  { timestamps: true }
)

vehicleSchema.index({ brand: 1, model: 1, year: 1 })
vehicleSchema.index({ type: 1, dailyRate: 1, isAvailable: 1 })

export default mongoose.model('Vehicle', vehicleSchema)

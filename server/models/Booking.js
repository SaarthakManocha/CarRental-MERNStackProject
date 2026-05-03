import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
)

bookingSchema.index({ vehicle: 1, status: 1, startDate: 1, endDate: 1 })
bookingSchema.index({ user: 1, createdAt: -1 })

bookingSchema.pre('validate', function validateBookingDates() {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    throw new Error('startDate must be before or equal to endDate')
  }
})

export default mongoose.model('Booking', bookingSchema)

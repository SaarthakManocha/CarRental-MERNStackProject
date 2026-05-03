import express from 'express'

import {
  checkVehicleAvailability,
  createVehicle,
  createVehicleValidators,
  deleteVehicle,
  getBrands,
  getVehicleById,
  getVehicles,
  getVehiclesByBrand,
  listVehicleValidators,
  updateVehicle,
  updateVehicleValidators,
} from '../controllers/vehicleController.js'
import { protect } from '../middleware/auth.js'
import { roleCheck } from '../middleware/roleCheck.js'
import { uploadVehicleImage } from '../middleware/upload.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

router.get('/', listVehicleValidators, validate, getVehicles)
router.get('/brands', getBrands)
router.get('/brand/:brand', getVehiclesByBrand)
router.get('/:id', getVehicleById)
router.get('/:id/availability', checkVehicleAvailability)

router.post('/', protect, roleCheck('admin'), createVehicleValidators, validate, createVehicle)
router.post('/upload-image', protect, roleCheck('admin'), uploadVehicleImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' })
  }
  res.json({ message: 'Image uploaded', filename: req.file.filename })
})
router.put('/:id', protect, roleCheck('admin'), updateVehicleValidators, validate, updateVehicle)
router.delete('/:id', protect, roleCheck('admin'), deleteVehicle)

export default router

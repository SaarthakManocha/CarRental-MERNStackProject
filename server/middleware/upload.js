import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Save to client/public/vehicle-images/
const uploadDir = path.resolve(__dirname, '../../client/public/vehicle-images')

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Expect the frontend to send the correct slugified filename
    const customName = req.body.imageName
    if (customName) {
      const ext = path.extname(file.originalname) || '.webp'
      cb(null, customName + ext)
    } else {
      // Fallback: use original filename
      cb(null, file.originalname)
    }
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/webp', 'image/jpeg', 'image/png', 'image/jpg']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only .webp, .jpg, .jpeg, and .png files are allowed'), false)
  }
}

export const uploadVehicleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
})

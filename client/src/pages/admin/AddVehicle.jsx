import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { createVehicle, uploadVehicleImage } from '../../api/vehicleApi'
import InlineError from '../../components/feedback/InlineError'
import AdminShell from '../../components/layout/AdminShell'
import extractErrorMessage from '../../utils/extractErrorMessage'

const VEHICLE_TYPES = ['sports', 'supercar', 'hypercar', 'luxury', 'suv', 'coupe', 'sedan']
const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid']
const TRANSMISSIONS = ['automatic', 'manual']
const DRIVETRAINS = ['RWD', 'AWD', 'FWD', 'MR', 'FR', 'M4', 'F4']

const slugify = (str) =>
  String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const AddVehicle = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [form, setForm] = useState({
    brand: '',
    model: '',
    name: '',
    type: 'sports',
    year: new Date().getFullYear(),
    dailyRate: '',
    seats: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    drivetrain: 'RWD',
    topSpeed: '',
    acceleration: '',
    power: '',
    weight: '',
    color: '',
  })

  const expectedFilename = form.brand && form.model
    ? `${slugify(form.brand)}-${slugify(form.model)}`
    : ''

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (file) => {
    if (!file) return
    const validTypes = ['image/webp', 'image/jpeg', 'image/png']
    if (!validTypes.includes(file.type)) {
      toast.error('Only .webp, .jpg, or .png files are allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10 MB')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer?.files?.[0]
    handleFileSelect(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    if (e.type === 'dragleave') setDragActive(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSaving(true)

    try {
      // 1. Upload image first (if provided)
      if (imageFile && expectedFilename) {
        await uploadVehicleImage(imageFile, expectedFilename)
      }

      // 2. Create the vehicle record
      const payload = {
        brand: form.brand,
        model: form.model,
        name: form.name || `${form.brand} ${form.model}`,
        type: form.type,
        year: Number(form.year),
        dailyRate: Number(form.dailyRate),
        seats: Number(form.seats),
        transmission: form.transmission,
        fuelType: form.fuelType,
      }

      if (form.topSpeed) payload.topSpeed = Number(form.topSpeed)
      if (form.acceleration) payload.acceleration = Number(form.acceleration)
      if (form.power) payload.power = form.power
      if (form.weight) payload.weight = Number(form.weight)
      if (form.color) payload.color = form.color
      if (form.drivetrain) payload.drivetrain = form.drivetrain

      await createVehicle(payload)
      toast.success(`${form.brand} ${form.model} added to fleet`)
      navigate('/admin/vehicles')
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to add vehicle')
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell title="Add New Vehicle" eyebrow="Fleet Management">
      <InlineError message={errorMessage} />

      <form className="add-vehicle-form" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="av-section">
          <h4 className="av-section-title">Vehicle Image</h4>
          <div
            className={`av-dropzone ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-preview' : ''}`}
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".webp,.jpg,.jpeg,.png"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              hidden
            />
            {imagePreview ? (
              <div className="av-preview-wrap">
                <img src={imagePreview} alt="Preview" className="av-preview-img" />
                <div className="av-preview-overlay">
                  <span>Click to replace</span>
                </div>
              </div>
            ) : (
              <div className="av-dropzone-content">
                <div className="av-dropzone-icon">+</div>
                <p>Drag and drop an image here, or click to browse</p>
                <span>Supports .webp, .jpg, .png (max 10 MB)</span>
              </div>
            )}
          </div>
          {imageFile && (
            <div className="av-file-info">
              <span>{imageFile.name}</span>
              <span>{(imageFile.size / 1024).toFixed(0)} KB</span>
              <button type="button" className="admin-btn-sm danger" onClick={() => { setImageFile(null); setImagePreview(null) }}>
                Remove
              </button>
            </div>
          )}
          {expectedFilename && (
            <p className="av-filename-hint">
              Will be saved as: <strong>{expectedFilename}.webp</strong>
            </p>
          )}
        </div>

        {/* Basic Info */}
        <div className="av-section">
          <h4 className="av-section-title">Basic Information</h4>
          <div className="av-grid av-grid-3">
            <label className="av-field">
              <span>Brand</span>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Ferrari" required />
            </label>
            <label className="av-field">
              <span>Model</span>
              <input name="model" value={form.model} onChange={handleChange} placeholder="e.g. F40" required />
            </label>
            <label className="av-field">
              <span>Display Name</span>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ferrari F40" />
            </label>
          </div>
          <div className="av-grid av-grid-4">
            <label className="av-field">
              <span>Type</span>
              <select name="type" value={form.type} onChange={handleChange}>
                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </label>
            <label className="av-field">
              <span>Year</span>
              <input name="year" type="number" value={form.year} onChange={handleChange} min="1960" max="2030" required />
            </label>
            <label className="av-field">
              <span>Seats</span>
              <input name="seats" type="number" value={form.seats} onChange={handleChange} min="1" max="8" required />
            </label>
            <label className="av-field">
              <span>Color</span>
              <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Rosso Corsa" />
            </label>
          </div>
        </div>

        {/* Pricing & Specs */}
        <div className="av-section">
          <h4 className="av-section-title">Pricing and Drivetrain</h4>
          <div className="av-grid av-grid-4">
            <label className="av-field">
              <span>Daily Rate (INR)</span>
              <input name="dailyRate" type="number" value={form.dailyRate} onChange={handleChange} placeholder="e.g. 50000" required />
            </label>
            <label className="av-field">
              <span>Transmission</span>
              <select name="transmission" value={form.transmission} onChange={handleChange}>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </label>
            <label className="av-field">
              <span>Fuel Type</span>
              <select name="fuelType" value={form.fuelType} onChange={handleChange}>
                {FUEL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </label>
            <label className="av-field">
              <span>Drivetrain</span>
              <select name="drivetrain" value={form.drivetrain} onChange={handleChange}>
                {DRIVETRAINS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>
        </div>

        {/* Performance */}
        <div className="av-section">
          <h4 className="av-section-title">Performance (Optional)</h4>
          <div className="av-grid av-grid-4">
            <label className="av-field">
              <span>Top Speed (km/h)</span>
              <input name="topSpeed" type="number" value={form.topSpeed} onChange={handleChange} placeholder="e.g. 324" />
            </label>
            <label className="av-field">
              <span>0-100 km/h (seconds)</span>
              <input name="acceleration" type="number" step="0.1" value={form.acceleration} onChange={handleChange} placeholder="e.g. 3.2" />
            </label>
            <label className="av-field">
              <span>Power (bhp)</span>
              <input name="power" value={form.power} onChange={handleChange} placeholder="e.g. 478" />
            </label>
            <label className="av-field">
              <span>Weight (kg)</span>
              <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="e.g. 1100" />
            </label>
          </div>
        </div>

        <div className="av-actions">
          <button type="button" className="btn ghost" onClick={() => navigate('/admin/vehicles')}>Cancel</button>
          <button type="submit" className="btn solid" disabled={saving}>
            {saving ? 'Adding...' : 'Add to Fleet'}
          </button>
        </div>
      </form>
    </AdminShell>
  )
}

export default AddVehicle

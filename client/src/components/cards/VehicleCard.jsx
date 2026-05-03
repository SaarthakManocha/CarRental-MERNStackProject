import { Link } from 'react-router-dom'

import SpotlightCard from '../animations/SpotlightCard'
import { getBrandMeta } from '../../data/brands'
import useVehicleImage from '../../hooks/useVehicleImage'

const VehicleCard = ({ vehicle }) => {
  const meta = getBrandMeta(vehicle.brand)
  const { hasImage, imageSrc, handleImageError } = useVehicleImage(vehicle)

  return (
    <SpotlightCard className="vehicle-card" accent={meta.accent}>
      <Link to={`/vehicle/${vehicle._id}`} className="card-link">
        <div className="vc-image-area">
          {hasImage ? (
            <img
              className="vc-photo"
              src={imageSrc}
              alt={`${vehicle.brand} ${vehicle.model}`}
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="vc-no-image">
              <span>{vehicle.brand.charAt(0)}</span>
            </div>
          )}
          <div className="vc-image-fade" />
        </div>
        <div className="vc-info">
          <p className="vc-brand" style={{ color: meta.accent }}>{vehicle.brand}</p>
          <h3 className="vc-model">{vehicle.model}</h3>
          <p className="vc-meta">
            {vehicle.type} · INR {vehicle.dailyRate?.toLocaleString()}/day
          </p>
          <div className="vc-chips">
            <span className="chip">Top {vehicle.stats?.topSpeed || 0} km/h</span>
            <span className="chip">0-100 {vehicle.stats?.acceleration || 0}s</span>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  )
}

export default VehicleCard

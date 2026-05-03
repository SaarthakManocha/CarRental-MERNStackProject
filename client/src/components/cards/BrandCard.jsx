import { useState } from 'react'
import { Link } from 'react-router-dom'

import SplitText from '../animations/SplitText'
import SpotlightCard from '../animations/SpotlightCard'
import { getBrandMeta } from '../../data/brands'

const LOGO_MAP = {
  Acura: '/cars/logos/acura-logo.png',
  Apollo: '/cars/logos/apollo-automobil-logo.png',
  Ariel: '/cars/logos/ariel-logo.png',
  'Aston Martin': '/cars/logos/aston-martin-logo.png',
  Audi: '/cars/logos/audi-logo.png',
  'Automobili Pininfarina': '/cars/logos/automobili-pininfarina-logo.png',
  Bentley: '/cars/logos/bentley-logo.png',
  BMW: '/cars/logos/bmw-logo.png',
  Bugatti: '/cars/logos/bugatti-logo.png',
  Cadillac: '/cars/logos/cadillac-logo.png',
  Caterham: '/cars/logos/caterham-logo.png',
  Chevrolet: '/cars/logos/chevrolet-logo.png',
  Dodge: '/cars/logos/dodge-logo.png',
  Ferrari: '/cars/logos/ferrari-logo.png',
  Ford: '/cars/logos/ford-logo.png',
  Hennessey: '/cars/logos/hennessey-logo.png',
  Jaguar: '/cars/logos/jaguar-logo.png',
  Koenigsegg: '/cars/logos/koenigsegg-logo.png',
  KTM: '/cars/logos/ktm-logo.png',
  Lamborghini: '/cars/logos/lamborghini-logo.jpg',
  Lexus: '/cars/logos/lexus-logo.png',
  Lotus: '/cars/logos/lotus-logo.png',
  Maserati: '/cars/logos/maserati-logo.png',
  Mazda: '/cars/logos/mazda-logo.png',
  McLaren: '/cars/logos/mcLaren-logo.png',
  'Mercedes-Benz': '/cars/logos/mercedes-benz-logo.png',
  Nissan: '/cars/logos/nissan-logo.png',
  Pagani: '/cars/logos/pagani-logo.png',
  Porsche: '/cars/logos/porsche-logo.png',
  Radical: '/cars/logos/radical-sportscars-logo.png',
  Renault: '/cars/logos/renault-logo-.png',
  Rimac: '/cars/logos/rimac-logo.png',
  Zenvo: '/cars/logos/zenvo-logo.png',
}

const BrandCard = ({ brand, count = 0, meta }) => {
  const details = meta || getBrandMeta(brand)
  const logoSrc = LOGO_MAP[brand]
  const [logoError, setLogoError] = useState(false)
  const showLogo = logoSrc && !logoError

  return (
    <SpotlightCard className="brand-card" accent={details.accent}>
      <Link to={`/fleet/${encodeURIComponent(brand)}`} className="card-link">
        <div className="brand-card-header">
          <div className="brand-logo-circle" style={{ borderColor: `${details.accent}33` }}>
            {showLogo ? (
              <img
                className="brand-logo-img"
                src={logoSrc}
                alt={`${brand} logo`}
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="brand-logo-initial" style={{ color: details.accent }}>
                {brand.charAt(0)}
              </span>
            )}
          </div>
          <div className="brand-card-title">
            <h3>
              <SplitText text={brand} />
            </h3>
            <p className="brand-card-country">{details.country}</p>
          </div>
        </div>
        <p className="card-sub">{count} {count === 1 ? 'vehicle' : 'vehicles'} available</p>
        <p className="brand-meta">{details.tagline}</p>
      </Link>
    </SpotlightCard>
  )
}

export default BrandCard

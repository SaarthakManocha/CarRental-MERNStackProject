import { useEffect, useMemo, useState } from 'react'

import { getVehicleImageCandidates } from '../utils/vehicleImageResolver'

const useVehicleImage = (vehicle) => {
  const candidates = useMemo(
    () => getVehicleImageCandidates(vehicle),
    [vehicle?.brand, vehicle?.model]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasImage, setHasImage] = useState(candidates.length > 0)

  useEffect(() => {
    setCurrentIndex(0)
    setHasImage(candidates.length > 0)
  }, [candidates])

  const handleImageError = () => {
    const next = currentIndex + 1

    if (next >= candidates.length) {
      setHasImage(false)
      return
    }

    setCurrentIndex(next)
  }

  return {
    hasImage,
    imageSrc: hasImage ? candidates[currentIndex] : '',
    handleImageError,
  }
}

export default useVehicleImage
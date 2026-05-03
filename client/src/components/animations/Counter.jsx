import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

import '../../styles/counter.css'

/* ────────────────────────────────
   ReactBits Counter — animated
   counting number display
   ──────────────────────────────── */

function Number({ mv, number, height }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10
    let offset = (10 + number - placeValue) % 10
    let memo = offset * height

    if (offset > 5) {
      memo -= 10 * height
    }

    return memo
  })

  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  )
}

function normalizeNearInteger(num) {
  const nearest = Math.round(num)
  const tolerance = 1e-9 * Math.max(1, Math.abs(num))
  return Math.abs(num - nearest) < tolerance ? nearest : num
}

function getValueRoundedToPlace(value, place) {
  const scaled = value / place
  return Math.floor(normalizeNearInteger(scaled))
}

function Digit({ place, value, height, digitStyle, springConfig }) {
  const isDecimal = place === '.'
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, place)
  const animatedValue = useSpring(valueRoundedToPlace, springConfig)

  useEffect(() => {
    if (!isDecimal) {
      animatedValue.set(valueRoundedToPlace)
    }
  }, [animatedValue, valueRoundedToPlace, isDecimal])

  if (isDecimal) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: 'fit-content' }}>
        .
      </span>
    )
  }

  return (
    <div className="counter-digit" style={{ height, ...digitStyle }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  )
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places,
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 0,
  gradientFrom = 'black',
  gradientTo = 'transparent',
  springConfig = { stiffness: 30, damping: 20 },
}) {
  const height = fontSize + padding

  // Auto-calculate places from value if not provided
  const derivedPlaces = places || [...value.toString()].map((ch, i, a) => {
    if (ch === '.') return '.'
    const dotIdx = a.indexOf('.')
    return dotIdx === -1
      ? 10 ** (a.length - i - 1)
      : i < dotIdx
        ? 10 ** (dotIdx - i - 1)
        : 10 ** -(i - dotIdx)
  })

  return (
    <span
      className="counter-container"
      style={{
        fontSize,
        color: textColor,
        fontWeight,
        ...containerStyle,
      }}
    >
      <span
        className="counter-counter"
        style={{
          gap,
          borderRadius,
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
          ...counterStyle,
        }}
      >
        {derivedPlaces.map((place, i) => (
          <Digit
            key={i}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
            springConfig={springConfig}
          />
        ))}
      </span>

      {gradientHeight > 0 && (
        <span className="gradient-container">
          <span
            className="top-gradient"
            style={{
              height: gradientHeight,
              background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
            }}
          />
          <span
            className="bottom-gradient"
            style={{
              height: gradientHeight,
              background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
            }}
          />
        </span>
      )}
    </span>
  )
}

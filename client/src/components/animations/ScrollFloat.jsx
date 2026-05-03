import { useLayoutEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
}) => {
  const containerRef = useRef(null)
  const charRefs = useRef([])
  const reduceMotion = useReducedMotion()
  const isStringContent = typeof children === 'string'

  charRefs.current = []

  const chars = useMemo(() => {
    if (!isStringContent) {
      return []
    }

    return children.split('')
  }, [children, isStringContent])

  useLayoutEffect(() => {
    if (reduceMotion || !isStringContent || !containerRef.current) {
      return
    }

    const charNodes = charRefs.current.filter(Boolean)

    if (charNodes.length === 0) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(charNodes, {
        yPercent: 120,
        opacity: 0,
        rotateX: -86,
        transformOrigin: '50% 100%',
      })

      gsap.to(charNodes, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: animationDuration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
          ...(scrollContainerRef?.current ? { scroller: scrollContainerRef.current } : {}),
        },
      })
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [animationDuration, ease, isStringContent, reduceMotion, scrollContainerRef, scrollEnd, scrollStart, stagger, chars.length])

  return (
    <div className={`scroll-float-container ${containerClassName}`.trim()} ref={containerRef}>
      <p className={`scroll-float-text ${textClassName}`.trim()}>
        {isStringContent
          ? chars.map((char, index) => (
              <span
                key={`${char}-${index}`}
                className={char === ' ' ? 'scroll-float-char space' : 'scroll-float-char'}
                ref={(element) => {
                  charRefs.current[index] = element
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))
          : children}
      </p>
    </div>
  )
}

export default ScrollFloat

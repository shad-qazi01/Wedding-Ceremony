import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const petals = [
  { left: '14%', top: '8%', delay: 0, duration: 19, drift: 22, size: 12 },
  { left: '31%', top: '23%', delay: 3.4, duration: 22, drift: -18, size: 10 },
  { left: '88%', top: '14%', delay: 5.2, duration: 18, drift: -24, size: 12 },
  { left: '79%', top: '39%', delay: 1.8, duration: 23, drift: 16, size: 11 },
  { left: '12%', top: '73%', delay: 4.7, duration: 21, drift: -14, size: 10 },
  { left: '51%', top: '87%', delay: 2.6, duration: 20, drift: 20, size: 12 },
  { left: '94%', top: '84%', delay: 6.3, duration: 24, drift: -16, size: 9 },
]

const particles = [
  { left: '7%', top: '62%', delay: 1.2, duration: 18, drift: 7, size: 4 },
  { left: '24%', top: '18%', delay: 4.2, duration: 21, drift: -5, size: 5 },
  { left: '47%', top: '6%', delay: 0.4, duration: 19, drift: 8, size: 4 },
  { left: '75%', top: '27%', delay: 2.8, duration: 22, drift: -7, size: 5 },
  { left: '90%', top: '62%', delay: 5.7, duration: 20, drift: 6, size: 4 },
  { left: '39%', top: '78%', delay: 3.6, duration: 23, drift: -6, size: 4 },
  { left: '66%', top: '92%', delay: 6.8, duration: 19, drift: 5, size: 5 },
]

type FloatingPetalsProps = {
  active?: boolean
  burst?: boolean
  variant?: 'book' | 'emerald'
}

export function FloatingPetals({
  active = true,
  burst = false,
  variant = 'book',
}: FloatingPetalsProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const inView = useInView(fieldRef, { amount: 0.05 })

  return (
    <div
      ref={fieldRef}
      className={`floating-petals floating-petals--${variant}${active ? ' floating-petals--active' : ''}`}
      aria-hidden="true"
    >
      {petals.map((petal, index) => (
        <motion.span
          className={`floating-petal${burst ? ' floating-petal--burst' : ''}`}
          key={`petal-${index}`}
          style={{
            left: petal.left,
            top: petal.top,
            width: petal.size,
            height: petal.size * 1.45,
          }}
          animate={
            shouldReduceMotion
              ? { y: 0, x: 0, rotate: index % 2 ? -25 : 25, opacity: 0.7 }
              : burst && active && inView
                ? {
                    y: [0, -48 - index * 6, 25 + index * 3],
                    x: [0, petal.drift * 1.5, petal.drift * -0.5],
                    rotate: [0, 100 + index * 24],
                    opacity: [0, 0.76, 0],
                  }
                : active && inView
                  ? {
                      y: [0, -20, 12, 0],
                      x: [0, petal.drift, petal.drift * -0.45, 0],
                      rotate: [0, 75, 155, 360],
                      opacity: [0.48, 0.72, 0.58, 0.48],
                    }
                  : { y: 0, x: 0, rotate: 0, opacity: 0 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.01 }
              : burst && active && inView
                ? { duration: 1.2, delay: index * 0.045, ease: 'easeOut' }
                : active && inView
                  ? {
                      duration: petal.duration,
                      delay: petal.delay,
                      repeat: Infinity,
                      ease: 'linear',
                    }
                  : { duration: 0.2 }
          }
        />
      ))}
      {particles.map((particle, index) => (
        <motion.span
          className="floating-particle"
          key={`particle-${index}`}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={
            shouldReduceMotion
              ? { y: 0, opacity: 0.56 }
              : active && inView
                ? { y: [0, -9, 6, 0], x: [0, particle.drift, -particle.drift / 2, 0], opacity: [0.28, 0.68, 0.4, 0.28] }
                : { opacity: 0 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.01 }
              : active && inView
                ? { duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
          }
        />
      ))}
    </div>
  )
}

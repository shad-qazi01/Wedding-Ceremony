import { motion, useReducedMotion } from 'framer-motion'

type IllustratedMapProps = {
  className?: string
}

export function IllustratedMap({ className = '' }: IllustratedMapProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`illustrated-map ${className}`} aria-hidden="true">
      <svg viewBox="0 0 540 284" role="presentation" focusable="false">
        <rect width="540" height="284" fill="#efe7ce" />
        <path
          d="M-25 210C72 182 134 160 219 177s141 31 204 10 92-47 146-69"
          fill="none"
          stroke="#d8ca99"
          strokeWidth="13"
        />
        <path
          d="M103-20 142 300M387-22 348 305"
          fill="none"
          stroke="#d8ca99"
          strokeWidth="11"
        />
        <path
          d="M-12 77c72 29 123 31 191 6s111-27 180-4 113 20 195-7"
          fill="none"
          stroke="#e4d8b5"
          strokeWidth="5"
          opacity=".8"
        />
        <circle cx="48" cy="228" r="8" fill="#12483b" />
        <motion.path
          d="M48 228c68-4 93-57 157-79s92-1 135-10 73-36 106-65"
          fill="none"
          stroke="#12483b"
          strokeWidth="3"
          strokeDasharray="8 11"
          initial={shouldReduceMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 1.8, ease: 'easeInOut' }}
        />
        <motion.g
          initial={shouldReduceMotion ? false : { opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : 0.9 }}
          style={{ transformOrigin: '434px 80px' }}
        >
          <ellipse cx="434" cy="99" rx="24" ry="8" fill="#675633" opacity=".16" />
          <path
            d="M434 40c-13 0-23 10-23 23 0 17 23 43 23 43s23-26 23-43c0-13-10-23-23-23Z"
            fill="#c6a45b"
            stroke="#98783c"
            strokeWidth="1.5"
          />
          <circle cx="434" cy="63" r="8" fill="#f8f3e8" />
        </motion.g>
        <circle cx="252" cy="112" r="4" fill="#ddcfaa" opacity=".9" />
        <circle cx="524" cy="205" r="4" fill="#ddcfaa" opacity=".8" />
      </svg>
    </div>
  )
}

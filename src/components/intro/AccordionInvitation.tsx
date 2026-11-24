import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { WeddingConfig } from '../../config/weddingConfig'
import { InvitationPage } from '../sections/InvitationPage'
import { FloatingPetals } from '../ui/FloatingPetals'

type AccordionInvitationProps = {
  config: WeddingConfig
  onOpened: () => void
}

function FoldOrnament({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`accordion-fold-ornament accordion-fold-ornament--${side}`}
      viewBox="0 0 90 170"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 5c32 18 42 45 38 78-3 31-16 58-38 82M85 5C53 23 43 50 47 83c3 31 16 58 38 82" />
      <path d="M8 48c15-2 23-10 28-24m-29 66c16 0 26-8 35-22m-36 70c17-2 29-11 38-25M82 48C67 46 59 38 54 24m29 66c-16 0-26-8-35-22m36 70c-17-2-29-11-38-25" />
      <path d="M15 47c-6-10-2-18 10-19 4 11 1 17-10 19Zm-2 44c-8-8-5-17 7-20 6 10 4 16-7 20Zm2 44c-6-10-2-18 10-19 4 11 1 17-10 19Zm60-88c6-10 2-18-10-19-4 11-1 17 10 19Zm2 44c8-8 5-17-7-20-6 10-4 16 7 20Zm-2 44c6-10 2-18-10-19-4 11-1 17 10 19Z" />
      <circle cx="45" cy="83" r="4" />
    </svg>
  )
}

function InnerInvitationDecor() {
  return (
    <svg className="accordion-inner-decor" viewBox="0 0 600 900" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <g className="accordion-drapes">
        <path d="M10 0h580M24 0v285c48-6 62-48 84-80 20-30 47-42 81-45m387 0c-34 3-61 15-81 45-22 32-36 74-84 80V0" />
        <path d="M24 0c30 48 59 63 84 67 27 4 54-5 81-22m387-45c-30 48-59 63-84 67-27 4-54-5-81-22" />
        <path d="M44 5v267m19-252v241m20-228v214m20-203v189m337-418v267m-19-252v241m-20-228v214m-20-203v189" />
        <path d="M24 279c23 13 40 14 57 4 17-10 26-27 39-48m456 44c-23 13-40 14-57 4-17-10-26-27-39-48" />
      </g>
      <g className="accordion-bottom-florals">
        <path d="M0 900c50-53 77-122 110-143 24-15 44-5 52 16 7-38 32-65 59-58 24 6 31 35 18 59 34-32 64-35 81-12 17 24 4 56-23 74 35-9 68 3 73 31 4 17-5 29-17 33M600 900c-50-53-77-122-110-143-24-15-44-5-52 16-7-38-32-65-59-58-24 6-31 35-18 59-34-32-64-35-81-12-17 24-4 56 23 74-35-9-68 3-73 31-4 17 5 29 17 33" />
        <path d="M50 900c37-41 54-89 84-111m416 111c-37-41-54-89-84-111M103 813c-22-23-18-45 8-54 21 15 21 33-8 54Zm37-42c-3-31 13-48 41-36 8 25-4 39-41 36Zm25 44c9-29 30-38 51-17-3 26-20 35-51 17Zm292-2c22-23 18-45-8-54-21 15-21 33 8 54Zm-37-42c3-31-13-48-41-36-8 25 4 39 41 36Zm-25 44c-9-29-30-38-51-17 3 26 20 35 51 17Z" />
        <path d="M88 900c23-19 43-25 62-18m362 18c-23-19-43-25-62-18M147 781c-12-16-9-29 9-37 14 11 12 23-9 37Zm306 0c12-16 9-29-9-37-14 11-12 23 9 37Z" />
      </g>
    </svg>
  )
}

export function AccordionInvitation({ config, onOpened }: AccordionInvitationProps) {
  const [opening, setOpening] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!opening) return
    const timer = window.setTimeout(onOpened, shouldReduceMotion ? 100 : 5_200)
    return () => window.clearTimeout(timer)
  }, [onOpened, opening, shouldReduceMotion])

  return (
    <section className="accordion-intro" aria-label="Wedding invitation opening">
      <div className="accordion-atmosphere" aria-hidden="true" />
      <FloatingPetals active={opening} burst={opening} />
      <motion.div
        className={`accordion-card${opening ? ' accordion-card--opening' : ''}`}
        animate={shouldReduceMotion || !opening ? { scale: 1 } : { scale: 1.015 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 2.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="accordion-inner">
          <InvitationPage config={config} embedded reveal={opening} />
          <motion.div
            className="accordion-decor-layer"
            aria-hidden="true"
            initial={false}
            animate={{ opacity: opening ? 1 : 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.8,
              delay: shouldReduceMotion || !opening ? 0 : 1.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <InnerInvitationDecor />
          </motion.div>
        </div>

        <div className="accordion-cover-panels" aria-hidden="true">
          <motion.div
            className="accordion-cover-panel accordion-cover-panel--left"
            animate={shouldReduceMotion || !opening ? { rotateY: 0 } : { rotateY: -112 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 2.25, delay: shouldReduceMotion || !opening ? 0 : 0.45, ease: [0.72, 0, 0.22, 1] }}
          >
            <FoldOrnament side="left" />
          </motion.div>
          <motion.div
            className="accordion-cover-panel accordion-cover-panel--right"
            animate={shouldReduceMotion || !opening ? { rotateY: 0 } : { rotateY: 112 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 2.25, delay: shouldReduceMotion || !opening ? 0 : 0.45, ease: [0.72, 0, 0.22, 1] }}
          >
            <FoldOrnament side="right" />
          </motion.div>
          <motion.div
            className="accordion-cover-panel accordion-cover-panel--center"
            animate={shouldReduceMotion || !opening ? { rotateX: 0 } : { rotateX: -112 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 1.15, delay: shouldReduceMotion || !opening ? 0 : 0.2, ease: [0.72, 0, 0.22, 1] }}
          />
          <motion.div
            className="accordion-cover-frame"
            initial={false}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: shouldReduceMotion || !opening ? 0 : 0.4 }}
          />
        </div>

        <motion.button
          type="button"
          className="accordion-seal"
          aria-label="Open the wedding invitation"
          onClick={() => setOpening(true)}
          disabled={opening}
          initial={false}
          animate={
            opening
              ? { opacity: 0, scale: 0.62, rotate: 20, y: -8 }
              : { opacity: 1, scale: 1, rotate: 0, y: 0 }
          }
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        >
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <path d="M60 4 72 9 85 7 93 18 106 23 108 37 117 48 112 61 116 74 106 84 103 98 89 102 80 114 66 111 53 117 43 107 29 105 25 91 13 82 16 68 8 56 15 44 14 30 27 23 34 10 48 12Z" />
            <circle cx="60" cy="60" r="34" />
            <path d="m60 38 6 15 16 1-12 10 4 16-14-9-14 9 4-16-12-10 16-1Z" />
          </svg>
        </motion.button>

        <motion.p
          className="accordion-tap-instruction"
          animate={opening ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.28 }}
        >
          TAP TO OPEN INVITATION
        </motion.p>
      </motion.div>
    </section>
  )
}

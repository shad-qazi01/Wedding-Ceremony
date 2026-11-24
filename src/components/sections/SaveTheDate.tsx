import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { KeyboardEvent, PointerEvent } from 'react'
import { CountdownTimer } from '../ui/CountdownTimer'
import { FloatingPetals } from '../ui/FloatingPetals'
import type { WeddingConfig } from '../../config/weddingConfig'
import { formatDateKey, isValidDateKey } from './eventCalendar'

type SaveTheDateProps = {
  config: WeddingConfig
}

const collapsedHeight = 126
const revealDistance = 250

export function SaveTheDate({ config }: SaveTheDateProps) {
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [fullHeight, setFullHeight] = useState(570)
  const startY = useRef(0)
  const startingProgress = useRef(0)
  const didDrag = useRef(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const validDate = isValidDateKey(config.weddingDate)
  const revealed = progress >= 1
  const formattedDate = validDate
    ? formatDateKey(config.weddingDate, { weekday: 'long' }).toUpperCase()
    : ''

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return

    const measure = () => {
      const card = content.closest('.date-card-shell')
      if (card) setFullHeight(Math.ceil(content.scrollHeight + 40))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    return () => observer.disconnect()
  }, [config])

  function setRevealProgress(nextProgress: number) {
    setProgress(Math.max(0, Math.min(1, nextProgress)))
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (shouldReduceMotion) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    startY.current = event.clientY
    startingProgress.current = progress
    didDrag.current = false
    setDragging(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!dragging || shouldReduceMotion) return
    const distance = event.clientY - startY.current
    if (Math.abs(distance) > 5) didDrag.current = true
    if (distance > 0) setRevealProgress(startingProgress.current + distance / revealDistance)
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (!dragging) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
    if (progress >= 0.48) setRevealProgress(1)
    else setRevealProgress(0)
  }

  function handlePullClick() {
    if (didDrag.current) {
      didDrag.current = false
      return
    }
    setRevealProgress(revealed ? 0 : 1)
  }

  function handlePullKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setRevealProgress(progress + (event.key === 'ArrowDown' ? 0.12 : -0.12))
  }

  const cardHeight = collapsedHeight + (fullHeight - collapsedHeight) * progress
  const tasselHeight = (1 - progress) * 142
  const gestureHeight = (1 - progress) * 64

  return (
    <section
      className={`save-date-section book-page${revealed ? '' : ' save-date-section--closed'}`}
      id="save-the-date"
      aria-labelledby="save-date-title"
    >
      <FloatingPetals variant="emerald" />
      <motion.div
        className="save-date-inner"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h2
          id="save-date-title"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.7 }}
        >
          SAVE THE DATE
        </motion.h2>

        <div
          className="save-date-scroll"
          style={{ height: `${cardHeight + tasselHeight + gestureHeight + 12}px` }}
        >
          <motion.div
            className="save-date-rod"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0.84 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.9, delay: shouldReduceMotion ? 0 : 0.18 }}
          >
            <span className="save-date-rod-cap save-date-rod-cap--left" />
            <span className="save-date-rod-cap save-date-rod-cap--right" />
          </motion.div>

          <motion.div
            className="date-card-shell"
            animate={{ height: cardHeight }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : dragging ? 0.06 : 0.68,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="date-card-paper">
              <motion.div
                className="date-card-content"
                id="save-date-card-content"
                ref={contentRef}
                animate={{ opacity: progress }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.28 }}
                aria-live="polite"
                aria-hidden={!revealed}
                inert={!revealed}
              >
                <p className="date-card-intro">Save this beautiful day</p>
                <p className="date-card-date">
                  {validDate ? formattedDate : '[DAY, DATE MONTH YEAR]'}
                </p>
                <p className="date-card-time">
                  {config.weddingStartTime.trim() || '[WEDDING TIME]'}
                </p>
                <div className="date-card-countdown">
                  <CountdownTimer config={config} />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.button
            className={`save-date-tassel${dragging ? ' save-date-tassel--dragging' : ''}`}
            type="button"
            tabIndex={revealed ? -1 : 0}
            aria-hidden={revealed}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={handlePullClick}
            onKeyDown={handlePullKeyDown}
            aria-label={revealed ? 'Close the date card' : 'Pull or tap to reveal the date card'}
            aria-expanded={revealed}
            aria-controls="save-date-card-content"
            animate={{ opacity: 1 - progress }}
            style={{
              top: `${cardHeight + 8}px`,
              height: `${tasselHeight}px`,
              pointerEvents: revealed ? 'none' : 'auto',
            }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
          >
            <span className="save-date-tassel-cord" aria-hidden="true" />
            <span className="save-date-tassel-fringe" aria-hidden="true" />
            <span className="sr-only">
              {revealed ? 'Date card revealed' : 'Pull down, press Enter, or tap to reveal'}
            </span>
          </motion.button>
          {!revealed && (
            <motion.span
              className="save-date-gesture"
              aria-hidden="true"
              style={{ top: `${cardHeight + tasselHeight + 28}px` }}
              animate={shouldReduceMotion ? { y: 0 } : { y: [0, 5, 0] }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 1.8,
                repeat: shouldReduceMotion ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            >
              👇
            </motion.span>
          )}
        </div>
        {!revealed && (
          <motion.p
            className="save-date-pull-label"
            animate={{ opacity: 0.7 + Math.sin(progress * Math.PI) * 0.3 }}
            transition={{ duration: 0.3 }}
          >
            PULL TO REVEAL
          </motion.p>
        )}
        {revealed && (
          <p className="save-date-timezone">All times shown in {config.timezone}.</p>
        )}
      </motion.div>
    </section>
  )
}

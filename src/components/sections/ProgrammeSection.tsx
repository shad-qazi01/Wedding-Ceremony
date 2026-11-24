import { motion, useReducedMotion } from 'framer-motion'
import type { WeddingConfig } from '../../config/weddingConfig'
import { FloatingPetals } from '../ui/FloatingPetals'
import { OrnamentalFrame } from '../ui/OrnamentalFrame'
import { formatDateKey, isValidDateKey } from './eventCalendar'

type ProgrammeSectionProps = {
  config: WeddingConfig
}

export function ProgrammeSection({ config }: ProgrammeSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const date = isValidDateKey(config.weddingDate)
    ? formatDateKey(config.weddingDate, { weekday: 'long' })
    : '[WEDDING DATE]'

  return (
    <section
      className="programme-section book-page"
      id="the-programme"
      aria-labelledby="programme-title"
    >
      <FloatingPetals variant="emerald" />
      <motion.div
        className="programme-inner"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="programme-eyebrow">A DAY TO REMEMBER</p>
        <h2 id="programme-title">THE PROGRAMME</h2>
        <OrnamentalFrame className="programme-card">
          <p className="programme-date">{date}</p>
          <div className="programme-entries">
            {config.programme.map((entry, index) => (
              <motion.div
                className="programme-entry"
                key={`${entry.title}-${index}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.55,
                  delay: shouldReduceMotion ? 0 : index * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="programme-entry-title">{entry.title}</span>
                <span className="programme-entry-rule" aria-hidden="true" />
                <time className="programme-entry-time">{entry.time}</time>
              </motion.div>
            ))}
          </div>
        </OrnamentalFrame>
      </motion.div>
    </section>
  )
}

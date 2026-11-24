import { motion, useReducedMotion } from 'framer-motion'
import type { WeddingConfig } from '../../config/weddingConfig'
import { FloatingPetals } from '../ui/FloatingPetals'
import { OrnamentalFrame } from '../ui/OrnamentalFrame'

type ClosingSectionProps = {
  config: WeddingConfig
}

export function ClosingSection({ config }: ClosingSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const bride = config.brideName.trim() || '[BRIDE NAME]'
  const groom = config.groomName.trim() || '[GROOM NAME]'
  const monogram = config.monogram.trim() || `${bride.charAt(0)}${groom.charAt(0)}`

  return (
    <section className="closing-book-page book-page" id="closing" aria-labelledby="closing-title">
      <div className="closing-light" aria-hidden="true" />
      <FloatingPetals />
      <OrnamentalFrame className="closing-frame">
        <motion.div
          className="closing-page-content"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.9 }}
        >
          <span className="closing-monogram">{monogram}</span>
          <p className="closing-eyebrow">A NOTE FROM OUR FAMILIES</p>
          <h2 id="closing-title">WE CAN’T WAIT TO CELEBRATE WITH YOU</h2>
          <p className="closing-couple">{bride} <i aria-hidden="true">&amp;</i> {groom}</p>
          <span className="closing-rule" aria-hidden="true" />
          <p className="closing-prayer">
            May Allah bless this beautiful union with love, mercy and barakah.
          </p>
          <p className="family-closing-line">
            {config.family.closingLine.trim() || '[FAMILY CLOSING LINE]'}
          </p>
        </motion.div>
      </OrnamentalFrame>
    </section>
  )
}

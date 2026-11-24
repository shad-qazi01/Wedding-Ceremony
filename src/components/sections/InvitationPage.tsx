import { motion, useReducedMotion } from 'framer-motion'
import type { WeddingConfig } from '../../config/weddingConfig'
import { OrnamentalFrame } from '../ui/OrnamentalFrame'

type InvitationPageProps = {
  config: WeddingConfig
  embedded?: boolean
  reveal?: boolean
}

function displayName(name: string, placeholder: string): string {
  return name.trim() || placeholder
}

function familyLine(first: string, relationship: 'Son' | 'Daughter'): string {
  return `${relationship} of ${first.trim() || '[FATHER’S NAME]'}`
}

function AnimatedCopy({
  text,
  reveal,
  delay,
  className,
}: {
  text: string
  reveal: boolean
  delay: number
  className: string
}) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <span className={className} aria-label={text}>
      {[...text].map((character, index) =>
        character === ' '
          ? ' '
          : (
              <motion.span
                aria-hidden="true"
                key={`${index}-${character}`}
                initial={false}
                animate={
                  reveal
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: shouldReduceMotion ? 0 : 7 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.22,
                  delay: shouldReduceMotion ? 0 : delay + index * 0.018,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {character}
              </motion.span>
            ),
      )}
    </span>
  )
}

function AnimatedName({
  name,
  label,
  reveal,
  delay,
  typewriter,
}: {
  name: string
  label: string
  reveal: boolean
  delay: number
  typewriter: boolean
}) {
  const shouldReduceMotion = useReducedMotion()
  const characters = [...name]

  return (
    <span className="animated-name" aria-label={label}>
      {characters.map((character, index) => (
        <motion.span
          aria-hidden="true"
          key={`${index}-${character}`}
          initial={typewriter ? false : shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={typewriter
            ? reveal
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: shouldReduceMotion ? 0 : 10 }
            : undefined}
          whileInView={typewriter ? undefined : { opacity: 1, y: 0 }}
          viewport={typewriter ? undefined : { once: true }}
          transition={typewriter
            ? {
                delay: shouldReduceMotion ? 0 : delay + index * 0.045,
                duration: shouldReduceMotion ? 0.01 : 0.38,
                ease: [0.22, 1, 0.36, 1],
              }
            : { delay: shouldReduceMotion ? 0 : 0.18 + index * 0.035, duration: 0.42 }}
        >
          {character === ' ' ? '\u00a0' : character}
        </motion.span>
      ))}
    </span>
  )
}

export function InvitationPage({
  config,
  embedded = false,
  reveal = true,
}: InvitationPageProps) {
  const groom = displayName(config.groomName, '[GROOM NAME]')
  const bride = displayName(config.brideName, '[BRIDE NAME]')

  return (
    <section
      className={`invitation-page book-page${embedded ? ' invitation-page--embedded' : ''}`}
      id="invitation-page"
      aria-labelledby="invitation-page-title"
    >
      {config.couplePhotoUrl && (
        <img
          className="invitation-portrait-background"
          src={config.couplePhotoUrl}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
      )}
      <div className="invitation-page-wash" aria-hidden="true" />
      <OrnamentalFrame className="invitation-page-frame">
        <div className="invitation-page-content">
          <p className="invocation">
            {embedded
              ? <AnimatedCopy text="In the name of Allah, the Most beneficent & Merciful" reveal={reveal} delay={1.2} className="invitation-typed-copy" />
              : 'In the name of Allah, the Most beneficent & Merciful'}
          </p>
          <span className="page-divider" aria-hidden="true"><span /></span>
          <p className="family-introduction">
            {embedded
              ? <AnimatedCopy text="Mr. Late Dr. Mohammad Israil" reveal={reveal} delay={1.55} className="invitation-typed-copy" />
              : 'Mr. Late Dr. Mohammad Israil'}
          </p>
          <p className="family-introduction">
            {embedded
              ? <AnimatedCopy text="Request the pleasure of your company on the auspicious occasion of their wedding of his beloved daughter" reveal={reveal} delay={1.72} className="invitation-typed-copy" />
              : 'Request the pleasure of your company on the auspicious occasion of their wedding of his beloved daughter'}
          </p>

          <h2 className="page-couple-names">
            <AnimatedName name={bride} label={bride} reveal={reveal} delay={2.25} typewriter={embedded} />
          </h2>
          <p className="parentage">
            {embedded
              ? <AnimatedCopy text={familyLine(config.family.brideFather, 'Daughter')} reveal={reveal} delay={2.6} className="invitation-typed-copy" />
              : familyLine(config.family.brideFather, 'Daughter')}
          </p>

          {/* <h1 className="page-couple-names" id="invitation-page-title">
            <AnimatedName name={groom} label={groom} />
          </h1>
          <p className="parentage">
            {familyLine(config.family.groomFather, 'Son')}
          </p> */}
          <span className="page-ampersand" aria-hidden="true">&amp;</span>
          {/* <h2 className="page-couple-names">
            <AnimatedName name={bride} label={bride} />
          </h2>
          <p className="parentage">
            {familyLine(config.family.brideFather, 'Daughter')}
          </p> */}
          <h1 className="page-couple-names" id="invitation-page-title">
            <AnimatedName name={groom} label={groom} reveal={reveal} delay={2.95} typewriter={embedded} />
          </h1>
          <p className="parentage">
            {embedded
              ? <AnimatedCopy text={familyLine(config.family.groomFather, 'Son')} reveal={reveal} delay={3.3} className="invitation-typed-copy" />
              : familyLine(config.family.groomFather, 'Son')}
          </p>

          <span className="page-divider page-divider--closing" aria-hidden="true"><span /></span>
          <p className="invitation-quote">
            {embedded
              ? <AnimatedCopy
                  text={config.invitationMessage.trim() ||
                    'We joyfully invite you to witness the beginning of our forever.'}
                  reveal={reveal}
                  delay={3.55}
                  className="invitation-typed-copy"
                />
              : config.invitationMessage.trim() ||
                'We joyfully invite you to witness the beginning of our forever.'}
          </p>
        </div>
      </OrnamentalFrame>

      {!embedded && (
        <a className="page-scroll-cue" href="#save-the-date">
          <span>TURN THE PAGE</span>
          <span className="page-scroll-arrow" aria-hidden="true" />
        </a>
      )}
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { weddingConfig as defaultWeddingConfig, type WeddingConfig } from '../../config/weddingConfig'
import { AccordionInvitation } from './AccordionInvitation'
import { ClosingSection } from '../sections/ClosingSection'
import { ProgrammeSection } from '../sections/ProgrammeSection'
import { RsvpSection } from '../sections/RsvpSection'
import { SaveTheDate } from '../sections/SaveTheDate'
import { VenueSection } from '../sections/VenueSection'
import { MusicPlayer } from '../ui/MusicPlayer'
import { FloatingPetals } from '../ui/FloatingPetals'
import './invitation-book.css'

type InvitationBookProps = {
  config?: WeddingConfig
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image()
    const timeoutId = window.setTimeout(() => {
      image.src = ''
      resolve()
    }, 8_000)
    const finish = () => {
      window.clearTimeout(timeoutId)
      resolve()
    }
    image.onload = finish
    image.onerror = finish
    image.src = src
    if (image.complete) finish()
  })
}

export function InvitationBook({ config = defaultWeddingConfig }: InvitationBookProps) {
  const [assetsReady, setAssetsReady] = useState(false)
  const [bookOpened, setBookOpened] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const backgroundX = useSpring(useMotionValue(0), { stiffness: 48, damping: 20, mass: 0.9 })
  const backgroundY = useSpring(useMotionValue(0), { stiffness: 48, damping: 20, mass: 0.9 })
  const preloadSources = useMemo(
    () => [
      config.couplePhotoUrl,
      config.venue.photoUrl,
      ...config.galleryImages.slice(0, 8).map((image) => image.src),
    ].filter(Boolean),
    [config.couplePhotoUrl, config.galleryImages, config.venue.photoUrl],
  )

  useEffect(() => {
    let active = true
    const minLoadingTime = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 420)
    })
    const fontLoading = document.fonts?.ready ?? Promise.resolve()
    void Promise.all([
      minLoadingTime,
      fontLoading,
      Promise.all(preloadSources.map(preloadImage)),
    ]).then(() => {
      if (active) setAssetsReady(true)
    })
    return () => {
      active = false
    }
  }, [preloadSources])

  const monogram = config.monogram.trim() ||
    (config.brideName.trim() || config.groomName.trim()
      ? `${config.groomName.trim().charAt(0)}${config.brideName.trim().charAt(0)}`
      : 'ن')

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (shouldReduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    backgroundX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * -10)
    backgroundY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -8)
  }

  return (
    <div
      className={`invitation-book${bookOpened ? ' invitation-book--open' : ' invitation-book--closed'}`}
      onPointerMove={bookOpened ? undefined : handlePointerMove}
      onPointerLeave={() => {
        backgroundX.set(0)
        backgroundY.set(0)
      }}
    >
      <motion.div
        className="book-atmosphere"
        style={{ x: backgroundX, y: backgroundY }}
        aria-hidden="true"
      />
      <div className="book-geometric-light" aria-hidden="true" />
      {!bookOpened && <FloatingPetals />}

      <AnimatePresence mode="wait" initial={false}>
        {!assetsReady ? (
          <motion.div
            className="book-loading"
            key="loading"
            role="status"
            aria-live="polite"
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.35 }}
          >
            <span className="loading-monogram">{monogram}</span>
            <p>PREPARING YOUR INVITATION</p>
            <span className="loading-rule"><span /></span>
          </motion.div>
        ) : (
          <div className="invitation-experience" key="invitation">
            <AccordionInvitation
              config={config}
              onOpened={() => {
                setBookOpened(true)
                window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'instant' : 'smooth' })
              }}
            />
            {bookOpened && (
              <motion.main
                className="book-flow"
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.91, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                <SaveTheDate config={config} />
                <ProgrammeSection config={config} />
                {/* <OurStory images={config.galleryImages} /> */}
                <VenueSection venue={config.venue} />
                <RsvpSection config={config} />
                <ClosingSection config={config} />
              </motion.main>
            )}
          </div>
        )}
      </AnimatePresence>

      {assetsReady && bookOpened && config.backgroundMusic.src && (
        <MusicPlayer
          src={config.backgroundMusic.src}
          title={config.backgroundMusic.title}
        />
      )}
      <span className="sr-only">
        This interactive wedding invitation is designed to be read as a book.
      </span>
    </div>
  )
}

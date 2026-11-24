import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { WeddingConfig } from '../../config/weddingConfig'
import { OrnamentalFrame } from '../ui/OrnamentalFrame'

type OurStoryProps = {
  images: WeddingConfig['galleryImages']
}

export function OurStory({ images }: OurStoryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const safeImages = images.slice(0, 8)

  function navigate(direction: number) {
    if (safeImages.length < 2) return
    setActiveIndex((current) => (current + direction + safeImages.length) % safeImages.length)
  }

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) {
    setDragging(false)
    if (info.offset.x < -45) navigate(1)
    if (info.offset.x > 45) navigate(-1)
  }

  function relativePosition(index: number): number {
    if (index === activeIndex) return 0
    const difference = (index - activeIndex + safeImages.length) % safeImages.length
    return difference === 1 ? 1 : difference === safeImages.length - 1 ? -1 : 2
  }

  return (
    <section className="story-section our-story-section book-page" id="our-story" aria-labelledby="story-title">
      <div className="story-page-inner">
        <p className="book-eyebrow">MOMENTS, HELD CLOSE</p>
        <h2 id="story-title">Our Story</h2>
        <p className="story-page-subtitle">A little collection of moments, for those we love.</p>

        {safeImages.length > 0 ? (
          <>
            <div className="story-carousel" aria-roledescription="carousel" aria-label="Our story photographs">
              {safeImages.map((image, index) => {
                const position = relativePosition(index)
                return (
                  <motion.div
                    className={`story-carousel-item${position === 0 ? ' story-carousel-item--active' : ''}`}
                    key={`${image.src}-${index}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${safeImages.length}${image.caption ? `: ${image.caption}` : ''}`}
                    aria-hidden={position === 2}
                    drag={position === 0 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.16}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={handleDragEnd}
                    initial={false}
                    animate={{
                      x: position === 0 ? 0 : position === -1 ? '-69%' : position === 1 ? '69%' : '0%',
                      scale: position === 0 ? 1 : position === 2 ? 0.72 : 0.84,
                      rotateY: position === 0 ? 0 : position * -13,
                      opacity: position === 2 ? 0 : position === 0 ? 1 : 0.55,
                      zIndex: position === 0 ? 2 : 1,
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 0.54,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ touchAction: position === 0 ? 'pan-y' : undefined }}
                  >
                    <OrnamentalFrame className="story-photo-frame">
                      <img src={image.src} alt={image.alt} draggable={false} loading="lazy" />
                      <span className="floral-corner floral-corner--top" aria-hidden="true">❧</span>
                      <span className="floral-corner floral-corner--bottom" aria-hidden="true">❧</span>
                    </OrnamentalFrame>
                  </motion.div>
                )
              })}
              {safeImages.length > 1 && (
                <>
                  <button
                    className="carousel-arrow carousel-arrow--previous"
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Previous photograph"
                    disabled={dragging}
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    className="carousel-arrow carousel-arrow--next"
                    type="button"
                    onClick={() => navigate(1)}
                    aria-label="Next photograph"
                    disabled={dragging}
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <div className="story-caption" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeIndex}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -7 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.23 }}
                >
                  {safeImages[activeIndex]?.caption}
                </motion.p>
              </AnimatePresence>
            </div>
            {safeImages.length > 1 && (
              <div className="story-pagination" role="group" aria-label="Choose a photograph">
                {safeImages.map((image, index) => (
                  <button
                    key={`${image.src}-dot-${index}`}
                    type="button"
                    className={index === activeIndex ? 'story-dot story-dot--active' : 'story-dot'}
                    aria-label={`Show photograph ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="story-empty-state">
            <OrnamentalFrame className="story-empty-art">
              <span className="empty-art-arch" />
              <span className="empty-art-spark empty-art-spark--one" />
              <span className="empty-art-spark empty-art-spark--two" />
            </OrnamentalFrame>
            <p>Your photographs will find their place here.</p>
          </div>
        )}
      </div>
    </section>
  )
}

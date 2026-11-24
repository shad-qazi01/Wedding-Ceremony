import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { WeddingConfig } from '../../config/weddingConfig'
import { FloatingPetals } from '../ui/FloatingPetals'
import { IllustratedMap } from '../ui/IllustratedMap'
import { getGoogleMapsUrl } from './eventCalendar'

type VenueSectionProps = {
  venue: WeddingConfig['venue']
}

export function VenueSection({ venue }: VenueSectionProps) {
  const [copyStatus, setCopyStatus] = useState('')
  const shouldReduceMotion = useReducedMotion()
  const mapsUrl = getGoogleMapsUrl(venue.googleMapsUrl, venue.address, venue.city)
  const copyAddress = venue.address.trim()

  async function handleCopyAddress() {
    if (!copyAddress) return
    try {
      await navigator.clipboard.writeText(copyAddress)
      setCopyStatus('Address copied')
    } catch (error) {
      setCopyStatus('Could not copy the address on this device.')
      console.error('Unable to copy the configured venue address.', error)
    }
  }

  return (
    <section className="venue-book-section book-page" id="location" aria-labelledby="location-title">
      <FloatingPetals variant="emerald" />
      <motion.div
        className="venue-book-inner"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h2
          id="location-title"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.7 }}
        >
          <span>Save this beautiful day</span>
          {/* <span>BEGINS</span> */}
        </motion.h2>

        <div className="location-card">
          <IllustratedMap className="location-map" />
          <div className="location-details">
            <h3>{venue.name.trim() || '[VENUE NAME]'}</h3>
            <p>{venue.address.trim() || '[COMPLETE VENUE ADDRESS]'}</p>
            {/* <p className="location-city">{venue.city.trim() || '[AREA, CITY]'}</p> */}

            <div className="location-actions">
              {mapsUrl ? (
                <a
                  className="location-action location-action--primary"
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GET DIRECTIONS
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ) : (
                <button
                  className="location-action location-action--primary"
                  type="button"
                  disabled
                  title="Add a venue address or Google Maps URL to enable directions."
                >
                  GET DIRECTIONS
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              )}
              <button
                className="location-action"
                type="button"
                onClick={handleCopyAddress}
                disabled={!copyAddress}
                title={!copyAddress ? 'Add a venue address to enable copying.' : undefined}
              >
                {copyStatus === 'Address copied'
                  ? <Check size={15} aria-hidden="true" />
                  : <Copy size={15} aria-hidden="true" />}
                {copyStatus === 'Address copied' ? 'ADDRESS COPIED' : 'COPY ADDRESS'}
              </button>
            </div>
            <span className="location-copy-status" aria-live="polite">
              {copyStatus}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

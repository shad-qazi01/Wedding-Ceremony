import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import type { WeddingConfig } from '../../config/weddingConfig'
import { OrnamentalFrame } from '../ui/OrnamentalFrame'

type RsvpSectionProps = {
  config: WeddingConfig
}

function phoneHref(phone: string): string | undefined {
  const normalized = phone.replace(/[^\d+]/g, '')
  return /^\+?\d{7,15}$/.test(normalized) ? `tel:${normalized}` : undefined
}

function whatsappHref(phone: string): string | undefined {
  const normalized = phone.replace(/\D/g, '')
  return /^\d{7,15}$/.test(normalized) ? `https://wa.me/${normalized}` : undefined
}

export function RsvpSection({ config }: RsvpSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const contacts = config.rsvp.contacts
    .map((contact) => typeof contact === 'string' ? { name: contact } : contact)
    .filter((contact) => contact.name.trim())

  return (
    <section className="rsvp-section book-page" id="rsvp" aria-labelledby="rsvp-title">
      <motion.div
        className="rsvp-inner"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="rsvp-eyebrow">WITH LOVE FROM OUR FAMILIES</p>
        <h2 id="rsvp-title">R.S.V.P.</h2>
        <OrnamentalFrame className="rsvp-card">
          {contacts.length > 0 ? (
            <div className="rsvp-contacts">
              {contacts.map((contact, index) => {
                const tel = contact.phone ? phoneHref(contact.phone) : undefined
                const whatsapp = contact.whatsapp
                  ? whatsappHref(contact.whatsapp)
                  : undefined

                return (
                  <motion.span
                    className="rsvp-contact"
                    key={`${contact.name}-${index}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 0.5,
                      delay: shouldReduceMotion ? 0 : index * 0.12,
                    }}
                  >
                    <span className="rsvp-contact-name">{contact.name}</span>
                    {(tel || whatsapp) && (
                      <span className="rsvp-contact-links">
                        {tel && (
                          <a href={tel} aria-label={`Call ${contact.name}`}>
                            <Phone size={16} aria-hidden="true" />
                            <span>Telephone</span>
                          </a>
                        )}
                        {whatsapp && (
                          <a
                            href={whatsapp}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Message ${contact.name} on WhatsApp`}
                          >
                            <MessageCircle size={16} aria-hidden="true" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </span>
                    )}
                    {index < contacts.length - 1 ? ', ' : ''}
                  </motion.span>
                )
              })}
            </div>
          ) : (
            <p className="rsvp-empty">RSVP contact details will be added here.</p>
          )}
        </OrnamentalFrame>
      </motion.div>
    </section>
  )
}

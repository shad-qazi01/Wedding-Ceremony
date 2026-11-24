import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Download } from 'lucide-react'
import type { WeddingConfig } from '../../config/weddingConfig'
import {
  downloadWeddingIcsFile,
  getWeddingGoogleCalendarUrl,
  isValidDateKey,
  localDateTimeToUtc,
  type WeddingCalendarDetails,
} from '../sections/eventCalendar'

type CountdownTimerProps = {
  config: WeddingConfig
}

type CountdownValues = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getRemaining(target: number, now: number): CountdownValues {
  let secondsRemaining = Math.max(0, Math.floor((target - now) / 1000))
  const days = Math.floor(secondsRemaining / 86_400)
  secondsRemaining %= 86_400
  const hours = Math.floor(secondsRemaining / 3_600)
  secondsRemaining %= 3_600
  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  return { days, hours, minutes, seconds }
}

function normalizeConfiguredTime(value: string): string {
  const time = value.trim()
  const twelveHour = /^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i.exec(time)
  if (twelveHour) {
    const hour = Number(twelveHour[1]) % 12 + (twelveHour[3].toUpperCase() === 'PM' ? 12 : 0)
    return `${String(hour).padStart(2, '0')}:${twelveHour[2]}`
  }
  return time
}

function buildCalendarDetails(config: WeddingConfig): WeddingCalendarDetails | null {
  const bride = config.brideName.trim()
  const groom = config.groomName.trim()
  const date = config.weddingDate.trim()
  if (!isValidDateKey(date) || !bride || !groom) return null
  return {
    title: `${bride} & ${groom} — Nikah`,
    description: config.invitationMessage.trim(),
    date,
    startTime: normalizeConfiguredTime(config.weddingStartTime),
    endTime: normalizeConfiguredTime(config.weddingEndTime),
    timeZone: config.timezone,
    location: [
      config.venue.name.trim(),
      config.venue.address.trim(),
      config.venue.city.trim(),
    ].filter(Boolean).join(', '),
  }
}

function getCountdownTarget(config: WeddingConfig): Date | null {
  const date = config.weddingDate.trim()
  if (!isValidDateKey(date)) return null
  const time = normalizeConfiguredTime(config.weddingStartTime) || '00:00'
  return localDateTimeToUtc(date, time, config.timezone)
}

export function CountdownTimer({ config }: CountdownTimerProps) {
  const targetTime = useMemo(
    () => getCountdownTarget(config)?.getTime() ?? null,
    [config],
  )
  const [now, setNow] = useState(() => Date.now())
  const details = buildCalendarDetails(config)
  const calendarUrl = details ? getWeddingGoogleCalendarUrl(details) : ''
  const calendarReady = Boolean(details && calendarUrl)
  const countdown = targetTime ? getRemaining(targetTime, now) : null
  const hasArrived = countdown?.days === 0 && countdown.hours === 0 &&
    countdown.minutes === 0 && countdown.seconds === 0

  useEffect(() => {
    if (!targetTime || hasArrived) return
    const timerId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [hasArrived, targetTime])

  return (
    <div className="countdown-wrap">
      {countdown ? (
        <div className="countdown" aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}>
          {([
            ['days', countdown.days],
            ['hours', countdown.hours],
            ['minutes', countdown.minutes],
            ['seconds', countdown.seconds],
          ] as const).map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <span className="countdown-number" aria-hidden="true">
                {String(value).padStart(2, '0')}
              </span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="date-pending">Countdown begins once the wedding date is added.</p>
      )}
      {hasArrived && <p className="countdown-arrived">The celebration day has arrived.</p>}
      <div className="date-actions">
        {calendarReady && details ? (
          <a href={calendarUrl} target="_blank" rel="noreferrer">
            <CalendarDays size={15} aria-hidden="true" />
            ADD TO GOOGLE CALENDAR
          </a>
        ) : (
          <button type="button" disabled>
            <CalendarDays size={15} aria-hidden="true" />
            ADD TO GOOGLE CALENDAR
          </button>
        )}
        {calendarReady && details ? (
          <button type="button" onClick={() => downloadWeddingIcsFile(details)}>
            <Download size={15} aria-hidden="true" />
            DOWNLOAD CALENDAR INVITATION
          </button>
        ) : (
          <button type="button" disabled>
            <Download size={15} aria-hidden="true" />
            DOWNLOAD CALENDAR INVITATION
          </button>
        )}
      </div>
      {!calendarReady && (
        <p className="calendar-pending">
          Add the couple’s names, date and valid times to enable calendar invitations.
        </p>
      )}
    </div>
  )
}

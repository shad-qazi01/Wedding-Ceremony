export type EventTimes = {
  start: Date
  end: Date
}

export function isValidDateKey(date: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return false
  const [, year, month, day] = match
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  return (
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() === Number(month) - 1 &&
    parsed.getUTCDate() === Number(day)
  )
}

function wallClockParts(timestamp: number, timeZone: string): number[] | null {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(timestamp))
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
    return [
      Number(values.year),
      Number(values.month),
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second),
    ]
  } catch (error) {
    if (error instanceof RangeError) return null
    throw error
  }
}

export function localDateTimeToUtc(date: string, time: string, timeZone: string): Date | null {
  if (!isValidDateKey(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const wallClockUtc = Date.UTC(year, month - 1, day, hour, minute)
  let timestamp = wallClockUtc

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = wallClockParts(timestamp, timeZone)
    if (!parts) return null
    const [localYear, localMonth, localDay, localHour, localMinute, localSecond] = parts
    const representedAsUtc = Date.UTC(
      localYear,
      localMonth - 1,
      localDay,
      localHour,
      localMinute,
      localSecond,
    )
    const correctedTimestamp = wallClockUtc - (representedAsUtc - timestamp)
    if (correctedTimestamp === timestamp) break
    timestamp = correctedTimestamp
  }

  const result = new Date(timestamp)
  const resolvedParts = wallClockParts(result.getTime(), timeZone)
  if (
    !resolvedParts ||
    resolvedParts[0] !== year ||
    resolvedParts[1] !== month ||
    resolvedParts[2] !== day ||
    resolvedParts[3] !== hour ||
    resolvedParts[4] !== minute
  ) {
    return null
  }
  return result
}

export function getEventTimes(
  event: { date: string; startTime: string; endTime: string },
  timeZone: string,
): EventTimes | null {
  const start = localDateTimeToUtc(event.date, event.startTime, timeZone)
  const end = localDateTimeToUtc(event.date, event.endTime, timeZone)
  if (!start || !end || end <= start) return null
  return { start, end }
}

export function getGoogleMapsUrl(
  googleMapsUrl: string,
  address: string,
  city = '',
): string {
  const directUrl = googleMapsUrl.trim()
  if (directUrl) return directUrl
  const query = [address.trim(), city.trim()].filter(Boolean).join(', ')
  if (!query) return ''
  const params = new URLSearchParams({ api: '1', destination: query })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

function formatUtcCalendarDate(date: Date): string {
  return date.toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}Z$/, 'Z')
}

export type WeddingCalendarDetails = {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  timeZone: string
  location: string
}

function isValidWeddingCalendarDetails(details: WeddingCalendarDetails): boolean {
  if (!details.title.trim() || !isValidDateKey(details.date)) return false
  if (!details.startTime && !details.endTime) return true
  return Boolean(details.startTime && details.endTime && getEventTimes(
    { date: details.date, startTime: details.startTime, endTime: details.endTime },
    details.timeZone,
  ))
}

function getAllDayEndDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1))
  return nextDay.toISOString().slice(0, 10).replaceAll('-', '')
}

function getCalendarTimes(details: WeddingCalendarDetails): string {
  if (!details.startTime || !details.endTime) {
    const start = details.date.replaceAll('-', '')
    return `${start}/${getAllDayEndDate(details.date)}`
  }
  const times = getEventTimes(
    { date: details.date, startTime: details.startTime, endTime: details.endTime },
    details.timeZone,
  )
  return times
    ? `${formatUtcCalendarDate(times.start)}/${formatUtcCalendarDate(times.end)}`
    : ''
}

export function getWeddingGoogleCalendarUrl(details: WeddingCalendarDetails): string {
  if (!isValidWeddingCalendarDetails(details)) return ''
  const dates = getCalendarTimes(details)
  if (!dates) return ''
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: details.title.trim(),
    dates,
    details: details.description.trim(),
    location: details.location.trim(),
  })
  if (details.startTime && details.endTime) params.set('ctz', details.timeZone)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function escapeIcsText(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('\n', '\\n')
    .replaceAll(',', '\\,')
    .replaceAll(';', '\\;')
}

function foldIcsLine(line: string): string {
  const segments: string[] = []
  let segment = ''
  let byteLength = 0
  const encoder = new TextEncoder()

  for (const character of line) {
    const characterBytes = encoder.encode(character).length
    if (byteLength + characterBytes > 75) {
      segments.push(segment)
      segment = ` ${character}`
      byteLength = 1 + characterBytes
    } else {
      segment += character
      byteLength += characterBytes
    }
  }
  segments.push(segment)
  return segments.join('\r\n')
}

export function createWeddingIcsContent(details: WeddingCalendarDetails): string {
  if (!isValidWeddingCalendarDetails(details)) {
    throw new Error('Calendar invitations require a configured date and valid optional start/end times.')
  }
  const allDay = !details.startTime && !details.endTime
  const times = allDay
    ? null
    : getEventTimes(
        { date: details.date, startTime: details.startTime, endTime: details.endTime },
        details.timeZone,
      )
  const date = details.date.replaceAll('-', '')
  const uid = `wedding-${date}@royal-nikah`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Royal Nikah//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${formatUtcCalendarDate(new Date())}`,
    ...(allDay
      ? [`DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${getAllDayEndDate(details.date)}`]
      : times
        ? [
            `DTSTART:${formatUtcCalendarDate(times.start)}`,
            `DTEND:${formatUtcCalendarDate(times.end)}`,
          ]
        : []),
    `SUMMARY:${escapeIcsText(details.title.trim())}`,
    `DESCRIPTION:${escapeIcsText(details.description.trim())}`,
    `LOCATION:${escapeIcsText(details.location.trim())}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`
}

export function downloadWeddingIcsFile(details: WeddingCalendarDetails): void {
  const content = createWeddingIcsContent(details)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const filename = details.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  anchor.href = url
  anchor.download = `${filename || 'wedding-event'}.ics`
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function formatDateKey(date: string, options?: Intl.DateTimeFormatOptions): string {
  if (!isValidDateKey(date)) return ''
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  }).format(new Date(Date.UTC(year, month - 1, day, 12)))
}

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

type MusicPlayerProps = {
  src: string
  title: string
}

export function MusicPlayer({ src, title }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => () => {
    if (fadeIntervalRef.current !== null) window.clearInterval(fadeIntervalRef.current)
  }, [])

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      if (fadeIntervalRef.current !== null) window.clearInterval(fadeIntervalRef.current)
      audio.pause()
      setPlaying(false)
      setMessage('Music paused')
      return
    }

    audio.volume = 0
    try {
      await audio.play()
      setPlaying(true)
      setMessage(title ? `Now playing ${title}` : 'Music playing')
      let volume = 0
      fadeIntervalRef.current = window.setInterval(() => {
        volume = Math.min(1, volume + 0.08)
        if (audioRef.current) audioRef.current.volume = volume
        if (volume >= 1 && fadeIntervalRef.current !== null) {
          window.clearInterval(fadeIntervalRef.current)
          fadeIntervalRef.current = null
        }
      }, 70)
    } catch {
      setPlaying(false)
      setMessage('Music could not be played. Please try again.')
    }
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        className="music-player-button"
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? 'Pause music' : 'Play music'}
        aria-pressed={playing}
      >
        {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
      </button>
      <span className="music-player-label">{playing ? title || 'Playing' : 'A little music'}</span>
      <span className="sr-only" aria-live="polite">{message}</span>
    </div>
  )
}

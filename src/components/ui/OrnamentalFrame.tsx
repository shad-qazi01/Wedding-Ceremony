import type { ReactNode } from 'react'

type OrnamentalFrameProps = {
  children: ReactNode
  className?: string
}

export function OrnamentalFrame({ children, className = '' }: OrnamentalFrameProps) {
  return (
    <div className={`ornamental-frame ${className}`}>
      <span className="frame-corner frame-corner--tl" aria-hidden="true" />
      <span className="frame-corner frame-corner--tr" aria-hidden="true" />
      <span className="frame-corner frame-corner--bl" aria-hidden="true" />
      <span className="frame-corner frame-corner--br" aria-hidden="true" />
      {children}
    </div>
  )
}

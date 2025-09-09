'use client'

import { useRef } from 'react'

type VideoPlayerProps = {
  src: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-auto rounded-xl shadow-md"
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
      />
    </div>
  )
}

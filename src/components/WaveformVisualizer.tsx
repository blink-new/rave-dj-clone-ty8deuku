import { useEffect, useRef } from 'react'

interface WaveformVisualizerProps {
  isPlaying: boolean
  progress: number
  className?: string
}

export function WaveformVisualizer({ isPlaying, progress, className }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, '#a855f7')
      gradient.addColorStop(0.5, '#ec4899')
      gradient.addColorStop(1, '#f97316')
      
      ctx.fillStyle = gradient
      
      // Draw waveform bars
      const barCount = 32
      const barWidth = width / barCount
      const time = Date.now() * 0.001
      
      for (let i = 0; i < barCount; i++) {
        const frequency = (i + 1) * 0.5
        let barHeight = Math.sin(time * frequency) * (height * 0.3) + height * 0.2
        
        // Add playing animation
        if (isPlaying) {
          barHeight += Math.sin(time * 10 + i * 0.5) * (height * 0.2)
        }
        
        // Apply progress effect
        const progressEffect = i < (progress / 100) * barCount ? 1.5 : 0.6
        barHeight *= progressEffect
        
        barHeight = Math.abs(barHeight)
        
        ctx.fillRect(
          i * barWidth + 2,
          height - barHeight,
          barWidth - 4,
          barHeight
        )
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw)
      }
    }
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    draw()
    
    if (isPlaying) {
      const animate = () => {
        draw()
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, progress])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-16 rounded-lg ${className}`}
      style={{ width: '100%', height: '64px' }}
    />
  )
}
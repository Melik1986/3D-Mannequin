'use client'
import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { RotationService } from '../services/RotationService'

type Props = {
  spriteSheetUrl?: string
  framesPath?: string
  rotationFrames: number
  frameWidth: number
  frameHeight: number
}

export default function MannequinViewer(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const spriteRef = useRef<PIXI.Sprite | null>(null)
  const rotationServiceRef = useRef<RotationService | null>(null)
  const frameTexturesRef = useRef<(PIXI.Texture | null)[]>([])

  // Initialize PixiJS
  useEffect(() => {
    const div = containerRef.current
    if (!div) return

    const app = new PIXI.Application({
      resizeTo: div,
      backgroundAlpha: 0,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    })
    appRef.current = app
    div.appendChild(app.view as unknown as Node)

    return () => {
      app.destroy(true)
      appRef.current = null
    }
  }, [])

  // Handle Resize
  useEffect(() => {
    const app = appRef.current
    if (!app) return

    const resizeSprite = () => {
      if (!spriteRef.current) return
      const { width, height } = app.screen
      const sprite = spriteRef.current

      const scale =
        Math.min(width / props.frameWidth, height / props.frameHeight) * 0.65 // Add padding to prevent cutting off

      sprite.scale.set(scale)
      sprite.x = width / 2
      sprite.y = height / 2
    }

    app.renderer.on('resize', resizeSprite)
    resizeSprite() // Initial sizing

    return () => {
      if (app.renderer) {
        app.renderer.off('resize', resizeSprite)
      }
    }
  }, [props.frameWidth, props.frameHeight])

  // Load Frames
  useEffect(() => {
    const app = appRef.current
    if (!app || !props.framesPath) return

    const loadFrame = async (index: number) => {
      // Helper to try loading multiple naming conventions
      const tryLoad = async (url: string) => {
        try {
          return await PIXI.Assets.load(url)
        } catch {
          return null
        }
      }

      const candidates = [
        `${props.framesPath}/frame-${index}.png`,
        `${props.framesPath}/cadr-${index}.png`,
        `${props.framesPath}/card-${index}.png`
      ]

      let loaded: PIXI.Texture | null = null
      for (const u of candidates) {
        const tex = await tryLoad(u)
        // If app is destroyed or component unmounted, stop
        if (!appRef.current || !app.stage) return

        if (tex) {
          loaded = tex
          break
        }
      }

      if (loaded) {
        frameTexturesRef.current[index] = loaded

        // If this is the first frame, initialize the sprite immediately
        if (index === 0) {
          if (!spriteRef.current) {
            const sprite = new PIXI.Sprite(loaded)
            sprite.anchor.set(0.5)
            spriteRef.current = sprite
            
            if (app.stage) {
              app.stage.addChild(sprite)
              // Trigger resize to position correctly
              app.renderer.emit('resize', app.screen.width, app.screen.height)
            }
          } else {
            spriteRef.current.texture = loaded
          }
        }
      }
    }

    const loadAll = async () => {
      // Initialize array
      frameTexturesRef.current = new Array(props.rotationFrames).fill(null)

      // 1. Load first frame ASAP (Priority)
      await loadFrame(0)

      // 2. Load the rest in background
      // We can load them in parallel batches to avoid freezing
      const promises = []
      for (let i = 1; i < props.rotationFrames; i++) {
        promises.push(loadFrame(i))
      }
      await Promise.all(promises)
    }

    void loadAll()
  }, [props.framesPath, props.rotationFrames])

  // Initialize RotationService
  useEffect(() => {
    const div = containerRef.current
    if (!div) return

    rotationServiceRef.current = new RotationService(
      div,
      (frameIndex) => {
        const tex = frameTexturesRef.current[frameIndex]
        if (tex && spriteRef.current) {
          spriteRef.current.texture = tex
        }
      },
      props.rotationFrames
    )

    return () => {
      rotationServiceRef.current?.destroy()
    }
  }, [props.rotationFrames])

  return (
    <div
      ref={containerRef}
      className="cursor-grab active:cursor-grabbing touch-none w-full h-full"
    />
  )
}

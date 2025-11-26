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
      width: props.frameWidth,
      height: props.frameHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1
    })
    appRef.current = app
    div.appendChild(app.view as unknown as Node)

    return () => {
      app.destroy(true)
      appRef.current = null
    }
  }, [props.frameWidth, props.frameHeight])

  // Load Frames
  useEffect(() => {
    const app = appRef.current
    if (!app || !props.framesPath) return

    const loadFrames = async () => {
      const frames: (PIXI.Texture | null)[] = []

      // Helper to try loading multiple naming conventions
      const tryLoad = async (url: string) => {
        try {
          return await PIXI.Assets.load(url)
        } catch {
          return null
        }
      }

      for (let i = 0; i < props.rotationFrames; i++) {
        // Handle the mixed naming convention: cadr-X vs card-X
        // Also handle the case where i might be 0-13
        const candidates = [
          `${props.framesPath}/cadr-${i}.png`,
          `${props.framesPath}/card-${i}.png`,
          `${props.framesPath}/frame-${i}.png` // Future proofing
        ]

        let loaded: PIXI.Texture | null = null
        for (const u of candidates) {
          const tex = await tryLoad(u)
          if (tex) {
            loaded = tex
            break
          }
        }
        frames.push(loaded)
      }

      frameTexturesRef.current = frames

      // Set initial frame
      if (frames[0] && !spriteRef.current) {
        const sprite = new PIXI.Sprite(frames[0])
        sprite.anchor.set(0.5) // Center anchor
        sprite.x = props.frameWidth / 2
        sprite.y = props.frameHeight / 2
        spriteRef.current = sprite
        app.stage.addChild(sprite)
      } else if (frames[0] && spriteRef.current) {
        spriteRef.current.texture = frames[0]
      }
    }

    void loadFrames()
  }, [props.framesPath, props.rotationFrames, props.frameWidth, props.frameHeight])

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
      className="cursor-grab active:cursor-grabbing touch-none"
      style={{ width: props.frameWidth, height: props.frameHeight }}
    />
  )
}

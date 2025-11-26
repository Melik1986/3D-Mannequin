'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import SKUSelector, { SKU } from './SKUSelector'

const MannequinViewer = dynamic(() => import('./MannequinViewer'), {
  ssr: false
})

type Props = {
  manifest: {
    modelId: string
    rotationFrames: number
    frameWidth: number
    frameHeight: number
    skus: SKU[]
    availableSizes: string[]
  }
}

export default function ProductPageClient({ manifest }: Props) {
  const [currentSkuId, setCurrentSkuId] = useState(manifest.skus[0]?.skuId)
  const currentSku =
    manifest.skus.find((s) => s.skuId === currentSkuId) || manifest.skus[0]

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden selection:bg-white/10">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.4)_0%,rgba(5,5,5,1)_70%)]" />
        
        {/* Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Header */}
      <header className="absolute top-12 z-20 flex flex-col items-center gap-2">
        <h2 className="text-white/40 text-sm tracking-[0.5em] font-sans uppercase">
          Interactive 3D View
        </h2>
        <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-widest text-center">
          {manifest.modelId.replace(/_/g, ' ')}
        </h1>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4" />
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {currentSku && (
          <div className="relative filter drop-shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <MannequinViewer
              framesPath={currentSku.framesPath}
              spriteSheetUrl={currentSku.spriteSheetUrl}
              rotationFrames={manifest.rotationFrames}
              frameWidth={manifest.frameWidth}
              frameHeight={manifest.frameHeight}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 z-20 flex flex-col items-center gap-6 w-full px-4">
        <SKUSelector
          skus={manifest.skus}
          currentSkuId={currentSkuId}
          onSelect={setCurrentSkuId}
        />
        
        <p className="text-white/30 font-serif text-sm tracking-widest uppercase">
          {currentSku?.fabricName}
        </p>
      </div>
    </div>
  )
}

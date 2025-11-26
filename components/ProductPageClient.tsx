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
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
      <h1 className="absolute top-8 text-2xl font-bold z-10">
        {manifest.modelId}
      </h1>

      {currentSku && (
        <MannequinViewer
          framesPath={currentSku.framesPath}
          spriteSheetUrl={currentSku.spriteSheetUrl}
          rotationFrames={manifest.rotationFrames}
          frameWidth={manifest.frameWidth}
          frameHeight={manifest.frameHeight}
        />
      )}

      <SKUSelector
        skus={manifest.skus}
        currentSkuId={currentSkuId}
        onSelect={setCurrentSkuId}
      />

      <div className="absolute top-8 right-8 z-10">
        <p>Selected: {currentSku?.fabricName}</p>
      </div>
    </div>
  )
}

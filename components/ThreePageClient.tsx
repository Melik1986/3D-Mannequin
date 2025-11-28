'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import SKUSelector, { SKU } from './SKUSelector'

const ThreeViewer = dynamic(() => import('./ThreeViewer'), { ssr: false })

type Manifest = {
  modelId: string
  model3dUrl: string
  skus: SKU[]
}

type Props = {
  manifest: Manifest
}

export default function ThreePageClient({ manifest }: Props) {
  const [currentSkuId, setCurrentSkuId] = useState(manifest.skus[0]?.skuId)
  const currentSku =
    manifest.skus.find((s) => s.skuId === currentSkuId) || manifest.skus[0]

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden selection:bg-white/10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.4)_0%,rgba(5,5,5,1)_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <header className="absolute top-12 z-20 flex flex-col items-center gap-2">
        <h2 className="text-white/40 text-sm tracking-[0.5em] font-sans uppercase">
          Interactive 3D View
        </h2>
        <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-widest text-center">
          {manifest.modelId.replace(/_/g, ' ')}
        </h1>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4" />
      </header>

      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl h-[60vh] md:h-[80vh] flex items-center justify-center filter drop-shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-all duration-300">
          <ThreeViewer modelUrl={manifest.model3dUrl} />
        </div>
      </div>

      <div className="absolute bottom-12 z-20 flex flex-col items-center gap-6 w-full px-4">
        <div className="flex items-center gap-8">
          <Link
            href={`/models/${manifest.modelId}`}
            className="group flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            title="Previous View"
          >
            <svg
              className="w-6 h-6 text-white/60 group-hover:text-white transition-colors transform rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <SKUSelector
            skus={manifest.skus}
            currentSkuId={currentSkuId}
            onSelect={setCurrentSkuId}
          />

          <Link
            href={`/models/${manifest.modelId}`}
            className="group flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            title="Next View"
          >
            <svg
              className="w-6 h-6 text-white/60 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <p className="text-white/30 font-serif text-sm tracking-widest uppercase">
          {currentSku?.fabricName}
        </p>
      </div>
    </div>
  )
}

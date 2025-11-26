'use client'
import React from 'react'

export type SKU = {
  skuId: string
  fabricName: string
  colorHex: string
  spriteSheetUrl?: string
  framesPath?: string
}

type Props = {
  skus: SKU[]
  currentSkuId: string
  onSelect: (skuId: string) => void
}

export default function SKUSelector({ skus, currentSkuId, onSelect }: Props) {
  return (
    <div className="flex gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl absolute bottom-8 left-1/2 -translate-x-1/2">
      {skus.map((sku) => (
        <button
          key={sku.skuId}
          onClick={() => onSelect(sku.skuId)}
          className={`w-12 h-12 rounded-full border-2 transition-transform hover:scale-110 ${
            currentSkuId === sku.skuId
              ? 'border-white scale-110 shadow-lg'
              : 'border-transparent'
          }`}
          style={{ backgroundColor: sku.colorHex }}
          title={sku.fabricName}
        />
      ))}
    </div>
  )
}

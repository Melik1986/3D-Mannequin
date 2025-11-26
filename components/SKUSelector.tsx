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
    <div className="flex gap-6 p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
      {skus.map((sku) => (
        <button
          key={sku.skuId}
          onClick={() => onSelect(sku.skuId)}
          className={`group relative w-10 h-10 rounded-full transition-all duration-300 ${
            currentSkuId === sku.skuId
              ? 'scale-110'
              : 'hover:scale-110 opacity-70 hover:opacity-100'
          }`}
          title={sku.fabricName}
        >
          {/* Ring Border */}
          <div className={`absolute -inset-1 rounded-full border transition-all duration-300 ${
            currentSkuId === sku.skuId
              ? 'border-white opacity-100'
              : 'border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-110'
          }`} />
          
          {/* Color Fill */}
          <div 
            className="w-full h-full rounded-full shadow-inner"
            style={{ backgroundColor: sku.colorHex }}
          />
        </button>
      ))}
    </div>
  )
}

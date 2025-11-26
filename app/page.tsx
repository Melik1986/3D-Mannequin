import ProductPageClient from '@/components/ProductPageClient'

const LOCAL_MANIFEST = {
  modelId: 'Museum_Collection',
  rotationFrames: 14,
  frameWidth: 1024,
  frameHeight: 1400,
  skus: [
    {
      skuId: 'LOCAL_SKU_1',
      fabricName: 'Royal Velvet',
      colorHex: '#1a1a1a',
      framesPath: '/costum',
    }
  ],
  availableSizes: ['M']
}

export default function Home() {
  return <ProductPageClient manifest={LOCAL_MANIFEST} />
}

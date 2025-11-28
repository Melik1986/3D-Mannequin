import ProductPageClient from '@/components/ProductPageClient'

type ManifestSKU = {
  skuId: string
  fabricName: string
  colorHex: string
  spriteSheetUrl?: string
  framesPath?: string
}

type Manifest = {
  modelId: string
  rotationFrames: number
  frameWidth: number
  frameHeight: number
  skus: ManifestSKU[]
  availableSizes: string[]
}

async function getManifest(id: string): Promise<Manifest> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/v1/models/${id}/manifest`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to load manifest')
  return res.json()
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const manifest = await getManifest(params.id)
  return <ProductPageClient manifest={manifest} />
}

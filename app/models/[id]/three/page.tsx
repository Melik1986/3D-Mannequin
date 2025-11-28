import ThreePageClient from '@/components/ThreePageClient'

type Manifest = {
  modelId: string
  model3dUrl: string
  skus: {
    skuId: string
    fabricName: string
    colorHex: string
  }[]
}

async function getManifest(id: string): Promise<Manifest> {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
  const res = await fetch(`${base}/api/v1/models/${id}/manifest`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to load manifest')
  const json = await res.json()
  return { modelId: json.modelId, model3dUrl: json.model3dUrl, skus: json.skus }
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const manifest = await getManifest(params.id)
  return <ThreePageClient manifest={manifest} />
}

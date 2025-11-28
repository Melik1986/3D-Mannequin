import ThreePageClient from '@/components/ThreePageClient'
import { getManifest } from '@/lib/manifest'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const manifest = await getManifest(params.id)
  return <ThreePageClient manifest={manifest} />
}


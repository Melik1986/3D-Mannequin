import { NextResponse } from 'next/server'
import { getManifest } from '@/lib/manifest'

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const id = params.id
  const manifest = await getManifest(id)

  return NextResponse.json(manifest)
}


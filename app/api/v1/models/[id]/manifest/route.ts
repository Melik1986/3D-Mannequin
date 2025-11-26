import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  // Mock data for the single available costume (migrated from NestJS)
  const manifest = {
    modelId: id,
    rotationFrames: 14,
    frameWidth: 1024,
    frameHeight: 1400,
    skus: [
      {
        skuId: 'COSTUME_1',
        fabricName: 'Classic Suit',
        colorHex: '#333333',
        framesPath: '/costum' // Path relative to public folder
      }
    ],
    availableSizes: ['S', 'M', 'L']
  }

  return NextResponse.json(manifest)
}

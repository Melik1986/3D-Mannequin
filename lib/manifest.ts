export type Manifest = {
  modelId: string
  rotationFrames: number
  frameWidth: number
  frameHeight: number
  model3dUrl: string
  skus: {
    skuId: string
    fabricName: string
    colorHex: string
    framesPath: string
  }[]
  availableSizes: string[]
}

export async function getManifest(id: string): Promise<Manifest> {
  // Simulate async database call or return static mock data
  return {
    modelId: id,
    rotationFrames: 13, // Based on file listing: frame-0 to frame-12 (13 frames)
    frameWidth: 1024,
    frameHeight: 1400,
    model3dUrl: '/3d-model/costum.glb',
    skus: [
      {
        skuId: 'COSTUME_1',
        fabricName: 'Classic Suit',
        colorHex: '#333333',
        framesPath: '/costum'
      }
    ],
    availableSizes: ['S', 'M', 'L']
  }
}

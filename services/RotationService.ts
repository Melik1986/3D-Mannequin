import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable)
}

export class RotationService {
  private element: HTMLElement
  private onFrameChange: (frame: number) => void
  private totalFrames: number
  private draggable: Draggable[] | null = null

  constructor(
    element: HTMLElement,
    onFrameChange: (frame: number) => void,
    totalFrames: number
  ) {
    this.element = element
    this.onFrameChange = onFrameChange
    this.totalFrames = totalFrames
    this.init()
  }

  private init() {
    // We create a proxy element or use the container itself to track "rotation"
    // Since we want infinite rotation or clamped, let's assume infinite for now but wrapping around?
    // Or just 0 to 100% mapped to frames.
    // The requirement says "360 degrees", so wrapping is good.

    this.draggable = Draggable.create(document.createElement('div'), {
      trigger: this.element,
      type: 'x',
      onDrag: this.updateFrame.bind(this)
      // We can use a large bounds or just let it go infinite and modulo the result
    })
  }

  private updateFrame() {
    if (!this.draggable) return
    const x = this.draggable[0].x

    // Sensitivity: how many pixels per frame?
    const pixelsPerFrame = 10
    const rawFrame = Math.round(-x / pixelsPerFrame)

    // Wrap around
    let frame = rawFrame % this.totalFrames
    if (frame < 0) frame += this.totalFrames

    this.onFrameChange(frame)
  }

  public destroy() {
    if (this.draggable) {
      this.draggable[0].kill()
    }
  }
}

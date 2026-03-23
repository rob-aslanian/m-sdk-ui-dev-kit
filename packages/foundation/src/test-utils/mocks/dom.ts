import { vi } from 'vitest'

const _noop = (): void => {}
// Mock HTMLCanvasElement for chart libraries
type MockCanvasRenderingContext2D = {
  arc: VoidFunction
  save: VoidFunction
  fill: VoidFunction
  rect: VoidFunction
  clip: VoidFunction
  scale: VoidFunction
  lineTo: VoidFunction
  moveTo: VoidFunction
  rotate: VoidFunction
  stroke: VoidFunction
  restore: VoidFunction
  fillText: VoidFunction
  fillRect: VoidFunction
  beginPath: VoidFunction
  translate: VoidFunction
  closePath: VoidFunction
  transform: VoidFunction
  drawImage: VoidFunction
  clearRect: VoidFunction
  setTransform: VoidFunction
  putImageData: VoidFunction
  createImageData: () => ImageData[]
  measureText: (text: string) => { width: number; height: number }
  getImageData: (x: number, y: number, w: number, h: number) => { data: number[] }
}

globalThis.HTMLCanvasElement.prototype.getContext = (() =>
  ({
    fillRect: _noop,
    clearRect: _noop,
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: Array.from({ length: w * h * 4 }),
    }),
    putImageData: _noop,
    createImageData: () => [],
    setTransform: _noop,
    drawImage: _noop,
    save: _noop,
    fillText: _noop,
    restore: _noop,
    beginPath: _noop,
    moveTo: _noop,
    lineTo: _noop,
    closePath: _noop,
    stroke: _noop,
    translate: _noop,
    scale: _noop,
    rotate: _noop,
    arc: _noop,
    fill: _noop,
    measureText: (text: string) => ({ width: 12 * text.length, height: 14 }),
    transform: _noop,
    rect: _noop,
    clip: _noop,
  }) as unknown as MockCanvasRenderingContext2D) as unknown as typeof HTMLCanvasElement.prototype.getContext

// Mock URL methods
globalThis.URL.createObjectURL = vi.fn()
globalThis.URL.revokeObjectURL = vi.fn()

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type Props = {
  modelUrl: string
}

export default function ThreeViewer({ modelUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambient)
    const directional = new THREE.DirectionalLight(0xffffff, 1.0)
    directional.position.set(2, 2, 5)
    scene.add(directional)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
    fillLight.position.set(-2, 0, 2)
    scene.add(fillLight)

    camera.position.set(0, 1, 4)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.target.set(0, 0.5, 0)
    controls.minPolarAngle = Math.PI / 2
    controls.maxPolarAngle = Math.PI / 2

    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene
        const box = new THREE.Box3().setFromObject(root)
        const center = box.getCenter(new THREE.Vector3())
        
        root.position.x = -center.x
        root.position.z = -center.z
        root.position.y = -center.y + 0.03 // Raised higher
        
        root.scale.set(1.9, 1.9, 1.9) // Increased scale
        scene.add(root)
      },
      undefined,
      (error) => {
        console.error('Error loading GLB:', error)
      }
    )

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    let mounted = true
    const tick = () => {
      if (!mounted) return
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()

    return () => {
      mounted = false
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [modelUrl])

  return <div ref={containerRef} className="w-full h-full" />
}

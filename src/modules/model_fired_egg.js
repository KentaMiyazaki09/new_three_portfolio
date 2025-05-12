import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export default (loader, scene, renderer) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()

  loader.load('/01_fired_egg.glb', (glb) => {
    const model = glb.scene
    model.position.set(5, 10, 3)
    model.rotation.y = -Math.PI / 3
    model.rotation.x = Math.PI / 3
    model.scale.set(9, 9, 9)
    model.traverse(child => {
      if(child.isMesh) {
        child.geometry.computeVertexNormals() 
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    scene.add(model)
  }, undefined, (error) => {
    console.log('読み込みエラー', error)
  })
}
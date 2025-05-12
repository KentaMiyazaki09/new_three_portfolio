/**
 * @param { Object } loader THREE.GLTFLoader()
 * @param { scene } loader THREE.Scene()
 */
export default (loader, scene) => {
  loader.load('/01_fired_egg.glb', (glb) => {
    const model = glb.scene
    model.position.set(4, 8, 3)
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
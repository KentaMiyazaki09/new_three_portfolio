/**
 * @param { Object } camera THREE.PerspectiveCamera()
 * @param { Object } renderer THREE.WebGLRenderer()
 */
export default (camera, renderer) => {
  if(window.innerWidth < 768) {
    camera.position.set(12, 5, 35)
    camera.rotation.set(0, 0.2, 0)
    camera.fov = 75
  } else {
    camera.position.set(11.5, 5, 30)
    camera.rotation.set(0, 0.2, 0)
    camera.fov = 60
  }

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}
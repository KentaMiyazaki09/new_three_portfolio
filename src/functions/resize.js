/**
 * @param { Object } camera THREE.PerspectiveCamera()
 * @param { Object } renderer THREE.WebGLRenderer()
 */
export default (camera, renderer) => {
  if(window.innerWidth < 768) {
    camera.position.set(4, 10, 38)
    camera.fov = 75
  } else {
    camera.position.set(5, 10, 35)
    camera.fov = 60
  }

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}
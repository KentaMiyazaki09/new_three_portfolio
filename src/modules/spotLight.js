import * as THREE from 'three'

export default((scene) => {
  // スポットライト
  const spotLight = new THREE.SpotLight(0xFFFFFF, 5, 100, Math.PI / 3, 0.5, 0.7)
  spotLight.position.set(25, -5, 38)
  spotLight.rotation.set(10, 0, 0)
  spotLight.castShadow = true
  scene.add(spotLight)

  //ライトヘルパー
  // const spotLightFolder = gui.addFolder('spotLight')
  // spotLightFolder.open()

  // const spotLightHelper = new THREE.SpotLightHelper(spotLight, 10)
  // scene.add(spotLightHelper)

  // const spotLightPosition = {
  //   x: spotLight.position.x,
  //   y: spotLight.position.y,
  //   z: spotLight.position.z,
  // }
  // spotLightFolder.add(spotLightPosition, 'x', -100, 100).onChange(() => {
  //   spotLight.position.x = spotLightPosition.x
  //   spotLightHelper.update()
  // })
  // spotLightFolder.add(spotLightPosition, 'y', -100, 100).onChange(() => {
  //   spotLight.position.y = spotLightPosition.y
  //   spotLightHelper.update()
  // })
  // spotLightFolder.add(spotLightPosition, 'z', -100, 100).onChange(() => {
  //   spotLight.position.z = spotLightPosition.z
  //   spotLightHelper.update()
  // })

  // const spotLighthelperControls = {
  //   showHelper: false,
  // }
  // spotLightFolder.add(spotLighthelperControls, 'showHelper').onChange((value) => {
  //   if (value) {
  //     if (!scene.children.includes(spotLightHelper)) {
  //       scene.add(spotLightHelper)
  //     }
  //   } else {
  //     if (scene.children.includes(spotLightHelper)) {
  //       scene.remove(spotLightHelper)
  //     }
  //   }
  // })
})

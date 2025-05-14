import * as THREE from 'three'

/**
 * @param { Object } scene THREE.Scene()
 * @param { Object } gui dut.gui()
 */

export default (scene, gui) => {
  //(色, 光強さ, 距離, 照射角, ボケ, 減衰率)
  const textLight = new THREE.SpotLight(0xFFFFFF, 10, 50, Math.PI / 4, 10, 0.7)
  textLight.position.set(4, 14, 28)
  textLight.castShadow = true
  // 範囲を広げる
  textLight.shadow.mapSize.width = 2048
  textLight.shadow.mapSize.height = 2048
  textLight.shadow.camera.left = -100;
  textLight.shadow.camera.right = 100;
  textLight.shadow.camera.top = 100;
  textLight.shadow.camera.bottom = -100;
  textLight.shadow.camera.near = 1;
  textLight.shadow.camera.far = 200;
  textLight.shadow.bias = -0.002;

  scene.add(textLight)

  const spotlightHelper = new THREE.SpotLightHelper(textLight)
  // scene.add(spotlightHelper)

  // ライトgui
  const textLightFolder = gui.addFolder('textLight')
  textLightFolder.open()

  const helperSetting = {
    x: textLight.position.x,
    y: textLight.position.y,
    z: textLight.position.z,
    color: `#${textLight.color.getHexString()}`,
    showHelper: false
  }

  // On/Off
  textLightFolder.add(helperSetting, 'showHelper').onChange((value) => {
    if (value) {
      if (!scene.children.includes(spotlightHelper)) {
        scene.add(spotlightHelper)
      }
    } else {
      if (scene.children.includes(spotlightHelper)) {
        scene.remove(spotlightHelper)
      }
    }
  })

  return { textLight, spotlightHelper }
}
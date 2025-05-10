import * as THREE from 'three'

/**
 * directionalLightをsceneに追加
 * @param { Object } scene
 * @param { Number } dLightPosX ライトのX座標
 * @param { Object } gui dut.gui
 * @return { Object } directionalLight ライト本体
 */

export default (scene, dLightPosX, gui) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(dLightPosX, -3, 24)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // // 影の範囲を広げる
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.bias = -0.002;

  // ヘルパー
  const lightFolder = gui.addFolder('directionalLight')
  lightFolder.open()
  const lightSettings = {
    color: '#ffffff',
  }
  lightFolder.addColor(lightSettings, 'color').onChange(value => {
    directionalLight.color.set(value)
  })
  const lightPosition = {
    x: directionalLight.position.x,
    y: directionalLight.position.y,
    z: directionalLight.position.z,
  }
  lightFolder.add(lightPosition, 'x', -50, 50).onChange(() => {
    directionalLight.position.x = lightPosition.x
  })
  lightFolder.add(lightPosition, 'y', -50, 50).onChange(() => {
    directionalLight.position.y = lightPosition.y
  })
  lightFolder.add(lightPosition, 'z', -50, 50).onChange(() => {
    directionalLight.position.z = lightPosition.z
  })

  const lightIntensity = {
    intensity: directionalLight.intensity,
  }
  lightFolder.add(lightIntensity, 'intensity', -10, 10).onChange(() => {
    directionalLight.intensity = lightIntensity.intensity
  })

  //ライトヘルパー
  const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
  // scene.add(lightHelper)

  const helperControls = {
    showHelper: false,
  }
  lightFolder.add(helperControls, 'showHelper').onChange((value) => {
    if (value) {
      if (!scene.children.includes(lightHelper)) {
        scene.add(lightHelper)
      }
    } else {
      if (scene.children.includes(lightHelper)) {
        scene.remove(lightHelper)
      }
    }
  })

  return directionalLight
}
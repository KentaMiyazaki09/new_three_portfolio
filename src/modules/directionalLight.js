import * as THREE from 'three'

/**
 * directionalLightをsceneに追加
 * @param { Object } scene
 * @param { Number } dLightPosX ライトのX座標
 * @param { Object } gui dut.gui
 * @return { Object } directionalLight ライト本体
 */

function createLight(name, shadowActive, scene, posX, posY, posZ, gui) {
  const directionalLight = new THREE.DirectionalLight('#fff1c1', 1)
  directionalLight.position.set(posX, posY, posZ)

  /* 影の描画 */
  if(shadowActive) {
    directionalLight.castShadow = true

    // 範囲を広げる
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.bias = -0.002;
  }

  scene.add(directionalLight)

  const lightFolder = gui.addFolder(`${name} textLight`)
  lightFolder.open()
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

  const helper = new THREE.DirectionalLightHelper(directionalLight)
  const helperControls = {
    showHelper: false,
  }
  lightFolder.add(helperControls, 'showHelper').onChange((value) => {
    if (value) {
      if (!scene.children.includes(helper)) {
        scene.add(helper)
      }
    } else {
      if (scene.children.includes(helper)) {
        scene.remove(helper)
      }
    }
  })
}

export default (name, shadowActive, scene, posX, posY, posZ, gui) => {
  createLight(name, shadowActive, scene, posX, posY, posZ, gui)
}
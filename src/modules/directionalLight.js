import * as THREE from 'three'

/**
 * directionalLightをsceneに追加
 * @param { String } name ライトの名前
 * @param { number } posX
 * @param { number } posY
 * @param { number } posZ
 * @param { Object } scene THREE.Scene()
 * @param { Object } gui dut.gui()
 * @return { Object } directionalLight
 */

export default function createLight(name, color, intensity, posX, posY, posZ, scene, gui = null) {
  const directionalLight = new THREE.DirectionalLight(color, intensity)
  directionalLight.position.set(posX, posY, posZ)
  scene.add(directionalLight)

  if (gui) {
    const lightFolder = gui.addFolder(`${name} Light`)
    lightFolder.open()
    const lightSetting = {
      x: directionalLight.position.x,
      y: directionalLight.position.y,
      z: directionalLight.position.z,
    }
    lightFolder.add(lightSetting, 'x', -50, 50).onChange(() => {
      directionalLight.position.x = lightSetting.x
    })
    lightFolder.add(lightSetting, 'y', -50, 50).onChange(() => {
      directionalLight.position.y = lightSetting.y
    })
    lightFolder.add(lightSetting, 'z', -100, 100).onChange(() => {
      directionalLight.position.z = lightSetting.z
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

    const settings = {
      color: `#${directionalLight.color.getHexString()}`
    }
    lightFolder.addColor(settings, 'color').onChange(value => {
      directionalLight.color.set(value)
    })
  }

  return directionalLight
}

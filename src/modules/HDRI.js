import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * HDRIをsceneに追加
 * @param { Object } scene THREE.Scene()
 */
export default (scene) => {
  return new Promise((resolve, reject) => {
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('/rogland_clear_night_4k.hdr', function(texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping
    
      scene.environment = texture
      scene.background = null
      resolve()
    }, undefined, (err) => {
      reject(err)
    })
  })
}
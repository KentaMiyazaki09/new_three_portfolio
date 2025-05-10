import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * HDRIをsceneに追加
 * @param { Object } scene
 */
export default (scene) => {
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load('/rogland_clear_night_4k.hdr', function(textture) {
    textture.mapping = THREE.EquirectangularReflectionMapping
  
    scene.environment = textture
    scene.background = textture
  })
}
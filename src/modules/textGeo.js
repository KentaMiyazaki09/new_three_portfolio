import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const fontLoader = new FontLoader()

/**
 * テキストモデルを生成
 * @param { String } text 図形にしたいテキスト
 * @param { Object } textureLoader THREE.TextureLoader()
 * @param { Number } positionX
 * @param { Number } positionY
 * @param { Number } positionZ
 * @param { Object } scene Three.scene()
 * @returns { Array } textMeshes テキストモデル
 */
export default (text, textureLoader, positionX, positionY, positionZ, scene) => {
  return new Promise((resolve) => {
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {

      /* テキスト */
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 2,
        depth: 1.5,
        curveSegments: 15, // 曲線の滑らかさ（増やすとギザギザが減る）
        bevelThickness: 0.2,
        bevelSize: 0.3,
        bevelSegment: 15, //解像度
      })
  
      /* テキストのメッシュ */
      const textTexture = textureLoader.load('/texture/metal_diff.jpg')
      const textTextureMetal = textureLoader.load('/texture/metal_metal.jpg')
      const textNormal = textureLoader.load('/texture/metal_normal.jpg')
      const textRough = textureLoader.load('/texture/metal_rough.jpg')
  
      textTexture.encoding = THREE.sRGBEncoding
      textTexture.wrapS = THREE.RepeatWrapping
      textTexture.wrapT = THREE.RepeatWrapping
      textTexture.repeat.set(0.5, 0.5)
  
      textTextureMetal.wrapS = THREE.RepeatWrapping
      textTextureMetal.wrapT = THREE.RepeatWrapping
      textTextureMetal.repeat.set(0.5, 0.5)
  
      textNormal.wrapS = THREE.RepeatWrapping
      textNormal.wrapT = THREE.RepeatWrapping
      textNormal.repeat.set(0.5, 0.5)
  
      textRough.wrapS = THREE.RepeatWrapping
      textRough.wrapT = THREE.RepeatWrapping
      textRough.repeat.set(0.5, 0.5)

      const textMaterial = new THREE.MeshPhysicalMaterial({
        map: textTexture,
        normalMap: textNormal,
        metalnessMap: textTextureMetal,
        roughnessMap: textRough,
        color: 0xf6f6f6,
        metalness: 1.0,
        roughness: 0.3,
        envMapIntensity: 1.0,
      })

      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textMesh.position.set(positionX, positionY, positionZ)
      textMesh.rotation.x = -Math.PI / 15
      textMesh.castShadow = true
      scene.add(textMesh)

      resolve({ textMesh })
    })
  })
}
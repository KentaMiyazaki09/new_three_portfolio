import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { Body, Box, Vec3 } from 'cannon-es'

const fontLoader = new FontLoader()
const textBodies = []
const textMeshes = []

/**
 * テキストモデルを生成
 * @param { String } text 図形にしたいテキスト
 * @param { Object } textureLoader THREE.TextureLoader()
 * @param { Number } positionX
 * @param { Number } positionY
 * @param { Number } positionZ
 * @param { Object } scene Three.scene()
 * @param { Object } world cannon-es.World()
 * @param { Object } textCannonMaterial cannon-es.Material()
 * @returns { Array } textMeshes テキストモデルの一覧
 * @returns { Array } textBodies Cannon.js用のテキストモデルの一覧
 */
export default (text, textureLoader, positionX, positionY, positionZ, scene, world, textCannonMaterial) => {
  return new Promise((resolve) => {
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {

      /* テキスト */
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 2.5,
        depth: 2,
        curveSegments: 15, // 曲線の滑らかさ（増やすとギザギザが減る）
        bevelThickness: 1,
        bevelSize: 0.2,
        bevelSegment: 15, //解像度
      })
  
      /* テキストのメッシュ */
      const textTexture = textureLoader.load('/metal_plate_02_diff_4k.jpg')
      const textTextureMetal = textureLoader.load('/metal_plate_02_metal_4k.jpg')
      const textNormal = textureLoader.load('/metal_plate_02_nor_gl_4k.jpg')
      const textRough = textureLoader.load('/metal_plate_02_rough_4k.jpg')
  
      textTexture.encoding = THREE.sRGBEncoding
      textTexture.wrapS = THREE.RepeatWrapping
      textTexture.wrapT = THREE.RepeatWrapping
      textTexture.repeat.set(0.1, 0.1)
  
      textTextureMetal.wrapS = THREE.RepeatWrapping
      textTextureMetal.wrapT = THREE.RepeatWrapping
      textTextureMetal.repeat.set(0.1, 0.1)
  
      textNormal.wrapS = THREE.RepeatWrapping
      textNormal.wrapT = THREE.RepeatWrapping
      textNormal.repeat.set(0.1, 0.1)
  
      textRough.wrapS = THREE.RepeatWrapping
      textRough.wrapT = THREE.RepeatWrapping
      textRough.repeat.set(0.1, 0.1)
  
      const textMaterial = new THREE.MeshStandardMaterial({
        map: textTexture,
        normalMap: textNormal,
        metalnessMap: textTextureMetal,
        roughnessMap: textRough,
        color: 0xffffff,
        roughness: 0.3,
        metalness: 1,
        envMapIntensity: 0.7,
      })
      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textMesh.position.set(positionX, positionY, positionZ)
      textMesh.castShadow = true
      scene.add(textMesh)
      textMeshes.push(textMesh)

      /* Cannon.js用のボディ */
      textGeometry.computeBoundingBox() // テキストの大きさをコピー
      const { min, max } = textGeometry.boundingBox
      const sx = (max.x - min.x) / 2
      const sy = (max.y - min.y) / 2
      const sz = (max.z - min.z) / 2

      const textBody = new Body({
        mass: 0.02,
        shape: new Box(new Vec3(sx, sy, sz)),
        position: new Vec3(positionX, positionY, positionZ),
      })
  
      textBody.allowSleep = false
    
      // 回転を制御
      textBody.fixedRotation = true
      textBody.updateMassProperties()
    
      textBody.material = textCannonMaterial
      world.addBody(textBody)
      textBodies.push(textBody)

      resolve({ textMeshes, textBodies })
    })
  })
}
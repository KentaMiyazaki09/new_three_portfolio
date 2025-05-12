import './style.css'
import * as THREE from 'three'

import HDRI from './modules/HDRI'

// import spotLight from './modules/spotLight'
import directionalLight from './modules/directionalLight'

import floor from './modules/floor'

import textGeo from './modules/textGeo'

import friedEgg from './modules/model_fired_egg'

/* dat gui */
import * as dat from 'dat.gui'
const gui = new dat.GUI()

import resize from './functions/resize'

import { GLTFLoader } from "three/examples/jsm/Addons.js"
const gltfLoader = new GLTFLoader()

/* シーン、カメラ、レンダラー */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.autoUpdate = true
document.body.appendChild(renderer.domElement)

/* HDRI */
HDRI(scene)

/* ライト */
// spotLight(scene)
const dLightPosX = -15
const dLight = directionalLight(scene, dLightPosX, gui)

/* テクスチャローダー */
const textureLoader = new THREE.TextureLoader()

/* 物理演算ワールドを作成 */
const { world, textCannonMaterial } = floor(textureLoader, scene)

/* テキストジオメトリを追加 */
const  { textMeshes, textBodies } = textGeo('WELCOME', textureLoader, -3.2, 20, 10, scene, world, textCannonMaterial)

/* 3Dモデル */
friedEgg(gltfLoader, scene)

/* アニメーション */
const clock = new THREE.Clock()
function animate() {
  world.step(1 / 60)

  // Cannon.jsのボディ位置をThree.jsのメッシュに反映
  textBodies.forEach((body, index) => {
    textMeshes[index].position.copy(body.position)
    textMeshes[index].quaternion.copy(body.quaternion)
  })

  // ライトの移動
  const elapsed = clock.getElapsedTime()
  if(elapsed > dLightPosX) {
    const t = elapsed - dLightPosX
    dLight.position.x = Math.cos(t * 0.25) * dLightPosX
  }

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

/* init */
animate()
resize(camera, renderer)

window.addEventListener('resize', () => {
  resize(camera, renderer)
})
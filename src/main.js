import './style.css'
import * as THREE from 'three'

import HDRI from './modules/HDRI'

import directionalLight from './modules/directionalLight'

import spotLight from './modules/spotLight'
import toggleChasingLightBtn from './modules/toggleChasingLightBtn'

import floor from './modules/floor'

import textGeo from './modules/textGeo'

import friedEgg from './modules/model_fired_egg'

/* dat gui */
import * as dat from 'dat.gui'
// const gui = null
const gui = new dat.GUI()

import resize from './functions/resize'

import { GLTFLoader } from "three/examples/jsm/Addons.js"
const gltfLoader = new GLTFLoader()

// 追従フラグ
let isFollowing = false
function toggleIsFollowing() {
  isFollowing = !isFollowing
  return isFollowing
}

/* シーン、カメラ、レンダラー */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

renderer.shadowMap.enabled = true
renderer.shadowMap.autoUpdate = true

document.body.appendChild(renderer.domElement)

/* ライト */
// テキストライト
const { textLight, spotlightHelper } = spotLight(scene, gui)

// マウス追従
const textLightPosition = toggleChasingLightBtn(textLight, toggleIsFollowing)

// fried_eggライト
directionalLight('egg', '#5a5ad8', 1.5, -4.3, 18, 50, scene, gui)

/*
 * HDRI
 */
HDRI(scene).then(() => {
  /* テクスチャローダー */
  const textureLoader = new THREE.TextureLoader()

  /* 物理演算ワールドを作成 */
  const { world, textCannonMaterial } = floor(textureLoader, scene)

  /* 3Dモデル */
  friedEgg(gltfLoader, scene)

  /* テキストジオメトリを追加 */
  textGeo('WELCOME', textureLoader, -2.5, 2.5, 17, scene)

  /* アニメーション */
  // const clock = new THREE.Clock()
  function animate() {
    world.step(1 / 60)

    // テキストライトをスムーズに追従させる
    if(isFollowing) {
      textLight.position.lerp(textLightPosition, 0.1)
      spotlightHelper.update()
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
})
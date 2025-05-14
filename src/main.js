import './style.css'
import * as THREE from 'three'

import HDRI from './modules/HDRI'

import directionalLight from './modules/directionalLight'
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
renderer.shadowMap.enabled = true
renderer.shadowMap.autoUpdate = true
document.body.appendChild(renderer.domElement)

/* ライト */
// テキストライト
const textLight = directionalLight('text', true, scene, -7, -0.5, 25, gui)
// マウス追従
const textLightPosition = toggleChasingLightBtn(textLight, toggleIsFollowing)

// fried_eggライト
directionalLight('egg', false, scene, -1, 22, 34, gui)

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
  textGeo('WELCOME', textureLoader, -1.5, 20, 10, scene, world, textCannonMaterial)
    .then(({ textMeshes, textBodies }) => {

      /* アニメーション */
      // const clock = new THREE.Clock()
      function animate() {
        world.step(1 / 60)

        // Cannon.jsのボディ位置をThree.jsのメッシュに反映
        textBodies.forEach((body, index) => {
          textMeshes[index].position.copy(body.position)
          textMeshes[index].quaternion.copy(body.quaternion)
        })

        // テキストライトをスムーズに追従させる
        if(isFollowing) {
          textLight.position.lerp(textLightPosition, 0.1)
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
})
import './style.css'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { World, Body, Box, Vec3, Material, ContactMaterial } from 'cannon-es'

// シーン、カメラ、レンダラーの作成
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 8)
camera.rotation.set(0.2, 0.3, 0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ライトの設置
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffddcc, 1, 100)
pointLight.position.set(5, 5, 5)
pointLight.castShadow = true
scene.add(pointLight)

// 物理演算ワールドを作成
const world = new World()
world.gravity.set(0, -9.82, 0) // 重力を下向きに設定

// 床（物理エンジン用）
const floorBody = new Body({
  type: Body.STATIC,
  shape: new Box(new Vec3(5, 0.1, 5)),
  position: new Vec3(0, -2, 0),
})
world.addBody(floorBody)

// 床（Three.js用）
const floorGeometry = new THREE.BoxGeometry(10, 0.2, 10)
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
floorMesh.position.y = -2
scene.add(floorMesh)

 // 反発係数を調整して弾みをコントロール
 const textCannonMaterial = new Material('textMaterial')
 const floorCannonMaterial = new Material('floorMaterial')
 const ContactMaterialOptions = {
   restitution: 0.2, // 反発係数
   friction: 0.3 // 摩擦係数
 }

 const contactCannonMaterial = new ContactMaterial(textCannonMaterial, floorCannonMaterial, ContactMaterialOptions)
 floorBody.material = floorCannonMaterial
 world.addContactMaterial(contactCannonMaterial)

// テキストジオメトリを追加
const fontLoader = new FontLoader()
const textBodies = []
const textMeshes = []

function createText(text, positionY) {
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 1,
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
    })

    // テキストの質感: やわらかい
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaabb,
      roughness: 0.5,
      metalness: 0.4,
    })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(-3, positionY, 0)
    scene.add(textMesh)
    textMeshes.push(textMesh)
  
    // Cannon.js用のボディ
    const textBody = new Body({
      mass: 1,
      shape: new Box(new Vec3(0.5, 0.5, 0.1)),
      position: new Vec3(-3, positionY, 0),
    })
  
    // 回転を制御
    textBody.fixedRotation = true
    textBody.updateMassProperties()
  
    textBody.material = textCannonMaterial
    world.addBody(textBody)
    textBodies.push(textBody)
  })
}

// アニメーションループ
function animate() {
  world.step(1 / 60)

  // Cannon.jsのボディ位置をThree.jsのメッシュに反映
  textBodies.forEach((body, index) => {
    textMeshes[index].position.copy(body.position)
    textMeshes[index].quaternion.copy(body.quaternion)
  })

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

// 関数の実行
createText('Portfolio', 3)
setTimeout(() => {
  createText('k.miyazaki', 3)
}, 1000)
animate()
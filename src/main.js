import './style.css'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { World, Body, Box, Vec3, Material, ContactMaterial } from 'cannon-es'

// シーン、カメラ、レンダラーの作成
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.rotation.set(0, 0, 0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.autoUpdate = true
document.body.appendChild(renderer.domElement)

// ライトの設置
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(15, 10, 11)
directionalLight.target.position.set(15, 0, 0)
directionalLight.castShadow = true
scene.add(directionalLight)
scene.add(directionalLight.target)

// 影の範囲を広げる
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.bias = -0.0001;

// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(lightHelper)

// 背景の壁
const bgGeometry = new THREE.PlaneGeometry(100, 100)
const beMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe4b5,
  roughness: 1.0,
  metalness: 0.0,
})
const bgPlane = new THREE.Mesh(bgGeometry, beMaterial)
bgPlane.position.set(15, 0, -10)
bgPlane.receiveShadow = true
scene.add(bgPlane)

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
const floorGeometry = new THREE.BoxGeometry(100, 0.2, 50)
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe4b5,
  roughness: 0.7,
  metalness: 0,
})
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
floorMesh.position.y = -2
floorMesh.position.x = 15
floorMesh.receiveShadow = true
scene.add(floorMesh)

 // 反発係数を調整して弾みをコントロール
 const textCannonMaterial = new Material('textMaterial')
 const floorCannonMaterial = new Material('floorMaterial')
 const ContactMaterialOptions = {
   restitution: 0.5, // 反発係数
   friction: 0.3 // 摩擦係数
 }

 const contactCannonMaterial = new ContactMaterial(textCannonMaterial, floorCannonMaterial, ContactMaterialOptions)
 floorBody.material = floorCannonMaterial
 world.addContactMaterial(contactCannonMaterial)

// テキストジオメトリを追加
const fontLoader = new FontLoader()
const textBodies = []
const textMeshes = []
function createText(text, positionX, positionY, positionZ) {
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 2.5,
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.8,
      bevelSize: 0.4,
    })

    // テキストの質感: やわらかい
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.4,
    })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(positionX, positionY, positionZ)
    textMesh.castShadow = true
    scene.add(textMesh)
    textMeshes.push(textMesh)
  
    // Cannon.js用のボディ
    const textBody = new Body({
      mass: 1,
      shape: new Box(new Vec3(1.5, 1.5, 0.5)),
      position: new Vec3(positionX, positionY, positionZ),
    })

    textBody.allowSleep = false
  
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

// ウィンドウリサイズ
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}

// レスポンシブ
function updateCamera() {
  if(window.innerWidth < 768) {
    camera.position.set(15, 10, 60)
    camera.fov = 75
  } else {
    camera.position.set(15, 10, 40)
    camera.fov = 60
  }
}


// 関数の実行
createText('k.miyazaki Portfolio', 0, 5, 0)
animate()
updateCamera()

window.addEventListener('resize', () => {
  onWindowResize()
  updateCamera()
})
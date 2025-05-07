import './style.css'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { World, Body, Box, Vec3, Material, ContactMaterial } from 'cannon-es'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// dat gui
import * as dat from 'dat.gui'
const gui = new dat.GUI()

// テクスチャローダー
const textureLoader = new THREE.TextureLoader()

const texture = textureLoader.load('/brick_wall_001_diffuse_4k.jpg')
const normal = textureLoader.load('/brick_wall_001_nor_gl_4k.jpg')
texture.encoding = THREE.sRGBEncoding
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(1, 1)

// シーン、カメラ、レンダラーの作成
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.autoUpdate = true
document.body.appendChild(renderer.domElement)

// HDRI
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/minedump_flats_4k.hdr', function(textture) {
  textture.mapping = THREE.EquirectangularReflectionMapping

  scene.environment = textture
  scene.background = textture
})

// ライトの設置
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
scene.add(ambientLight)

// ライトのヘルパー
const lightFolder = gui.addFolder('directionalLight')
lightFolder.open()

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(-1, 12, 9)
directionalLight.target.position.set(15, 0, 0)
directionalLight.castShadow = true
scene.add(directionalLight)
scene.add(directionalLight.target)

const lightSettings = {
  color: '#ffffff',
}
lightFolder.addColor(lightSettings, 'color').onChange(value => {
  directionalLight.color.set(value)
})
const lightPosition = {
  x: directionalLight.position.x,
  y: directionalLight.position.y,
  z: directionalLight.position.z,
}
lightFolder.add(lightPosition, 'x', -50, 50).onChange(() => {
  directionalLight.position.x = lightPosition.x
})
lightFolder.add(lightPosition, 'y', 0, 50).onChange(() => {
  directionalLight.position.y = lightPosition.y
})
lightFolder.add(lightPosition, 'z', -50, 50).onChange(() => {
  directionalLight.position.z = lightPosition.z
})

const lightIntensity = {
  intensity: directionalLight.intensity,
}
lightFolder.add(lightIntensity, 'intensity', -10, 10).onChange(() => {
  directionalLight.intensity = lightIntensity.intensity
})

// 影の範囲を広げる
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.bias = -0.01;

//ライトヘルパー
const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(lightHelper)

const helperControls = {
  showHelper: false,
}
lightFolder.add(helperControls, 'showHelper').onChange((value) => {
  if (value) {
    if (!scene.children.includes(lightHelper)) {
      scene.add(lightHelper)
    }
  } else {
    if (scene.children.includes(lightHelper)) {
      scene.remove(lightHelper)
    }
  }
})


// 背景の壁
const bgGeometry = new THREE.PlaneGeometry(200, 200)
const beMaterial = new THREE.MeshStandardMaterial({
  normalMap: normal,
  map: texture,
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
const floorGeometry = new THREE.BoxGeometry(200, 0.2, 150)
const floorMaterial = new THREE.MeshStandardMaterial({
  normalMap: normal,
  map: texture,
  color: 0xffe4b5,
  roughness: 1.0,
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
      size: 5,
      depth: 1,
      bevelEnabled: true,
      curveSegments: 15,  // 曲線の滑らかさ（増やすとギザギザが減る）
      bevelThickness: 1,
      bevelSize: 0.2,
      bevelSegment: 15, //解像度
    })

    // テキストのメッシュ
    const textTexture = textureLoader.load('/metal_plate_02_metal_4k.jpg')
    const textNormal = textureLoader.load('/metal_plate_02_nor_gl_4k.jpg')
    const textRough = textureLoader.load('/metal_plate_02_rough_4k.jpg')
    textTexture.encoding = THREE.sRGBEncoding
    textTexture.wrapS = THREE.RepeatWrapping
    textTexture.wrapT = THREE.RepeatWrapping
    textTexture.repeat.set(0.001, 0.001)

    const textMaterial = new THREE.MeshStandardMaterial({
      normalMap: textNormal,
      metalnessMap: textTexture,
      roughnessMap: textRough,
      color: 0xffffff,
      roughness: 0.4,
      metalness: 1.0,
      flatShading: false,
      envMapIntensity: 0.3,
    })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(positionX, positionY, positionZ)
    textMesh.castShadow = true
    scene.add(textMesh)
    textMeshes.push(textMesh)
  
    // Cannon.js用のボディ
    const textBody = new Body({
      mass: 0.02,
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
    camera.position.set(25, 10, 50)
    camera.rotation.set(0, 0.2, 0)
    camera.fov = 75
  } else {
    camera.position.set(18, 5, 30)
    camera.rotation.set(0, 0.2, 0)
    camera.fov = 60
  }
}

// 関数の実行
createText('Portforio', 0, 40, 5)
animate()
updateCamera()
onWindowResize()

window.addEventListener('resize', () => {
  onWindowResize()
  updateCamera()
})
import * as THREE from 'three'
import { World, Body, Box, Vec3, Material, ContactMaterial } from 'cannon-es'

/**
 * sceneに物理エンジン搭載の床を設置
 * @param { Object } textureLoader THREE.TextureLoader
 * @param { Object } scene
 * @returns { Object } world cannon-es World
 * @returns { Object } textCannonMaterial cannon-es Material
 */

export default (textureLoader, scene) => {
  /**
   * テクスチャ
   */
  const map = textureLoader.load('/brick_wall_001_diffuse_4k.jpg')
  map.encoding = THREE.sRGBEncoding
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.repeat.set(2, 2)

   const normalMap = textureLoader.load('/brick_wall_001_nor_gl_4k.jpg')
  normalMap.encoding = THREE.sRGBEncoding
  normalMap.wrapS = THREE.RepeatWrapping
  normalMap.wrapT = THREE.RepeatWrapping
  normalMap.repeat.set(2, 2)

  /*
   * 壁
   */
   const bgGeometry = new THREE.PlaneGeometry(200, 200)
  const beMaterial = new THREE.MeshStandardMaterial({
    map: map,
    normalMap: normalMap,
    color: 0xf6f6f6,
    roughness: 1.0,
    metalness: 0.0,
    envMapIntensity: 1,
  })
  const bgPlane = new THREE.Mesh(bgGeometry, beMaterial)
  bgPlane.position.set(15, 0, -10)
  bgPlane.receiveShadow = true
  scene.add(bgPlane)

  /**
   * 床
   */
  const world = new World()
  world.gravity.set(0, -9.82, 0) // 重力を下向きに設定

  // 床（物理エンジン用）
  const floorBody = new Body({
    type: Body.STATIC,
    shape: new Box(new Vec3(200, 0.2, 150)),
    position: new Vec3(0, -2, 0),
  })
  world.addBody(floorBody)

  // 床（Three.js用）
  const floorGeometry = new THREE.BoxGeometry(200, 0.2, 150)
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: map,
    normalMap: normalMap,
    color: 0xffffff,
    roughness: 1.0,
    metalness: 0,
    envMapIntensity: 1,
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

  return {world, textCannonMaterial}
}
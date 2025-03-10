import './style.css'
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { World, Body, Box, Vec3, Material, ContactMaterial } from 'cannon-es';

// シーン、カメラ、レンダラーの作成
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 物理演算ワールドを作成
const world = new World();
world.gravity.set(0, -9.82, 0); // 重力を下向きに設定

// 床（物理エンジン用）
const floorBody = new Body({
  type: Body.STATIC,
  shape: new Box(new Vec3(5, 0.1, 5)),
  position: new Vec3(0, -2, 0),
});
world.addBody(floorBody);

// 床（Three.js用）
const floorGeometry = new THREE.BoxGeometry(10, 0.2, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.position.y = -2;
scene.add(floorMesh);

// テキストジオメトリを追加
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('PORTFOLIO', {
    font: font,
		size: 1,
    depth: 0.4,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textMesh);

  // Cannon.js用のボディ
  const textBody = new Body({
    mass: 1,
    shape: new Box(new Vec3(0.5, 0.5, 0.1)),
    position: new Vec3(-3, 3, 0),
  });

  // 回転を制御
  textBody.fixedRotation = true
  textBody.updateMassProperties()

  // 反発係数を調整して弾みぐらいをコントロール
  const textCannonMaterial = new Material('textMaterial')
  const floorCannonMaterial = new Material('floorMaterial')
  const ContactMaterialOptions = {
    restitution: 0.4, // 反発係数
    friction: 0.3 // 摩擦係数
  }

  const contactCannonMaterial = new ContactMaterial(textCannonMaterial, floorCannonMaterial, ContactMaterialOptions)

  textBody.material = textCannonMaterial
  floorBody.material = floorCannonMaterial
  world.addContactMaterial(contactCannonMaterial)

  world.addBody(textBody);

  // アニメーションループ
  function animate() {
    world.step(1 / 60);

    // Cannon.jsのボディ位置をThree.jsのメッシュに反映
    textMesh.position.copy(textBody.position);
    textMesh.quaternion.copy(textBody.quaternion);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
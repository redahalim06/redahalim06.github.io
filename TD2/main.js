import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(2, 3, 4);
scene.add(sun);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const loader = new THREE.TextureLoader();
const texture = loader.load('textures/crate.gif');
texture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshStandardMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
cube.position.x = -2;
scene.add(cube);

let mixer;
const clock = new THREE.Clock();

const gltfLoader = new GLTFLoader();
gltfLoader.load('models/Horse.glb', (gltf) => {
  const horse = gltf.scene;
  horse.scale.set(0.01, 0.01, 0.01);
  horse.position.set(2, -1, 0);
  scene.add(horse);

  console.log(gltf.animations.map((a) => a.name));

  mixer = new THREE.AnimationMixer(horse);
  mixer.clipAction(gltf.animations[0]).play();
});

function animate() {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// 03-geometries.js
// - DirectionalLightHelper
// - CameraHelper for shadow range
// - ConvexGeometry, LatheGeometry, OctahedronGeometry, ParametricGeometry
// - TetrahedronGeometry, TorusGeometry
// - MeshStandardMaterial, MeshBasicMaterial
// - MultiMaterialObject

import * as THREE from 'three';  
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { ParametricGeometries } from 'three/addons/geometries/ParametricGeometries.js';
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 120;
camera.position.y = 60;
camera.position.z = 180;
camera.lookAt(new THREE.Vector3(-10, 0, 0));
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

let orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(40, 40, 0);
directionalLight.castShadow = true;

// shadow 설정 추가
directionalLight.shadow.camera.left = -300;  // 그림자 생성 구간 설정
directionalLight.shadow.camera.right = 300;
directionalLight.shadow.camera.top = 300;
directionalLight.shadow.camera.bottom = -300;
directionalLight.shadow.camera.near = 10;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.mapSize.width = 2048;  // 그림자 해상도 증가
directionalLight.shadow.mapSize.height = 2048;  // 그림자 해상도 증가

scene.add(directionalLight);

const geometry = new THREE.SphereGeometry(1, 32, 32); // 반지름 1, 세그먼트 32x32
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.scale.set(10, 10, 10);

//수성
const textureLoader = new THREE.TextureLoader();
const mercuryTexture = textureLoader.load('Mercury.jpg');
const material2 = new THREE.MeshStandardMaterial({
    map: mercuryTexture,
    roughness: 0.8,
    metalness: 0.2
});

const sphere2 = new THREE.Mesh(geometry, material2);

sphere2.position.x = 20;
sphere2.position.y = 0;
sphere2.position.z = 0;
scene.add(sphere2);
sphere2.scale.set(1.5, 1.5, 1.5);


//금성
const textureLoader2 = new THREE.TextureLoader();
const venusTexture = textureLoader2.load('Venus.jpg');
const material3 = new THREE.MeshStandardMaterial({
    map: venusTexture,
    roughness: 0.8,
    metalness: 0.2
});

const sphere3 = new THREE.Mesh(geometry, material3);

sphere3.position.x = 35;
sphere3.position.y = 0;
sphere3.position.z = 0;
scene.add(sphere3);
sphere3.scale.set(3, 3, 3);


//지구
const textureLoader3 = new THREE.TextureLoader();
const earthTexture = textureLoader3.load('Earth.jpg');
const material4 = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.8,
    metalness: 0.2
});

const sphere4 = new THREE.Mesh(geometry, material4);

sphere4.position.x = 50;
sphere4.position.y = 0;
sphere4.position.z = 0;
scene.add(sphere4);
sphere4.scale.set(3.5, 3.5, 3.5);


//화성
const textureLoader4 = new THREE.TextureLoader();
const marsTexture = textureLoader4.load('Mars.jpg');
const material5 = new THREE.MeshStandardMaterial({
    map: marsTexture,
    roughness: 0.8,
    metalness: 0.2
});

const sphere5 = new THREE.Mesh(geometry, material5);

sphere5.position.x = 65;
sphere5.position.y = 0;
sphere5.position.z = 0;
scene.add(sphere5);
sphere5.scale.set(2.5, 2.5, 2.5);


// call the render function
let step = 0;

const gui = new GUI();

const controls = new function () {
    this.perspective = "Perspective";
    this.Switch = function () {
        if (camera instanceof THREE.PerspectiveCamera) {
            scene.remove(camera);
            camera = null; // 기존의 camera 제거    
            // OrthographicCamera(left, right, top, bottom, near, far)
            camera = new THREE.OrthographicCamera(window.innerWidth / -16, 
                window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(new THREE.Vector3(-10, 0, 0));
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Orthographic";
        } else {
            scene.remove(camera);
            camera = null; 
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(new THREE.Vector3(-10, 0, 0));
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Perspective";
        }
    };
};
const CameraControl = gui.addFolder('Camera');
CameraControl.add(controls, 'Switch').name('Switch Camera Type');
CameraControl.add(controls, 'perspective').listen();

const props = {
    mer_rot_speed: 0.02,
    mer_orb_speed: 0.02,

    ven_rot_speed: 0.015,
    ven_orb_speed: 0.015,

    ear_rot_speed: 0.01,
    ear_orb_speed: 0.01,

    mar_rot_speed: 0.008,
    mar_orb_speed: 0.008,
};
const MercuryControl = gui.addFolder('Mercury');
MercuryControl.add(props, 'mer_rot_speed', 0, 0.2, 0.001);
MercuryControl.add(props, 'mer_orb_speed', 0, 0.2, 0.001);

const VenusControl = gui.addFolder('Venus');
VenusControl.add(props, 'ven_rot_speed', 0, 0.15, 0.001);
VenusControl.add(props, 'ven_orb_speed', 0, 0.15, 0.001);

const EarthControl = gui.addFolder('Earth');
EarthControl.add(props, 'ear_rot_speed', 0, 0.1, 0.001);
EarthControl.add(props, 'ear_orb_speed', 0, 0.1, 0.001);

const MarsControl = gui.addFolder('Mars');
MarsControl.add(props, 'mar_rot_speed', 0, 0.08, 0.001);
MarsControl.add(props, 'mar_orb_speed', 0, 0.08, 0.001);

const pivot = new THREE.Object3D();
scene.add(pivot);
pivot.add(sphere2);

const pivot2 = new THREE.Object3D();
scene.add(pivot2);
pivot2.add(sphere3);

const pivot3 = new THREE.Object3D();
scene.add(pivot3);
pivot3.add(sphere4);

const pivot4 = new THREE.Object3D();
scene.add(pivot4);
pivot4.add(sphere5);

render();

function render() {
    orbitControls.update();
    stats.update();
    renderer.render(scene, camera);

    step += 1;

    pivot.rotation.y = step * props.mer_rot_speed;
    sphere2.rotation.y = step * props.mer_orb_speed;
    
    pivot2.rotation.y = step * props.ven_rot_speed;
    sphere3.rotation.y = step * props.ven_orb_speed;

    pivot3.rotation.y = step * props.ear_rot_speed;
    sphere4.rotation.y = step * props.ear_orb_speed;

    pivot4.rotation.y = step * props.mar_rot_speed;
    sphere5.rotation.y = step * props.mar_orb_speed;

    requestAnimationFrame(render);
}
//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xFFFFFF);

//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the guitar move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'guitar';

//Instantiate a loader for the .gltf file
// const loader = new GLTFLoader();
// loader.load(
//   `models/${objToRender}/fender_stratocaster1.gltf`,
//   function (gltf) {
//     //If the file is loaded, add it to the scene
//     object = gltf.scene;
//     scene.add(object);
//   },
//   function (xhr) {
//     //While it is loading, log the progress
//     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//   },
//   function (error) {
//     //If there is an error, log it
//     console.error(error);
//   }
// );

// Instantiate a loader for the .obj file
const loader = new OBJLoader();
loader.load(
  'models/guitar/harledson_XYN.obj', // Replace with your .obj file path
  function (object) {
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    object.material = material;
    object.scale.set(10, 10, 10);
    object.rotation.y = Math.PI / 2;
    scene.add(object);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "guitar" ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const rightLight = new THREE.DirectionalLight(0xFFFFFF, 0.5); // (color, intensity)
rightLight.position.set(500, 500, 500) //top-left-ish
rightLight.castShadow = true;
scene.add(rightLight);

const leftLight = new THREE.DirectionalLight(0xFFFFFF, 0.5); // (color, intensity)
leftLight.position.set(-500, -500, -500) //top-left-ish
leftLight.castShadow = true;
scene.add(leftLight);

// const ambientLight = new THREE.AmbientLight(0xFFFFFF, objToRender === "guitar" ? 5 : 1);
// scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "guitar") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the guitar move
  if (object && objToRender === "guitar") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the guitar move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();
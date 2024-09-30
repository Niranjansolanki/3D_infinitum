let scene, camera, renderer, objLoader, controls, objModel;
let leftLight, rightLight;

// Initialize Three.js scene
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Set background color of the scene
    renderer.setClearColor(0x808080); // Change this color to your desired background color
    document.body.appendChild(renderer.domElement);

    // Add OrbitControls for camera movement
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    const gridMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff00 // Green color
    });
    // Create the grid helper with the custom material
    const gridHelper = new THREE.GridHelper(100, 10, gridMaterial);
    scene.add(gridHelper);

    // Create and add a colored plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // Change the color here
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
    scene.add(plane);

    // Add axes helper (red = X, green = Y, blue = Z)
    const axesHelper = new THREE.AxesHelper(50);  // 50 units long
    scene.add(axesHelper);

    const axesHelper2 = new THREE.AxesHelper(50);
    axesHelper2.rotation.y = Math.PI;
    scene.add(axesHelper2);

    // Add left and right directional lights with separate intensities
    leftLight = new THREE.DirectionalLight(0xffffff, 1);
    leftLight.position.set(-10, 10, 0);
    scene.add(leftLight);

    rightLight = new THREE.DirectionalLight(0xffffff, 1);
    rightLight.position.set(10, 10, 0);
    scene.add(rightLight);

    // Set camera position
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // Initialize the OBJ Loader
    objLoader = new THREE.OBJLoader();

    // Animation loop
    animate();
}

// Load OBJ Model
function loadModel(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const contents = event.target.result;
        const object = objLoader.parse(contents);

        if (objModel) {
            scene.remove(objModel); // Remove previous model
        }

        objModel = object;
        scene.add(objModel);
    };
    reader.readAsText(file);
}

// Function to scale the model
function scaleModel(percentage) {
    if (objModel) {
        const scale = percentage / 100;
        objModel.scale.set(scale, scale, scale);
    }
}

// Add Event Listeners
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        loadModel(file);
    }
});

document.getElementById('scaleButton').addEventListener('click', function() {
    const scaleValue = parseFloat(document.getElementById('scaleInput').value);
    scaleModel(scaleValue);
});

// Light intensity controls
document.getElementById('intensityRangeLeft').addEventListener('input', function(event) {
    leftLight.intensity = parseFloat(event.target.value);
});

document.getElementById('intensityRangeRight').addEventListener('input', function(event) {
    rightLight.intensity = parseFloat(event.target.value);
});

// Add keyboard controls for moving the object
document.addEventListener('keydown', function(event) {
    if (objModel) {
        const moveDistance = 0.1; // Move object by 0.1 units
        switch (event.code) {
            case 'ArrowUp':
                objModel.position.y += moveDistance;  // Move up
                break;
            case 'ArrowDown':
                objModel.position.y -= moveDistance;  // Move down
                break;
            case 'ArrowLeft':
                objModel.position.x -= moveDistance;  // Move left
                break;
            case 'ArrowRight':
                objModel.position.x += moveDistance;  // Move right
                break;
        }
    }
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();

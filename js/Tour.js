import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', function () {
    function initVirtualTour(imageParentElement, imageUrl) {
        // Create the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(90, imageParentElement.clientWidth / imageParentElement.clientHeight, 0.8, 10000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(imageParentElement.clientWidth, imageParentElement.clientHeight);
        imageParentElement.appendChild(renderer.domElement);

        // Create Stats
        const stats = new Stats();
        document.body.appendChild(stats.dom);

        // Create sphere geometry and load texture
        const geometry = new THREE.SphereGeometry(100, 60, 40);
        geometry.scale(-1, 1, 1); // Invert the geometry on the x-axis

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            imageUrl,
            function (texture) {
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const sphere = new THREE.Mesh(geometry, material);
                scene.add(sphere);

                // Add controls
                const controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.enableZoom = false;
                controls.target.set(0, 0, 0);
                controls.update();

                // Animation loop
                function animate() {
                    requestAnimationFrame(animate);
                    controls.update();
                    renderer.render(scene, camera);
                    stats.update(); // Update stats
                }

                animate();
            },
            undefined, // onProgress callback is currently not supported
            function (err) {
                console.error('An error happened while loading the texture.', err);
            }
        );

        // Set the camera position further back to zoom out
        camera.position.set(0, 0, -10);

        // Handle window resize
        window.addEventListener('resize', function () {
            const width = imageParentElement.clientWidth;
            const height = imageParentElement.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        // Example GSAP animation (optional)
        gsap.to(camera.position, { duration: 2, z: 5, onUpdate: function () {
            camera.lookAt(0, 0, 0);
        }});
    }

    // Initialize virtual tours for all elements with the class "tour"
    document.querySelectorAll('.tour').forEach(tourElement => {
        const imageElement = tourElement.querySelector('.image img');
        const imageParentElement = tourElement.querySelector('.image');
        if (imageElement) {
            const imageUrl = imageElement.src;
            console.log('Initializing virtual tour for:', imageUrl);
            initVirtualTour(imageParentElement, imageUrl);
        }
    });
});
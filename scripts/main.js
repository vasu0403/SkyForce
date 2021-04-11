import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import {Game} from './game.js'
import {InputManager} from './inputManager.js'
main();
function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    {
        const color = 0xFAFAFA;  // white
        const near = 65;
        const far = 70;
        // scene.fog = new THREE.Fog(color, near, far);

        // const color = 0xFFFFFF;
        // const density = 0.015;
        // scene.fog = new THREE.FogExp2(color, density);
    }

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    const models = {
        player: {url: 'http://localhost:8080/models/jet_final.gltf'},
        building1: {url: 'http://localhost:8080/models/building1/scene.gltf'},
        building2: {url: 'http://localhost:8080/models/building2/scene.gltf'},
        building3: {url: 'http://localhost:8080/models/building3/scene.gltf'},
    }
    const manager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(manager);
    let game;
    for (const model of Object.values(models)) {
        gltfLoader.load(model.url, (gltf) => {
            model.scene = gltf.scene;
            scene.add(model.scene);
            const box = new THREE.Box3().setFromObject(model.scene);
            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());
            // console.log(model);
            // console.log(boxSize);
            // console.log(boxCenter)
        });
    }
    manager.onLoad = function() {
        const ground = -50;
        const buildingSize = 6.0;
        {
            const size = 0.1;
            models.building1.scene.name = 'building1';
            models.building1.scene.position.set(0, ground + 7.5, -100);
            models.building1.scene.scale.set(buildingSize * size, buildingSize * size, buildingSize * size);
        }
        {
            const size = 0.0005;
            models.building2.scene.name = 'building2';
            models.building2.scene.position.set(30, ground, -10)
            models.building2.scene.scale.set(buildingSize * size, buildingSize * size, buildingSize * size);
            const model = models.building2.scene.children[0].children[0].children[0].children[0].children[0].children[0];
            model.material.metalness = 0;
        }
        {
            const size = 0.0004;
            models.building3.scene.name = 'building3';
            models.building3.scene.position.set(30, ground, -42)
            models.building3.scene.scale.set(buildingSize * size, buildingSize * size, buildingSize * size);
            const model = models.building3.scene.children[0].children[0].children[0].children[0].children[0].children[0];
            model.material.metalness = 0;
        }

        let inputManager = new InputManager();
        game = new Game(camera, scene, models, inputManager);
        requestAnimationFrame(render);
    };
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    function render(time) {
        time *= 0.001;
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        game.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
}

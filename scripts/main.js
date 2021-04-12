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

    const fogColor = 0x000000;  //
    const fogNear = 200;
    const fogFar = 300;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    // scene.fog = new THREE.FogExp2(0x03544e, 0.001);
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
        enemy1: {url: 'http://localhost:8080/models/enemy5/scene.gltf'},
        enemy2: {url: 'http://localhost:8080/models/enemy6/scene.gltf'},
        bullet: {url: 'http://localhost:8080/models/bullet1/scene.gltf'},
        enemyBullet: {url: 'http://localhost:8080/models/bullet3/scene.gltf'},
        star: {url: 'http://localhost:8080/models/star/scene.gltf'},
        moon: {url: 'http://localhost:8080/models/moon/scene.gltf'},
    }
    const manager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(manager);
    let game;
    for (const model of Object.values(models)) {
        gltfLoader.load(model.url, (gltf) => {
            model.scene = gltf.scene;
            // if(model != enemy1 && model != enemy2) {
                // scene.add(model.scene);
            // }
            const box = new THREE.Box3().setFromObject(model.scene);
            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());
            // console.log(model);
            // console.log(boxSize);
            // console.log(boxCenter);
        });
    }
    manager.onLoad = function() {
        const ground = -50;
        const buildingSize = 6.0;
        {
            const size = 0.1;
            models.building1.scene.name = 'building1';
            models.building1.scene.position.set(0, ground + 7.5, -75);
            models.building1.scene.scale.set(buildingSize * size, buildingSize * size, buildingSize * size);
        }

        {
            const size = 0.0005;
            models.building2.scene.name = 'building2';
            models.building2.scene.position.set(30, ground, -15.0)
            models.building2.scene.scale.set(buildingSize * size, buildingSize * size, buildingSize * size);
            const model = models.building2.scene.children[0].children[0].children[0].children[0].children[0].children[0];
            model.material.metalness = 0.0;
        }

        {
            models.enemy1.scene.position.set(0, -0.5, 0);
            models.enemy1.scene.scale.set(0.3, 0.3, 0.3);
            const model = models.enemy1.scene.children[0].children[0].children[0];
            for(let i = 0; i < 5; i++) {
                model.children[i].material.metalness = 0;
            }
        }

        {
            models.enemy2.scene.position.set(0, -1, 0);
            models.enemy2.scene.scale.set(0.3, 0.3, 0.3);
        }

        {
            models.bullet.scene.position.set(0, 0, 0);
            models.bullet.scene.scale.set(0.007, 0.007, 0.007);
            models.bullet.scene.rotateX(-Math.PI / 2);
            const model = models.bullet.scene.children[0].children[0].children[0];
            for(let i = 0; i < 12; i++) {
                model.children[i].material.metalness = 0;
            }
        }

        {
            models.enemyBullet.scene.scale.set(0.1, 0.1, 0.1);
            let myAxis = new THREE.Vector3(0, 0, 1);
            models.enemyBullet.scene.rotateOnWorldAxis(myAxis, -0.07);
            myAxis = new THREE.Vector3(1, 0, 0);
            models.enemyBullet.scene.rotateOnWorldAxis(myAxis, Math.PI / 2);
            // scene.add(models.enemyBullet.scene);
        }
        {
            models.star.scene.scale.set(0.5, 0.5, 0.5);
        }
        {
            const color = 0xFFFFFF;
            const intensity = 0.1;
            const light = new THREE.PointLight(color, intensity);
            models.moon.scene.scale.set(0.05, 0.05, 0.05);
            models.moon.scene.add(light);
            models.moon.scene.position.set(-10, 10, -100);
            scene.add(models.moon.scene);
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

import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {Player} from './player.js'
const CAMERA_POSITION = {
    x: 0,
    y: 13,
    z: 20
}
export class Game {
    constructor(camera, scene, models, inputManager) {
        this.camera = camera;
        this.scene = scene;
        this.models = models;
        this.inputManager = inputManager;

        this.player = new Player(this.models.player.scene);
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 1;
        this.models.player.scene.add(axes);
        this.camera.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
        this.camera.lookAt(0, 0, 0);

        this.models.player.scene.rotation.y = -(Math.PI / 2);

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.scene.add(light);

        // adding ground
        const planeSize = 40;
        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        mesh.position.y = -50.0;
        this.scene.add(mesh);

        this.building2Copy1 = this.models.building2.scene.clone();
        this.building2Copy1.position.x = -30;
        this.building2Copy1.position.z = -15.0;

        this.building2Copy2 = this.models.building2.scene.clone();
        this.building2Copy2.position.x = -30;
        this.building2Copy2.position.z = -157.5;

        this.building2Copy3 = this.models.building2.scene.clone();
        this.building2Copy3.position.x = 30;
        this.building2Copy3.position.z = -157.5;

        this.building2Copy4 = this.models.building2.scene.clone();
        this.building2Copy4.position.x = 70;
        this.building2Copy4.position.z = -78.75;

        this.building2Copy5 = this.models.building2.scene.clone();
        this.building2Copy5.position.x = 70;
        this.building2Copy5.position.z = -236.25;

        this.building2Copy6 = this.models.building2.scene.clone();
        this.building2Copy6.position.x = -70;
        this.building2Copy6.position.z = -78.75;

        this.building2Copy7 = this.models.building2.scene.clone();
        this.building2Copy7.position.x = -70;
        this.building2Copy7.position.z = -236.25;

        scene.add(this.building2Copy1);
        scene.add(this.building2Copy2);
        scene.add(this.building2Copy3);
        scene.add(this.building2Copy4);
        scene.add(this.building2Copy5);
        scene.add(this.building2Copy6);
        scene.add(this.building2Copy7);
        this.buildings = [
            this.models.building2.scene,
            this.models.building1.scene,
            this.building2Copy1,
            this.building2Copy2,
            this.building2Copy3,
            this.building2Copy4,
            this.building2Copy5,
            this.building2Copy6,
            this.building2Copy7,
        ];
        // this.scene.add(buildingObject);
    }
    update() {
        let leftRightKeyPressed = false;
        if(this.inputManager.keys.W.down) {
            this.player.scene.position.z -= 0.1;
        }
        if(this.inputManager.keys.S.down) {
            this.player.scene.position.z += 0.1;
        }
        if(this.inputManager.keys.A.down) {
            leftRightKeyPressed = true;
            this.player.scene.position.x -= 0.1;
            this.player.rotateX(1);
        }
        if(this.inputManager.keys.D.down) {
            leftRightKeyPressed = true;
            this.player.scene.position.x += 0.1;
            this.player.rotateX(-1);
        }
        if(!leftRightKeyPressed) {
            this.player.RotateBackX();
        }
        for(const building of this.buildings) {
            building.position.z += 0.25;
            if(building.name != 'building1') {
                if(building.position.z > 15) {
                    building.position.z = -300;
                }
            } else {
                if(building.position.z > -15) {
                    building.position.z = -405;
                }
            }
        }
    }
}

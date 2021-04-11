import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {Player} from './player.js'
import {Enemy} from './enemy.js'
// const CAMERA_POSITION = {
//     x: 0,
//     y: 13,
//     z: 20
// }
const CAMERA_POSITION = {
    x: 0,
    y: 9,
    z: 20
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
export class Game {
    constructor(camera, scene, models, inputManager) {
        this.camera = camera;
        this.scene = scene;
        this.models = models;
        this.inputManager = inputManager;
        this.bound = 20;
        this.enemyVelocityZ = 0.20;
        this.enemyResponPosition = -100;

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
        {
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

            this.scene.add(this.building2Copy1);
            this.scene.add(this.building2Copy2);
            this.scene.add(this.building2Copy3);
            this.scene.add(this.building2Copy4);
            this.scene.add(this.building2Copy5);
            this.scene.add(this.building2Copy6);
            this.scene.add(this.building2Copy7);
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
        }

        this.scene.add(this.models.building1.scene);
        this.scene.add(this.models.building2.scene);
        this.scene.add(this.models.player.scene);
        this.lastPosition = 0;

        {
            this.enemies = []
            for(let i = 1; i <= 10; i++) {
                let which = (i <= 5);
                let positionZ = - (i * 10);
                let positionX = getRndInteger(-this.bound, this.bound);
                let newEnemy;
                if(which) {
                    newEnemy = this.models.enemy1.scene.clone();
                } else {
                    newEnemy = this.models.enemy2.scene.clone();
                }
                newEnemy.position.z = positionZ;
                newEnemy.position.x = positionX;
                newEnemy.added_to_remove_list = false;
                this.scene.add(newEnemy);
                this.lastPosition = positionZ;
                let type = 'hard';
                if(i > 5) {
                    type = 'easy'
                }
                let enemyObject = new Enemy(newEnemy, type, this.bound);
                this.enemies.push(enemyObject);

            }
        }

        this.remove = [];
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
        for(let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i].scene;
            enemy.position.z += this.enemyVelocityZ;
            if(enemy.position.z > 15) {
                if(!enemy.added_to_remove_list) {
                    enemy.added_to_remove_list = true;
                    this.remove.push(enemy);
                }
            }
            if(enemy.visible) {
                this.enemies[i].zigZag();
            }
        }
        let toRemove = this.remove.length;
        if(toRemove > 1) {
            const index = Math.floor(Math.random() * toRemove)
            const enemy = this.remove[index];
            enemy.added_to_remove_list = false;
            enemy.position.z = this.enemyResponPosition;
            enemy.position.x = getRndInteger(-this.bound, this.bound);
            enemy.visible = true;
            this.remove.splice(index, 1);
        }
    }
}

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
    y: 5,
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
        this.bound = 16;
        this.enemyVelocityZ = 0.20;
        this.enemyResponPosition = -100;

        this.player = new Player(this.models.player.scene);
        this.camera.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
        this.camera.lookAt(0, 0, 0);

        this.models.player.scene.rotation.y = -(Math.PI / 2);

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.HUDElement = document.querySelector('#HUD');
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
            this.remove = [];
        }

        {
            this.bulletAmmo = []
            for(let i = 0; i <= 25; i++) {
                let newBullet = this.models.bullet.scene.clone();
                newBullet.visible = false;
                this.scene.add(newBullet);
                this.bulletAmmo.push(newBullet);
            }
            this.bulletSpeed = -0.25;
            this.lastBulletFireTime = new Date().getTime();
            this.gapBetweenBullets = 300.
        }

        {
            this.enemyBullets = [];
            for(let i = 0; i <= 60; i++) {
                let newBullet = this.models.enemyBullet.scene.clone();
                newBullet.visible = false;
                this.scene.add(newBullet);
                this.enemyBullets.push(newBullet);
            }
            this.enemyBulletSpeed = 0.75;
        }

        {
            this.stars = [];
            for(let i = 0; i < 5; i++) {
                const star = this.models.star.scene.clone();
                star.visible = false;
                this.stars.push(star);
                this.scene.add(star);
            }
            this.starPosition = -120;
            this.stars[0].position.z = this.starPosition;
            this.scene.add(this.stars[0]);
            this.gapBetweenStars = 5000;
            this.lastStarTime = new Date().getTime();
            this.starVelocity = 0.20;
        }
    }
    changeHUD() {
        let text = "Lives: " + this.player.lives + "<br>Score: " + this.player.score;
        this.HUDElement.innerHTML = text;
    }
    update() {
        this.changeHUD();
        if(this.player.lives <= 0) {
            this.HUDElement.innerHTML = "";
            while(this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
            const endElement = document.querySelector('#end');
            let text = "GAME OVER<br>Score: " + this.player.score;
            endElement.innerHTML = text;
            return;
        }
        let leftRightKeyPressed = false;
        if(this.inputManager.keys.W.down) {
            this.player.scene.position.z -= 0.1;
        }
        if(this.inputManager.keys.S.down) {
            this.player.scene.position.z += 0.1;
            if(this.player.scene.position.z >= 7) {
                this.player.scene.position.z = 7
            }
        }
        if(this.inputManager.keys.A.down) {
            leftRightKeyPressed = true;
            this.player.scene.position.x -= 0.1;
            this.player.rotateX(1);
            if(this.player.scene.position.x < -this.bound) {
                this.player.scene.position.x = -this.bound;
            }
        }
        if(this.inputManager.keys.D.down) {
            leftRightKeyPressed = true;
            this.player.scene.position.x += 0.1;
            this.player.rotateX(-1);
            if(this.player.scene.position.x > this.bound) {
                this.player.scene.position.x = this.bound;
            }
        }
        if(this.inputManager.keys.E.down) {
            let Time = new Date().getTime();
            if(Time - this.lastBulletFireTime >= this.gapBetweenBullets) {
                for(let i = 0; i < this.bulletAmmo.length; i++) {
                    const bullet = this.bulletAmmo[i];
                    if(bullet.visible == false) {
                        bullet.position.x = this.player.scene.position.x;
                        bullet.position.y = this.player.scene.position.y;
                        bullet.position.z = this.player.scene.position.z;
                        bullet.visible = true;
                        this.lastBulletFireTime = Time;
                        break;
                    }
                }
            }
        }
        if(!leftRightKeyPressed) {
            this.player.RotateBackX();
        }
        let time = new Date().getTime();
        if(time - this.lastStarTime >= this.gapBetweenStars) {
            for(let i = 0; i < 5; i++) {
                const star = this.stars[i];
                if(star.visible == false) {
                    this.lastStarTime = time;
                    star.position.z = this.starPosition;
                    star.position.x = getRndInteger(-this.bound, this.bound);
                    star.visible = true;
                    break;
                }
            }
        }
        const playerBox = new THREE.Box3().setFromObject(this.player.scene);
        for(let i = 0; i < 5; i++) {
            const star = this.stars[i];
            if(star.visible) {
                star.position.z += this.starVelocity;
                star.rotateY(0.1);
                if(star.position.z >= 15) {
                    star.visible = false;
                } else {
                    const starBox = new THREE.Box3().setFromObject(star);
                    if(starBox.intersectsBox(playerBox)) {
                        star.visible = false;
                        this.player.score += 10;
                        this.changeHUD();
                    }
                }
            }

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
            if(enemy.visible == false) {
                continue;
            }
            enemy.position.z += this.enemyVelocityZ;
            if(enemy.position.z > 15) {
                enemy.visible = false;
                this.remove.push(enemy);
                continue;
            }
            if(this.enemies[i].canFire()) {
                for(let j = 0; j < this.enemyBullets.length; j++) {
                    const bullet = this.enemyBullets[j];
                    if(bullet.visible == false) {
                        bullet.position.x = enemy.position.x;
                        bullet.position.y = enemy.position.y;
                        bullet.position.z = enemy.position.z;
                        bullet.visible = true;
                        break;
                    }
                }
            }
            this.enemies[i].zigZag();
            const enemyBox = new THREE.Box3().setFromObject(enemy);
            if(playerBox.intersectsBox(enemyBox)) {
                this.player.lives -= 2;
                enemy.visible = false;
                this.remove.push(enemy);
                this.changeHUD();
            }
        }
        let toRemove = this.remove.length;
        if(toRemove > 1) {
            const index = Math.floor(Math.random() * toRemove)
            const enemy = this.remove[index];
            enemy.position.z = this.enemyResponPosition;
            enemy.position.x = getRndInteger(-this.bound, this.bound);
            enemy.visible = true;
            this.remove.splice(index, 1);
        }
        for(let i = 0; i < this.bulletAmmo.length; i++) {
            const bullet = this.bulletAmmo[i];
            if(bullet.visible == false) {
                continue;
            }
            bullet.position.z += this.bulletSpeed;
            if(bullet.position.z <= -100) {
                bullet.visible = false;
            } else {
                const bulletBox = new THREE.Box3().setFromObject(bullet);
                for(let j = 0; j < this.enemies.length; j++) {
                    const enemy = this.enemies[j].scene;
                    if(enemy.visible == false) {
                        continue;
                    }
                    const enemyBox = new THREE.Box3().setFromObject(enemy);
                    if(bulletBox.intersectsBox(enemyBox)) {
                        this.player.score += 1;
                        this.changeHUD();
                        this.remove.push(enemy);
                        bullet.visible = false;
                        enemy.visible = false;
                        break;
                    }
                }
            }
        }
        for(let i = 0; i < this.enemyBullets.length; i++) {
            const bullet = this.enemyBullets[i];
            if(bullet.visible == false) {
                continue;
            }
            bullet.position.z += this.enemyBulletSpeed;
            if(bullet.position.z >= 10) {
                bullet.visible = false;
            } else {
                const bulletBox = new THREE.Box3().setFromObject(bullet);
                if(bulletBox.intersectsBox(playerBox)) {
                    bullet.visible = false;
                    this.player.lives -= 1;
                    this.changeHUD();
                }
            }
        }

    }
}

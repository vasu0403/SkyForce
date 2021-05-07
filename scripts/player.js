import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.rotationSpeed = 0.025;
        this.score = 0;
        this.lives = 20;
        this.rotationX = 0;
        this.rotationZ = 0;
    }
    rotateX(direction) {
        if(direction == 1) {
            if(this.rotationX <= Math.PI / 4) {
                this.rotationX += direction * this.rotationSpeed;
                this.scene.rotateX(direction * this.rotationSpeed);
            }
        } else {
            if(this.rotationX >= -Math.PI / 4) {
                this.rotationX += direction * this.rotationSpeed;
                this.scene.rotateX(direction * this.rotationSpeed);
            }
        }
    }
    RotateBackX() {
        if(this.rotationX == 0) {
            return;
        }
        if(this.rotationX < 0) {
            let speed = Math.min(this.rotationSpeed, 0 - this.rotationX);
            this.rotationX += speed;
            this.scene.rotateX(speed);
        } else {
            let speed = Math.min(this.rotationSpeed, this.rotationX);
            this.rotationX -= speed;
            this.scene.rotateX(-speed);
        }
    }
}

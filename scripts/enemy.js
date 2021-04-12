import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

export class Enemy {
    constructor(scene, type, bound) {
        this.scene = scene;
        this.direction = Math.floor(Math.random() * 2);
        if(this.direction == 0) {
            this.direction = -1;
        }
        this.type = type;
        this.bound = bound;
        this.zigZagVelocity = 0.1;
        this.rotation = 0;
        this.rotationSpeed = 0.005;
        this.gapBetweenBullets = 800;
        this.lastBulletFireTime = new Date().getTime();
    }
    zigZag() {
        if(this.type == 'easy') {

        } else {
            this.scene.position.x += this.direction * this.zigZagVelocity;
            if(this.direction < 0) {
                if(this.rotation <= Math.PI / 4) {
                    this.scene.rotateZ(this.rotationSpeed);
                    this.rotation += this.rotationSpeed;
                }
            } else {
                if(this.rotation >= -Math.PI / 4) {
                    this.scene.rotateZ(-this.rotationSpeed);
                    this.rotation -= this.rotationSpeed;
                }
            }
            if(this.scene.position.x < -this.bound) {
                this.scene.position.x = -this.bound;
                this.direction *= -1;
            } else if(this.scene.position.x > this.bound) {
                this.scene.position.x = this.bound;
                this.direction *= -1;
            }
        }
    }
    canFire() {
        const curTime = new Date().getTime();
        if(curTime - this.lastBulletFireTime >= this.gapBetweenBullets) {
            this.lastBulletFireTime = curTime;
            return true;
        }
        return false;
    }
}

import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
export function loadPlayer(scene) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('http://localhost:8080/models/jet_final.gltf', (gltf) => {
        const root = gltf.scene;
        scene.add(root);
        root.position.y = 1;
        console.log(root.position);
        const box = new THREE.Box3().setFromObject(root);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        console.log(root);
        return root;
    });
    console.log("herloo")
}

import * as THREE from "./three.module.js";
class ThirdPersonCamera {
    constructor(camera, target) {
        this._camera = camera;
        this._target = target;
    }

    updateCamera() {
        const offset = new THREE.Vector3(0,2,10);
        const position = new THREE.Vector3();
        position.copy(this._target.position);
        position.add(offset);

        this._camera.position.copy(position);
    }
}
export {ThirdPersonCamera}

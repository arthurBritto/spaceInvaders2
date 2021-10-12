import * as THREE from "./three.module.js";
class Controller {
    constructor(object, fire) {
        this._inputController = new ControllerInputListener();
        this._object = object;
        this._radians = 1 * (Math.PI / 180);
        this._fire = fire;
        this._velocity = new THREE.Vector3(0, 0, -0.25);

    }

    updateController() {
        this._object.position.add(this._velocity);

        let keys = this._inputController._keys;
        if (keys.left) {
            this._object.position.add(new THREE.Vector3(-1, 0, 0).multiplyScalar(-this._velocity.z));

        }
        if (keys.right) {
            this._object.position.add(new THREE.Vector3(1, 0, 0).multiplyScalar(-this._velocity.z));

        }
        if (keys.up) {
            this._object.position.add(new THREE.Vector3(0, 1, 0).multiplyScalar(-this._velocity.z));
        }
        if (keys.down) {
            this._object.position.add(new THREE.Vector3(0, -1, 0).multiplyScalar(-this._velocity.z));

        }
        if (keys.space) {
            this._fire.fireBullet();
        }
    }
}

class ControllerInputListener {
    constructor() {
        this._keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false
        };

        document.onkeydown = this._onKeyDown.bind(this);
        document.onkeyup = this._onKeyUp.bind(this);
    }

    _onKeyDown(e) {
        switch (e.keyCode) {
            case 87: // w
                this._keys.up = true;
                break;
            case 65: // a
                this._keys.left = true;
                break;
            case 83: // s
                this._keys.down = true;
                break;
            case 68: // d
                this._keys.right = true;
                break;
            case 32: //space
                this._keys.space = true;
                break;
        }
    };

    _onKeyUp(e) {
        switch (e.keyCode) {
            case 87: // w
                this._keys.up = false;
                break;
            case 65: // a
                this._keys.left = false;
                break;
            case 83: // s
                this._keys.down = false;
                break;
            case 68: // d
                this._keys.right = false;
                break;
            case 32:
                this._keys.space = false;
                break;
        }
    }
}
export { Controller }

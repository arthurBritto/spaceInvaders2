import * as THREE from "./three.module.js";
class Controller {
    constructor(object, fire, tweenX, tweenY) {
        this._inputController = new ControllerInputListener();
        this._object = object;
        this._objectMesh = object.getMesh();
        this._radians = 1 * (Math.PI / 180);
        this._fire = fire;
        this._velocity = new THREE.Vector3(0, 0, -0.25);
        this.tweenX = tweenX;
        this.tweenY = tweenY;
    }

    updateController() {
       this._objectMesh.position.add(this._velocity);

        let keys = this._inputController._keys;
        if (keys.left) {
            this._objectMesh.position.add(new THREE.Vector3(-1, 0, 0).multiplyScalar(-this._velocity.z));

        }
        if (keys.right) {
            this._objectMesh.position.add(new THREE.Vector3(1, 0, 0).multiplyScalar(-this._velocity.z));

        }
        if (keys.up) {
            this._objectMesh.position.add(new THREE.Vector3(0, 1, 0).multiplyScalar(-this._velocity.z));

        }
        if (keys.down) {
           this._objectMesh.position.add(new THREE.Vector3(0, -1, 0).multiplyScalar(-this._velocity.z));

        }
        if (keys.space) {
            this._object.fireBullet(this._objectMesh, "player");
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
            case 38: // ArrowUp
                this._keys.up = true;
                break;
            case 37: // ArrowLeft
                this._keys.left = true;
                break;
            case 40: // ArrowDown
                this._keys.down = true;
                break;
            case 39: // ArrowRight
                this._keys.right = true;
                break;
            case 32: //space
                this._keys.space = true;
                break;
        }
    };

    _onKeyUp(e) {
        switch (e.keyCode) {
            case 38: // ArrowUp
                this._keys.up = false;
                break;
            case 37: // ArrowLeft
                this._keys.left = false;
                break;
            case 40: // ArrowDown
                this._keys.down = false;
                break;
            case 39: // ArrowRight
                this._keys.right = false;
                break;
            case 32:
                this._keys.space = false;
                break;
        }
    }
}
export { Controller }

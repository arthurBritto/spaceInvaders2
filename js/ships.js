import * as THREE from "./three.module.js";
import {Fire} from "./fire.js";
import {Controller} from "./controller.js";
import {GLTFLoader} from "./GLTFLoader.js";
import {ThirdPersonCamera} from "./thirdPersonCamera.js"

class Ship {
    constructor(health, scene) {
        this._ship;
        this._loader = new GLTFLoader();
        this._health = health;
        this._fire;
        this._scene = scene;
    }  
    updateShips() {
        this._fire.updateBullets();
        this._controller.updatePosition();
    }

}

class BotShips extends Ship {
    constructor(scene, target) {
        super(10, scene);
        this._target = target;
        this._botShips =[];
        this._velocity = new THREE.Vector3(0,0,4);
        this._model;
        this._loadModel();
    }

    async _loadModel(){
        let botData = await this._loader.loadAsync("models/space_fighters/scene.gltf");
        this._model = botData.scene.children[0];
    }

    spawnBotShip() {
        if(this._model){
            let botShip = this._model.clone();
            let botShipChildren = botShip.children[0].children;
            
            botShip.rotateZ(180 * (Math.PI / 180));
            botShip.scale.set(0.5,0.5,0.5);
    
        
            let targetPosition = new THREE.Vector3();
            this._target.getWorldPosition(targetPosition);
            let offset = new THREE.Vector3(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                -1010);
    
            offset.add(targetPosition);
            botShip.position.copy(offset);
            
            for(let i=0; i< botShipChildren.length; i++){
                let childOffset = new THREE.Vector3((Math.random()-0.5) * 150,(Math.random()-0.5) *150 ,(Math.random()-0.5)*150);
                let child = botShipChildren[i];
                let childPosition = new THREE.Vector3();
                child.localToWorld(childPosition);
                childOffset.add(childPosition);
                child.position.copy(childOffset);
            }
    
            this._botShips.push(botShip);
            this._scene.add(botShip);
        }
        else{
            return;
        }
    }

    updateBotsPosition(){
        for(let i=0; i<this._botShips.length; i++){
            let bot = this._botShips[i];
            bot.position.add(this._velocity);
        }

    }
}
class PlayerShip extends Ship {
    constructor(scene, camera) {
        super(100, scene);
        this._controller;
        this._loader = new GLTFLoader();
        this._thirdPersonCamera;
        this._camera = camera;
    }

    updatePlayerShip() {
        this._controller.updateController();
        this._fire.updateBullets();
        this._thirdPersonCamera.updateCamera();
    }
    async loadPlayerModel(){
        let modelData = await this._loader.loadAsync("models/death_row_spaceship/scene.gltf");
        this._ship = modelData.scene.children[0];
        this._ship.scale.set(0.3,0.3,0.3);
        this._ship.rotateZ(180 * (Math.PI / 180));

        this._scene.add(this._ship);
        this._fire = new Fire(this._scene, this._ship);
        this._controller = new Controller(this._ship, this._fire);
        this._thirdPersonCamera = new ThirdPersonCamera(this._camera, this._ship);
    }
}

export {BotShips, PlayerShip}

import * as THREE from "./three.module.js";
import { Fire } from "./fire.js";
import { Controller } from "./controller.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { ThirdPersonCamera } from "./thirdPersonCamera.js"

class Ship {
    constructor(health, scene, fire) {
        this._ship;
        this._loader = new GLTFLoader();
        this._health = health;
        this._fire = fire;
        this._scene = scene;
        this._timer = 0.5;
        this._clock = new THREE.Clock();
    }
    updateShips() {
        this._fire.updateBullets();
        this._controller.updatePosition();
    }
    fireBullet(shooter, shooterType){
        this._timer += this._clock.getDelta();        
        if(this._timer >=0.5){
            this._timer =0;
            this._fire.fireBullet(shooter,shooterType);
        }
    }
}
class Bot{
    constructor(health,ship,target){
        this._health = health;
        this._ship = ship;
        this._target = target;
    }
}

class SpawnBotShips extends Ship {
    constructor(scene, target, camera, fire) {
        super(10, scene, fire);
        this._target = target;
        this._botShips =[];
        this._velocity = new THREE.Vector3(0,0,4);
        this._loadModel();
        this._model;
        this._camera = camera;
        this._objectsFilter = [];
    }

    async _loadModel(){
        let botData = await this._loader.loadAsync("models/space_fighters/scene.gltf");
        this._model = botData.scene.children[0].children[0];
    }

    spawnBotShip() {
        if(this._model){
            let botShip = this._model.children[0].clone();
            let bot = new Bot(10,botShip,this._target);

            botShip.rotateZ(180 * (Math.PI / 180));
            botShip.rotateX(90 * (Math.PI / 180));
            botShip.scale.set(0.5,0.5,0.5);

            let targetPosition = new THREE.Vector3();
            this._target.getWorldPosition(targetPosition);
            let offset = new THREE.Vector3(
                (Math.random() - 0.5) * 0,
                (Math.random() - 0.5) * 0,
                -1010);

            offset.add(targetPosition);
            botShip.position.copy(offset);
            this._botShips.push(bot);
            this._scene.add(botShip);
        }
        else{
            return;
        }
    }

    updateBotsPosition(){
        for(let i=0; i<this._botShips.length; i++){            
            let bot = this._botShips[i];
            bot._ship.position.add(this._velocity);
            this.detectPlayer(bot);
            this._detectCollision(bot);
        }
    }
    detectPlayer(bot){
        let raycaster = new THREE.Raycaster();

        let botPosition = new THREE.Vector3();
        let botDirection = new THREE.Vector3(0,0,1);
        bot._ship.getWorldPosition(botPosition);

        botDirection.normalize();
        raycaster.set(botPosition, botDirection);
        let intersections = raycaster.intersectObject(this._target, true);

        if (intersections.length > 0) {
            this.fireBullet(bot._ship, "bot");             
        }
    }
    _removeSpawnedBot(botMesh){
        this._scene.remove(botMesh);
        for(let i=0; i<this._botShips.length; i++){
            if(this._botShips[i]._ship == botMesh){
                this._botShips.splice(i,1);
                break;
            }
        }
     }
    _detectCollision(bot) {
        let raycaster = new THREE.Raycaster();
        let rayOrigin = new THREE.Vector3();
        let rayDirection = new THREE.Vector3(0, 0, 1);
        bot._ship.getWorldPosition(rayOrigin);
        rayOrigin.x -=2.5;
        rayOrigin.z -=5;
        raycaster.far = 5;
         
        if(!this._objectsFilter.length >0){
            return;
        }
        for (let i = 0; i < 20; i++) {
            rayOrigin.x+=0.25;
            raycaster.set(rayOrigin, rayDirection.normalize());
        
            let intersections = raycaster.intersectObjects(this._objectsFilter, true);
            for (let i = 0; i < intersections.length; i++) {
                 if(intersections[i].object.name == "bullet player"){
                    this._fire.removeBullet(intersections[i].object, "player");
                }
                this._removeSpawnedBot(bot._ship);
                return;
                }
            }
        }

}
class PlayerShip extends Ship {
    constructor(scene, camera, fire) {
        super(100,scene,fire);
        this._controller;
        this._loader = new GLTFLoader();
        this._thirdPersonCamera;
        this._camera = camera;
        this._objectsFilter = new Set();
        this._spawnedBots;
    }

    updatePlayerShip() {
        this._controller.updateController();
        this._thirdPersonCamera.updateCamera();
        this._detectCollision();
    }
    getMesh(){
        return this._ship;
    }
    _detectCollision(){
        let raycaster = new THREE.Raycaster();
        let rayOrigin = new THREE.Vector3();
        let rayDirection = new THREE.Vector3(0, 0, -1);
        this._ship.getWorldPosition(rayOrigin);
        let filter = Array.from(this._objectsFilter);
        
        rayOrigin.x -=2.5;
        rayOrigin.z +=5;
        raycaster.far = 5;
        
        if(!filter.length >0){
            return;
        }
        for (let i = 0; i < 20; i++) {
            rayOrigin.x+=0.25;
            raycaster.set(rayOrigin, rayDirection.normalize());
        
            let intersections = raycaster.intersectObjects(filter, true);
            for (let j = 0; j < intersections.length; j++) {
                if(intersections[j].object.name == "bullet bot"){
                    console.log("Player hit by  bullet from " + intersections[j].object.id);
                }
                else{
                    this._spawnedBots._removeSpawnedBot(intersections[j].object);
                    return;
                }
            }
        }
    }
    
    async loadPlayerModel(){
        let modelData = await this._loader.loadAsync("models/death_row_spaceship/scene.gltf");
        this._ship = modelData.scene.children[0];
        this._ship.scale.set(0.3,0.3,0.3);
        this._ship.rotateZ(180 * (Math.PI / 180));
        this._scene.add(this._ship);
        this._controller = new Controller(this, this._fire);
        this._thirdPersonCamera = new ThirdPersonCamera(this._camera, this._ship);
    }
}

export {SpawnBotShips, PlayerShip}

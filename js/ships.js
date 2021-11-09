import * as THREE from "./three.module.js";
import { Fire } from "./fire.js";
import { Controller } from "./controller.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { ThirdPersonCamera } from "./thirdPersonCamera.js"
import * as constants from "./constants.js"

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
    fireBullet(shooter, shooterType) {
        this._timer += this._clock.getDelta();
        if (this._timer >= 0.5) {
            this._timer = 0;
            this._fire.fireBullet(shooter, shooterType);
        }
    }

    _restartModel(){
        this._scene.add(this._ship);
    }
}

class Bot {
    constructor(health, ship, target) {
        this._health = health;
        this._ship = ship;
        this._target = target;
    }

    _restoreLife() {
        this._health = constants.BOT_HEALTH;
    }
}

class SpawnBotShips extends Ship {
    
    constructor(scene, target, camera, fire) {
        super(10, scene, fire);
        this._target = target;
        this._botShips = [];
        this._velocity = new THREE.Vector3(0, 0, 4);
        this._loadModel();
        this._model;
        this._camera = camera;
        this._objectsFilter = [];
        this._killedBotsCounter = 0;
        this._botPool = [];
        this._botShipPool = [];
    }

    async _loadModel() {
        let botData = await this._loader.loadAsync("models/space_fighters/scene.gltf");
        this._model = botData.scene.children[0].children[0];
    }

    spawnBotShip() {
        if (this._model) {
            let botShip = this._model.children[0].clone();
            let bot = new Bot(10, botShip, this._target);

            botShip.rotateZ(180 * (Math.PI / 180));
            botShip.rotateX(90 * (Math.PI / 180));
            botShip.scale.set(0.5, 0.5, 0.5);

            this._scene.add(botShip);
            botShip.visible = false;

            return [bot, botShip];
        }
        else {
            return;
        }
    }

    _createPool() {
        if(this._model) {
            for(let i = 0; i < constants.BOT_NUMBER; i++) {
                const spawn = this.spawnBotShip();

                this._botPool.push(spawn[0]);
                this._botShipPool.push(spawn[1]);
            }
        }
    }

    _getNextBotMesh(){
        return this._botShipPool.shift();
    }

    _getNextBot(){
        return this._botPool.shift();
    }

    _resetBot(bot, botMesh){
        bot._restoreLife();

        this._botPool.push(bot);
        this._botShipPool.push(botMesh);
    }

    _spawnBot() {
        let bot = this._getNextBot();
        let botMesh = this._getNextBotMesh();
        botMesh.intersected = false;

        let targetPosition = new THREE.Vector3();
        this._target.getWorldPosition(targetPosition);

        let offset = new THREE.Vector3(
            (Math.random() - 0.5) * 0,
            (Math.random() - 0.5) * 0,
            -1010);

        offset.add(targetPosition);
        botMesh.position.copy(offset);
        
        botMesh.visible = true;
        this._botShips.push(bot);
    }

    _reloadModels(){
        this._botShipPool.map(ship => this._scene.add(ship));
    }

    updateBotsPosition() {
        this._botShips.map((bot) => {
            bot._ship.position.add(this._velocity);
            this.detectPlayer(bot);
            this._detectCollision(bot);

            if (bot._ship.position.z > this._camera.position.z) this._removeSpawnedBot(bot._ship);
        });
    }

    detectPlayer(bot) {
      
        let raycaster = new THREE.Raycaster();
        let botPosition = new THREE.Vector3();
        let botDirection = new THREE.Vector3(0, 0, 1);
        bot._ship.getWorldPosition(botPosition);

        botDirection.normalize();
        raycaster.set(botPosition, botDirection);
        let intersections = raycaster.intersectObject(this._target, true);

        return intersections.length > 0 ? this.fireBullet(bot._ship, "bot"): null;
    }

    _removeSpawnedBot(botMesh) {

        this._botShips.map((bot, index) => {
            if (bot._ship == botMesh) {
                this._resetBot(bot, botMesh);
                this._botShips.splice(index, 1);
                botMesh.visible = false;
                this._killedBotsCounter++; 
                return;
            }
        });
    }

    _detectCollision(bot) {
        let raycaster = new THREE.Raycaster();
        let rayOrigin = new THREE.Vector3();
        let rayDirection = new THREE.Vector3(0, 0, 1);
        bot._ship.getWorldPosition(rayOrigin);
        rayOrigin.x -= 2.5;
        rayOrigin.z -= 5;
        raycaster.far = 5;

        if (!this._objectsFilter.length > 0) {
            return;
        }
        for (let i = 0; i < 20; i++) {
            rayOrigin.x += 0.25;
            raycaster.set(rayOrigin, rayDirection.normalize());

            let intersections = raycaster.intersectObjects(this._objectsFilter, true);
            intersections.map((intersection) => {
                if (intersection.object.name == "bullet player") {
                    this._fire.removeBullet(intersection.object, "player");
                }
                this.takeDamage(10,bot);
                return;
            });
        }
    }

    takeDamage(hit, bot){
        this._botShips.map((botShip) => {
            if(botShip == bot){
                botShip._health -= hit;
                if(botShip._health <= 0){
                    this._removeSpawnedBot(bot._ship);
                    return;
                } 
            }
        });
    }
}

class PlayerShip extends Ship {

    constructor(scene, camera, fire, tweenX, tweenY) {
        super(100, scene, fire);
        this._controller;
        this._loader = new GLTFLoader();
        this._thirdPersonCamera;
        this._camera = camera;
        this._objectsFilter = new Set();
        this._spawnedBots;
        this._lifeCounter = 7;
        this._damageCounter = 0;
    }

    updatePlayerShip() {
        this._controller.updateController();
        this._thirdPersonCamera.updateCamera();
        this._detectCollision();
    }

    getMesh() {
        return this._ship;
    }

    _detectCollision() {
        let raycaster = new THREE.Raycaster();
        let rayOrigin = new THREE.Vector3();
        let rayDirection = new THREE.Vector3(0, 0, -1);
        this._ship.getWorldPosition(rayOrigin);
        let filter = Array.from(this._objectsFilter);

        rayOrigin.x -= 2.5;
        rayOrigin.z += 5;
        raycaster.far = 5;

        if (!filter.length > 0) {
            return;
        }
        for (let i = 0; i < 20; i++) {
            rayOrigin.x += 0.25;
            raycaster.set(rayOrigin, rayDirection.normalize());

            let intersections = raycaster.intersectObjects(filter, true);

            intersections.map((intersection) => {

                if(intersection.object.name == "bullet bot"){
                    this.takeDamage(10);
                    return;
                }
                else if(!intersection.object.intersected){
                    this._spawnedBots._removeSpawnedBot(intersection.object);
                    this.takeDamage(100);
                    intersection.object.intersected = true;
                    return;
                }
            });
        }
    }

    takeDamage(hit){
        this._health -=hit;

        if(this._health<=0 && this._lifeCounter > 0){
            this._health = 100;
            this._lifeCounter--;
        }
    }

    _gameOver(){

        // remove every element from the scene
        this._scene.children = [];
        this._spawnedBots._killedBotsCounter = 0;
        this._spawnedBots._botShips.map((bot) => this._spawnedBots._removeSpawnedBot(bot._ship));

        const image = new THREE.TextureLoader().load('../resources/gameover.jpg');
        const imageGeometry = new THREE.PlaneBufferGeometry();
        const imageMaterial = new THREE.MeshBasicMaterial({
            map: image,
            color: 0xffffff
        });

        const mesh = new THREE.Mesh(imageGeometry, imageMaterial);
        mesh.scale.set(window.innerWidth, window.innerHeight);
        this._scene.add(mesh);
    }

    _healthRestart() {
        this._health = 100;
    }

    _lifeCounterRestart() {
        this._lifeCounter = constants.LIFES;
    }

    _clearFilter() {
        this._objectsFilter.clear();
    }
    
    async loadPlayerModel(){
        let modelData = await this._loader.loadAsync("models/death_row_spaceship/scene.gltf");
        this._ship = modelData.scene.children[0];
        this._ship.scale.set(0.3, 0.3, 0.3);
        this._ship.rotateZ(180 * (Math.PI / 180));
        this._scene.add(this._ship);
        this._controller = new Controller(this, this._fire);
        this._thirdPersonCamera = new ThirdPersonCamera(this._camera, this._ship);
    }
}

export { SpawnBotShips, PlayerShip }

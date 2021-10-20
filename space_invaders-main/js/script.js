import * as THREE from "./three.module.js";
import Stats from "./stats.module.js";
import { PlayerShip } from "./ships.js";
import { SpawnBotShips } from "./ships.js";
import { Fire } from "./fire.js";

let scene, camera, renderer, stats, player, spawnBotShips, raycaster,fire;
let starsNumber, starPool, starGeo, starGeo1, starGeo2, starGeo3, star, starLength = 400;
 
async function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    stats = Stats();
    document.body.appendChild(stats.dom);

    scene.add(new THREE.AmbientLight(0x444444));

    let light1 = new THREE.DirectionalLight(0xffffff, 20);
    light1.position.set(0, 100, -2000);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0xffffff, 20);
    light2.position.set(0, -200, 0);
    scene.add(light2);

    let light3 = new THREE.DirectionalLight(0x404040, 20);
    light3.position.set(-100, 0, 0);
    scene.add(light3);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    starsNumber = 70;
    starPool = new Array(starsNumber).fill(0);

    for (let i = 0; i < starsNumber; i++) {
    raycaster = new THREE.Raycaster();
        star = new THREE.Vector3(
            Math.random() * 1400 - 800,
            Math.random() * 800 - 400,
            Math.random() * starLength - starLength
        );
        starPool[i] = star;
    }

    starGeo = starGeo1 = starGeo2 = starGeo3 = starPool;


    let sprite = new THREE.TextureLoader().load('resources/star.png');
    let geometry = new THREE.BufferGeometry().setFromPoints(starGeo);
    let starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        map: sprite
    });

    starGeo1 = new THREE.Points(geometry, starMaterial);
    starGeo2 = new THREE.Points(geometry, starMaterial);
    starGeo3 = new THREE.Points(geometry, starMaterial);

    starGeo1.translateZ(-starLength);
    starGeo2.translateZ(-starLength * 2);
    starGeo3.translateZ(-starLength * 3);

    scene.add(starGeo1);
    scene.add(starGeo2);
    scene.add(starGeo3);

    fire = new Fire(scene);

    player = new PlayerShip(scene, camera, fire);
    await player.loadPlayerModel();
    
    spawnBotShips = new SpawnBotShips(scene, player._ship, camera, fire);
    player._spawnedBots = spawnBotShips;
    
    

    camera.position.set(0, 2, 2);

    light1.lookAt(player._ship);
    light2.lookAt(player._ship);
    light3.lookAt(player._ship);


    setInterval(spawnBotShips.spawnBotShip.bind(spawnBotShips), 1000);
    // setTimeout(spawnBotShips.spawnBotShip.bind(spawnBotShips), 1000);



    animate();
}
function updateStarsPositions() {

    let playerPosition = new THREE.Vector3();
    player._ship.getWorldPosition(playerPosition);

    if (playerPosition.z < starGeo1.position.z) starGeo1.translateZ(-starLength * 3);
    if (playerPosition.z < starGeo2.position.z) starGeo2.translateZ(-starLength * 3);
    if (playerPosition.z < starGeo3.position.z) starGeo3.translateZ(-starLength * 3);
}

function updateObjectsInfo(){
    let bulletsPlayer = fire._bulletsPlayer;
    spawnBotShips._objectsFilter = [];
    for(let i=0; i<bulletsPlayer.length;i++){
        spawnBotShips._objectsFilter.push(bulletsPlayer[i]._bulletMesh);
    }

    let bulletsBots = fire._bulletsBots;
    
    for(let i=0; i<bulletsBots.length;i++){
        player._objectsFilter.add(bulletsBots[i]._bulletMesh);
    }

    let botsInScene = spawnBotShips._botShips;
    for(let i=0; i<botsInScene.length; i++){
        player._objectsFilter.add(botsInScene[i]._ship);
    }

}
function animate() {
    updateObjectsInfo();
    stats.update();
   // onShipMove();
    player.updatePlayerShip();
    updateStarsPositions();
    spawnBotShips.updateBotsPosition();
    fire.updateBullets();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}
init();

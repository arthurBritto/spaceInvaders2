import * as THREE from "./three.module.js";
import Stats from "./stats.module.js";
import { PlayerShip } from "./ships.js";
import { SpawnBotShips } from "./ships.js";
import { Fire } from "./fire.js";
import * as constants from "./constants.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';

let scene, camera, renderer, light1, light2, light3, stats, player, spawnBotShips, raycaster, fire;
let starsNumber, star, starPool, starGeo, starGeo1, starGeo2, starGeo3, starGeo4, starGeo5, starGeo6, starLength, starGeoPool;
let score, life, playerName;

// it's true when the game over image is rendered
let rendered = false; 
let gameOverFlag = false;
let restartFlag = false;
let timer;
let tween;


async function init() {

    // You start with 7 lifes and lose them if got hit by a ship or receive 3 shots
    // Your score depends in how much enemy ships you killed
    life = 7; score = 0;

    // Takes the player name on the browser, and show the Score and Lifes
    window.onload = function () {
        playerName = prompt("What's your name my Lord?");
    };

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    stats = Stats();
    document.body.appendChild(stats.dom);

    scene.add(new THREE.AmbientLight(0x444444));

    light1 = new THREE.DirectionalLight(0xffffff, 20);
    light2 = new THREE.DirectionalLight(0xffffff, 20);
    light3 = new THREE.DirectionalLight(0x404040, 20);
    light1.position.set(0, 100, -2000);
    light2.position.set(0, -200, 0);
    light3.position.set(-100, 0, 0);
    scene.add(light1, light2, light3);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    starsNumber = 70;
    starLength = 200;
    starPool = new Array(starsNumber).fill(0);

    for (let i = 0; i < starsNumber; i++) {
        raycaster = new THREE.Raycaster();
        star = new THREE.Vector3(
            Math.random() * 2000 - 1000, 
            Math.random() * 2000 - 1000, 
            Math.random() * starLength - starLength
        );
        starPool[i] = star;
    }

    // starPool = [...new Array(starsNumber)].map((star) => {
    //     raycaster = new THREE.Raycaster();
    //     star = new THREE.Vector3(
    //         Math.random() * 2000 - 1000, 
    //         Math.random() * 2000 - 1000, 
    //         Math.random() * starLength - starLength
    //     );
    // });

    starGeo = starGeo1 = starGeo2 = starGeo3  = starGeo4 = starGeo5 = starGeo6 = starPool;

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
    starGeo4 = new THREE.Points(geometry, starMaterial);
    starGeo5 = new THREE.Points(geometry, starMaterial);
    starGeo6 = new THREE.Points(geometry, starMaterial);

    starGeoPool = [starGeo1, starGeo2, starGeo3, starGeo4, starGeo5, starGeo6];
    
    //starGeoPool.map((starGeo) => starGeo = new THREE.Points(geometry, starMaterial));

    starGeoPool.map((starGeo, index ) => starGeo.translateZ(-starLength * (index + 1))); 
    starGeoPool.map(starGeo => scene.add(starGeo));

    fire = new Fire(scene, camera);

    player = new PlayerShip(scene, camera, fire);
    await player.loadPlayerModel();

    spawnBotShips = new SpawnBotShips(scene, player._ship, camera, fire);
    player._spawnedBots = spawnBotShips;

    camera.position.set(0, 2, 2);

    light1.lookAt(player._ship);
    light2.lookAt(player._ship);
    light3.lookAt(player._ship);
    
    setTimeout(() => {
        spawnBotShips._createPool();
        
        timer = setInterval(spawnBotShips._spawnBot.bind(spawnBotShips), 1000);

        tween = new TWEEN.Tween(player._ship.rotation);

        animate();
    }, 200);
    // setTimeout(spawnBotShips.spawnBotShip.bind(spawnBotShips), 1000);
}

function updateStarsPositions() {

    let playerPosition = new THREE.Vector3();
    player._ship.getWorldPosition(playerPosition);

    starGeoPool.map((starGeo, index) => {
        if (playerPosition.z < starGeo.position.z){ 
            starGeo.translateZ(-starLength * 6);
            starGeo.translateX(playerPosition.x);
            starGeo.translateY(playerPosition.y);
            console.log(starGeo, starGeo.position.z, index );
        }
    });
}

function updateObjectsInfo() {
    let bulletsPlayer = fire._bulletsPlayer;
    let bulletsBots = fire._bulletsBots;
    let botsInScene = spawnBotShips._botShips;
    spawnBotShips._objectsFilter = [];

    bulletsPlayer.map((bulletsPlayer) => spawnBotShips._objectsFilter.push(bulletsPlayer._bulletMesh));
    bulletsBots.map((bullet) => player._objectsFilter.add(bullet._bulletMesh));
    botsInScene.map((bot) =>  player._objectsFilter.add(bot._ship));
}

function scoreAndLifeCounter() {

    score = spawnBotShips._killedBotsCounter;
    life = player._lifeCounter;
    document.getElementById('playerStats').innerHTML = playerName +
        " Health " + player._health + " Lifes: " + life + " Score: " + score;

}

function restartListener() {
    window.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') restartFlag = true;
    });
}

function restartGame(){
    document.getElementById('playerStats').style.display = "block";

    // re-adding the elements to the scene when the game is restarted
    starGeoPool.map(starGeo => scene.add(starGeo));

    scene.add(light1, light2, light3);

    player._lifeCounterRestart();
    player._healthRestart();
    player._restartModel();

    fire = new Fire(scene, camera);

    player._fire = fire;
    spawnBotShips._fire = fire;
    spawnBotShips._reloadModels();
    player._spawnedBots = spawnBotShips;

    timer = setInterval(spawnBotShips._spawnBot.bind(spawnBotShips), 1000);
}

function animate() {
    if(!gameOverFlag){
        tween = new TWEEN.Tween(player._ship.rotation);
        stats.update();
        scoreAndLifeCounter(); 
        updateObjectsInfo(); 
        player.updatePlayerShip(); 
        updateStarsPositions(); 
        spawnBotShips.updateBotsPosition(); 
        fire.updateBullets(); 
        TWEEN.update();
    } else if(!rendered){
        player._gameOver(); 
        player._clearFilter();
        rendered = true;
        document.getElementById('playerStats').style.display = "none";

        clearInterval(timer);

        camera.position.set(0, 0, constants.CAMERA_POSITION_GAME_OVER);
        restartListener();

        // timeout is needed because message would lock the screen and wouldn't show the image
        setTimeout(() => {window.alert("Press Enter to restart the game!")}, 100);
        clearInterval(timer);
    } 


    gameOverFlag = player._lifeCounter <= 0;

    if(restartFlag && rendered) {
        gameOverFlag = false;
        rendered = false;
        restartFlag = false;
        restartGame();
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case 'ArrowUp': 
            tween.to({x: -Math.PI / 2.2}).start();
            break;
        case 'ArrowLeft': 
            tween.to({y: -Math.PI / 6}).start();
            break;
        case 'ArrowDown': 
            tween.to({x: -Math.PI / 1.8}).start();
            break;
        case 'ArrowRight': 
            tween.to({y: Math.PI / 6}).start();
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case 'ArrowUp': 
            tween.to({x: -Math.PI / 2}).start();
            break;
        case 'ArrowLeft': 
            tween.to({y: 0}).start();
            break;
        case 'ArrowDown': 
            tween.to({x: -Math.PI / 2}).start();
            break;
        case 'ArrowRight': 
            tween.to({y: 0}).start();
            break;
    }
});

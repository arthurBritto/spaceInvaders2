import * as THREE from "./three.module.js";
import Stats  from "./stats.module.js";
import {PlayerShip} from "./ships.js";
import { BotShips } from "./ships.js";
import {ThirdPersonCamera} from "./thirdPersonCamera.js";
let scene, camera, renderer, starGeo, star, stars,thirdPersonCamera,stats, player,botShips;
let timer=0;

async function init(){
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
    stats = Stats();
    document.body.appendChild(stats.dom);

    scene.add( new THREE.AmbientLight( 0x444444 ) );    

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
    starGeo = [];
  
    for(let i=0;i<6000;i++) {
        star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
        starGeo.push(star);
    }
    let sprite = new THREE.TextureLoader().load('resources/star.png');
    let geometry = new THREE.BufferGeometry().setFromPoints(starGeo);
    let starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        map: sprite
    });

    stars = new THREE.Points(geometry, starMaterial);
    scene.add(stars);

    player = new PlayerShip(scene,camera);
    await player.loadPlayerModel();
    camera.position.set(0,2,2);

    light1.lookAt(player._ship);   
    light2.lookAt(player._ship);    
    light3.lookAt(player._ship);    



    botShips = new BotShips(scene, player._ship);
    
    setInterval(await botShips.spawnBotShip.bind(botShips), 1000);
   
    animate();
}

function animate(){
    stats.update();
    player.updatePlayerShip();
    botShips.updateBotsPosition();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}

init();
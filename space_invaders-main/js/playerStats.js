import * as THREE from "./three.module.js";
import Stats from "./stats.module.js";
import { PlayerShip } from "./ships.js";
import { SpawnBotShips } from "./ships.js";
import { Fire } from "./fire.js";

let score, life, scoreText, lifeText;

life = 7;
score = 0; 


window.onload = function () {
    var name = prompt("What's your name brow?");
    document.getElementById('playerStats').innerHTML = name;
};

window.onload = function () {
    document.getElementById('output1').innerHTML = "too cool for school   ";
};

function start(){

    scoreText = new Text("Score: " + score, 25, 25, "left", "#ffffff", "20");
}
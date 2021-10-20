import * as THREE from "./three.module.js"

class Bullet{
    constructor(shooter, shooterType){
        this._shooter = shooter;
        this._shooterType = shooterType;
        this._velocity = new THREE.Vector3(0,0,-10);
        this._bulletMesh = this._createBullets();
    }
    _createBullets(){
        const bulletGeometry = new THREE.CylinderGeometry(0.15,0.15,10);
        let bulletMaterial = new THREE.MeshBasicMaterial({
            color:0xff0000
        });
        bulletMaterial.side = THREE.DoubleSide;
        let bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        if(this._shooterType == "bot"){
            this._velocity.multiply(new THREE.Vector3(1,1,-1));
        }
        let shooterQuaternion = new THREE.Quaternion();
        this._shooter.getWorldQuaternion(shooterQuaternion);
        bullet.position.copy(this._shooter.position);
        bullet.applyQuaternion(shooterQuaternion);
        bullet.position.add(new THREE.Vector3(0,0,-15));
        return bullet;
    }
    updateBullet(){
        this._bulletMesh.position.add(this._velocity);
    }
    getBulletMesh(){
        return this._bulletMesh;
    }
}
class Fire{
    constructor(scene){
        this._scene = scene;
        this._bulletsPlayer = [];
        this._bulletsBots = [];
        this._clock = new THREE.Clock();
    }

    fireBullet(shooter, shooterType){
        let bullet = new Bullet(shooter, shooterType);
        let bulletMesh = bullet.getBulletMesh();
            
        if(shooterType == "player"){
            bulletMesh.name = "bullet player";
            this._bulletsPlayer.push(bullet);
        }
        else if(shooterType == "bot"){
            bulletMesh.name = "bullet bot";
            this._bulletsBots.push(bullet);
        }
        this._scene.add(bulletMesh);     
    }
    
    updateBullets(){
        for(let i=0; i<this._bulletsPlayer.length; i++){
            this._bulletsPlayer[i].updateBullet();
   
        }
        for(let i=0; i<this._bulletsBots.length; i++){
            this._bulletsBots[i].updateBullet();
        }
    }
    removeBullet(bullet, shooter){
        this._scene.remove(bullet);
        let bulletArray;
        if(shooter == "player"){
            bulletArray = this._bulletsPlayer;
        }
        else if(shooter == "bot"){
            bulletArray = this._bulletsBots;
        }
        for(let i=0; i<bulletArray.length;i++){
            if(bulletArray[i]._bulletMesh == bullet){
                bulletArray.splice(i,1);
                break;
            }
        }
    }
}
export {Fire}

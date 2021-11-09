import * as THREE from "./three.module.js"

class Bullet{
    constructor(){
        this._shooter;
        this._shooterType;
        this._velocity = new THREE.Vector3(0,0,-10);
        this._bulletMesh = this._createBullets();
    }
    _createBullets(){
        const bulletGeometry = new THREE.CylinderGeometry(0.15,0.15,10);
        let bulletMaterial = new THREE.MeshBasicMaterial({ color:0xff0000 });
        bulletMaterial.side = THREE.DoubleSide;
        let bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        this._bulletMesh = bullet;
        this._bulletMesh.visible = false;
        return bullet;
    }
    resetBullet(){
        this._shooter ="";
        this._shooterType = "";
        this._velocity = new THREE.Vector3(0,0,-10);
        this._bulletMesh.visible = false;
    }
    initializeBullet(shooter, shooterType){
        this._shooter = shooter;
        this._shooterType = shooterType
        if (this._shooterType == "bot") this._velocity.multiply(new THREE.Vector3(1,1,-1)); 
        let shooterQuaternion = new THREE.Quaternion();
        this._shooter.getWorldQuaternion(shooterQuaternion);
        this._bulletMesh.position.copy(this._shooter.position);
        this._bulletMesh.quaternion.copy(shooterQuaternion);
        this._bulletMesh.position.add(new THREE.Vector3(0,0,-15));
        this._bulletMesh.name = "bullet " + this._shooterType;
        this._bulletMesh.visible  = true;

    }
    updateBullet(){
        this._bulletMesh.position.add(this._velocity);
    }
    getBulletMesh(){
        return this._bulletMesh;
    }
}
class Fire{
    constructor(scene, camera){
        this._scene = scene;
        this._bulletsPlayer = [];
        this._bulletsBots = [];
        this._bulletsPool = [];
        this._bulletsNumber = 100;
        this._camera = camera;
        this._BULLET_DISTANCE = 600;
        this._startPool();

    }
    _startPool(){
        for(let i=0;i<this._bulletsNumber;i++){
            let bullet = new Bullet();
            this._bulletsPool.push(bullet);
            this._scene.add(bullet.getBulletMesh());
        }
    }
    _getNextBullet(){
        if (this._bulletsPool.length>0) return this._bulletsPool.pop();
        return null;
    }
    _removeBulletNotVisible(){
        let bulletMesh;

        this._bulletsBots.map((bullet, index) => {
            bulletMesh = bullet.getBulletMesh();
            if(bulletMesh.position.z > this._camera.position.z){
                this._bulletsBots.splice(index,1);
                this._bulletsPool.push(bullet);
                bullet.resetBullet();
            }
        });

        this._bulletsPlayer.map((bullet, index) => {
            bulletMesh = bullet.getBulletMesh();
            let distance = Math.abs(bulletMesh.position.z - this._camera.position.z);
            if(distance> this._BULLET_DISTANCE){
                this._bulletsPlayer.splice(index,1);
                this._bulletsPool.push(bullet);
                bullet.resetBullet();
            }
        });
    }

    fireBullet(shooter, shooterType){

        let bullet = this._getNextBullet();

        if(!bullet)return;

        let bulletMesh = bullet.getBulletMesh();
        bullet.initializeBullet(shooter,shooterType);

        shooterType == "bot" ? this._bulletsBots.push(bullet) : this._bulletsPlayer.push(bullet);
    }
    
    updateBullets(){

        this._removeBulletNotVisible();

        this._bulletsPlayer.map((element) => {
            element.updateBullet();
        });

        this._bulletsBots.map((element) => {
            element.updateBullet();
        });
    }
    removeBullet(bullet, shooter){
        bullet.visible = false;

    }
}

export {Fire}

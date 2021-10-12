import * as THREE from "./three.module.js"
class Fire{
    constructor(scene, shooter){
        this._scene = scene;
        this._bullet = this._createBullets();
        this._bulletsArray = [];
        this._shooter = shooter;
        this._clock = new THREE.Clock();
        this._timer =0.55;
        this._velocity = new THREE.Vector3(0,0,-3);
    }

    _createBullets(){
        const bulletGeometry = new THREE.CylinderGeometry(0.15,0.15,10);
        let bulletMaterial = new THREE.MeshBasicMaterial({
            color:0xff0000
        });
        let bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

        bullet.position.set(0,0,-15);         
        return bullet;
    }

    fireBullet(){
        let delta = this._clock.getDelta();
        this._timer += delta;
        if(this._timer < 0.5){
            return;
        }
        else{
            this._timer =0;
            let bullet = this._bullet.clone();
            let position = new THREE.Vector3();
            let rotation = new THREE.Quaternion();
            
            this._shooter.getWorldQuaternion(rotation);
            this._shooter.getWorldPosition(position);
            
            bullet.applyQuaternion(rotation);
            bullet.position.add(position);
            
            this._bulletsArray.push(bullet);
            this._scene.add(bullet);      
        }
    }

    updateBullets(){
        for(let i=0; i<this._bulletsArray.length; i++){
            let b = this._bulletsArray[i];
            b.position.add(this._velocity);
        }
    }
}
export {Fire}


import { CGFobject,CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;

        this.sphere = new MySphere(scene, 64,32,true);

        this.material = new CGFappearance(scene);
        this.material.setEmission(1, 1, 1, 1);
        this.material.setAmbient(0, 0, 0, 1);
        this.material.setDiffuse(0, 0, 0, 1);
        this.material.setSpecular(0, 0, 0, 1);
        this.material.setTexture(texture);
        //this.material.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }

    display() {
        this.scene.pushMatrix();

        const camera_position = this.scene.camera.position;
        this.scene.translate(camera_position[0], camera_position[1]+20, camera_position[2]);
        this.scene.scale(300, 300, 300);
        this.material.apply();
        this.sphere.display();

        this.scene.popMatrix();
    }
}

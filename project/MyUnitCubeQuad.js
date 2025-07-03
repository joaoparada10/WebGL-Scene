import { CGFappearance, CGFobject } from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, topoTex, frenteTex, direitaTex, trasTex, esquerdaTex, fundoTex, color) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.topoTex = topoTex;
        this.frenteTex = frenteTex;
        this.direitaTex = direitaTex;
        this.trasTex = trasTex;
        this.esquerdaTex = esquerdaTex;
        this.fundoTex = fundoTex;

        this.wallMat = new CGFappearance(this.scene);
        const r = color[0] / 255;
        const g = color[1] / 255;
        const b = color[2] / 255;

        this.wallMat.setAmbient(r * 0.8, g * 0.8, b * 0.8, 1.0);
        this.wallMat.setDiffuse(r * 0.7, g * 0.7, b * 0.7, 1.0);
        this.wallMat.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.wallMat.setShininess(10.0);
    }

    display() {
        this.wallMat.apply();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(-Math.PI, 0, 1, 0);
        this.scene.scale(1, 1, 1);
        this.trasTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);

        this.frenteTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.esquerdaTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.direitaTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.topoTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.fundoTex.bind();
        this.quad.display();
        this.scene.popMatrix();

    }
}
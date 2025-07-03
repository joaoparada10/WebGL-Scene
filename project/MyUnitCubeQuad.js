import { CGFappearance, CGFobject } from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, topoTex, frenteTex, direitaTex, trasTex, esquerdaTex, fundoTex,color) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.topoTex = topoTex;
        this.frenteTex = frenteTex;
        this.direitaTex = direitaTex;
        this.trasTex = trasTex;
        this.esquerdaTex = esquerdaTex;
        this.fundoTex = fundoTex;

        this.wallMat = new CGFappearance(this.scene);
        this.wallMat.setAmbient(color[0]/255,color[1]/255,color[2]/255,1);
        this.wallMat.setDiffuse(color[0]/255,color[1]/255,color[2]/255,1);
    }

    display() {
        this.wallMat.apply();
        
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5);
        this.trasTex.bind();
        this.quad.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5);
        
        this.frenteTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,0);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.esquerdaTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5,0,0);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.direitaTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.topoTex.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.fundoTex.bind();
        this.quad.display();
        this.scene.popMatrix();

    }
}
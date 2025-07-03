import { CGFobject, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";
import { MySphere } from "./MySphere.js";

export class MyHelipad extends CGFobject {
    /**
     * @param scene     - CGFscene
     * @param sizeX     - Helipad X size
     * @param sizeZ     - Helipad Z size
     * @param texH      – CGFtexture for “H”
     * @param texUp     – CGFtexture for “UP”
     * @param texDown   – CGFtexture for “DOWN”
     */
    constructor(scene, sizeX, sizeZ, texH, texUp, texDown) {
        super(scene);
        this.padQuad = new MyQuad(scene);
        this.lamp = new MySphere(scene, 8, 8, false);
        this.texH = texH;
        this.texUp = texUp;
        this.texDown = texDown;
        this.sizeX = sizeX;
        this.sizeZ = sizeZ;

        this.lampMat = new CGFappearance(scene);
        this.lampMat.setAmbient(0, 0, 0, 1);
        this.lampMat.setDiffuse(0, 0, 0, 1);
        this.lampMat.setSpecular(0, 0, 0, 1);
        this.lampMat.setShininess(10);
    }

    display() {
        const gl = this.scene.gl;
        const state = this.scene.currHeliState;
        this.scene.setActiveShader(this.scene.helipadShader);
        gl.activeTexture(gl.TEXTURE0);
        this.texH.bind(0);
        gl.activeTexture(gl.TEXTURE1);
        if (state === this.scene.helicopter.STATE.TAKING_OFF) {
            this.texUp.bind(1);
        } else if (state === this.scene.helicopter.STATE.LANDING) {
            this.texDown.bind(1);
        } else {
            this.texH.bind(1);
        }

        this.scene.pushMatrix();
        this.scene.translate(0, 0.01, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.sizeX, this.sizeZ, 1);
        this.padQuad.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);

        let e = 0.0;
        if ((this.scene.helicopter.state === this.scene.helicopter.STATE.TAKING_OFF && this.scene.helicopter.prevState === this.scene.helicopter.STATE.LANDED) ||
            state === this.scene.helicopter.STATE.LANDING) {
                
            const t = this.scene.lastUpdateTime * 0.001;
            e = 0.3 + 0.7 * Math.abs(Math.sin(t * 6.0));
        }
        this.lampMat.setEmission(e, e, e, 1);

        const w2 = this.sizeX / 2, d2 = this.sizeZ / 2, h = 0.1;
        const corners = [
            [w2, h, d2],
            [-w2, h, d2],
            [w2, h, -d2],
            [-w2, h, -d2]
        ];
        for (let [x, y, z] of corners) {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.scene.scale(0.2, 0.2, 0.2);
            this.lampMat.apply();
            this.lamp.display();
            this.scene.popMatrix();
        }
    }
}

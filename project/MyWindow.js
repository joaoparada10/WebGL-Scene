import { CGFobject, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyWindow extends CGFobject {
    constructor(scene, texturePath) {
        super(scene);
        this.quad = new MyQuad(scene);

        this.appearance = new CGFappearance(scene);
        this.appearance.setAmbient(1, 1, 1, 1);
        this.appearance.setDiffuse(1, 1, 1, 1);
        this.appearance.setSpecular(0, 0, 0, 1);
        this.appearance.setShininess(10.0);
        this.appearance.setTexture(new CGFtexture(scene, texturePath));
    }

    display() {
        this.appearance.apply();
        this.quad.display();
    }
}

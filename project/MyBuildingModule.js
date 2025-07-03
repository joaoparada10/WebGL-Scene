import { CGFobject, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";
import { MyQuad } from "./MyQuad.js";
import { MyWindow } from "./MyWindow.js";

export class MyBuildingModule extends CGFobject {
    constructor(scene, width, height, depth, floorCount, windowsPerFloor, windowTexturePath, isCentral, bombeirosColor, topTexturePath = null) {
        super(scene);

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.floorCount = floorCount;
        this.windowsPerFloor = windowsPerFloor;
        this.isCentral = isCentral;
        this.floorHeight = height / floorCount;
        this.bombeirosColor = bombeirosColor;

        const wallTex = new CGFtexture(scene, "textures/white-wall-textures.jpg");
        const topTex = topTexturePath ? new CGFtexture(scene, topTexturePath) : wallTex;
        
        this.cube = new MyUnitCubeQuad(scene, topTex, wallTex, wallTex, wallTex, wallTex, wallTex, bombeirosColor);

        this.window = new MyWindow(scene, windowTexturePath);
        this.doorQuad = new MyQuad(scene);
        this.signQuad = new MyQuad(scene);

        this.doorAppearance = new CGFappearance(scene);
        this.doorAppearance.setTexture(new CGFtexture(scene, "textures/double door.png"));
        this.doorAppearance.setAmbient(0.8,0.8,0.8,1);
        this.doorAppearance.setDiffuse(0.8,0.8,0.8,1);

        this.signAppearance = new CGFappearance(scene);
        this.signAppearance.setTexture(new CGFtexture(scene, "textures/bombeiros.png"));
        this.signAppearance.setAmbient(0.8,0.8,0.8,1);
        this.signAppearance.setDiffuse(0.8,0.8,0.8,1);


    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.width, this.height, this.depth);
        this.cube.display();
        this.scene.popMatrix();

        for (let i = 0; i < this.floorCount; i++) {
            if (this.isCentral && i === 0) continue;

            for (let j = 0; j < this.windowsPerFloor; j++) {
                const xSpacing = this.width / (this.windowsPerFloor + 1);
                const x = -this.width / 2 + (j + 1) * xSpacing;
                const y = -this.height / 2 + (i + 0.5) * this.floorHeight;

                this.scene.pushMatrix();
                this.scene.translate(x, y, this.depth / 2 + 0.01);
                this.scene.scale(0.3, 0.3, 1);
                this.window.display();
                this.scene.popMatrix();
            }
        }

        if (this.isCentral) {
            this.scene.pushMatrix();
            this.scene.translate(0, -this.height / 2 + 0.3, this.depth / 2 + 0.01);
            this.scene.scale(0.5, 0.6, 1);
            this.doorAppearance.apply();
            this.doorQuad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, -this.height / 2 + 1, this.depth / 2 + 0.01);
            this.scene.scale(0.8, 0.2, 1);
            this.signAppearance.apply();
            this.signQuad.display();
            this.scene.popMatrix();
        }
    }
}

import { CGFobject } from "../lib/CGF.js";
import { MyBuildingModule } from "./MyBuildingModule.js";

export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, floors, windowsPerFloor, bombeirosColor,windowTex, wallTex, signTex, doorTex, helipadTex, helipadUpTex, helipadDownTex) {
        super(scene);
        this.floors = floors;

        const centralFloors = floors + 1;
        const centralWidth = totalWidth / 3;
        const sideWidth = centralWidth * 0.75;
        const depth = 4;
        const centralDepth = 6;
        const floorHeight = 1;

        this.offset = sideWidth/2 + centralWidth / 2;

        this.left = new MyBuildingModule(
            scene,
            sideWidth,
            floors * floorHeight,
            depth,
            floors,
            windowsPerFloor,
            false,
            bombeirosColor, 
            windowTex, wallTex, signTex, doorTex
        );

        this.center = new MyBuildingModule(
            scene,
            centralWidth,
            centralFloors * floorHeight,
            centralDepth,
            centralFloors,
            windowsPerFloor,
            true,
            bombeirosColor,
            windowTex, wallTex, signTex, doorTex,
            helipadTex, helipadUpTex, helipadDownTex
        );

        this.right = new MyBuildingModule(
            scene,
            sideWidth,
            floors * floorHeight,
            depth,
            floors,
            windowsPerFloor,
            false,
            bombeirosColor,
            windowTex, wallTex, signTex, doorTex
        );
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.offset, this.floors / 2, 0);
        this.left.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, (this.floors +1)  / 2,0);
        this.center.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.offset, this.floors / 2, 0);
        this.right.display();
        this.scene.popMatrix();

    }
}

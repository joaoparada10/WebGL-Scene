import { CGFobject } from "../lib/CGF.js";
import { MyBuildingModule } from "./MyBuildingModule.js";

export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, floors, windowsPerFloor, windowTexturePath, bombeirosColor) {
        super(scene);

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
            windowTexturePath,
            false,
            bombeirosColor
        );

        this.center = new MyBuildingModule(
            scene,
            centralWidth,
            centralFloors * floorHeight,
            centralDepth,
            centralFloors,
            windowsPerFloor,
            windowTexturePath,
            true,
            bombeirosColor,
            "textures/helipad.png"
        );

        this.right = new MyBuildingModule(
            scene,
            sideWidth,
            floors * floorHeight,
            depth,
            floors,
            windowsPerFloor,
            windowTexturePath,
            false,
            bombeirosColor
        );
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.offset, 0, 0);
        this.left.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.center.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.offset, 0, 0);
        this.right.display();
        this.scene.popMatrix();
    }
}

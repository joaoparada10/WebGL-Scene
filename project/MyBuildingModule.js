import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";
import { MyQuad } from "./MyQuad.js";
import { MyWindow } from "./MyWindow.js";
import { MyHelipad } from "./MyHelipad.js";

export class MyBuildingModule extends CGFobject {
  /**
   * @param scene            – CGFscene
   * @param width, height, depth
   * @param floorCount       – number of floors
   * @param windowsPerFloor  – windows per floor
   * @param isCentral        – true for the middle module (has helipad)
   * @param bombeirosColor   – [r,g,b] color for the walls
   * @param windowTex        – CGFtexture for windows
   * @param wallTex          – CGFtexture for walls & roof (if no helipad)
   * @param signTex          – CGFtexture for building sign
   * @param doorTex          – CGFtexture for door
   * @param helipadTex       – CGFtexture for “H” pad
   * @param helipadUpTex     – CGFtexture for “UP”
   * @param helipadDownTex   – CGFtexture for “DOWN”
   */
  constructor(
    scene,
    width,
    height,
    depth,
    floorCount,
    windowsPerFloor,
    isCentral,
    bombeirosColor,
    windowTex,
    wallTex,
    signTex,
    doorTex,
    helipadTex = null,
    helipadUpTex = null,
    helipadDownTex = null
  ) {
    super(scene);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.floorCount = floorCount;
    this.windowsPerFloor = windowsPerFloor;
    this.isCentral = isCentral;
    this.floorHeight = height / floorCount;

    this.cube = new MyUnitCubeQuad(
      scene,
      wallTex, wallTex, wallTex,
      wallTex, wallTex, wallTex,
      bombeirosColor
    );
    this.windowQuad = new MyWindow(scene, windowTex);
    this.doorQuad = new MyQuad(scene);
    this.signQuad = new MyQuad(scene);

    // Appearances
    this.doorAppearance = new CGFappearance(scene);
    this.doorAppearance.setTexture(doorTex);
    this.doorAppearance.setAmbient(0.8, 0.8, 0.8, 1);
    this.doorAppearance.setDiffuse(0.8, 0.8, 0.8, 1);

    this.signAppearance = new CGFappearance(scene);
    this.signAppearance.setTexture(signTex);
    this.signAppearance.setAmbient(0.8, 0.8, 0.8, 1);
    this.signAppearance.setDiffuse(0.8, 0.8, 0.8, 1);

    // Helipad (only for central module)
    if (isCentral) {
      this.helipad = new MyHelipad(
        scene,
        width, depth,
        helipadTex,
        helipadUpTex,
        helipadDownTex
      );
    }
  }

  display() {
    // --- Main block ---
    this.scene.pushMatrix();
    this.scene.scale(this.width, this.height, this.depth);
    this.cube.display();
    this.scene.popMatrix();

    // --- Windows ---
    for (let i = 0; i < this.floorCount; i++) {
      if (this.isCentral && i === 0) continue;
      for (let j = 0; j < this.windowsPerFloor; j++) {
        const xSpacing = this.width / (this.windowsPerFloor + 1);
        const x = -this.width / 2 + (j + 1) * xSpacing;
        const y = -this.height / 2 + (i + 0.5) * this.floorHeight;
        this.scene.pushMatrix();
        this.scene.translate(x, y, this.depth / 2 + 0.01);
        this.scene.scale(0.3, 0.3, 1);
        this.windowQuad.display();
        this.scene.popMatrix();
      }
    }

    if (this.isCentral) {
      // --- Door ---
      this.scene.pushMatrix();
      this.scene.translate(0, -this.height / 2 + 0.3, this.depth / 2 + 0.01);
      this.scene.scale(0.5, 0.6, 1);
      this.doorAppearance.apply();
      this.doorQuad.display();
      this.scene.popMatrix();

      // --- Sign above door ---
      this.scene.pushMatrix();
      this.scene.translate(0, -this.height / 2 + 1, this.depth / 2 + 0.01);
      this.scene.scale(1, 0.3, 1);
      this.signAppearance.apply();
      this.signQuad.display();
      this.scene.popMatrix();

      // --- Helipad on roof ---
      this.scene.pushMatrix();
      this.scene.translate(0, this.height / 2 + 0.01, 0);
      this.helipad.display();
      this.scene.popMatrix();
    }
  }
}

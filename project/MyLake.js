import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js';

export class MyLake extends CGFobject {
  constructor(scene, centerX, centerZ, size, waterTex) {
    super(scene);
    this.centerX = centerX;
    this.centerZ = centerZ;
    this.size = size;
    this.plane = new MyPlane(scene, 1, 0, 1, 0, 1);

    this.mat = new CGFappearance(scene);
    this.mat.setAmbient(0, 0.2, 0.4, 1);
    this.mat.setDiffuse(0, 0.4, 0.8, 1);
    this.mat.setSpecular(0.1, 0.1, 0.2, 1);
    this.mat.setShininess(5);
    this.mat.setTexture(waterTex);
    this.mat.setTextureWrap('REPEAT', 'REPEAT');
  }

  isInside(x, z) {
    const half = this.size / 2;
    return x >= this.centerX - half &&
      x <= this.centerX + half &&
      z >= this.centerZ - half &&
      z <= this.centerZ + half;
  }

  display() {
    this.scene.pushMatrix();
    this.scene.translate(this.centerX, 0.01, this.centerZ);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(this.size, this.size, 1);
    this.mat.apply();
    this.plane.display();
    this.scene.popMatrix();
  }
}

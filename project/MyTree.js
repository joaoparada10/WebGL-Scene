import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCone }       from './MyCone.js';
import { MyPyramid }    from './MyPyramid.js';

export class MyTree extends CGFobject {
  /**
   * @param scene         – referência à MyScene
   * @param tiltDeg       – inclinação em graus (0º = vertical)
   * @param tiltAxis      – 'X' ou 'Z'
   * @param baseRadius    – raio da base do tronco
   * @param height        – altura total da árvore
   * @param crownColor    – [r,g,b], cor da copa
   * @param trunkTexture
   * @param crownTexture 
   */
  constructor(scene, tiltDeg, tiltAxis, baseRadius, height, crownColor, trunkTexture, crownTexture) {
    super(scene);
    this.tiltDeg    = tiltDeg;
    this.tiltAxis   = tiltAxis;
    this.baseRadius = baseRadius;
    this.height     = height;
    this.crownColor = crownColor;
    this.trunkTexture = trunkTexture;
    this.crownTexture = crownTexture;

    this.trunkHeight  = 0.8 * height;  
    this.crownHeight  = 0.8 * height;  
    this.numPyramids  = Math.max(1, Math.round(this.crownHeight * 2)); 

    this.trunk    = new MyCone(scene, 12, 1);
    this.pyramids = [];
    for (let i = 0; i < this.numPyramids; i++)
      this.pyramids.push(new MyPyramid(scene, 6, 1));

    this.trunkMat = new CGFappearance(scene);
    this.trunkMat.setAmbient(0.3,0.2,0.1,1);
    this.trunkMat.setDiffuse(0.6,0.4,0.2,1);
    this.trunkMat.setSpecular(0.1,0.1,0.1,1);
    this.trunkMat.setShininess(10);
    this.trunkMat.setTexture(this.trunkTexture);
    this.trunkMat.setTextureWrap('REPEAT','REPEAT');

    this.crownMat = new CGFappearance(scene);
    this.crownMat.setAmbient(...crownColor,1);
    this.crownMat.setDiffuse(...crownColor,1);
    this.crownMat.setSpecular(0.1,0.1,0.1,1);
    this.crownMat.setShininess(10);
    this.crownMat.setTexture(this.crownTexture);
    this.crownMat.setTextureWrap('REPEAT','REPEAT');
  }

  display() {
    this.scene.pushMatrix();

    if (this.tiltDeg !== 0) {
      const rad = this.tiltDeg * Math.PI / 180;
      if (this.tiltAxis === 'X') this.scene.rotate(rad, 1, 0, 0);
      else                        this.scene.rotate(rad, 0, 0, 1);
    }

    this.trunkMat.apply();
    this.scene.pushMatrix();
    this.scene.scale(this.baseRadius, this.trunkHeight, this.baseRadius);
    this.trunk.display();
    this.scene.popMatrix();


    let currentY   = this.height - this.crownHeight;
    let maxRadius  = this.baseRadius * 6;
    let radiusStep = maxRadius / this.numPyramids;
    let heightStep = this.crownHeight / this.numPyramids;

    for (let i = 0; i < this.numPyramids; i++) {
      const h    = heightStep;
      const r    = maxRadius - i * radiusStep;
      this.crownMat.apply();
      this.scene.pushMatrix();
      this.scene.translate(0, currentY + h/2, 0);
      this.scene.scale(r, h, r);
      this.pyramids[i].display();
      this.scene.popMatrix();
      currentY += h * 0.6;  // ligeiro overlap
    }

    this.scene.popMatrix();
  }
}

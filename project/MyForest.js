import { CGFobject } from '../lib/CGF.js';
import { MyTree }    from './MyTree.js';

export class MyForest extends CGFobject {
  /**
   * @param scene      – referência à MyScene
   * @param rows       – número de linhas de árvores
   * @param cols       – número de colunas
   * @param areaWidth  – largura total da área floresta
   * @param areaDepth  – profundidade total da área floresta
   */
  constructor(scene, rows, cols, areaWidth, areaDepth,barkTex, leafTex) {
    super(scene);
    this.rows       = rows;
    this.cols       = cols;
    this.areaWidth  = areaWidth;
    this.areaDepth  = areaDepth;
    this.trees      = [];
    this.barkTex = barkTex;
    this.leafTex = leafTex;

    const dx = areaWidth  / cols;
    const dz = areaDepth  / rows;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cx = -areaWidth/2 + dx*(j + 0.5);
        const cz = -areaDepth/2 + dz*(i + 0.5);

        const ox = (Math.random() - 0.5) * dx * 0.4;
        const oz = (Math.random() - 0.5) * dz * 0.4;

        // tree params with some randomness
        const tiltDeg    = (Math.random() - 0.5) * 10;     
        const tiltAxis   = Math.random() < 0.5 ? 'X' : 'Z';
        const height     = 3.0 + Math.random() * 3.0;  
        const baseRadius = 0.2 + Math.random() * 0.03 * height;  
        const greenShade = [
          0.1 + Math.random()*0.2,  
          0.6 + Math.random()*0.2,  
          0.1 + Math.random()*0.2   
        ];

        const tree = new MyTree(
          scene,
          tiltDeg, tiltAxis,
          baseRadius, height, greenShade,
          this.barkTex,
          this.leafTex
        );

        this.trees.push({
          tree,
          x: cx + ox,
          z: cz + oz
        });
      }
    }
  }

  display() {
    for (const { tree, x, z } of this.trees) {
      this.scene.pushMatrix();
      this.scene.translate(x, 0, z);
      tree.display();
      this.scene.popMatrix();
    }
  }
}

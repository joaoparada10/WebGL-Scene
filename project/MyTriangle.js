import { CGFobject } from '../lib/CGF.js';

export class MyTriangle extends CGFobject {
  constructor(scene) {
    super(scene);

    this.vertices = [
      0,  1, 0,   // 0, apex, top-center
     -1,  0, 0,   // 1,
      1,  0, 0    // 2
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.indices = [
      0, 1, 2,
      2,1,0
    ];

    this.texCoords = [
      0.5, 1.0,    
      0.0, 0.0,    
      1.0, 0.0    
    ];

    this.initGLBuffers();
  }
}

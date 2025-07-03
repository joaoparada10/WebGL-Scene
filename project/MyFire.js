import { CGFobject } from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';

export class MyFire extends CGFobject {
  /**
   * @param scene   – MyScene reference
   * @param fireTex – CGFtexture for the flame
   * @param x       – world X
   * @param z       – world Z
   * @param height  – maximum flame height
   * @param count   – number of triangle slices
   * @param radius  – base radius of flame
   */
  constructor(scene, fireTex, x, z, height = 2, count = 20, radius = 1) {
    super(scene);
    this.scene   = scene;
    this.fireTex = fireTex;
    this.x       = x;
    this.z       = z;
    this.height  = height;
    this.count   = count;
    this.radius  = radius;
    this.active  = true;

    this.slice = new MyTriangle(scene);
    
    // randomize each flame maxheight
    this.params = [];
    for (let i = 0; i < this.count; i++) {
      const angle = (2 * Math.PI * i) / this.count;
      const h     = this.height + Math.random()*2;
      this.params.push({ angle, h });
    }
  }

  extinguish() {
    this.active = false;
  }

  display() {
    if (!this.active) return;
    const gl     = this.scene.gl;
    const shader = this.scene.fireShader;

    this.scene.setActiveShader(shader);

    this.fireTex.bind(0);

    this.scene.pushMatrix();
    this.scene.translate(this.x, 0, this.z);
    for (const { angle, h } of this.params) {
      this.scene.pushMatrix();
      this.scene.rotate(angle, 0, 1, 0);
      shader.setUniformsValues({ uSliceSeed: h });
      this.scene.scale(this.radius, h, this.radius);
      this.slice.display();
      this.scene.popMatrix();
    }
    this.scene.popMatrix();
    this.scene.setActiveShader(this.scene.defaultShader);
  }
}

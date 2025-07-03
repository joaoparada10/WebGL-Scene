import { CGFobject } from '../lib/CGF.js';
import { MySphere }  from './MySphere.js';

export class MyWaterDrop extends CGFobject {
  constructor(scene, x, y, z, radius=0.5, speed=0.01) {
    super(scene);
    this.sphere = new MySphere(scene, 8, 8, true);
    this.position = { x, y, z };
    this.radius   = radius;
    this.speed    = speed;
    this.active   = true;
  }

  update(dt) {
    this.position.y -= this.speed * dt;
    if (this.position.y <= 0) {
      this.active = false;
    }
  }

  display() {
    if (!this.active) return;
    this.scene.pushMatrix();
      this.scene.translate(
        this.position.x,
        this.position.y,
        this.position.z
      );
      this.scene.scale(this.radius, this.radius, this.radius);
      this.scene.helicopter.waterMaterial.apply();
      this.sphere.display();
    this.scene.popMatrix();
  }
}

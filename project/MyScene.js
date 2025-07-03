import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyHeli } from "./MyHeli.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyFire } from "./MyFire.js";
import { MyLake } from "./MyLake.js";
import { MyWaterDrop } from './MyWaterDrop.js';

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this.gl.clearColor(0, 0, 0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.setUpdatePeriod(50);

    this.translateSphere = true;
    this.sphereSlices = 64;
    this.sphereStacks = 64;
    this.sphereRadius = 10;
    this.forestX = 70;
    this.forestZ = 60;
    this.forestRows = 20;
    this.forestCols = 12;

    // Helicopter properties
    this.speedFactor = 1.0;
    this.lastUpdateTime = 0;    // For deltaTime 
    this.heliSizeScale = 0.5;
    this.heliAnimationsEnabled = true;

    this.cameraFollowHelicopter = false;
    this.cameraDistance = 20;
    this.cameraHeight = 10;
    this.cameraOffset = 5;

    this.bombeirosFloors = 3;
    this.bombeirosWindows = 4;
    this.buildingScale = 2.0;
    this.bombeirosColor = [125, 85, 75];

    this.initCameras();
    this.initLights();

    // Texture loading
    this.waterTex = new CGFtexture(this, "textures/water.png");
    this.grassTex = new CGFtexture(this, "textures/grass_gs.jpg");
    this.wallTex = new CGFtexture(this, "textures/white-wall-textures.jpg");
    this.doorTex = new CGFtexture(this, "textures/double_door.png");
    this.windowTex = new CGFtexture(this, "textures/window.jpg");
    this.signTex = new CGFtexture(this, "textures/sign.png");
    this.helipadTex = new CGFtexture(this, "textures/helipad_h.png");
    this.earthTex = new CGFtexture(this, "textures/earth.jpg");
    this.panoramaTex = new CGFtexture(this, "textures/real_texture.jpg");
    this.barkTex = new CGFtexture(this, "textures/bark.png");
    this.leafTex = new CGFtexture(this, "textures/pine_needles.png");
    this.heliBodyTex = new CGFtexture(this, "textures/helicopter_body.jpeg");
    this.fireTex = new CGFtexture(this, "textures/fire.png");
    this.helipadUpTex = new CGFtexture(this, "textures/helipad_up.png");
    this.helipadDownTex = new CGFtexture(this, "textures/helipad_down.png");


    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.fireShader.setUniformsValues({
      uSampler: 0,
      uAmplitude: 0.05,   // how far each vertex moves
      uFrequency: 0.5   // how fast it ripples
    });

    this.helipadShader = new CGFshader(this.gl, "shaders/helipad.vert", "shaders/helipad.frag");
    this.helipadShader.setUniformsValues({
      uTexH: 0,
      uTexAux: 1
    });

    this.fires = [];
    this.waterDrops = [];
    this.lake = new MyLake(this, 40, -10, 20, this.waterTex);
    [{ x: this.forestX - this.forestRows / 2, z: this.forestZ - this.forestCols / 2 }, { x: this.forestX, z: this.forestZ }, { x: this.forestX + this.forestRows / 2, z: this.forestZ + this.forestCols / 2 }].
      forEach(p => this.fires.push(new MyFire(this, this.fireTex, p.x, p.z, 5, 10, 3)));
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 8, 0, 64, 0, 64);
    this.sphere = new MySphere(this, this.sphereSlices, this.sphereStacks, false);
    this.helicopter = new MyHeli(this, this.buildingScale * (this.bombeirosFloors + 1), this.heliSizeScale); // central floor tem mais 1, e o heli deve estar no topo
    this.panorama = new MyPanorama(this, this.panoramaTex);
    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestRows * 2, this.forestCols * 2.8, this.barkTex, this.leafTex);
    this.bombeiros = new MyBuilding(this, 20, this.bombeirosFloors, this.bombeirosWindows, this.bombeirosColor, this.windowTex, this.wallTex, this.signTex, this.doorTex, this.helipadTex, this.helipadUpTex, this.helipadDownTex);

    this.grassMaterial = new CGFappearance(this);
    this.grassMaterial.setAmbient(0.2, 0.5, 0.1, 1);
    this.grassMaterial.setDiffuse(0.5, 1, 0.2, 1);
    this.grassMaterial.setSpecular(0.4, 0.8, 0.2, 1);
    this.grassMaterial.setTexture(this.grassTex);
    this.grassMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.earthMaterial = new CGFappearance(this);
    this.earthMaterial.setAmbient(0, 0.8, 0.8, 1);
    this.earthMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.earthMaterial.setSpecular(0.3, 0.3, 0.3, 1);
    this.earthMaterial.setShininess(30.0);
    this.earthMaterial.setTexture(this.earthTex);

    // interface toggles
    this.displayAxis = false;
    this.displaySphere = false;
    this.displayPlane = true;
    this.displayPanorama = true;
    this.displayHelicopter = true;
    this.displayBombeiros = true;

    
  }

  updateBombeiros() {
    this.bombeiros = new MyBuilding(this, 20, this.bombeirosFloors, this.bombeirosWindows, this.bombeirosColor, this.windowTex, this.wallTex, this.signTex, this.doorTex, this.helipadTex, this.helipadUpTex, this.helipadDownTex);
    this.helicopter = new MyHeli(this, this.buildingScale * (this.bombeirosFloors + 1), this.heliSizeScale);
  }

  initLights() {
    this.lights[0].setPosition(500, 20, -10, 1);
    this.lights[0].setDiffuse(0.9, 0.9, 0.9, 1.0);
    this.lights[0].setAmbient(0.6, 0.6, 0.6, 1.0);
    this.lights[0].setSpecular(0.7, 0.7, 0.7, 1.0);
    this.lights[0].enable();
    this.lights[0].update();

    for (let i = 1; i < 4; i++) {
      this.lights[i].setAmbient(0, 0, 0, 1);
      this.lights[i].setDiffuse(0, 0, 0, 1);
      this.lights[i].setSpecular(0, 0, 0, 1);
      this.lights[i].disable();
      this.lights[i].update();
    }
  }

  initCameras() {
    // Camera positioned to view the helicopter at the start
    this.camera = new CGFcamera(
      0.7,
      0.1,
      1000,
      vec3.fromValues(40, 40, 40),
      vec3.fromValues(10, this.bombeirosFloors * 2, 10)
    );
  }

  checkKeys() {

    if (this.gui.isKeyPressed("KeyW")) {
      this.helicopter.accelerate(this.speedFactor);
      this.helicopter.setLean(-1);
    } else if (this.gui.isKeyPressed("KeyS")) {
      this.helicopter.accelerate(-this.speedFactor);
      this.helicopter.setLean(+1);
    } else {
      this.helicopter.accelerate(0);
      this.helicopter.setLean(0);
    }
    if (this.gui.isKeyPressed("KeyP")) {
      this.helicopter.requestTakeOff();
    }
    if (this.gui.isKeyPressed("KeyL")) {
      if (this.lake.isInside(this.helicopter.x, this.helicopter.z) && this.helicopter.state === this.helicopter.STATE.FLYING) {
        this.helicopter.requestPickUp();
      }
      else {
        this.helicopter.requestLanding();
      }
    }
    if (this.gui.isKeyPressed("KeyO")) {
      if (this.helicopter.carryingWater) {
        this.fires.forEach(f => {
          const dx = this.helicopter.x - f.x;
          const dz = this.helicopter.z - f.z;
          if (f.active && dx * dx + dz * dz < f.radius * f.radius) {
            const bx = this.helicopter.x;
            const by = this.helicopter.y - 2;  // adjust to bucket’s world‐space Y
            const bz = this.helicopter.z;
            this.waterDrops.push(new MyWaterDrop(this, bx, by, bz));
            this.helicopter.carryingWater = false;
          }
        });
      }
    }
    if (this.gui.isKeyPressed('KeyR')) {
      this.helicopter.reset();
    }
    if (this.gui.isKeyPressed("KeyW")) {
      this.helicopter.accelerate(+ this.speedFactor);
    }
    if (this.gui.isKeyPressed("KeyS")) {
      this.helicopter.accelerate(- this.speedFactor);
    }
    if (this.gui.isKeyPressed("KeyA")) {
      this.helicopter.turn(+ this.speedFactor);
    }
    if (this.gui.isKeyPressed("KeyD")) {
      this.helicopter.turn(- this.speedFactor);
    }
  }

  update(t) {
    this.checkKeys();

    if (!this.lastUpdateTime) this.lastUpdateTime = t;
    const dt = (t - this.lastUpdateTime);
    this.lastUpdateTime = t;

    if (this.helicopter && this.heliAnimationsEnabled) {
      this.helicopter.update(dt);
    }

    this.fireShader.setUniformsValues({ uTime: t / 100 % 100 });

    const timeSec = t * 0.001;
    this.helipadBlink = Math.abs(Math.sin(Math.PI * 1 * timeSec));

    let blendFactor = 0.0;
    this.currHeliState = this.helicopter.state;
    if ((this.helicopter.state === this.helicopter.STATE.TAKING_OFF && this.helicopter.prevState === this.helicopter.STATE.LANDED) ||
      this.helicopter.state === this.helicopter.STATE.LANDING) {
      blendFactor = this.helipadBlink;
    }
    this.helipadShader.setUniformsValues({ uBlend: blendFactor });
    this.setActiveShader(this.defaultShader);

    this.fires.forEach((f, idx) => {
      const lightIndex = idx + 1;
      if (f.active) {
        const flicker = 0.5 + 0.5 * Math.abs(Math.sin(Math.PI * 1 * timeSec));  
        const r = 2.8 * flicker + 1.0;
        const g = 0.6 * flicker + 0.4;
        const b = 0.2 * flicker + 0.2;
        this.lights[lightIndex].setPosition(f.x, f.height * 0.5, f.z, 1);
        this.lights[lightIndex].setDiffuse(r, g, b, 1);
        this.lights[lightIndex].setSpecular(r * 0.82, g * 0.2, b * 0.2, 1);
        this.lights[lightIndex].setQuadraticAttenuation(0.003);
        this.lights[lightIndex].enable();
      } else {
        this.lights[lightIndex].disable();
      }
    });

    for (let drop of this.waterDrops) {
      drop.update(dt);
      if (!drop.active) {
        for (let f of this.fires) {
          const dx = drop.position.x - f.x;
          const dz = drop.position.z - f.z;
          if (f.active && dx * dx + dz * dz < f.radius * f.radius) {
            f.extinguish();
            this.helicopter.carryingWater = false;
          }
        }
      }
    }
    this.waterDrops = this.waterDrops.filter(d => d.active);
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Camera following system
    if (this.cameraFollowHelicopter && this.displayHelicopter && this.helicopter) {
      const heli = this.helicopter;
      const d = this.cameraDistance;
      const h = this.cameraHeight;

      const wx = heli.x;
      const wy = heli.y;
      const wz = heli.z;

      const camX = wx - d * Math.sin(heli.angle);
      const camZ = wz - d * Math.cos(heli.angle);
      const camY = wy + h;

      this.camera.setPosition(vec3.fromValues(camX, camY, camZ));
      this.camera.setTarget(vec3.fromValues(wx, wy + 1, wz));
    }

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();
    this.lights[0].update();
    this.lights[1].update();
    this.lights[2].update();
    this.lights[3].update();

    // Draw axis
    if (this.displayAxis)
      this.axis.display();

    this.setDefaultAppearance();

    if (this.displayPanorama) {
      this.gl.disable(this.gl.CULL_FACE);
      this.panorama.display();
      this.gl.enable(this.gl.CULL_FACE);
    }
    if (this.displayPlane) {
      this.pushMatrix();
      this.grassMaterial.apply();
      this.scale(400, 1, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.plane.display();
      this.popMatrix();
    }

    if (this.displaySphere) {
      this.pushMatrix();
      if (this.translateSphere) this.translate(50, 50, -50);
      else this.translate(20, 50, 20);
      this.scale(this.sphereRadius, this.sphereRadius, this.sphereRadius);
      this.earthMaterial.apply();
      this.sphere.display();
      this.popMatrix();
    }
    this.pushMatrix();
    this.lake.display();
    this.popMatrix();

    this.pushMatrix();
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.fires.forEach(f => f.display());
    this.gl.disable(this.gl.BLEND);
    this.popMatrix();

    this.pushMatrix();
    for (let drop of this.waterDrops) drop.display();
    this.popMatrix();

    if (this.displayHelicopter && this.helicopter) {
      this.pushMatrix();
      this.helicopter.display();
      this.popMatrix();
    }

    if (this.displayBombeiros) {
      this.pushMatrix();
      this.scale(this.buildingScale, this.buildingScale, this.buildingScale);
      this.bombeiros.display();
      this.popMatrix();
    }

    this.pushMatrix();
    this.translate(this.forestX, 0, this.forestZ);
    this.gl.enable(this.gl.BLEND);
    this.forest.display();
    this.gl.disable(this.gl.BLEND);
    this.popMatrix();
  }
}
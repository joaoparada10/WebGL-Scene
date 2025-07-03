import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama} from  "./MyPanorama.js";
import { MyHeli } from "./MyHeli.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";

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

    this.initCameras();
    this.initLights();

    //Background color
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

    // Helicopter properties
    this.heliSpeed = 0.5;       // Units per update
    this.heliTurnSpeed = 0.05;  // Radians per update
    this.heliVertSpeed = 0.3;   // Units per update
    this.lastUpdateTime = 0;    // For deltaTime 
    this.heliSizeScale = 0.5;
    this.heliAnimationsEnabled = true;

    // Camera following properties
    this.cameraFollowHelicopter = false;
    this.cameraDistance = 20;
    this.cameraHeight = 10;
    this.cameraOffset = 5; // Offset lateral para melhor visibilidade
    
    // Store initial camera position for reset
    this.initialCameraPosition = vec3.fromValues(20, 20, 20);
    this.initialCameraTarget = vec3.fromValues(10, 10, 10);

    // Helicopter commands
    this.keyWActivated = true;
    this.keyAActivated = true;
    this.keySActivated = true;
    this.keyDActivated = true;
    this.keyQActivated = true;
    this.keyEActivated = true;
    this.keyRActivated = true;

    // default floors
    this.bombeirosFloors = 3;
    this.bombeirosWindows = 4;
    this.bombeirosSize1 = 1;
    this.bombeirosSize2 = 1;
    this.bombeirosSize3 = 1;

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this,16,0,128,0,128);
    this.sphere = new MySphere(this,this.sphereSlices,this.sphereStacks, true);
    this.helicopter = new MyHeli(this, this.bombeirosFloors);

    // Position the helicopter at a helipad position
    this.helicopter.x = 0;
    this.helicopter.y = 8;
    this.helicopter.z = 0;

    this.grassTex = new CGFtexture(this, "textures/grass_gs.jpg");
    this.grassMaterial = new CGFappearance(this);
    this.grassMaterial.setAmbient(0.2, 0.5, 0.1, 1);
    this.grassMaterial.setDiffuse(0.2, 0.5, 0, 1);
    this.grassMaterial.setSpecular(0.2, 0.5, 0.1, 1);
    this.grassMaterial.setTexture(this.grassTex);
    this.grassMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.earthTex = new CGFtexture(this, "textures/earth.jpg");
    this.earthMaterial = new CGFappearance(this);
    this.earthMaterial.setAmbient(0, 0.8, 0.8, 1);
    this.earthMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.earthMaterial.setSpecular(0.3, 0.3, 0.3, 1);
    this.earthMaterial.setShininess(30.0);

    this.earthMaterial.setTexture(this.earthTex);

    this.panoramaTex = new CGFtexture (this, "textures/real_texture.jpg");
    this.panorama = new MyPanorama(this, this.panoramaTex);

    this.barkTex  = new CGFtexture(this, "textures/bark.png");
    this.leafTex  = new CGFtexture(this, "textures/pine_needles.png");

    this.forest = new MyForest(this, 6, 5, 10, 5,this.barkTex,this.leafTex);

    this.windowTexPath = "textures/window2.jpeg";

    // change color here
    this.bombeirosColor = [100,200,240];
    // params: scene, totalwidth, num floors, windows per floor, window tex, color
    this.bombeiros = new MyBuilding(this, 20, this.bombeirosFloors, this.bombeirosWindows, this.windowTexPath, this.bombeirosColor);

    // Create helicopter textures
    this.heliBodyTex = new CGFtexture(this, "textures/helicopter_body.jpeg");

    this.displayAxis = false;
    this.displaySphere = true;
    this.displayPlane = true;
    this.displayPanorama = true;
    this.displayHelicopter = true;
    this.displayBombeiros = true;
  }
  
  // Method to update the Bombeiros building dynamically
  updateBombeiros() {
    this.bombeiros = new MyBuilding(
      this, 
      20, 
      this.bombeirosFloors, 
      this.bombeirosWindows, 
      this.windowTexPath, 
      this.bombeirosColor
    );
  }
  
  initLights() {
    this.lights[0].setPosition(20, 20, 20, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();

    this.lights[1].setPosition(-20, 20, 0, 1);
    this.lights[1].setDiffuse(0.6, 0.6, 0.6, 1);
    this.lights[1].enable();
    this.lights[1].update();
  }
  
  initCameras() {
    // Camera positioned to view the helicopter at the start
    this.camera = new CGFcamera(
      0.7,
      0.1,
      1000,
      vec3.fromValues(20, 20, 20),
      vec3.fromValues(10, 10, 10)
    );
  }
  
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.keyWActivated & this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
      this.helicopter.moveForward(this.heliSpeed);
    }

    if (this.keySActivated & this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
      this.helicopter.moveBackward(this.heliSpeed);
    }
    
    if (this.keyAActivated & this.gui.isKeyPressed("KeyA")) {
      text += " A ";
      keysPressed = true;
      this.helicopter.turnLeft(this.heliTurnSpeed);
    }
    
    if (this.keyDActivated & this.gui.isKeyPressed("KeyD")) {
      text += " D ";
      keysPressed = true;
      this.helicopter.turnRight(this.heliTurnSpeed);
    }
    
    if (this.keyQActivated & this.gui.isKeyPressed("KeyQ")) {
      text += " Q ";
      keysPressed = true;
      this.helicopter.moveUp(this.heliVertSpeed);
    }
    
    if (this.keyEActivated & this.gui.isKeyPressed("KeyE")) {
      text += " E ";
      keysPressed = true;
      this.helicopter.moveDown(this.heliVertSpeed);
    }
    
    // Toggle water collection
    if (this.keyRActivated & this.gui.isKeyPressed("KeyR")) {
      // Toggle water only on keypress, not continuously
      if (!this.rKeyPressed) {
        this.helicopter.toggleWater();
        this.rKeyPressed = true;
        text += " R ";
        keysPressed = true;
      }
    } else {
      this.rKeyPressed = false;
    }
    
    if (keysPressed)
      console.log(text);
  }

  update(t) {
    this.checkKeys();
    
    // Update helicopter animations only if animations are enabled
    if (this.helicopter && this.heliAnimationsEnabled) {
      this.helicopter.update(50); // Use a fixed deltaTime for simplicity
    }
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    
    // Camera following system
    if (this.cameraFollowHelicopter && this.displayHelicopter && this.helicopter) {
        // Calcular posição da câmera baseada na orientação do helicóptero
        const angleOffset = -Math.PI / 4; // Ângulo de offset para melhor visão
        const followAngle = this.helicopter.angle + angleOffset;
        
        // Posição da câmera
        const cameraX = this.helicopter.x - this.cameraDistance * Math.sin(followAngle);
        const cameraY = this.helicopter.y + this.cameraHeight;
        const cameraZ = this.helicopter.z - this.cameraDistance * Math.cos(followAngle);
        
        // Ponto alvo (ligeiramente à frente do helicóptero)
        const targetOffsetDistance = 5;
        const targetX = this.helicopter.x + targetOffsetDistance * Math.sin(this.helicopter.angle);
        const targetY = this.helicopter.y;
        const targetZ = this.helicopter.z + targetOffsetDistance * Math.cos(this.helicopter.angle);
        
        // Aplicar suavização (opcional mas recomendado)
        const currentPos = this.camera.position;
        const smoothFactor = 0.1;
        
        const smoothX = currentPos[0] + (cameraX - currentPos[0]) * smoothFactor;
        const smoothY = currentPos[1] + (cameraY - currentPos[1]) * smoothFactor;
        const smoothZ = currentPos[2] + (cameraZ - currentPos[2]) * smoothFactor;
        
        // Atualizar posição e alvo da câmera
        this.camera.setPosition(vec3.fromValues(smoothX, smoothY, smoothZ));
        this.camera.setTarget(vec3.fromValues(targetX, targetY, targetZ));
    } else {
        // Retornar à posição inicial da câmera
        this.camera.setPosition(this.initialCameraPosition);
        this.camera.setTarget(this.initialCameraTarget);
    }
    
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();
    this.lights[0].update();
    this.lights[1].update();

    // Draw axis
    if (this.displayAxis)
      this.axis.display();

    this.setDefaultAppearance();

    if (this.displayPanorama){
      this.gl.disable(this.gl.CULL_FACE);
      this.panorama.display();
      this.gl.enable(this.gl.CULL_FACE);
    }
    if (this.displayPlane){
      this.pushMatrix();
      this.grassMaterial.apply();
      this.scale(400, 1, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      
      this.plane.display();
      this.popMatrix();
    }

    if (this.displaySphere){
      this.pushMatrix(); 
      if(this.translateSphere) this.translate(50, 50, -50);
      else this.translate(20, 50, 20);
      this.scale(this.sphereRadius, this.sphereRadius, this.sphereRadius);
      this.earthMaterial.apply();
      this.sphere.display();
      this.popMatrix();
    }
    
    // Display helicopter
    if (this.displayHelicopter && this.helicopter) {
      this.pushMatrix();
      this.scale(this.heliSizeScale, this.heliSizeScale, this.heliSizeScale);
      this.helicopter.display();
      this.popMatrix();
    }

    if (this.displayBombeiros){
        this.pushMatrix();
        this.translate(0,this.bombeirosFloors/2,0);
        this.scale(this.bombeirosSize1, this.bombeirosSize2, this.bombeirosSize3);
        this.bombeiros.display();
        this.popMatrix();
    }

    this.pushMatrix();
    this.translate(25, 0, 25);
    this.gl.enable(this.gl.BLEND);
    this.forest.display();
    this.popMatrix();

    this.gl.disable(this.gl.BLEND);
  }
}
/*Coisas a melhorar no ponto 1:
  -> Code clean up + Comentários padronizados;
  -> Efeito de rotação na terra sobre si mesma;
  -> Panormama a simular um fundo estrelado;
  -> ROdar o planeta para uma posição mais real;
  -> Ajustar Translação do planeta;
  -> AJustar melhor a postura da câmera;
  -> Ajustar Iluminação do planeta Terra;
  -> Confirmar que funcionalidades da GUI funcionam todas;*/

/*Coisas a melhorar no ponto 2:
  */

/*Coisas a melhorar no ponto 3:
  */

/*Coisas a melhorar no ponto 4:
  */

/*Coisas a melhorar no ponto 5:
  */

/*Coisas a melhorar no ponto 6:
  */
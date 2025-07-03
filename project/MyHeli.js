import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';
import { MyPyramid } from './MyPyramid.js';
import { MyCylinder } from './MyCylinder.js';

/**
 * MyHeli
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene, height) {
        super(scene);
        
        // Initialize components
        this.initMaterials();
        this.initComponents();
        
        // Helicopter position and orientation
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.angle = 3 * Math.PI / 2;
        this.height = height || 0; // Default to 0 if not provided
        
        // Animation properties
        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;
        this.rotorSpeed = 5; // Rotation speed in radians per second
        this.bucketSwingAngle = 0;
        this.bucketSwingDirection = 1;
        
        // Helicopter state
        this.isFlying = false;
        this.carryingWater = false;
    }
    
    /**
     * Initialize all materials and textures used by the helicopter
     */
    initMaterials() {
        // Body material
        this.bodyMaterial = new CGFappearance(this.scene);
        this.bodyMaterial.setAmbient(0.7, 0.7, 0.7, 1);
        this.bodyMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.bodyMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.bodyMaterial.setShininess(10.0);
        this.bodyTexture = new CGFtexture(this.scene, "textures/helicopter_body.jpeg");
        this.bodyMaterial.setTexture(this.bodyTexture);
        
        // Glass material
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setAmbient(0.2, 0.2, 0.2, 0.8);
        this.glassMaterial.setDiffuse(0.2, 0.2, 0.8, 0.8);
        this.glassMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.glassMaterial.setShininess(120.0);
        
        // Rotor material
        this.rotorMaterial = new CGFappearance(this.scene);
        this.rotorMaterial.setAmbient(0.2, 0.2, 0.2, 1);
        this.rotorMaterial.setDiffuse(0.2, 0.2, 0.2, 1);
        this.rotorMaterial.setSpecular(0.5, 0.5, 0.5, 1);
        this.rotorMaterial.setShininess(30.0);
        
        // Landing gear material
        this.landingGearMaterial = new CGFappearance(this.scene);
        this.landingGearMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.landingGearMaterial.setDiffuse(0.1, 0.1, 0.1, 1);
        this.landingGearMaterial.setSpecular(0.3, 0.3, 0.3, 1);
        
        // Bucket material
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setAmbient(0.6, 0.3, 0.1, 1);
        this.bucketMaterial.setDiffuse(0.6, 0.3, 0.1, 1);
        this.bucketMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        
        // Water material
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.0, 0.2, 0.8, 0.8);
        this.waterMaterial.setDiffuse(0.0, 0.4, 0.8, 0.8);
        this.waterMaterial.setSpecular(0.8, 0.8, 0.8, 0.8);
        this.waterMaterial.setShininess(150.0);
    }
    
    /**
     * Initialize all component objects of the helicopter
     */
    initComponents() {
        // Create basic shapes
        this.sphere = new MySphere(this.scene, 10, 10, false);
        this.cube = new MyUnitCubeQuad(
            this.scene, 
            this.bodyTexture, this.bodyTexture, this.bodyTexture, 
            this.bodyTexture, this.bodyTexture, this.bodyTexture,
            [200, 200, 200]
        );
        this.pyramid = new MyPyramid(this.scene, 4, 1);
        this.cylinder = new MyCylinder(this.scene, 10, 10, true);
    }
    
    /**
     * Update helicopter animation state
     * @param {number} deltaTime - Time elapsed since last update in milliseconds
     */
    update(deltaTime) {
        // Convert deltaTime to seconds for easier calculations
        const delta = deltaTime / 1000;
        
        // Update rotor angles
        this.mainRotorAngle += this.rotorSpeed * delta * 10;
        this.tailRotorAngle += this.rotorSpeed * delta * 15;
        
        // Keep angles in range [0, 2π]
        this.mainRotorAngle %= (2 * Math.PI);
        this.tailRotorAngle %= (2 * Math.PI);
        
        // Animate bucket swinging when flying
        if (this.isFlying) {
            this.bucketSwingAngle += this.bucketSwingDirection * 0.02;
            
            // Reverse direction when reaching limits
            if (Math.abs(this.bucketSwingAngle) > 0.2) {
                this.bucketSwingDirection *= -1;
            }
        } else {
            // Gradually return to neutral position when landed
            if (Math.abs(this.bucketSwingAngle) > 0.01) {
                this.bucketSwingAngle *= 0.95;
            } else {
                this.bucketSwingAngle = 0;
            }
        }
    }
    
    /**
     * Move helicopter forward
     * @param {number} amount - Amount to move
     */
    moveForward(amount) {
        this.x += amount * Math.sin(this.angle + Math.PI / 2);
        this.z += amount * Math.cos(this.angle + Math.PI / 2);
        this.isFlying = true;
    }
    
    /**
     * Move helicopter backward
     * @param {number} amount - Amount to move
     */
    moveBackward(amount) {
        this.moveForward(-amount);
    }
    
    /**
     * Turn helicopter left
     * @param {number} amount - Angle to turn in radians
     */
    turnLeft(amount) {
        this.angle += amount;
    }
    
    /**
     * Turn helicopter right
     * @param {number} amount - Angle to turn in radians
     */
    turnRight(amount) {
        this.turnLeft(-amount);
    }
    
    /**
     * Move helicopter up
     * @param {number} amount - Amount to move
     */
    moveUp(amount) {
        this.y += amount;
        this.isFlying = true;
    }
    
    /**
     * Move helicopter down
     * @param {number} amount - Amount to move
     */
    moveDown(amount) {
        if (this.y > amount) {
            this.y -= amount;
        } else {
            this.y = 0;
            this.isFlying = false;
        }
    }
    
    /**
     * Toggle water carrying state
     */
    toggleWater() {
        if (this.isFlying && this.y < 5) {
            this.carryingWater = !this.carryingWater;
        }
    }
    
    /**
     * Draw the cabin of the helicopter
     */
    drawCabin() {
        // Main cabin body
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(0, this.height, 0);
        this.scene.scale(4, 1.5, 2);
        this.sphere.display();
        this.scene.popMatrix();
        
        // Glass cockpit
        this.scene.pushMatrix();
        this.glassMaterial.apply();
        this.scene.translate(2, this.height + 0.5, 0);
        this.scene.scale(2, 1.3, 1.8);
        this.sphere.display();
        this.scene.popMatrix();
    }
    
    /**
     * Draw the tail of the helicopter
     */
    drawTail() {
        // Tail boom
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-3, this.height, 0);
        this.scene.scale(2, 0.5, 0.5);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Tail vertical fin
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-6, this.height + 1, 0);
        this.scene.scale(1, 2, 0.2);
        this.cube.display();
        this.scene.popMatrix();
        
        // Tail horizontal fin
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-6, this.height, 0);
        this.scene.scale(1, 0.2, 1);
        this.cube.display();
        this.scene.popMatrix();
    }
    
    /**
     * Draw the main rotor of the helicopter
     */
    drawMainRotor() {
        // Rotor hub
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.translate(0, this.height + 1.8, 0);
        this.scene.scale(0.5, 0.3, 0.5);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Rotor blades
        this.scene.pushMatrix();
        this.scene.translate(0, this.height + 1.8, 0);
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        
        // Draw 4 blades
        for (let i = 0; i < 4; i++) {
            this.scene.pushMatrix();
            this.rotorMaterial.apply();
            this.scene.rotate(i * Math.PI / 2, 0, 1, 0);
            this.scene.translate(2, 0, 0);
            this.scene.scale(4, 0.1, 0.5);
            this.cube.display();
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
    }
    
    /**
     * Draw the tail rotor of the helicopter
     */
    drawTailRotor() {
        // Tail rotor hub
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.translate(-6, this.height + 1, 0.4);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(0.3, 0.2, 0.3);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Tail rotor blades
        this.scene.pushMatrix();
        this.scene.translate(-6, this.height + 1, 0.4);
        this.scene.rotate(this.tailRotorAngle, 1, 0, 0);
        
        // Draw 2 blades
        for (let i = 0; i < 2; i++) {
            this.scene.pushMatrix();
            this.rotorMaterial.apply();
            this.scene.rotate(i * Math.PI, 1, 0, 0);
            this.scene.translate(0, 1, 0);
            this.scene.scale(0.2, 2, 0.1);
            this.cube.display();
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
    }
    
    /**
     * Draw the landing gear of the helicopter
     */
    drawLandingGear() {
        // Left skid
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(0, this.height - 2.6, 1.0);
        this.scene.scale(5, 0.2, 0.2);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Right skid
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(0, this.height - 2.6, -1.0);
        this.scene.scale(5, 0.2, 0.2);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Support struts - left front
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(1.5, this.height - 1, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 1.6);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Support struts - left rear
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(-1.5, this.height - 1, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 1.6);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Support struts - right front
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(1.5, this.height - 1, -1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 1.6);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Support struts - right rear
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(-1.5, this.height - 1, -1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 1.6);
        this.cylinder.display();
        this.scene.popMatrix();
    }
    
    /**
     * Draw the water bucket
     */
    drawBucket() {
        if (!this.isFlying) return;
        
        this.scene.pushMatrix();
        
        // Apply bucket swing effect
        this.scene.rotate(this.bucketSwingAngle, 0, 0, 1);
        
        // Bucket rope
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(0, this.height - 2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 3);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Bucket container
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.scene.translate(0, this.height - 5, 0);
        this.scene.scale(1, 1.5, 1);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Water in bucket (if carrying water)
        if (this.carryingWater) {
            this.scene.pushMatrix();
            this.waterMaterial.apply();
            this.scene.translate(0, this.height - 4.5, 0);
            this.scene.scale(0.8, 0.8, 0.8);
            this.sphere.display();
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
    }
    
    /**
     * Display the helicopter
     */
    display() {
        this.scene.pushMatrix();
        
        // Apply helicopter position and orientation
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.angle, 0, 1, 0);
        
        // Draw all helicopter components
        this.drawCabin();
        this.drawTail();
        this.drawMainRotor();
        this.drawTailRotor();
        this.drawLandingGear();
        this.drawBucket();
        
        this.scene.popMatrix();
    }
}
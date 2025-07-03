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
    constructor(scene, height, scaleFactor) {
        super(scene);
        this.scaleFactor = scaleFactor
        this.angle = 0;
        this.x = 0;
        this.y = height;
        this.z = 0;
        this.modelOffset = 2.9;
        

        // Initialize components
        this.initMaterials();
        this.initComponents();

        this.cruiseAltitude = this.y + 15;
        this.landingAltitude = height;
        this.pickupAltitude = 0;
        this.speed = 0;
        this.velocity = { x: 0, y: 0, z: 0 };

        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;
        this.rotorSpeed = 0;
        this.bucketSwingAngle = 0;
        this.bucketSwingDirection = 1;

        this.isFlying = false;
        this.carryingWater = false;

        this.leanAngle = 0;
        this.leanTarget = 0;
        this.maxLean = Math.PI / 12;
        this.leanDamp = 0.1;

        this.STATE = {
            LANDED: 0,
            TAKING_OFF: 1,
            FLYING: 2,
            LANDING: 3,
            PICKING_UP: 4
        };
        this.state = this.STATE.LANDED;
        this.prevState = this.STATE.LANDED;

        this.vertSpeed = 4;
        this.landingHorizSpeed = 10;

    }

    /**
     * Initialize all materials and textures used by the helicopter
     */
    initMaterials() {
        // Body material
        this.bodyMaterial = new CGFappearance(this.scene);
        this.bodyMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.bodyMaterial.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.bodyMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.bodyMaterial.setShininess(30.0);
        this.bodyTexture = new CGFtexture(this.scene, "textures/helicopter_body.jpeg");
        this.bodyMaterial.setTexture(this.bodyTexture);
        this.bodyMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // Glass material
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setAmbient(0.1, 0.1, 0.15, 0.4); 
        this.glassMaterial.setDiffuse(0.1, 0.1, 0.8, 0.4);
        this.glassMaterial.setSpecular(0.8, 0.8, 0.8, 0.6); 
        this.glassMaterial.setShininess(120.0);

        // Rotor material
        this.rotorMaterial = new CGFappearance(this.scene);
        this.rotorMaterial.setAmbient(0.05, 0.05, 0.05, 1.0);
        this.rotorMaterial.setDiffuse(0.2, 0.2, 0.2, 1.0);
        this.rotorMaterial.setSpecular(0.6, 0.6, 0.6, 1.0);
        this.rotorMaterial.setShininess(100.0);

        // Landing gear material
        this.landingGearMaterial = new CGFappearance(this.scene);
        this.landingGearMaterial.setAmbient(0.05, 0.05, 0.05, 1.0);
        this.landingGearMaterial.setDiffuse(0.15, 0.15, 0.15, 1.0);
        this.landingGearMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.landingGearMaterial.setShininess(30.0);

        // Bucket material
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setAmbient(0.2, 0.1, 0.05, 1.0);
        this.bucketMaterial.setDiffuse(0.5, 0.25, 0.1, 1.0);
        this.bucketMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.bucketMaterial.setShininess(15.0);

        // Water material
        this.waterMaterial = new CGFappearance(this.scene);

        this.waterMaterial.setAmbient(0.0, 0.1, 0.3, 0.6);
        this.waterMaterial.setDiffuse(0.0, 0.3, 0.8, 0.6); 
        this.waterMaterial.setSpecular(0.8, 0.8, 0.9, 1.0); 
        this.waterMaterial.setShininess(80.0);
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

    resetHorizontalSpeed() {
        this.velocity.x = this.velocity.z = this.leanTarget = this.leanAngle = this.speed = 0;
    }

    /**
     * Update helicopter animation state
     * @param {number} deltaTime - Time elapsed since last update in milliseconds
     */
    update(deltaTime) {
        const dt = deltaTime / 1000;

        this.mainRotorAngle = (this.mainRotorAngle + this.rotorSpeed * dt) % (2 * Math.PI);
        this.tailRotorAngle = (this.tailRotorAngle + this.rotorSpeed * dt * 1.5) % (2 * Math.PI);
        this.x += this.velocity.x * dt;
        this.z += this.velocity.z * dt;

        this.leanAngle += (this.leanTarget - this.leanAngle) * this.leanDamp;

        switch (this.state) {
            case this.STATE.TAKING_OFF:
                if (this.prevState === this.STATE.LANDED) this.isFlying = false;
                this.y += this.vertSpeed * dt;
                if (this.y >= this.cruiseAltitude) {
                    this.isFlying = true;
                    this.y = this.cruiseAltitude;
                    this.state = this.STATE.FLYING;
                }
                break;

            case this.STATE.LANDING: {
                const dx = 0 - this.x;
                const dz = 0 - this.z;
                this.resetHorizontalSpeed();
                const dist2 = dx * dx + dz * dz;
                console.log(this.y, this.landingAltitude);
                if (dist2 > 0.1) {
                    const dist = Math.sqrt(dist2);
                    const ux = dx / dist, uz = dz / dist;
                    this.x += ux * this.landingHorizSpeed * dt;
                    this.z += uz * this.landingHorizSpeed * dt;
                } else {
                    this.isFlying = false;
                    this.carryingWater = false;
                    this.y -= this.vertSpeed * dt;

                    if (this.y <= this.landingAltitude) {
                        this.y = this.landingAltitude;
                        this.state = this.STATE.LANDED;

                        this.rotorSpeed = 0;
                    }
                }
            }
                break;

            case this.STATE.FLYING:
                const dragCoeff = 1.0;
                const dv = dragCoeff * this.speed * dt;
                this.speed -= dv;
                if (Math.abs(this.speed) < 0.001) this.speed = 0;

                this.velocity.x = this.speed * Math.sin(this.angle);
                this.velocity.z = this.speed * Math.cos(this.angle);
                break;
            case this.STATE.PICKING_UP:
                this.resetHorizontalSpeed();
                this.y -= this.vertSpeed * dt;
                if (this.y <= this.pickupAltitude) {
                    this.y = this.pickupAltitude;
                    this.carryingWater = true;
                    this.prevState = this.STATE.PICKING_UP;      // bucket now full
                }
                break;

            case this.STATE.LANDED:
                this.state = this.STATE.LANDED;
                this.prevState = this.STATE.LANDED;
            default:
                break;
        }



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
     * Aumenta ou diminui a velocidade do helicóptero mantido a direção atual.
     * @param {number} v – delta de velocidade (unidades/s)
     */
    accelerate(v) {
        if (this.state !== this.STATE.FLYING) return;
        this.speed += v;
        this.velocity.x = this.speed * Math.sin(this.angle);
        this.velocity.z = this.speed * Math.cos(this.angle);
    }

    /**
     * Gira o helicóptero em torno do eixo Y e ajusta o vetor velocidade.
     * @param {number} v – delta de ângulo (radianos)
     */
    turn(v) {
        if (this.state !== this.STATE.FLYING) return;
        this.angle += v * 0.1;
        this.velocity.x = this.speed * Math.sin(this.angle);
        this.velocity.z = this.speed * Math.cos(this.angle);
    }
    /**
     * Reseta o helicóptero ao pad, zera tudo (posição, velocidade, estado).
     */
    reset() {
        this.x = 0;
        this.y = this.landingAltitude;
        this.z = 0;
        this.angle = 0;
        this.rotorSpeed = 0;
        this.speed = 0;
        this.velocity.x = this.velocity.z = 0;
        this.state = this.STATE.LANDED;
        this.isFlying = false;
        this.leanTarget = this.leanAngle = 0;
        this.carryingWater = false;
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
     * Define o leanTarget com valor em [-1,1]
     * @param   dir   – -1 para lean forward, +1 para lean back, 0 para neutro
     */
    setLean(dir) {
        if (this.state !== this.STATE.FLYING) return;
        this.leanTarget = dir * this.maxLean;
    }

    /**
     * Inicia subida automática do heliporto até altitude de cruzeiro
     */
    requestTakeOff() {
        if (this.state === this.STATE.LANDED || this.state === this.STATE.PICKING_UP) {
            this.state = this.STATE.TAKING_OFF;
            this.isFlying = true;
            this.rotorSpeed = Math.abs(this.rotorSpeed) || 5;
        }
    }

    /**
     * Inicia descida automática ao heliporto
     */
    requestLanding() {
        if (this.state === this.STATE.FLYING) {
            this.state = this.STATE.LANDING;
            this.carryingWater = false;
        }
    }

    requestPickUp() {
        if (this.state === this.STATE.FLYING) {
            this.state = this.STATE.PICKING_UP;
            this.rotorSpeed = Math.abs(this.rotorSpeed) || 5;
        }
    }


    /**
     * Draw the cabin of the helicopter
     */
    drawCabin() {
        // Main cabin body
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(0, this.modelOffset, 0);
        this.scene.scale(4, 1.5, 2);
        this.sphere.display();
        this.scene.popMatrix();

        // Glass cockpit
        this.scene.pushMatrix();
        this.glassMaterial.apply();
        this.scene.translate(2, this.modelOffset + 0.5, 0);
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
        this.scene.translate(-3, this.modelOffset, 0);
        this.scene.scale(2, 0.5, 0.5);
        this.cylinder.display();
        this.scene.popMatrix();

        // Tail vertical fin
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-6, this.modelOffset + 1, 0);
        this.scene.scale(1, 2, 0.2);
        this.cube.display();
        this.scene.popMatrix();

        // Tail horizontal fin
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-6, this.modelOffset, 0);
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
        this.scene.translate(0, this.modelOffset + 1.8, 0);
        this.scene.scale(0.5, 0.3, 0.5);
        this.cylinder.display();
        this.scene.popMatrix();

        // Rotor blades
        this.scene.pushMatrix();
        this.scene.translate(0, this.modelOffset + 1.8, 0);
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
        this.scene.translate(-6, this.modelOffset + 1, 0.4);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.scale(0.3, 0.2, 0.3);
        this.cylinder.display();
        this.scene.popMatrix();

        // Tail rotor blades
        this.scene.pushMatrix();
        this.scene.translate(-6, this.modelOffset + 1, 0.4);
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
        this.scene.translate(0, this.modelOffset - 2.6, 1.0);
        this.scene.scale(5, 0.2, 0.2);
        this.cylinder.display();
        this.scene.popMatrix();

        // Right skid
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(0, this.modelOffset - 2.6, -1.0);
        this.scene.scale(5, 0.2, 0.2);
        this.cylinder.display();
        this.scene.popMatrix();

        // Support struts - left front
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(1.5, this.modelOffset - 1, 1);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 1.6);
        this.cylinder.display();
        this.scene.popMatrix();

        // Support struts - left rear
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(-1.5, this.modelOffset - 1, 1);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 1.6);
        this.cylinder.display();
        this.scene.popMatrix();

        // Support struts - right front
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(1.5, this.modelOffset - 1, -1);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 1.6);
        this.cylinder.display();
        this.scene.popMatrix();

        // Support struts - right rear
        this.scene.pushMatrix();
        this.landingGearMaterial.apply();
        this.scene.translate(-1.5, this.modelOffset - 1, -1);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
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
        this.scene.translate(0, this.modelOffset - 2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 3);
        this.cylinder.display();
        this.scene.popMatrix();

        // Bucket container
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.scene.translate(0, this.modelOffset - 5, 0);
        this.scene.scale(1, 1.5, 1);
        this.cylinder.display();
        this.scene.popMatrix();

        // Water in bucket (if carrying water)
        if (this.carryingWater) {
            this.scene.pushMatrix();
            this.waterMaterial.apply();
            this.scene.translate(0, this.modelOffset - 4.5, 0);
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

        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.rotate(this.angle, 0, 1, 0);
        this.scene.rotate(this.leanAngle, 0, 0, 1);
        this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);


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
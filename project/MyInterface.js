import { CGFinterface, dat } from '../lib/CGF.js';
/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        super.init(application); // call CGFinterface init
        this.gui = new dat.GUI();


        //------ Secção Opções Gerais
        var opcoesGerais = this.gui.addFolder('General Options');
        opcoesGerais.add(this.scene, 'displayAxis').name('Display Axis');
        opcoesGerais.add(this.scene, 'displayPlane').name('Display Floor');

        //------ Secção Sky-Sphere
        var Esfera = this.gui.addFolder('Sphere');
        Esfera.add(this.scene, 'displaySphere').name('Display Sphere');
        Esfera.add(this.scene, 'translateSphere').name('Translate Sphere');
        Esfera.add(this.scene, 'sphereRadius', 5, 50, 1).name('Radius');
        Esfera.add(this.scene, 'sphereSlices', 10, 100, 1).name('Slices');
        Esfera.add(this.scene, 'sphereStacks', 10, 100, 1).name('Stacks');
        Esfera.add(this.scene, 'displayPanorama').name('Display Panor.');

        //------ Secção Bombeiros
        var Bombeiros = this.gui.addFolder('Firefighters Building');
        Bombeiros.add(this.scene, 'displayBombeiros').name('Display Building');
        Bombeiros.add(this.scene, 'buildingScale', 0.5, 4.0).name('Building Scale').onChange(() => this.scene.updateBombeiros());
        Bombeiros.add(this.scene, 'bombeirosFloors', 2, 10, 1).name('Floors').onChange(() => this.scene.updateBombeiros());
        Bombeiros.add(this.scene, 'bombeirosWindows', 2, 14, 1).name('Windows').onChange(() => this.scene.updateBombeiros());

        //------ Secção Helicóptero
        var Helicoptero = this.gui.addFolder('Helicopter');
        Helicoptero.add(this.scene, 'displayHelicopter').name('Display Helicopter');
        Helicoptero.add(this.scene, 'speedFactor', 0.1, 3.0, 0.1).name('Speed Factor');
        Helicoptero.add(this.scene, 'cameraFollowHelicopter').name('Camera Follow');
        Helicoptero.add(this.scene, 'cameraDistance', 10, 40, 1).name('Camera Distance');
        Helicoptero.add(this.scene, 'cameraHeight', 5, 30, 1).name('Camera Height');

        // Info about controls
        const keyInfo = {
            'W - Move Forward': '',
            'S - Move Backward': '',
            'A - Turn Left': '',
            'D - Turn Right': '',
            'P - Take Off': '',
            'L - Land / Pickup Water': '',
            'O - Extinguish Fire': '',
            'R - Reset Heli': ''
        };
        const heliControls = this.gui.addFolder('Helicopter Controls');
        for (const label in keyInfo) {
            const ctrl = heliControls.add(keyInfo, label);
            const inp = ctrl.domElement.querySelector('input');
            if (inp) inp.style.display = 'none';
        }

        this.initKeys();
        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;
        // disable the processKeyboard function
        this.processKeyboard = function () { };
        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }

    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    }

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }
}
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
        this.initKeys();
        
        //------ Secção Opções Gerais
        var opcoesGerais = this.gui.addFolder('General Options');
        opcoesGerais.add(this.scene, 'displayAxis').name('Display Axis');
        opcoesGerais.add(this.scene, 'displayPlane').name('Display Floor');
        
        //------ Secção Sky-Sphere
        var Esfera = this.gui.addFolder('Sky-Sphere');
        Esfera.add(this.scene, 'displaySphere').name('Display Sphere');
        Esfera.add(this.scene, 'translateSphere').name('Translate Sphere');
        Esfera.add(this.scene, 'sphereRadius', 5, 50, 1).name('Radius');
        Esfera.add(this.scene, 'sphereSlices', 10, 100, 1).name('Slices');
        Esfera.add(this.scene, 'sphereStacks', 10, 100, 1).name('Stacks');
        Esfera.add(this.scene, 'displayPanorama').name('Display Panor.');
        
        //------ Secção Bombeiros
        var Bombeiros = this.gui.addFolder('Firefighters Building');
        Bombeiros.add(this.scene, 'displayBombeiros').name('Display Building');
        Bombeiros.add(this.scene, 'bombeirosSize3', 1, 5, 1).name('Length');
        Bombeiros.add(this.scene, 'bombeirosSize1', 1, 5, 1).name('Width');
        Bombeiros.add(this.scene, 'bombeirosSize2', 1, 5, 1).name('Height');
        Bombeiros.add(this.scene, 'bombeirosFloors', 2, 10, 1).name('Floors').onChange(() => this.scene.updateBombeiros());
        Bombeiros.add(this.scene, 'bombeirosWindows', 2, 14, 1).name('Windows').onChange(() => this.scene.updateBombeiros());

        //------ Secção Helicóptero
        var Helicoptero = this.gui.addFolder('Helicopter');
        Helicoptero.add(this.scene, 'displayHelicopter').name('Display Helicopter');
        Helicoptero.add(this.scene, 'heliSizeScale', 0.5, 4, 0.5).name('Size');
        Helicoptero.add(this.scene, 'heliSpeed', 0.1, 2.0, 0.1).name('Speed');
        Helicoptero.add(this.scene, 'heliTurnSpeed', 0.01, 0.2, 0.01).name('Turn Speed');
        Helicoptero.add(this.scene, 'heliVertSpeed', 0.1, 1.0, 0.1).name('Vertical Speed');
        Helicoptero.add(this.scene, 'heliAnimationsEnabled').name('Animations On/Off');
        Helicoptero.add(this.scene, 'cameraFollowHelicopter').name('Camera Follow');
        Helicoptero.add(this.scene, 'cameraDistance', 10, 40, 1).name('Camera Distance');
        Helicoptero.add(this.scene, 'cameraHeight', 5, 30, 1).name('Camera Height');
        
        // Info about controls
        var heliControls = this.gui.addFolder('Helicopter Controls');
        heliControls.add(this.scene, 'keyWActivated').name('W - Move For.');
        heliControls.add(this.scene, 'keySActivated').name('S - Move Back');
        heliControls.add(this.scene, 'keySActivated').name('A - Turn Left');
        heliControls.add(this.scene, 'keyDActivated').name('D - Turn Right');
        heliControls.add(this.scene, 'keyQActivated').name('Q - Up');
        heliControls.add(this.scene, 'keyEActivated').name('E - Down');
        heliControls.add(this.scene, 'keyRActivated').name('R - Water On/Off');
        
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
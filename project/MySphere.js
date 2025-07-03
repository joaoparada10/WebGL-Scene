import { CGFobject } from '../lib/CGF.js';

/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, invert = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.invert = invert;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const normal_sign = this.invert ? -1 : 1;
        const total_stacks = this.stacks * 2;
        const delta_alfa = Math.PI / total_stacks; // Ângulo entre stacks (latitude)
        const delta_teta = 2 * Math.PI / this.slices; // ângulo entre slices (longitude)

        for (let i = 0; i <= total_stacks; i++) {
            let alfa = i * delta_alfa;
            let sin_alfa = Math.sin(alfa);
            let cos_alfa = Math.cos(alfa);

            for (let j = 0; j <= this.slices; j++) {
                let teta = j *  delta_teta; // longitude (0 a)
                let sin_teta = Math.sin(teta);
                let cos_teta = Math.cos(teta);

                let x = cos_teta * sin_alfa;
                let y = cos_alfa;
                let z = sin_teta * sin_alfa;
                
                this.vertices.push(x, y, z);
                this.normals.push(normal_sign * x,normal_sign *  y,normal_sign *  z);
                this.texCoords.push(j / this.slices, i / total_stacks);
            }
        }
        for (let i = 0; i < total_stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                let first = i * (this.slices + 1) + j;
                let second = first + this.slices + 1;
                if (!this.invert){
                    this.indices.push(first + 1, second, first);
                    this.indices.push(second + 1, second, first + 1);
                }
                else{
                    this.indices.push(first, second, first + 1);
                    this.indices.push(first + 1, second, second + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

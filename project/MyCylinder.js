import { CGFobject } from '../lib/CGF.js';

/**
 * MyCylinder
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Integer} slices - Number of divisions around the circumference
 * @param {Integer} stacks - Number of divisions along the height
 * @param {Boolean} closed - Whether to close the cylinder with caps
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks, closed = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.closed = closed;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const alphaAng = 2 * Math.PI / this.slices;
        const stackHeight = 1 / this.stacks;

        // OUTER SURFACE - Generate vertices, normals and texture coordinates
        for (let stack = 0; stack <= this.stacks; stack++) {
            const h = stack * stackHeight;
            
            for (let slice = 0; slice <= this.slices; slice++) {
                // For texture coordinates continuity, we need one more vertex
                const theta = slice * alphaAng;

                // Cylinder point
                const x = Math.cos(theta);
                const y = h;
                const z = Math.sin(theta);

                // Push vertices
                this.vertices.push(x, y - 0.5, z); // Center cylinder at origin

                // Push normals (radial outward)
                this.normals.push(x, 0, z);

                // Texture coords
                this.texCoords.push(slice / this.slices, 1 - stack / this.stacks);
            }
        }

        // Generate indices for outer surface
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const a = stack * (this.slices + 1) + slice;
                const b = stack * (this.slices + 1) + slice + 1;
                const c = (stack + 1) * (this.slices + 1) + slice;
                const d = (stack + 1) * (this.slices + 1) + slice + 1;

                // Two triangles per sector
                this.indices.push(a, c, b);
                this.indices.push(b, c, d);
            }
        }

        // INNER SURFACE - Store offset for inner surface vertices
        const innerOffset = this.vertices.length / 3;

        // Generate vertices for inner surface
        for (let stack = 0; stack <= this.stacks; stack++) {
            const h = stack * stackHeight;
            
            for (let slice = 0; slice <= this.slices; slice++) {
                const theta = slice * alphaAng;

                // Cylinder point
                const x = Math.cos(theta);
                const y = h;
                const z = Math.sin(theta);

                // Push vertices (same as outer)
                this.vertices.push(x, y - 0.5, z);

                // Push normals (radial inward - inverted)
                this.normals.push(-x, 0, -z);

                // Texture coords
                this.texCoords.push(slice / this.slices, 1 - stack / this.stacks);
            }
        }

        // Generate indices for inner surface (inverted winding order)
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const a = innerOffset + stack * (this.slices + 1) + slice;
                const b = innerOffset + stack * (this.slices + 1) + slice + 1;
                const c = innerOffset + (stack + 1) * (this.slices + 1) + slice;
                const d = innerOffset + (stack + 1) * (this.slices + 1) + slice + 1;

                // Two triangles per sector (inverted order)
                this.indices.push(a, b, c);
                this.indices.push(b, d, c);
            }
        }

        // Add caps if requested
        if (this.closed) {
            this.addCaps();
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Add top and bottom caps to the cylinder
     */
    addCaps() {
        const topCapBaseIndex = this.vertices.length / 3;
        const alphaAng = 2 * Math.PI / this.slices;

        // Top center vertex
        this.vertices.push(0, 0.5, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

        // Top cap vertices
        for (let slice = 0; slice <= this.slices; slice++) {
            const theta = slice * alphaAng;
            const x = Math.cos(theta);
            const z = Math.sin(theta);

            // Push vertices
            this.vertices.push(x, 0.5, z);
            
            // Push normals
            this.normals.push(0, 1, 0);
            
            // Texture coords
            this.texCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * z);
        }

        // Top cap indices
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                topCapBaseIndex, 
                topCapBaseIndex + slice + 1, 
                topCapBaseIndex + slice + 2
            );
        }

        // Bottom center vertex
        const bottomCapBaseIndex = this.vertices.length / 3;
        this.vertices.push(0, -0.5, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        // Bottom cap vertices
        for (let slice = 0; slice <= this.slices; slice++) {
            const theta = slice * alphaAng;
            const x = Math.cos(theta);
            const z = Math.sin(theta);

            // Push vertices
            this.vertices.push(x, -0.5, z);
            
            // Push normals
            this.normals.push(0, -1, 0);
            
            // Texture coords
            this.texCoords.push(0.5 + 0.5 * x, 0.5 + 0.5 * z);
        }

        // Bottom cap indices
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                bottomCapBaseIndex,
                bottomCapBaseIndex + slice + 2,
                bottomCapBaseIndex + slice + 1
            );
        }
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); // complexity varies 0-1, so slices varies 3-12
        
        // Reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
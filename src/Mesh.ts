import { ML, Vec3 } from "./MathLib";

export class Mesh {

    indexBuffer?: WebGLBuffer;
    positionBuffer?: WebGLBuffer;
    normalBuffer?: WebGLBuffer;
    vertexColorBuffer?: WebGLBuffer;

    protected _isLoaded = false;

    get isLoaded(){
        if ( !this._isLoaded )
            return false;
        return true;
    }

    protected createBuffers(indices: Uint16Array, positions: Float32Array, normals?: Float32Array | false, vertexColors?: Float32Array | false) {
        //TODO
    }

    protected calculateNormal(vertex1: Vec3, vertex2: Vec3, vertex3: Vec3) {
        const vector1 = ML.sub3(vertex2, vertex1);
        const vector2 = ML.sub3(vertex3, vertex1);
        let normal = ML.cross3(vector1, vector2);
        normal = ML.normalize3(normal);
      
        //opposite sides have the same normal, so we need to inverse the wrong ones
        const mid = ML.add3(ML.add3(vertex1, vertex2), vertex3);
        const dotProduct = ML.dot3(normal, mid);
        if (dotProduct < 0) {
            ML.negate3(normal);
        }
      
        return normal;
    }
}

export class Cube extends Mesh {
    constructor(public readonly size = 1 ) {
        super();

        let indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];
        let r = size * .5;
        let positions = [
            -r, -r, r, r, -r, r, r, r, r, -r, r, r,
            -r, -r, -r, -r, r, -r, r, r, -r, r, -r, -r,
            -r, r, -r, -r, r, r, r, r, r, r, r, -r,
            -r, -r, -r, r, -r, -r, r, -r, r, -r, -r, r,
            r, -r, -r, r, r, -r, r, r, r, r, -r, r,
            -r, -r, -r, -r, -r, r, -r, r, r, -r, r, -r
        ];
        let normals = [
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
        ];
        let colors = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ];
        this.createBuffers(new Uint16Array( indices ), new Float32Array( positions ), new Float32Array( normals ), new Float32Array( colors ) );
        this._isLoaded = true;
    }
}
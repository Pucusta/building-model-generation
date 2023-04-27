import { Vec3 } from "./MathLib";

export class Vertex {
    position: Vec3;
    normal: Vec3 = [0, 0, 0];

    constructor(position: Vec3) {
        this.position = position;
    }
}
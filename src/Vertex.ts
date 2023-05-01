import { Vec3, Vec4 } from "./MathLib";

export class Vertex {
    position: Vec3;
    normal: Vec3;
    color: Vec4;

    constructor(position: Vec3, normal: Vec3, color: Vec4) {
        this.position = position;
        this.normal = normal;
        this.color = color;
    }
}
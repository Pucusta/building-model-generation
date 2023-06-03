import { Vec2, Vec3, Vec4 } from "./MathLib";

export class Vertex {
    position: Vec3;
    normal: Vec3;
    textureCoord: Vec2
    color: Vec4;

    constructor(position: Vec3, normal: Vec3, textureCoord: Vec2, color: Vec4 = [ 1, 1, 1, 1 ]) {
        this.position = position;
        this.normal = normal;
        this.textureCoord = textureCoord;
        this.color = color;
    }
}
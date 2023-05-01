import { Vec3, Vec4 } from "./MathLib";
import { Mesh } from "./Mesh";

export class Cube extends Mesh {

    height = 2;
    static color: Vec4 = [0.12, 0.41, 0.95, 1.0];

    constructor(positions: Vec3[]) {
        super(positions);
    }

    protected Build(positions: Vec3[]) {
        const bottomCorners = positions;
        const topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + this.height, v[2]]);
        const objMiddle = this.GetMiddlePoint(bottomCorners.concat(topCorners));

        //sides
        for (let i = 0; i < 4; i++) {

            const positions: Vec3[] = [];
            positions.push(bottomCorners[i % 4]);
            positions.push(bottomCorners[(i + 1) % 4]);
            positions.push(topCorners[(i + 1) % 4]);
            positions.push(topCorners[i % 4]);

            const sideNormal = this.CalculateNormal(positions[0], positions[1], positions[2], objMiddle);

            this.BuildRectangle(positions, sideNormal, Cube.color);
        }

        //bottom
        const bottomNormal = this.CalculateNormal(bottomCorners[0], bottomCorners[1], bottomCorners[2], objMiddle);
        this.BuildRectangle(bottomCorners, bottomNormal, Cube.color);

        //top
        const topNormal = this.CalculateNormal(topCorners[0], topCorners[1], topCorners[2], objMiddle);
        this.BuildRectangle(topCorners, topNormal, Cube.color);
    }
}
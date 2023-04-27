import { Vec3 } from "./MathLib";
import { Mesh } from "./Mesh";

export class Cube extends Mesh {

    height = 2;

    constructor(corners: Vec3[]) {
        super();
        this.Build(corners);
        console.log("num of vertices: " + this.vertices.length);
    }

    Build(corners: Vec3[]) {
        const bottomCorners = corners;
        const topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + this.height, v[2]]);

        //sides
        for (let i = 0; i < 4; i++) {

            const corners: Vec3[] = [];
            corners.push(bottomCorners[i % 4]);
            corners.push(bottomCorners[(i + 1) % 4]);
            corners.push(topCorners[(i + 1) % 4]);
            corners.push(topCorners[i % 4]);

            this.BuildRectangle(corners);
        }

        //bottom
        this.BuildRectangle(bottomCorners);

        //top
        this.BuildRectangle(topCorners);

        this.CalculateNormals();
    }
}
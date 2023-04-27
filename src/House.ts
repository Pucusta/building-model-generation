import { Vec3, ML } from './MathLib';
import { Mesh } from './Mesh';
import { Vertex } from './Vertex';

export class House extends Mesh {
    
    wallHeight = 1.5;
    roofHeight = 1;
    eavesWidth = 0.2;

    constructor(corners: Vec3[]) {
        super();
        this.Build(corners);
        console.log("num of vertices: " + this.vertices.length);
    }

    Build(corners: Vec3[]) {
        const bottomCorners = corners;
        const topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + this.wallHeight, v[2]]);

        let topMiddle: Vec3 = [0, 0, 0];
        for (let i = 0; i < 4; i++) {
            topMiddle = ML.add3(topMiddle, topCorners[i]);
        }
        topMiddle = [topMiddle[0] / 4, topMiddle[1] / 4, topMiddle[2] / 4];
        let rooftop: Vec3 = [topMiddle[0], topMiddle[1] + this.roofHeight, topMiddle[2]];

        const eavesCorners: Vec3[] = []; 
        for (let i = 0; i < 4; i++) {
            let offset: Vec3 = ML.normalize3(ML.sub3(topCorners[i], topMiddle));
            offset = [offset[0] * this.eavesWidth, offset[1], offset[2] * this.eavesWidth]
            eavesCorners.push(ML.add3(topCorners[i], offset));
        }

        //sides
        for (let i = 0; i < 4; i++) {

            const positions: Vec3[] = [];
            positions.push(bottomCorners[i % 4]);
            positions.push(bottomCorners[(i + 1) % 4]);
            positions.push(topCorners[(i + 1) % 4]);
            positions.push(topCorners[i % 4]);

            this.BuildRectangle(positions);
        }

        //roof
        for (let i = 0; i < 4; i++) {

            const positions: Vec3[] = [];
            positions.push(eavesCorners[i % 4]);
            positions.push(eavesCorners[(i + 1) % 4]);
            positions.push(rooftop);

            this.BuildTriangle(positions);
        }

        this.CalculateNormals();
    }
}
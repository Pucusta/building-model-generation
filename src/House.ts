import { Vec3, ML } from './MathLib';

export class House {

    corners: Vec3[] = [];

    vertices: Vec3[] = [];
    normals: Vec3[] = [];
    //indices: number[] = [];

    wallHeight = 1.5;
    roofHeight = 1;
    eavesWidth = 0.2;

    constructor(corners: Vec3[]) {
        this.corners = corners;
        this.BuildHouse();
        console.log("num of vertices: " + this.vertices.length);
    }

    private BuildCube() {
        const bottomCorners = this.corners;
        const topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + this.wallHeight, v[2]]);

        //sides
        for (let i = 0; i < 4; i++) {
            this.vertices.push(bottomCorners[i % 4]);
            this.vertices.push(bottomCorners[(i + 1) % 4]);
            this.vertices.push(topCorners[(i + 1) % 4]);

            this.vertices.push(topCorners[(i + 1) % 4]);
            this.vertices.push(topCorners[i % 4]);
            this.vertices.push(bottomCorners[i % 4]);
        }

        //bottom
        this.vertices.push(bottomCorners[0]);
        this.vertices.push(bottomCorners[1]);
        this.vertices.push(bottomCorners[2]);

        this.vertices.push(bottomCorners[2]);
        this.vertices.push(bottomCorners[3]);
        this.vertices.push(bottomCorners[0]);

        //top
        this.vertices.push(topCorners[0]);
        this.vertices.push(topCorners[1]);
        this.vertices.push(topCorners[2]);

        this.vertices.push(topCorners[2]);
        this.vertices.push(topCorners[3]);
        this.vertices.push(topCorners[0]);

        this.CalculateNormals();
    }

    private BuildHouse() {
        const bottomCorners = this.corners;
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
            this.vertices.push(bottomCorners[i % 4]);
            this.vertices.push(bottomCorners[(i + 1) % 4]);
            this.vertices.push(topCorners[(i + 1) % 4]);

            this.vertices.push(topCorners[(i + 1) % 4]);
            this.vertices.push(topCorners[i % 4]);
            this.vertices.push(bottomCorners[i % 4]);
        }

        //bottom
        this.vertices.push(bottomCorners[0]);
        this.vertices.push(bottomCorners[1]);
        this.vertices.push(bottomCorners[2]);

        this.vertices.push(bottomCorners[2]);
        this.vertices.push(bottomCorners[3]);
        this.vertices.push(bottomCorners[0]);

        //eaves (whole area under roof)
        this.vertices.push(eavesCorners[0]);
        this.vertices.push(eavesCorners[1]);
        this.vertices.push(eavesCorners[2]);

        this.vertices.push(eavesCorners[2]);
        this.vertices.push(eavesCorners[3]);
        this.vertices.push(eavesCorners[0]);

        //roof
        for (let i = 0; i < 4; i++) {
            this.vertices.push(eavesCorners[i % 4]);
            this.vertices.push(eavesCorners[(i + 1) % 4]);
            this.vertices.push(rooftop);
        }

        this.CalculateNormals();
    }

    private CalculateNormals() {
        for (let i = 0; i < this.vertices.length - 2; i += 3) {
            let v1 = this.vertices[i];
            let v2 = this.vertices[i + 1];
            let v3 = this.vertices[i + 2];
            let normal = this.CalculateNormal(v1, v2, v3);

            for (let i = 0; i < 3; i++) {
                this.normals.push(normal);
            }
        }
    }

    private CalculateNormal(vertex1: Vec3, vertex2: Vec3, vertex3: Vec3): Vec3 {
        const vector1 = ML.sub3(vertex2, vertex1);
        const vector2 = ML.sub3(vertex3, vertex1);
        let normal = ML.normalize3(ML.cross3(vector1, vector2));
      
        //opposite sides have the same normal, so we need to inverse the wrong ones
        const mid = ML.add3(ML.add3(vertex1, vertex2), vertex3);
        const dotProduct = ML.dot3(normal, mid);
        if (dotProduct < 0) {
            normal = ML.negate3(normal);
        }
      
        return normal;
    }
}
import { Vec3, ML, Vec4, Vec2 } from './MathLib';
import { Mesh } from './Mesh';
import { Parameters } from './Parameters';
import { Vertex } from './Vertex';

export class House extends Mesh {

    static wallTextureCoord: Vec2 = [0.5, 0];
    static roofTextureCoord: Vec2 = [0, 0.75];
    static doorTextureCoord: Vec2 = [0, 0];
    static windowTextureCoord: Vec2 = [0, 0.25];

    objMiddle: Vec3 = [0, 0, 0];

    constructor(positions: Vec3[]) {
        super(positions);
    }

    protected Build(positions: Vec3[]) {
        const bottomCorners = positions;
        const topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + Parameters.wallHeight, v[2]]);
        this.objMiddle = this.GetMiddlePoint(bottomCorners.concat(topCorners));

        this.BuildWalls(bottomCorners, topCorners);
        this.BuildRoof(topCorners);  
    }

    private BuildWalls(bottomCorners: Vec3[], topCorners: Vec3[]) {
        let bottomMiddle: Vec3 = [0, 0, 0];
        for (let i = 0; i < bottomCorners.length; i++) {
            bottomMiddle = ML.add3(bottomMiddle, bottomCorners[i]);
        }
        bottomMiddle = [bottomMiddle[0] / bottomCorners.length, bottomMiddle[1] / bottomCorners.length, bottomMiddle[2] / bottomCorners.length];

        for (let i = 0; i < 4; i++) {
            const positions: Vec3[] = [];
            positions.push(bottomCorners[i % 4]);
            positions.push(bottomCorners[(i + 1) % 4]);
            positions.push(topCorners[(i + 1) % 4]);
            positions.push(topCorners[i % 4]);

            const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

            if (i == 0) {
                this.BuildRectangle(positions, normal, House.doorTextureCoord);
            } else if (i == 1) {
                this.BuildRectangle(positions, normal, House.windowTextureCoord);
            } else {
                this.BuildRectangle(positions, normal, House.wallTextureCoord);
            }
        }
    }

    private BuildRoof(topCorners: Vec3[]) {
        let topMiddle: Vec3 = [0, 0, 0];
        for (let i = 0; i < topCorners.length; i++) {
            topMiddle = ML.add3(topMiddle, topCorners[i]);
        }
        topMiddle = [topMiddle[0] / topCorners.length, topMiddle[1] / topCorners.length, topMiddle[2] / topCorners.length];

        const eavesCorners: Vec3[] = []; 
        for (let i = 0; i < 4; i++) {
            let offset: Vec3 = ML.normalize3(ML.sub3(topCorners[i], topMiddle));
            offset = [offset[0] * Parameters.eavesWidth, offset[1], offset[2] * Parameters.eavesWidth]
            eavesCorners.push(ML.add3(topCorners[i], offset));
        }

        let sideLength1 = ML.getLength3(ML.sub3(eavesCorners[0], eavesCorners[1]));
        let sideLength2 = ML.getLength3(ML.sub3(eavesCorners[1], eavesCorners[2]));
        if (sideLength1 != sideLength2) {

            let shorterSideLength = 0;
            let indexOffset = 0;
            if (sideLength1 < sideLength2) {
                shorterSideLength = sideLength1;
                indexOffset = 0
            } else {
                shorterSideLength = sideLength2;
                indexOffset = 1;
            }
            
            let rooftops: Vec3[] = [];
            for (let i = 0; i <= 2; i += 2) {
                let sideMiddle = ML.add3(eavesCorners[(i + indexOffset + 1) % 4], ML.setLength3(ML.sub3(eavesCorners[(i + indexOffset) % 4], eavesCorners[(i + indexOffset + 1) % 4]), shorterSideLength / 2));
                let rooftopOffset = ML.add3(sideMiddle, ML.setLength3(ML.sub3(topMiddle, sideMiddle), shorterSideLength / 2));
                let rooftop: Vec3 = [rooftopOffset[0], rooftopOffset[1] + Parameters.roofHeight, rooftopOffset[2]];
                rooftops.push(rooftop);

                const positions: Vec3[] = [];
                positions.push(eavesCorners[(i + indexOffset) % 4]);
                positions.push(eavesCorners[(i + indexOffset + 1) % 4]);
                positions.push(rooftop);

                const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

                this.BuildTriangle(positions, normal, House.roofTextureCoord);
            }

            let positions: Vec3[] = [];
            positions.push(eavesCorners[(1 + indexOffset) % 4]);
            positions.push(eavesCorners[(2 + indexOffset) % 4]);
            positions.push(rooftops[1]);
            positions.push(rooftops[0]);

            let normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

            this.BuildTrapezoid(positions, normal, House.roofTextureCoord);

            positions = [];
            positions.push(eavesCorners[(3 + indexOffset) % 4]);
            positions.push(eavesCorners[(0 + indexOffset) % 4]);
            positions.push(rooftops[0]);
            positions.push(rooftops[1]);

            normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

            this.BuildTrapezoid(positions, normal, House.roofTextureCoord);

        } else { //sideLength1 == sideLength2

            let rooftopHeight = Math.tan(Parameters.roofAngle * (Math.PI / 180)) * (ML.getLength3(ML.sub3(eavesCorners[0], topMiddle)));
            let rooftop: Vec3 = [topMiddle[0], topMiddle[1] + rooftopHeight, topMiddle[2]];
    
            for (let i = 0; i < 4; i++) {
                const positions: Vec3[] = [];
                positions.push(eavesCorners[i % 4]);
                positions.push(eavesCorners[(i + 1) % 4]);
                positions.push(rooftop);
    
                const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);
    
                this.BuildTriangle(positions, normal, House.roofTextureCoord);
            }
        }
    }
}
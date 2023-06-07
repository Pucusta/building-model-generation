import { vec2 } from 'gl-matrix';
import { Vec3, ML, Vec4, Vec2 } from './MathLib';
import { Mesh } from './Mesh';
import { Parameters } from './Parameters';
import { Vertex } from './Vertex';

export class House extends Mesh {

    static roofTextureCoord: Vec2 = [0, 0.75];
    static doorTextureCoord: Vec2 = [0, 0];
    static windowTextureCoord: Vec2 = [0, 0.25];
    static balconyTextureCoord: Vec2 = [0, 0.5];

    objMiddle: Vec3 = [0, 0, 0];

    constructor(positions: Vec3[], numOfFloors: number) {
        super();
        this.Build(positions, numOfFloors);
    }

    private Build(positions: Vec3[], numOfFloors: number = 1) {
        let bottomCorners = positions;
        let topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + Parameters.wallHeight, v[2]]);
        this.objMiddle = this.GetMiddlePoint(positions.concat(topCorners));
        this.BuildGroundFloor(bottomCorners, topCorners);

        for (let i = 1; i < numOfFloors; i++) { 
            bottomCorners = topCorners;
            topCorners = bottomCorners.map(v => [v[0], v[1] + Parameters.wallHeight, v[2]]);
            this.objMiddle = this.GetMiddlePoint(positions.concat(topCorners));
            this.BuildUpperFloor(bottomCorners, topCorners);
        }

        this.BuildRoof(topCorners);  
    }

    private BuildGroundFloor(bottomCorners: Vec3[], topCorners: Vec3[]) {
        let numOfCorners = bottomCorners.length;

        for (let i = 0; i < numOfCorners; i++) {
            const positions: Vec3[] = [];
            positions.push(bottomCorners[i % numOfCorners]);
            positions.push(bottomCorners[(i + 1) % numOfCorners]);
            positions.push(topCorners[(i + 1) % numOfCorners]);
            positions.push(topCorners[i % numOfCorners]);

            const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

            if (i == 0) {
                this.BuildRectangle(positions, normal, House.doorTextureCoord);
            } else {
                this.BuildRectangle(positions, normal, House.windowTextureCoord);
            }
        }
    }

    private BuildUpperFloor(bottomCorners: Vec3[], topCorners: Vec3[]) {
        let numOfCorners = bottomCorners.length;

        for (let i = 0; i < numOfCorners; i++) {
            const positions: Vec3[] = [];
            positions.push(bottomCorners[i % numOfCorners]);
            positions.push(bottomCorners[(i + 1) % numOfCorners]);
            positions.push(topCorners[(i + 1) % numOfCorners]);
            positions.push(topCorners[i % numOfCorners]);

            const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

            this.BuildRectangle(positions, normal, House.balconyTextureCoord);
        }
    }

    private BuildRoof(topCorners: Vec3[]) {
        let numOfCorners = topCorners.length;
        let topMiddle = this.GetMiddlePoint(topCorners);

        const eavesCorners: Vec3[] = []; 
        for (let i = 0; i < numOfCorners; i++) {
            let offset: Vec3 = ML.normalize3(ML.sub3(topCorners[i], topMiddle));
            offset = [offset[0] * Parameters.eavesWidth, offset[1], offset[2] * Parameters.eavesWidth]
            eavesCorners.push(ML.add3(topCorners[i], offset));
        }

        if (numOfCorners == 4) {

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

        } else {

            let rooftop: Vec3 = [topMiddle[0], topMiddle[1] + Parameters.roofHeight, topMiddle[2]];

            for (let i = 0; i < numOfCorners; i++) {
                const positions: Vec3[] = [];
                    positions.push(eavesCorners[i % numOfCorners]);
                    positions.push(eavesCorners[(i + 1) % numOfCorners]);
                    positions.push(rooftop);
    
                    const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);
    
                    this.BuildTriangle(positions, normal, House.roofTextureCoord);
            }
        }
    }
}
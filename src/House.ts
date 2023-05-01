import { Vec3, ML, Vec4 } from './MathLib';
import { Mesh } from './Mesh';
import { Vertex } from './Vertex';

export class House extends Mesh {

    static wallColor: Vec4 = [0.8, 0.8, 0.8, 1.0];
    static roofColor: Vec4 = [0.74, 0.38, 0.31, 1.0];
    static doorColor: Vec4 = [0.44, 0.29, 0.14, 1.0];
    static windowColor: Vec4 = [0.3, 0.4, 0.8, 1.0];

    constructor(positions: Vec3[]) {
        super(positions);
    }

    protected Build(positions: Vec3[]) {
        const bottomCorners = positions;
        const topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + Parameters.wallHeight, v[2]]);
        const objMiddle = this.GetMiddlePoint(bottomCorners.concat(topCorners));

        let bottomMiddle: Vec3 = [0, 0, 0];
        for (let i = 0; i < bottomCorners.length; i++) {
            bottomMiddle = ML.add3(bottomMiddle, bottomCorners[i]);
        }
        bottomMiddle = [bottomMiddle[0] / bottomCorners.length, bottomMiddle[1] / bottomCorners.length, bottomMiddle[2] / bottomCorners.length];

        let topMiddle: Vec3 = [0, 0, 0];
        for (let i = 0; i < topCorners.length; i++) {
            topMiddle = ML.add3(topMiddle, topCorners[i]);
        }
        topMiddle = [topMiddle[0] / topCorners.length, topMiddle[1] / topCorners.length, topMiddle[2] / topCorners.length];

        let rooftop: Vec3 = [topMiddle[0], topMiddle[1] + Parameters.roofHeight, topMiddle[2]];

        const eavesCorners: Vec3[] = []; 
        for (let i = 0; i < 4; i++) {
            let offset: Vec3 = ML.normalize3(ML.sub3(topCorners[i], topMiddle));
            offset = [offset[0] * Parameters.eavesWidth, offset[1], offset[2] * Parameters.eavesWidth]
            eavesCorners.push(ML.add3(topCorners[i], offset));
        }

        //sides
        for (let i = 0; i < 4; i++) {

            const positions: Vec3[] = [];
            positions.push(bottomCorners[i % 4]);
            positions.push(bottomCorners[(i + 1) % 4]);
            positions.push(topCorners[(i + 1) % 4]);
            positions.push(topCorners[i % 4]);

            const normal = this.CalculateNormal(positions[0], positions[1], positions[2], objMiddle);

            if (i == 1) {
                this.BuildWallWithDoor(positions, normal);
            } else if (i == 0) {
                this.BuildWallWithWindow(positions, normal);
            } else {
                this.BuildRectangle(positions, normal, House.wallColor);
            }
        }

        //roof
        for (let i = 0; i < 4; i++) {

            const positions: Vec3[] = [];
            positions.push(eavesCorners[i % 4]);
            positions.push(eavesCorners[(i + 1) % 4]);
            positions.push(rooftop);

            const normal = this.CalculateNormal(positions[0], positions[1], positions[2], objMiddle);

            this.BuildTriangle(positions, normal, House.roofColor);
        }
    }

    private BuildWallWithDoor(positions: Vec3[], wallNormal: Vec3) {

        const doorPositions: Vec3[] = [];

        const wallWidth = ML.getLength3(ML.sub3(positions[0], positions[1]));
        if (wallWidth > Parameters.doorWidth + Parameters.doorOffset && Parameters.wallHeight > Parameters.doorHeight) {

            let offsetDirection = ML.setLength3(ML.sub3(positions[1], positions[0]), Parameters.doorOffset);
            doorPositions.push(ML.add3(positions[0], offsetDirection));

            let widthDirection = ML.setLength3(offsetDirection, Parameters.doorWidth);
            doorPositions.push(ML.add3(doorPositions[0], widthDirection));

            let heightDirection = ML.setLength3(ML.sub3(positions[2], positions[1]), Parameters.doorHeight);
            doorPositions.push(ML.add3(doorPositions[1], heightDirection));

            widthDirection = ML.negate3(widthDirection);
            doorPositions.push(ML.add3(doorPositions[2], widthDirection));

            let depthDirection = ML.setLength3(ML.negate3(wallNormal), Parameters.doorDepth);
            for (let i = 0; i < 4; i++) {
                doorPositions.push(ML.add3(doorPositions[i], depthDirection));
            }

            let leftProj = ML.projection3(ML.sub3(positions[3], positions[0]), ML.sub3(doorPositions[3], positions[0]));
            let leftProjPoint = ML.add3(positions[0], leftProj);
            let rightProj = ML.projection3(ML.sub3(positions[2], positions[1]), ML.sub3(doorPositions[2], positions[1]));
            let rightProjPoint = ML.add3(positions[1], rightProj);

            const doorMiddle = this.GetMiddlePoint(doorPositions);

            //wall outside
            let rectPositions = [positions[0], doorPositions[0], doorPositions[3], leftProjPoint];
            let normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [doorPositions[1], positions[1], rightProjPoint, doorPositions[2]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [leftProjPoint, rightProjPoint, positions[2], positions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            //wall inside
            rectPositions = [doorPositions[0], doorPositions[1], doorPositions[5], doorPositions[4]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [doorPositions[1], doorPositions[5], doorPositions[6], doorPositions[2]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);
            
            rectPositions = [doorPositions[3], doorPositions[2], doorPositions[6], doorPositions[7]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [doorPositions[0], doorPositions[4], doorPositions[7], doorPositions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            //door
            rectPositions = [doorPositions[4], doorPositions[5], doorPositions[6], doorPositions[7]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.doorColor);
        }
    }

    private BuildWallWithWindow(positions: Vec3[], wallNormal: Vec3) {

        const windowPositions: Vec3[] = [];

        const wallWidth = ML.getLength3(ML.sub3(positions[0], positions[1]));
        if (wallWidth > Parameters.windowWidth + Parameters.windowSideOffset && Parameters.wallHeight > Parameters.windowHeight + Parameters.windowBottomOffset) {
            
            let sideOffsetDirection = ML.setLength3(ML.sub3(positions[1], positions[0]), Parameters.windowSideOffset);
            let bottomOffsetDirection = ML.setLength3(ML.sub3(positions[3], positions[0]), Parameters.windowBottomOffset);
            let offsetDirection = ML.add3(sideOffsetDirection, bottomOffsetDirection);
            windowPositions.push(ML.add3(positions[0], offsetDirection));

            let widthDirection = ML.setLength3(ML.sub3(positions[1], positions[0]), Parameters.windowWidth);
            windowPositions.push(ML.add3(windowPositions[0], widthDirection));

            let heightDirection = ML.setLength3(ML.sub3(positions[2], positions[1]), Parameters.windowHeight);
            windowPositions.push(ML.add3(windowPositions[1], heightDirection));

            widthDirection = ML.negate3(widthDirection);
            windowPositions.push(ML.add3(windowPositions[2], widthDirection));

            let depthDirection = ML.setLength3(ML.negate3(wallNormal), Parameters.windowDepth);
            for (let i = 0; i < 4; i++) {
                windowPositions.push(ML.add3(windowPositions[i], depthDirection));
            }

            let leftTopProj = ML.projection3(ML.sub3(positions[3], positions[0]), ML.sub3(windowPositions[3], positions[0]));
            let leftTopProjPoint = ML.add3(positions[0], leftTopProj);
            let leftBottomProj = ML.projection3(ML.sub3(positions[3], positions[0]), ML.sub3(windowPositions[0], positions[0]));
            let leftBottomProjPoint = ML.add3(positions[0], leftBottomProj);
            let rightTopProj = ML.projection3(ML.sub3(positions[2], positions[1]), ML.sub3(windowPositions[2], positions[1]));
            let rightTopProjPoint = ML.add3(positions[1], rightTopProj);
            let rightBottomProj = ML.projection3(ML.sub3(positions[2], positions[1]), ML.sub3(windowPositions[1], positions[1]));
            let rightBottomProjPoint = ML.add3(positions[1], rightBottomProj);

            const windowMiddle = this.GetMiddlePoint(windowPositions);

            //wall outside
            let rectPositions = [positions[0], positions[1], rightBottomProjPoint, leftBottomProjPoint];
            let normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [leftBottomProjPoint, windowPositions[0], windowPositions[3], leftTopProjPoint];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [windowPositions[1], rightBottomProjPoint, rightTopProjPoint, windowPositions[2]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [leftTopProjPoint, rightTopProjPoint, positions[2], positions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            //wall inside
            rectPositions = [windowPositions[0], windowPositions[1], windowPositions[5], windowPositions[4]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [windowPositions[1], windowPositions[5], windowPositions[6], windowPositions[2]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);
            
            rectPositions = [windowPositions[3], windowPositions[2], windowPositions[6], windowPositions[7]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [windowPositions[0], windowPositions[4], windowPositions[7], windowPositions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            //window
            rectPositions = [windowPositions[4], windowPositions[5], windowPositions[6], windowPositions[7]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.windowColor);
        }
    }
}

class Parameters {

    static wallHeight = 1.5;

    static roofHeight = 1;

    static eavesWidth = 0.2;

    static doorWidth = 0.5;
    static doorHeight = 1;
    static doorOffset = 0.2;
    static doorDepth = 0.1;

    static windowWidth = 0.8;
    static windowHeight = 0.6;
    static windowSideOffset = 0.4;
    static windowBottomOffset = 0.4;
    static windowDepth = 0.1;
}
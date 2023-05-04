import { Vec3, ML, Vec4 } from './MathLib';
import { Mesh } from './Mesh';
import { Vertex } from './Vertex';

export class House extends Mesh {

    static wallColor: Vec4 = [0.8, 0.8, 0.8, 1.0];
    static roofColor: Vec4 = [0.74, 0.38, 0.31, 1.0];
    static doorColor: Vec4 = [0.44, 0.29, 0.14, 1.0];
    static windowColor: Vec4 = [0.3, 0.4, 0.8, 1.0];

    objMiddle: Vec3 = [0, 0, 0];

    constructor(positions: Vec3[]) {
        super(positions);
    }

    protected Build(positions: Vec3[]) {
        const bottomCorners = positions;
        const topCorners: Vec3[] = bottomCorners.map(v => [v[0], v[1] + Parameters.wallHeight, v[2]]);
        this.objMiddle = this.GetMiddlePoint(bottomCorners.concat(topCorners));

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

            const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

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

            const normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);

            this.BuildTriangle(positions, normal, House.roofColor);
        }
    }

    private BuildWallWithDoor(positions: Vec3[], wallNormal: Vec3) {

        const doorOutsidePositions: Vec3[] = [];

        const wallWidth = ML.getLength3(ML.sub3(positions[0], positions[1]));
        if (wallWidth > Parameters.doorWidth + Parameters.doorOffset && Parameters.wallHeight > Parameters.doorHeight) {

            let offsetDirection = ML.setLength3(ML.sub3(positions[1], positions[0]), Parameters.doorOffset);
            doorOutsidePositions.push(ML.add3(positions[0], offsetDirection));

            let widthDirection = ML.setLength3(offsetDirection, Parameters.doorWidth);
            doorOutsidePositions.push(ML.add3(doorOutsidePositions[0], widthDirection));

            let heightDirection = ML.setLength3(ML.sub3(positions[2], positions[1]), Parameters.doorHeight);
            doorOutsidePositions.push(ML.add3(doorOutsidePositions[1], heightDirection));

            widthDirection = ML.negate3(widthDirection);
            doorOutsidePositions.push(ML.add3(doorOutsidePositions[2], widthDirection));

            let depthDirection = ML.setLength3(ML.negate3(wallNormal), Parameters.doorDepth);
            const doorInsidePositions: Vec3[] = [];
            for (let i = 0; i < 4; i++) {
                doorInsidePositions.push(ML.add3(doorOutsidePositions[i], depthDirection));
            }

            const doorMiddle = this.GetMiddlePoint(doorOutsidePositions);

            //wall outside
            let normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);
            this.BuildRectangleWithCutOutRectangle(positions, doorOutsidePositions, normal, House.wallColor);

            //wall inside
            let rectPositions = [doorOutsidePositions[0], doorOutsidePositions[1], doorInsidePositions[1], doorInsidePositions[0]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [doorOutsidePositions[1], doorInsidePositions[1], doorInsidePositions[2], doorOutsidePositions[2]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);
            
            rectPositions = [doorOutsidePositions[3], doorOutsidePositions[2], doorInsidePositions[2], doorInsidePositions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [doorOutsidePositions[0], doorInsidePositions[0], doorInsidePositions[3], doorOutsidePositions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            //door
            rectPositions = [doorInsidePositions[0], doorInsidePositions[1], doorInsidePositions[2], doorInsidePositions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], doorMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.doorColor);
        }
    }

    private BuildWallWithWindow(positions: Vec3[], wallNormal: Vec3) {

        const windowOutsidePositions: Vec3[] = [];

        const wallWidth = ML.getLength3(ML.sub3(positions[0], positions[1]));
        if (wallWidth > Parameters.windowWidth + Parameters.windowSideOffset && Parameters.wallHeight > Parameters.windowHeight + Parameters.windowBottomOffset) {
            
            let sideOffsetDirection = ML.setLength3(ML.sub3(positions[1], positions[0]), Parameters.windowSideOffset);
            let bottomOffsetDirection = ML.setLength3(ML.sub3(positions[3], positions[0]), Parameters.windowBottomOffset);
            let offsetDirection = ML.add3(sideOffsetDirection, bottomOffsetDirection);
            windowOutsidePositions.push(ML.add3(positions[0], offsetDirection));

            let widthDirection = ML.setLength3(ML.sub3(positions[1], positions[0]), Parameters.windowWidth);
            windowOutsidePositions.push(ML.add3(windowOutsidePositions[0], widthDirection));

            let heightDirection = ML.setLength3(ML.sub3(positions[2], positions[1]), Parameters.windowHeight);
            windowOutsidePositions.push(ML.add3(windowOutsidePositions[1], heightDirection));

            widthDirection = ML.negate3(widthDirection);
            windowOutsidePositions.push(ML.add3(windowOutsidePositions[2], widthDirection));

            let depthDirection = ML.setLength3(ML.negate3(wallNormal), Parameters.windowDepth);
            const windowsInsidePositions: Vec3[] = [];
            for (let i = 0; i < 4; i++) {
                windowsInsidePositions.push(ML.add3(windowOutsidePositions[i], depthDirection));
            }

            //wall outside
            let normal = this.CalculateNormal(positions[0], positions[1], positions[2], this.objMiddle);
            this.BuildRectangleWithCutOutRectangle(positions, windowOutsidePositions, normal, House.wallColor);

            //wall inside
            const windowMiddle = this.GetMiddlePoint(windowOutsidePositions);

            let rectPositions = [windowOutsidePositions[0], windowOutsidePositions[1], windowsInsidePositions[1], windowsInsidePositions[0]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [windowOutsidePositions[1], windowsInsidePositions[1], windowsInsidePositions[2], windowOutsidePositions[2]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);
            
            rectPositions = [windowOutsidePositions[3], windowOutsidePositions[2], windowsInsidePositions[2], windowsInsidePositions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            rectPositions = [windowOutsidePositions[0], windowsInsidePositions[0], windowsInsidePositions[3], windowOutsidePositions[3]];
            normal = this.CalculateNormal(rectPositions[0], rectPositions[1], rectPositions[2], windowMiddle, true);
            this.BuildRectangle(rectPositions, normal, House.wallColor);

            //window
            rectPositions = [windowsInsidePositions[0], windowsInsidePositions[1], windowsInsidePositions[2], windowsInsidePositions[3]];
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
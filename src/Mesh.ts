import { ML, Vec2, Vec3 } from "./MathLib";
import { Parameters } from "./Parameters";
import { Vertex } from "./Vertex";

export abstract class Mesh {

    vertices: Vertex[] = [];
    indices: number[] = [];

    constructor() {}

    protected BuildRectangle(positions: Vec3[], normal: Vec3, textureCoord: Vec2) {
        let length = ML.getLength3(ML.sub3(positions[0], positions[1]));
        let height = ML.getLength3(ML.sub3(positions[1], positions[2]));

        length = Math.round(length / Parameters.wallHeight) * Parameters.textureRatio;
        height = Math.round(height / Parameters.wallHeight) * Parameters.textureRatio;

        const v1 = new Vertex(positions[0], normal, [textureCoord[0], textureCoord[1]]);
        const v2 = new Vertex(positions[1], normal, [textureCoord[0] + length, textureCoord[1]]);
        const v3 = new Vertex(positions[2], normal, [textureCoord[0] + length, textureCoord[1] + height - 0.002]);
        const v4 = new Vertex(positions[3], normal, [textureCoord[0], textureCoord[1] + height - 0.002]);

        const i1 = this.vertices.push(v1) - 1;
        const i2 = this.vertices.push(v2) - 1;
        const i3 = this.vertices.push(v3) - 1;
        const i4 = this.vertices.push(v4) - 1;

        this.indices.push(i1);
        this.indices.push(i2);
        this.indices.push(i3);
        this.indices.push(i3);
        this.indices.push(i4);
        this.indices.push(i1);
    }

    protected BuildTrapezoid(positions: Vec3[], normal: Vec3, textureCoord: Vec2) {
        let leftSideVec = ML.sub3(positions[3], positions[0]);
        let rightSideVec = ML.sub3(positions[2], positions[1]);
        let leftSideLength = ML.getLength3(leftSideVec);
        let rightSideLength = ML.getLength3(rightSideVec);
        let leftAngle = ML.getAngle3(leftSideVec, ML.sub3(positions[1], positions[0]));
        let rightAngle = ML.getAngle3(rightSideVec, ML.sub3(positions[0], positions[1]));
        let leftOffsetLength = Math.cos(leftAngle) * leftSideLength;
        let rightOffsetLength = Math.cos(rightAngle) * rightSideLength;
        let length = ML.getLength3(ML.sub3(positions[0], positions[1]));
        let height = Math.sin(leftAngle) * leftSideLength;

        let textureLength = length / height * Parameters.textureRatio;
        let textureLeftOffsetLength = leftOffsetLength / height * Parameters.textureRatio;
        let textureRightOffsetLength = rightOffsetLength / height * Parameters.textureRatio;
        //length = Math.round(length / Parameters.wallHeight) * Parameters.textureRatio;
        //height = Math.round(height / Parameters.wallHeight) * Parameters.textureRatio;
        
        const v1 = new Vertex(positions[0], normal, [textureCoord[0], textureCoord[1] + 0.002]);
        const v2 = new Vertex(positions[1], normal, [textureCoord[0] + textureLength, textureCoord[1]+ 0.002]);
        const v3 = new Vertex(positions[2], normal, [textureCoord[0] + textureLength - textureRightOffsetLength, textureCoord[1] + 0.25]);
        const v4 = new Vertex(positions[3], normal, [textureCoord[0] + textureLeftOffsetLength, textureCoord[1] + 0.25]);

        const i1 = this.vertices.push(v1) - 1;
        const i2 = this.vertices.push(v2) - 1;
        const i3 = this.vertices.push(v3) - 1;
        const i4 = this.vertices.push(v4) - 1;

        this.indices.push(i1);
        this.indices.push(i2);
        this.indices.push(i3);
        this.indices.push(i3);
        this.indices.push(i4);
        this.indices.push(i1);
    }

    protected BuildTriangle(positions: Vec3[], normal: Vec3, textureCoord: Vec2) {
        let leftSideVec = ML.sub3(positions[2], positions[0]);
        //let rightSideVec = ML.sub3(positions[2], positions[1]);
        let leftSideLength = ML.getLength3(leftSideVec);
        //let rightSideLength = ML.getLength3(rightSideVec);
        let leftAngle = ML.getAngle3(leftSideVec, ML.sub3(positions[1], positions[0]));
        let leftOffsetLength = Math.cos(leftAngle) * leftSideLength;
        let length = ML.getLength3(ML.sub3(positions[0], positions[1]));
        let height = Math.sin(leftAngle) * leftSideLength;

        let textureLength = length / height * Parameters.textureRatio;
        let textureLeftOffsetLength = leftOffsetLength / height * Parameters.textureRatio;
        //let textureLength = Math.round(length / Parameters.wallHeight) * Parameters.textureRatio;
        //let textureHeight = Math.round(height / Parameters.wallHeight) * Parameters.textureRatio;

        const v1 = new Vertex(positions[0], normal, [textureCoord[0], textureCoord[1] + 0.002]);
        const v2 = new Vertex(positions[1], normal, [textureCoord[0] + textureLength, textureCoord[1] + 0.002]);
        const v3 = new Vertex(positions[2], normal, [textureCoord[0] + textureLeftOffsetLength, textureCoord[1] + 0.25]);

        const i1 = this.vertices.push(v1) - 1;
        const i2 = this.vertices.push(v2) - 1;
        const i3 = this.vertices.push(v3) - 1;

        this.indices.push(i1);
        this.indices.push(i2);
        this.indices.push(i3);
    }

    protected BuildTrapezoidWithSections(positions: Vec3[], normal: Vec3, textureCoord: Vec2) {
        let leftSideVec = ML.sub3(positions[3], positions[0]);
        let rightSideVec = ML.sub3(positions[2], positions[1]);
        let leftSideLength = ML.getLength3(leftSideVec);
        let rightSideLength = ML.getLength3(rightSideVec);
        let leftAngle = ML.getAngle3(leftSideVec, ML.sub3(positions[1], positions[0]));
        let rightAngle = ML.getAngle3(rightSideVec, ML.sub3(positions[0], positions[1]));
        let leftOffsetLength = Math.cos(leftAngle) * leftSideLength;
        let rightOffsetLength = Math.cos(rightAngle) * rightSideLength;
        let length = ML.getLength3(ML.sub3(positions[0], positions[1]));
        let height = Math.sin(leftAngle) * leftSideLength;

        let numOfSections = Math.round(height / Parameters.wallHeight);

        for (let i = 0; i < numOfSections - 1; i++) {
            let trapezoidPositions: Vec3[] = [];
            trapezoidPositions.push(positions[0]);
            trapezoidPositions.push(positions[1]);

            let rightSideOffset = ML.setLength3(rightSideVec, rightSideLength / numOfSections);
            positions[1] = ML.add3(positions[1], rightSideOffset);
            trapezoidPositions.push(positions[1]);

            let leftSideOffset = ML.setLength3(leftSideVec, leftSideLength / numOfSections);
            positions[0] = ML.add3(positions[0], leftSideOffset);
            trapezoidPositions.push(positions[0]);

            this.BuildTrapezoidWithSections(trapezoidPositions, normal, textureCoord);
        }

        leftSideVec = ML.sub3(positions[3], positions[0]);
        rightSideVec = ML.sub3(positions[2], positions[1]);
        leftSideLength = ML.getLength3(leftSideVec);
        rightSideLength = ML.getLength3(rightSideVec);
        leftAngle = ML.getAngle3(leftSideVec, ML.sub3(positions[1], positions[0]));
        rightAngle = ML.getAngle3(rightSideVec, ML.sub3(positions[0], positions[1]));
        leftOffsetLength = Math.cos(leftAngle) * leftSideLength;
        rightOffsetLength = Math.cos(rightAngle) * rightSideLength;
        length = ML.getLength3(ML.sub3(positions[0], positions[1]));
        height = Math.sin(leftAngle) * leftSideLength;

        let lengthRatio = Math.round(length / Parameters.wallHeight) / (length / Parameters.wallHeight);
        leftOffsetLength = leftOffsetLength * lengthRatio / Parameters.wallHeight * Parameters.textureRatio;
        rightOffsetLength = rightOffsetLength * lengthRatio / Parameters.wallHeight * Parameters.textureRatio;
        length = Math.round(length / Parameters.wallHeight) * Parameters.textureRatio;
        height = Math.round(height / Parameters.wallHeight) * Parameters.textureRatio;
        
        const v1 = new Vertex(positions[0], normal, [textureCoord[0], textureCoord[1] + 0.002]);
        const v2 = new Vertex(positions[1], normal, [textureCoord[0] + length, textureCoord[1]+ 0.002]);
        const v3 = new Vertex(positions[2], normal, [textureCoord[0] + length - rightOffsetLength, textureCoord[1] + 0.25]);
        const v4 = new Vertex(positions[3], normal, [textureCoord[0] + leftOffsetLength, textureCoord[1] + 0.25]);

        const i1 = this.vertices.push(v1) - 1;
        const i2 = this.vertices.push(v2) - 1;
        const i3 = this.vertices.push(v3) - 1;
        const i4 = this.vertices.push(v4) - 1;

        this.indices.push(i1);
        this.indices.push(i2);
        this.indices.push(i3);
        this.indices.push(i3);
        this.indices.push(i4);
        this.indices.push(i1);
    }

    protected BuildTriangleWithSections(positions: Vec3[], normal: Vec3, textureCoord: Vec2) {
        let leftSideVec = ML.sub3(positions[2], positions[0]);
        let rightSideVec = ML.sub3(positions[2], positions[1]);
        let leftSideLength = ML.getLength3(leftSideVec);
        let rightSideLength = ML.getLength3(rightSideVec);
        let leftAngle = ML.getAngle3(leftSideVec, ML.sub3(positions[1], positions[0]));
        let leftOffsetLength = Math.cos(leftAngle) * leftSideLength;
        let length = ML.getLength3(ML.sub3(positions[0], positions[1]));
        let height = Math.sin(leftAngle) * leftSideLength;

        let numOfSections = Math.round(height / Parameters.wallHeight);

        for (let i = 0; i < numOfSections - 1; i++) {
            let trapezoidPositions: Vec3[] = [];
            trapezoidPositions.push(positions[0]);
            trapezoidPositions.push(positions[1]);

            let rightSideOffset = ML.setLength3(rightSideVec, rightSideLength / numOfSections);
            positions[1] = ML.add3(positions[1], rightSideOffset);
            trapezoidPositions.push(positions[1]);

            let leftSideOffset = ML.setLength3(leftSideVec, leftSideLength / numOfSections);
            positions[0] = ML.add3(positions[0], leftSideOffset);
            trapezoidPositions.push(positions[0]);

            this.BuildTrapezoidWithSections(trapezoidPositions, normal, textureCoord);
        }

        leftSideVec = ML.sub3(positions[2], positions[0]);
        rightSideVec = ML.sub3(positions[2], positions[1]);
        leftSideLength = ML.getLength3(leftSideVec);
        rightSideLength = ML.getLength3(rightSideVec);
        leftAngle = ML.getAngle3(leftSideVec, ML.sub3(positions[1], positions[0]));
        leftOffsetLength = Math.cos(leftAngle) * leftSideLength;
        length = ML.getLength3(ML.sub3(positions[0], positions[1]));
        height = Math.sin(leftAngle) * leftSideLength;

        let lengthRatio = Math.round(length / Parameters.wallHeight) / (length / Parameters.wallHeight);
        let textureLeftOffsetLength = leftOffsetLength * lengthRatio / Parameters.wallHeight * Parameters.textureRatio;
        let textureLength = Math.round(length / Parameters.wallHeight) * Parameters.textureRatio;
        //let textureHeight = numOfSections * Parameters.textureRatio;

        const v1 = new Vertex(positions[0], normal, [textureCoord[0], textureCoord[1] + 0.002]);
        const v2 = new Vertex(positions[1], normal, [textureCoord[0] + textureLength, textureCoord[1] + 0.002]);
        const v3 = new Vertex(positions[2], normal, [textureCoord[0] + textureLeftOffsetLength, textureCoord[1] + 0.25]);

        const i1 = this.vertices.push(v1) - 1;
        const i2 = this.vertices.push(v2) - 1;
        const i3 = this.vertices.push(v3) - 1;

        this.indices.push(i1);
        this.indices.push(i2);
        this.indices.push(i3);
    }

    protected CalculateNormal(vertex1: Vec3, vertex2: Vec3, vertex3: Vec3, objectMiddle: Vec3, inverse: boolean = false): Vec3 {
        const vector1 = ML.sub3(vertex2, vertex1);
        const vector2 = ML.sub3(vertex3, vertex1);
        let normal = ML.normalize3(ML.cross3(vector1, vector2));
      
        //opposite sides have the same normal, so we need to inverse the wrong ones
        const vertexSum = ML.add3(ML.add3(vertex1, vertex2), vertex3);
        const vertexMiddle = ML.setLength3(vertexSum, ML.getLength3(vertexSum) / 3);
        const dotProduct = ML.dot3(normal, ML.sub3(vertexMiddle, objectMiddle));
        if (!inverse) {
            if (dotProduct < 0) {
                normal = ML.negate3(normal);
            }
        } else {
            if (dotProduct > 0) {
                normal = ML.negate3(normal);
            }
        }

        return normal;
    }

    public GetVertexData(): number[] {
        const vertexData = [];
        for (let i = 0; i < this.vertices.length; i++) {

            const position = this.vertices[i].position;
            const normal = this.vertices[i].normal;
            const textCoord = this.vertices[i].textureCoord;

            vertexData.push(
                position[0],
                position[1],
                position[2],
                normal[0],
                normal[1],
                normal[2],
                textCoord[0],
                textCoord[1]
            );
        }

        return vertexData;
    }

    public GetMiddlePoint(positions: Vec3[]): Vec3 {
        const numOfPositions = positions.length;
        let middle: Vec3 = [0, 0, 0]

        for (let i = 0; i < numOfPositions; i++) {
            middle = ML.add3(middle, positions[i]);
        }

        middle = ML.setLength3(middle, ML.getLength3(middle) / numOfPositions);
        return middle;
    }
}
import { ML, Vec2, Vec3, Vec4 } from "./MathLib";
import { Vertex } from "./Vertex";

export abstract class Mesh {

    vertices: Vertex[] = [];
    indices: number[] = [];

    constructor(positions: Vec3[]) {
        this.Build(positions);
    }

    protected abstract Build(positions: Vec3[]): void;

    protected BuildRectangle(positions: Vec3[], normal: Vec3, textureCoord: Vec2) {
        const v1 = new Vertex(positions[0], normal, [textureCoord[0], textureCoord[1]]);
        const v2 = new Vertex(positions[1], normal, [textureCoord[0] + 0.25, textureCoord[1]]);
        const v3 = new Vertex(positions[2], normal, [textureCoord[0] + 0.25, textureCoord[1] + 0.25]);
        const v4 = new Vertex(positions[3], normal, [textureCoord[0], textureCoord[1] + 0.25]);

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
        const v1 = new Vertex(positions[0], normal, [textureCoord[0], textureCoord[1]]);
        const v2 = new Vertex(positions[1], normal, [textureCoord[0] + 0.25, textureCoord[1]]);
        const v3 = new Vertex(positions[2], normal, [textureCoord[0] + 0.125, textureCoord[1] + 0.25]);

        const i1 = this.vertices.push(v1) - 1;
        const i2 = this.vertices.push(v2) - 1;
        const i3 = this.vertices.push(v3) - 1;

        this.indices.push(i1);
        this.indices.push(i2);
        this.indices.push(i3);
    }

    /*
    protected BuildRectangleWithCutOutRectangle(rectPositions: Vec3[], cutoutRectPositions: Vec3[], normal: Vec3, textureCoord: Vec2) {
        const v1 = new Vertex(rectPositions[0], normal, textureCoord);
        const v2 = new Vertex(rectPositions[1], normal, textureCoord);
        const v3 = new Vertex(rectPositions[2], normal, textureCoord);
        const v4 = new Vertex(rectPositions[3], normal, textureCoord);
        const v5 = new Vertex(cutoutRectPositions[0], normal, textureCoord);
        const v6 = new Vertex(cutoutRectPositions[1], normal, textureCoord);
        const v7 = new Vertex(cutoutRectPositions[2], normal, textureCoord);
        const v8 = new Vertex(cutoutRectPositions[3], normal, textureCoord);

        const rectIndices: number[] = [];
        const cutoutIndices: number[] = [];

        rectIndices.push(this.vertices.push(v1) - 1);
        rectIndices.push(this.vertices.push(v2) - 1);
        rectIndices.push(this.vertices.push(v3) - 1);
        rectIndices.push(this.vertices.push(v4) - 1);
        cutoutIndices.push(this.vertices.push(v5) - 1);
        cutoutIndices.push(this.vertices.push(v6) - 1);
        cutoutIndices.push(this.vertices.push(v7) - 1);
        cutoutIndices.push(this.vertices.push(v8) - 1);

        for (let i = 0; i < 4; i++) {
            this.indices.push(rectIndices[i % 4]);
            this.indices.push(rectIndices[(i + 1) % 4]);
            this.indices.push(cutoutIndices[i % 4]);

            this.indices.push(cutoutIndices[i % 4]);
            this.indices.push(cutoutIndices[(i + 1) % 4]);
            this.indices.push(rectIndices[(i + 1) % 4]);
        }
    }
    */

    /*
    protected CalculateNormals() {
        for (let i = 0; i < this.indices.length - 2; i += 3) {
            let i1 = this.indices[i];
            let i2 = this.indices[i + 1];
            let i3 = this.indices[i + 2];
            let v1 = this.vertices[i1];
            let v2 = this.vertices[i2];
            let v3 = this.vertices[i3];
            let normal = this.CalculateNormal(v1.position, v2.position, v3.position);
            v1.normal = normal;
            v2.normal = normal;
            v3.normal = normal;
        }
    }
    */
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
            //const color = this.vertices[i].color;
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
                //color[0],
                //color[1],
                //color[2],
                //color[3]
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
        //middle = [middle[0] / numOfPositions, middle[1] / numOfPositions, middle[2] / numOfPositions];
        return middle;
    }
}
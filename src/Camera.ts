import { ML, Vec3 } from "./MathLib";

export class Camera {
  aspectRatio = 1;

  constructor(
    public position: Vec3,
    public target: Vec3,
    public up: Vec3,
    public fieldOfView = 1,
    public nearPlane = 1,
    public farPlane = 1000
  ) {}

  calcViewMatrix() {
    return ML.createLookAt4x4(this.position, this.target, this.up);
  }

  calcProjectionMatrix() {
    return ML.createPerspective4x4(
      this.fieldOfView,
      this.aspectRatio,
      this.nearPlane,
      this.farPlane
    );
  }

  calcViewProjectionMatrix() {
    return ML.mul4x4(this.calcProjectionMatrix(), this.calcViewMatrix());
  }
}

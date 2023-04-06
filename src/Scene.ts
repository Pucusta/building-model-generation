import { Camera } from "./Camera";
import { Engine } from "./Engine";
import { Material } from "./Material";
import { ML, Vec3 } from "./MathLib";
import { Mesh } from "./Mesh";

export class Scene {
  camera = new Camera([0, 1, 5], [0, 0, 0], [0, 1, 0]);
  objects: { mesh: Mesh; material: Material }[] = [];
  directionalLight: Vec3 = [1, 2, 1];
  rotationMatrix = ML.createRotationY4x4(45);

  constructor(public name: string, public readonly engine: Engine) {
    engine.setScene(this);
  }

  render() {
    let viewMatrix = this.camera.calcViewMatrix();
    let projectionMatrix = this.camera.calcProjectionMatrix();
    
    for (let obj of this.objects) {
      obj.material.setUniformMatrix("uModelViewMatrix", viewMatrix);
      obj.material.setUniformMatrix("uProjectionMatrix", projectionMatrix);
      obj.material.setUniformMatrix("uRotationMatrix", this.rotationMatrix);
      obj.material.setUniformVec3(
        "uLightDirection",
        this.directionalLight[0],
        this.directionalLight[1],
        this.directionalLight[2]
      );
    }
  }

  addObject(mesh: Mesh){
    this.objects.push({mesh, });
  }
}

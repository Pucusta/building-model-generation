import { Scene } from "./Scene";

export class Engine {
  readonly gl2: WebGL2RenderingContext;
  scene: Scene | undefined;

  constructor(public readonly canvas: HTMLCanvasElement) {
    let gl2 = canvas.getContext("webgl2");
    if (!gl2) {
      throw new Error(
        "Unable to initialize WebGL2. Your browser or machine may not support it."
      );
    } else {
      this.gl2 = gl2;
      const glslVersion = this.gl2!.getParameter(
        this.gl2.SHADING_LANGUAGE_VERSION
      );
      console.log(`GLSL ES version supported by the context: ${glslVersion}`);
    }

    this.gl2.enable(this.gl2.CULL_FACE);
    //this.gl2.enable(this.gl2.DEPTH_TEST);
    this.gl2.clearDepth(1);
    this.gl2.viewport(0, 0, canvas.width, canvas.height);

    window.addEventListener("resize", this.resize);
    this.resize();
  }

  // this function resizes our canvas in a way, that makes it fit the entire screen perfectly!
  private resize = () => {
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
  };

  private render() {
    this.gl2.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
    this.gl2.clear(this.gl2.COLOR_BUFFER_BIT | this.gl2.DEPTH_BUFFER_BIT); // Clear the color and depth buffers

    if (this.scene) {
      this.scene.render();
    }
  }

  public setScene(scene: Scene) {
    this.scene = scene;
  }
}

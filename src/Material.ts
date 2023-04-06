import { Scene } from "./Scene";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

export class Material {
  readonly program: WebGLProgram | null = null;
  readonly attributes: { [name: string]: number } = {};
  private readonly uniforms: {
    [name: string]: { location: WebGLUniformLocation; version: number };
  } = {};

  constructor(
    public readonly scene: Scene,
    uniformNames: string[],
    attributeNames: string[]
  ) {
    let gl = scene.engine.gl2;
    this.program = Material.link(gl);
    gl.useProgram(this.program);

    for (let u of uniformNames) {
      let x = gl.getUniformLocation(this.program, u);
      if (!x) throw new Error("Cannot find uniform in shader");
      this.uniforms[u] = { location: x, version: 0 };
    }

    for (let a of attributeNames) {
      let x = gl.getAttribLocation(this.program, a);
      if (x < 0) throw new Error("Cannot find attribute in shader");
      this.attributes[a] = x;
    }
  }

  private static link(gl: WebGL2RenderingContext) {
    const vertexShader = this.compile(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    )!;
    const fragmentShader = this.compile(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    )!;
    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      throw new Error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(shaderProgram)
      );
    return shaderProgram;
  }

  private static compile(
    gl: WebGL2RenderingContext,
    type: number,
    source: string
  ) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("An error occurred compiling the shaders: " + info);
    }
    return shader;
  }

  setUniformInt(name: string, x: number) {
    const engine = this.scene.engine;
    engine.gl2.uniform1i(this.uniforms[name].location, x);
  }

  setUniformFloat(name: string, x: number) {
    const engine = this.scene.engine;
    engine.gl2.uniform1f(this.uniforms[name].location, x);
  }

  setUniformMatrix(name: string, value: number[]) {
    const engine = this.scene.engine;
    engine.gl2.uniformMatrix4fv(this.uniforms[name].location, false, value);
  }

  setUniformVec3(name: string, x: number, y: number, z: number) {
    const engine = this.scene.engine;
    engine.gl2.uniform3f(this.uniforms[name].location, x, y, z);
  }

  setUniformVec4(name: string, x: number, y: number, z: number, w: number) {
    const engine = this.scene.engine;
    engine.gl2.uniform4f(this.uniforms[name].location, x, y, z, w);
  }

  setUniformVec2(name: string, x: number, y: number) {
    const engine = this.scene.engine;
    engine.gl2.uniform2f(this.uniforms[name].location, x, y);
  }

  setUniformArrayVec3(name: string, values: Float32Array, version = 0) {
    const engine = this.scene.engine;
    const uInfo = this.uniforms[name];
    engine.gl2.uniform3fv(uInfo.location, values);
    uInfo.version = version;
  }
}

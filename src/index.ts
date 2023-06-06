import { vec3, mat4, glMatrix } from "gl-matrix";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import { House } from "./House";
import { Vec3 } from "./MathLib";

glMatrix.setMatrixArrayType(Array);

const canvas: HTMLCanvasElement = document.createElement("canvas"); // creates a new canvas element ( <canvas></canvas> )
const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2"); // creates a WebGL2 context, using the canvas

function onResize() {
  // this function resizes our canvas in a way, that makes it fit the entire screen perfectly!
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;
}

window.onresize = onResize; // sets the window's resize function to be the exact function we use for resizing our canvas

function initWebGL2() {
  if (gl) {
    const glslVersion = gl!.getParameter(gl.SHADING_LANGUAGE_VERSION);
    console.log(`GLSL ES version supported by the context: ${glslVersion}`);
  } else {
    // if the gl DIDN'T create properly
    alert("This browser does not support WebGL 2."); // alert the user about it
    return; // go out of the function; stop this function
  }

  const style = canvas.style;

  style.position = "absolute";
  style.width = "100%";
  style.height = "100%";
  style.left = "0";
  style.top = "0";
  style.right = "0";
  style.bottom = "0";
  style.margin = "0";
  style.zIndex = "-1";

  document.body.appendChild(canvas); // appends/adds the canvas element to the document's body
  onResize(); // resizes the canvas (it needs to be done, because otherwise it will not resize until you resize your window)

  const corners: Vec3[] = [[-6, 0, -4], [6, 0, -4], [6, 0, 4], [-6, 0, 4]];
  const house = new House(corners, 3);
  const vertexData = house.GetVertexData();
  const indices = house.indices;
  console.log("num of vertices: " + house.vertices.length);

  const textureImage = new Image();
  textureImage.onload = () => {

    const texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
  };

  textureImage.onerror = () => {
    console.error("Failed to load the texture image.");
  };

  textureImage.src = "../textures/tileset-256x256.png";

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -50.0]);
  mat4.rotateX(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(30));
  mat4.rotateY(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(45));

  const projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    glMatrix.toRadian(45),
    canvas.width / canvas.height,
    0.1,
    200.0
  );

  const rotationAxis: vec3 = [0, 1, 0]; // rotate around the y-axis
  const rotationAngle = 0;
  const rotationMatrix = mat4.create();
  mat4.fromRotation(rotationMatrix, rotationAngle, rotationAxis);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const vertexShader: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader: WebGLShader | null = gl.createShader(gl.FRAGMENT_SHADER);
  const shaderProgram: WebGLProgram | null = gl.createProgram();

  if (shaderProgram && vertexShader && fragmentShader) {
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        `Error compiling vertex shader: ${gl.getShaderInfoLog(vertexShader)}`
      );
      return;
    }

    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        `Error compiling fragment shader: ${gl.getShaderInfoLog(
          fragmentShader
        )}`
      );
      return;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers

    const vertexPositionAttributeLocation = gl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    const vertexNormalAttributeLocation = gl.getAttribLocation(
      shaderProgram,
      "aVertexNormal"
    );
    const vertexTextureCoordAttributeLocation = gl.getAttribLocation(
      shaderProgram,
      "aTextureCoord"
    );

    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(vertexNormalAttributeLocation);
    gl.enableVertexAttribArray(vertexTextureCoordAttributeLocation);

    const vertexDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(
      vertexPositionAttributeLocation,
      3,
      gl.FLOAT,
      false,
      8 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(
      vertexNormalAttributeLocation,
      3,
      gl.FLOAT,
      false,
      8 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.vertexAttribPointer(
      vertexTextureCoordAttributeLocation,
      2,
      gl.FLOAT,
      false,
      8 * Float32Array.BYTES_PER_ELEMENT,
      6 * Float32Array.BYTES_PER_ELEMENT
    );

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    const modelViewUniformLocation = gl.getUniformLocation(
      shaderProgram,
      "uModelViewMatrix"
    );
    gl.uniformMatrix4fv(modelViewUniformLocation, false, modelViewMatrix);

    const projectionUniformLocation = gl.getUniformLocation(
      shaderProgram,
      "uProjectionMatrix"
    );
    gl.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix);

    const lightDirectionLocation = gl.getUniformLocation(
      shaderProgram,
      "uLightDirection"
    );
    const lightDirection = vec3.fromValues(1, 2, 1);
    vec3.normalize(lightDirection, lightDirection);
    gl.uniform3fv(lightDirectionLocation, lightDirection);

    const rotationUniformLocation = gl.getUniformLocation(
      shaderProgram,
      "uRotationMatrix"
    );

    const textureUniformLocation = gl.getUniformLocation(
      shaderProgram,
      "uTexture"
    );
    gl.uniform1i(textureUniformLocation, 0);

    const draw = () => {
      mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(0.1));
      gl.uniformMatrix4fv(rotationUniformLocation, false, rotationMatrix);

      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers
      gl.drawElements(gl.TRIANGLES, house.indices.length, gl.UNSIGNED_SHORT, 0);
      //gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);

      requestAnimationFrame(draw);
    };

    draw();
  }
}

initWebGL2(); // we call our init function, therefore initializing the application
import { vec3, mat4, glMatrix } from "gl-matrix";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

glMatrix.setMatrixArrayType(Array);

const canvas: HTMLCanvasElement = document.createElement("canvas"); // creates a new canvas element ( <canvas></canvas> )
const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2"); // creates a WebGL2 context, using the canvas

function onResize() {
  // this function resizes our canvas in a way, that makes it fit the entire screen perfectly!
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;
}

window.onresize = onResize; // sets the window's resize function to be the exact function we use for resizing our canvas

function calculateNormal(vertex1: vec3, vertex2: vec3, vertex3: vec3) {
  const vector1 = vec3.subtract(vec3.create(), vertex2, vertex1);
  const vector2 = vec3.subtract(vec3.create(), vertex3, vertex1);
  const normal = vec3.cross(vec3.create(), vector1, vector2);
  vec3.normalize(normal, normal);

  //opposite sides have the same normal, so we need to inverse the wrong ones
  const mid = vec3.add(
    vec3.create(),
    vec3.add(vec3.create(), vertex1, vertex2),
    vertex3
  );
  const dotProduct = vec3.dot(normal, mid);
  if (dotProduct < 0) {
    vec3.scale(normal, normal, -1);
  }

  return normal;
}

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

  // Define the vertices of the cube
  const vertices = [
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1,
    1, -1,
  ];

  // Define the indices of the cube
  const indices = [
    // Front face
    0, 1, 2, 2, 3, 0,
    // Back face
    4, 5, 6, 6, 7, 4,
    // Top face
    3, 2, 6, 6, 7, 3,
    // Bottom face
    0, 1, 5, 5, 4, 0,
    // Right face
    1, 2, 6, 6, 5, 1,
    // Left face
    0, 3, 7, 7, 4, 0,
  ];

  const vertexData = [];
  for (let i = 0; i < indices.length; i += 3) {
    const index1 = indices[i];
    const index2 = indices[i + 1];
    const index3 = indices[i + 2];

    const vertex1 = vec3.fromValues(
      vertices[index1 * 3],
      vertices[index1 * 3 + 1],
      vertices[index1 * 3 + 2]
    );
    const vertex2 = vec3.fromValues(
      vertices[index2 * 3],
      vertices[index2 * 3 + 1],
      vertices[index2 * 3 + 2]
    );
    const vertex3 = vec3.fromValues(
      vertices[index3 * 3],
      vertices[index3 * 3 + 1],
      vertices[index3 * 3 + 2]
    );

    const normal = calculateNormal(vertex1, vertex2, vertex3);

    vertexData.push(
      vertex1[0],
      vertex1[1],
      vertex1[2],
      normal[0],
      normal[1],
      normal[2]
    );
    vertexData.push(
      vertex2[0],
      vertex2[1],
      vertex2[2],
      normal[0],
      normal[1],
      normal[2]
    );
    vertexData.push(
      vertex3[0],
      vertex3[1],
      vertex3[2],
      normal[0],
      normal[1],
      normal[2]
    );
  }

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -10.0]);
  mat4.rotateX(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(30));
  mat4.rotateY(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(45));

  const projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    glMatrix.toRadian(45),
    canvas.width / canvas.height,
    0.1,
    100.0
  );

  const rotationAxis: vec3 = [0, 1, 0]; // rotate around the y-axis
  const rotationAngle = 0;
  const rotationMatrix = mat4.create();
  mat4.fromRotation(rotationMatrix, rotationAngle, rotationAxis);

  /*
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );
    */

  /*
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );
    */

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const vertexShader: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader: WebGLShader | null = gl.createShader(
    gl.FRAGMENT_SHADER
  );
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

    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(vertexNormalAttributeLocation);

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
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(
      vertexNormalAttributeLocation,
      3,
      gl.FLOAT,
      false,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
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

    const draw = () => {
      mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(0.1));
      gl.uniformMatrix4fv(rotationUniformLocation, false, rotationMatrix);

      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers
      //gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);

      requestAnimationFrame(draw);
    };

    draw();
  }
}

initWebGL2(); // we call our init function, therefore initializing the application

import { useRef, useEffect } from 'react';
import { vec3, mat4, glMatrix } from "gl-matrix";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import { GetBuildingContext } from './ContextProvider';

function WebGL() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  //Building to display
  const house = GetBuildingContext().building;
  const vertexData = house.GetVertexData();
  const indices = house.indices;
  console.log("num of vertices: " + house.vertices.length);

  useEffect(() => {
    //Getting canvas and its container
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Canvas element not found.')
      return
    }

    const container = canvas.parentElement;
    if (!container) {
      console.error('Canvas container not found.')
      return
    }
    
    //Getting WebGL context
    const gl = canvas.getContext('webgl2')

    //WebGl support check
    if (gl) {
      const glslVersion = gl!.getParameter(gl.SHADING_LANGUAGE_VERSION);
      console.log(`GLSL ES version supported by the context: ${glslVersion}`);
    } else {
      // if the gl DIDN'T create properly
      alert("This browser does not support WebGL 2."); // alert the user about it
      return; // go out of the function; stop this function
    }

    //Event listeners
    function resizeCanvas() {
      canvas!.width = container!.clientWidth;
      canvas!.height = container!.clientHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    
    window.addEventListener('resize', resizeCanvas);


    //Texture loading
    const textureImage = new Image();
    var texture: WebGLTexture | null;
    textureImage.onload = () => {

      texture = gl.createTexture();

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

    textureImage.src = "./tileset-256x256.png";

    //Transformation matrices
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -4.0, -100.0]);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(30));
    mat4.rotateY(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(45));

    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      glMatrix.toRadian(15),
      canvas.width / canvas.height,
      0.1,
      200.0
    );

    const rotationAxis: vec3 = [0, 1, 0]; // rotate around the y-axis
    const rotationAngle = 0;
    const rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, rotationAngle, rotationAxis);

    //Settings
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers

    //Create buffers
    const vertexDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.STATIC_DRAW
    );

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    //Create shaders
    const vertexShader: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader: WebGLShader | null = gl.createShader(gl.FRAGMENT_SHADER);
    const shaderProgram: WebGLProgram | null = gl.createProgram();

    if (!shaderProgram || !vertexShader || !fragmentShader) {
      console.error("Failed to create shader program");
      return;
    }

    gl.shaderSource(vertexShader!, vertexShaderSource);
    gl.compileShader(vertexShader!);

    if (!gl.getShaderParameter(vertexShader!, gl.COMPILE_STATUS)) {
      console.error(
        `Error compiling vertex shader: ${gl.getShaderInfoLog(vertexShader!)}`
      );
      return;
    }

    gl.shaderSource(fragmentShader!, fragmentShaderSource);
    gl.compileShader(fragmentShader!);

    if (!gl.getShaderParameter(fragmentShader!, gl.COMPILE_STATUS)) {
      console.error(
        `Error compiling fragment shader: ${gl.getShaderInfoLog(
          fragmentShader!
        )}`
      );
      return;
    }

    gl.attachShader(shaderProgram!, vertexShader!);
    gl.attachShader(shaderProgram!, fragmentShader!);
    gl.linkProgram(shaderProgram!);
    gl.useProgram(shaderProgram);

    const vertexPositionAttributeLocation = gl.getAttribLocation(
      shaderProgram!,
      "aVertexPosition"
    );
    const vertexNormalAttributeLocation = gl.getAttribLocation(
      shaderProgram!,
      "aVertexNormal"
    );
    const vertexTextureCoordAttributeLocation = gl.getAttribLocation(
      shaderProgram!,
      "aTextureCoord"
    );

    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(vertexNormalAttributeLocation);
    gl.enableVertexAttribArray(vertexTextureCoordAttributeLocation);

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

    const modelViewUniformLocation = gl.getUniformLocation(
      shaderProgram!,
      "uModelViewMatrix"
    );
    gl.uniformMatrix4fv(modelViewUniformLocation, false, modelViewMatrix);

    const projectionUniformLocation = gl.getUniformLocation(
      shaderProgram!,
      "uProjectionMatrix"
    );
    gl.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix);

    const lightDirectionLocation = gl.getUniformLocation(
      shaderProgram!,
      "uLightDirection"
    );
    const lightDirection = vec3.fromValues(1, 2, 1);
    vec3.normalize(lightDirection, lightDirection);
    gl.uniform3fv(lightDirectionLocation, lightDirection);

    const rotationUniformLocation = gl.getUniformLocation(
      shaderProgram!,
      "uRotationMatrix"
    );

    const textureUniformLocation = gl.getUniformLocation(
      shaderProgram!,
      "uTexture"
    );
    gl.uniform1i(textureUniformLocation, 0);
    
    //Animation
    let animationActive = true;
    let animationFrameId : number;

    const draw = () => {
      if (!animationActive) {
        return;
      }

      mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(0.1));
      gl.useProgram(shaderProgram);
      gl.uniformMatrix4fv(rotationUniformLocation, false, rotationMatrix);

      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers
      gl.drawElements(gl.TRIANGLES, house.indices.length, gl.UNSIGNED_SHORT, 0);

      animationFrameId = requestAnimationFrame(draw);
    };

    const stopAnimation = () => {
      animationActive = false;
    };
  
    const startAnimation = () => {
      animationActive = true;
      draw();
    };
    
    resizeCanvas();
    startAnimation();

    return () => {
      stopAnimation();
      cancelAnimationFrame(animationFrameId);

      gl.deleteBuffer(vertexDataBuffer);
      gl.deleteBuffer(indexBuffer);

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(shaderProgram);

      gl.deleteTexture(texture);
      
      window.removeEventListener('resize', resizeCanvas);
    }
  }, [house])

  return <canvas ref={canvasRef} />
}

export default WebGL

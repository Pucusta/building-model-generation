import { useRef, useEffect } from 'react';
import { Vec3 } from "./MathLib";
import { House } from "./House";
import { vec3, mat4, glMatrix } from "gl-matrix";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

function WebGL() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Canvas element not found.')
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

    //Building generation
    const corners: Vec3[] = [[-3, 0, -6], [3, 0, -6], [3, 0, 6], [-3, 0, 6]];
    const house = new House(corners, 2);
    const vertexData = house.GetVertexData();
    const indices = house.indices;
    console.log("num of vertices: " + house.vertices.length);

    //Texture loading
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

    textureImage.src = "/tileset-256x256.png";

    //Transformation matrices
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -40.0]);
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

    //Settings
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers

    //Shaders
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
        gl.useProgram(shaderProgram);
        gl.uniformMatrix4fv(rotationUniformLocation, false, rotationMatrix);
  
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers
        gl.drawElements(gl.TRIANGLES, house.indices.length, gl.UNSIGNED_SHORT, 0);
  
        requestAnimationFrame(draw);
      };

      function resizeCanvas() {
        canvas!.width = window.innerWidth;
        canvas!.height = window.innerHeight;
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
      }
      
      window.addEventListener('resize', resizeCanvas);
  
      resizeCanvas();
      draw();
    }

    return () => {
      // Cleanup, if needed
    }
  }, [])

  return <canvas ref={canvasRef} />
}

export default WebGL
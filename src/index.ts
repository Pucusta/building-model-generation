import { Engine } from "./Engine";
import { Material } from "./Material";
import { Scene } from "./Scene";

const canvas: HTMLCanvasElement = document.createElement("canvas");
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

document.body.appendChild(canvas);
const engine = new Engine(canvas);
const scene = new Scene("indexScene", engine);
const material = new Material(
  scene,
  [
    "uModelViewMatrix",
    "uProjectionMatrix",
    "uLightDirection",
    "uRotationMatrix",
  ],
  [
    "aVertexPosition",
    "aVertexNormal"
  ]
);

function initWebGL2() {



    
  

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

    /*
    const vertexDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.STATIC_DRAW
    );
    */
    
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );
    

    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
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

    const draw = () => {
      mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(0.1));
      gl.uniformMatrix4fv(rotationUniformLocation, false, rotationMatrix);


      //gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);

      requestAnimationFrame(draw);
    };

    draw();
  }
}

initWebGL2(); // we call our init function, therefore initializing the application

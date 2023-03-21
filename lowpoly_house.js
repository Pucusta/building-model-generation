import { mat4, glMatrix } from './node_modules/gl-matrix/esm/index.js';

let canvas = null; // we'll keep it as a global object
let gl = null; // it will store our context, and all the functions and constants that are needed to use it

function onResize() { // this function resizes our canvas in a way, that makes it fit the entire screen perfectly!
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
}

window.onresize = onResize; // sets the window's resize function to be the exact function we use for resizing our canvas

function initWebGL2() {
    canvas = document.createElement("canvas"); // creates a new canvas element ( <canvas></canvas> )
    gl = canvas.getContext("webgl2"); // creates a WebGL2 context, using the canvas
    if (!gl) { // if the gl DIDN'T create properly
        alert("This browser does not support WebGL 2."); // alert the user about it
        return; // go out of the function; stop this function
    }
    canvas.style = "position: absolute; width: 100%; height: 100%; left: 0; top: 0; right: 0; bottom: 0; margin: 0; z-index: -1;"; // we add a simple style to our canvas
    document.body.appendChild(canvas); // appends/adds the canvas element to the document's body
    onResize(); // resizes the canvas (it needs to be done, because otherwise it will not resize until you resize your window)

    // Define the vertices of the cube
    const vertices = [
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
    ];

    // Define the indices of the cube
    const indices = [
        // Front face
        0, 1, 2,
        2, 3, 0,
        // Back face
        4, 5, 6,
        6, 7, 4,
        // Top face
        3, 2, 6,
        6, 7, 3,
        // Bottom face
        0, 1, 5,
        5, 4, 0,
        // Right face
        1, 2, 6,
        6, 5, 1,
        // Left face
        0, 3, 7,
        7, 4, 0,
    ];

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

    const projectionMatrix = mat4.create();
    mat4.perspective(
        projectionMatrix,
        glMatrix.toRadian(45),
        canvas.width / canvas.height,
        0.1,
        100.0
    );

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(30));
    mat4.rotateY(modelViewMatrix, modelViewMatrix, glMatrix.toRadian(45));

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Load the GLSL files using the fetch API
    fetch('shaders/vertex.glsl')
        .then(response => response.text())
        .then(vertexShaderSource => {
            fetch('shaders/fragment.glsl')
                .then(response => response.text())
                .then(fragmentShaderSource => {

                    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(vertexShader, vertexShaderSource);
                    gl.compileShader(vertexShader);
                    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                        console.error(`Error compiling vertex shader: ${gl.getShaderInfoLog(vertexShader)}`);
                        return;
                    }

                    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(fragmentShader, fragmentShaderSource);
                    gl.compileShader(fragmentShader);
                    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                        console.error(`Error compiling fragment shader: ${gl.getShaderInfoLog(fragmentShader)}`);
                        return;
                    }

                    const shaderProgram = gl.createProgram();
                    gl.attachShader(shaderProgram, vertexShader);
                    gl.attachShader(shaderProgram, fragmentShader);
                    gl.linkProgram(shaderProgram);
                    gl.useProgram(shaderProgram);

                    gl.enable(gl.DEPTH_TEST);
                    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the clear color to black
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffers

                    const vertexAttributeLocation = gl.getAttribLocation(
                        shaderProgram,
                        "aVertexPosition"
                    );
                    gl.enableVertexAttribArray(vertexAttributeLocation);
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.vertexAttribPointer(vertexAttributeLocation, 3, gl.FLOAT, false, 0, 0);

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

                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

                });
        });
}

initWebGL2(); // we call our init function, therefore initializing the application
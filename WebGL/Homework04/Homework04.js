import { resizeAspectRatio, setupText, updateText, Axes } from '../util/util.js';
import { Shader, readShaderFile } from '../util/shader.js';

let isInitialized = false;
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;
let vao;
let vao2;
let vao3;
let axes;
let finalTransform;
let rotationAngle = 0;
let currentTransformType = null;
let isAnimating = false;
let lastTime = 0;
let textOverlay; 

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) {
        console.log("Already initialized");
        return;
    }

    main().then(success => {
        if (!success) {
            console.log('프로그램을 종료합니다.');
            return;
        }
        isInitialized = true;
        requestAnimationFrame(animate);
    }).catch(error => {
        console.error('프로그램 실행 중 오류 발생:', error);
    });
});

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;
    resizeAspectRatio(gl, canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.3, 0.4, 1.0);
    
    return true;
}

function setupBuffers() {
    const cubeVertices = new Float32Array([
        -0.5,  0.5,  // 좌상단
        -0.5, -0.5,  // 좌하단
         0.5, -0.5,  // 우하단
         0.5,  0.5   // 우상단
    ]);

    const indices = new Uint16Array([
        0, 1, 2,    // 첫 번째 삼각형
        0, 2, 3     // 두 번째 삼각형
    ]);

    const cubeColors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,  // 빨간색
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0
    ]);

    const cubeCyan = new Float32Array([
        0.0, 1.0, 1.0, 1.0,  // CYAN
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0
    ]);

    const cubeYellow = new Float32Array([
        1.0, 1.0, 0.0, 1.0,  // Yellow
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    ]);

    //해
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // VBO for position
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    // VBO for color
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

    // EBO
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


    //지구
    vao2 = gl.createVertexArray();
    gl.bindVertexArray(vao2);

    // VBO for position
    const positionBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    // VBO for color
    const colorBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, cubeCyan, gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

    // EBO
    const indexBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    
    //달
    vao3 = gl.createVertexArray();
    gl.bindVertexArray(vao3);

    // VBO for position
    const positionBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    // VBO for color
    const colorBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, cubeYellow, gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

    // EBO
    const indexBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
}

function getTransformMatrices() {
    const S1 = mat4.create();
    const R1 = mat4.create();

    const S2 = mat4.create();
    const R2 = mat4.create();
    const T2 = mat4.create();
    const R3 = mat4.create();

    const S3 = mat4.create();
    const R4 = mat4.create();
    const T3 = mat4.create();
    const R5 = mat4.create();
    const T4 = mat4.create();
    const R6 = mat4.create();
    
    mat4.scale(S1, S1, [0.2, 0.2, 1]);
    mat4.rotate(R1, R1, rotationAngle / 4, [0, 0, 1]);

    mat4.scale(S2, S2, [0.1, 0.1, 1]);
    mat4.rotate(R2, R2, rotationAngle, [0, 0, 1]);
    mat4.translate(T2, T2, [0.7, 0.0, 0]);
    mat4.rotate(R3, R3, rotationAngle / 6, [0, 0, 1]);

    mat4.scale(S3, S3, [0.05, 0.05, 1]);
    mat4.rotate(R4, R4, rotationAngle, [0, 0, 1]);
    mat4.translate(T3, T3, [0.2, 0.0, 0]);
    mat4.rotate(R5, R5, rotationAngle * 2, [0, 0, 1]);
    mat4.translate(T4, T4, [0.7, 0.0, 0]);
    mat4.rotate(R6, R6, rotationAngle / 6, [0, 0, 1]);
    
    return { S1, R1, S2, R2, T2, R3, S3, R4, T3, R5, T4, R6 };
}

function applyTransform(type) {
    finalTransform = mat4.create();
    const { S1, R1, S2, R2, T2, R3, S3, R4, T3, R5, T4, R6 } = getTransformMatrices();
    
    const transformOrder = {
        'SR' : [S1, R1],
        'SRTR': [S2, R2, T2, R3],
        'SRTRTR' : [S3, R4, T3, R5, T4, R6]
    };

    /*
      type은 'TRS', 'TSR', 'RTS', 'RST', 'STR', 'SRT' 중 하나
      array.forEach(...) : 각 type의 element T or R or S 에 대해 반복
    */
    if (transformOrder[type]) {
        transformOrder[type].forEach(matrix => {
            mat4.multiply(finalTransform, matrix, finalTransform);
        });
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw axes
    axes.draw(mat4.create(), mat4.create()); 

    // draw cube
    shader.use();

    //해
    currentTransformType = 'SR';
    applyTransform(currentTransformType)

    shader.setMat4("u_transform", finalTransform);

    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    //지구
    currentTransformType = 'SRTR';
    applyTransform(currentTransformType)

    shader.setMat4("u_transform", finalTransform);

    gl.bindVertexArray(vao2);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    //달
    currentTransformType = 'SRTRTR';
    applyTransform(currentTransformType)

    shader.setMat4("u_transform", finalTransform);

    gl.bindVertexArray(vao3);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function animate(currentTime) {

    if (!lastTime) lastTime = currentTime; // if lastTime == 0
    // deltaTime: 이전 frame에서부터의 elapsed time (in seconds)
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (currentTransformType) {
        // 2초당 1회전, 즉, 1초당 180도 회전
        rotationAngle += Math.PI * deltaTime;
    }
    render();

    requestAnimationFrame(animate);
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

async function main() {
    try {
        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
        }

        finalTransform = mat4.create();
        
        await initShader();

        setupBuffers();
        axes = new Axes(gl, 0.8); 

        return true;
    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}

/*-------------------------------------------------------------------------
06_FlipTriangle.js

1) Change the color of the triangle by keyboard input
   : 'r' for red, 'g' for green, 'b' for blue
2) Flip the triangle vertically by keyboard input 'f' 
---------------------------------------------------------------------------*/
import { resizeAspectRatio, setupText, updateText } from '../util/util.js';
import { Shader, readShaderFile } from '../util/shader.js';

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;
let vao;

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 600;
    canvas.height = 600;

    resizeAspectRatio(gl, canvas);

    // Initialize WebGL settings
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    return true;
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    return new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

let x = 0.00;
let y = 0.00;
let letme_go = false;
let keys = null;

function setupKeyboardEvents() {

    document.addEventListener('keydown', (event) => {
        letme_go = true;
        keys = event.key;
    });

    document.addEventListener('keyup', (event) => {
        letme_go = false;
        keys = null;
    });
}

function f5_pos() {
    if (letme_go == true && keys === 'ArrowUp' && y + 0.1 < 1){
        y = y + 0.01;
        console.log(x, y);
    } else if (letme_go == true && keys === 'ArrowDown' && y - 0.1 > -1){
        y = y - 0.01;
        console.log(x, y);
    } else if (letme_go == true && keys === 'ArrowRight' && x + 0.1 < 1){
        x = x + 0.01;
        console.log(x, y);
    } else if (letme_go == true && keys === 'ArrowLeft' && x - 0.1 > -1){
        x = x - 0.01;
        console.log(x, y);
    }
}

function setupBuffers(shader) {
    const vertices = new Float32Array([
        -0.1, -0.1, 0.0,
        -0.1,  0.1, 0.0,
         0.1,  0.1, 0.0,
         0.1, -0.1, 0.0
    ]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    shader.setAttribPointer('aPos', 3, gl.FLOAT, false, 0, 0);

    return vao;
}

function render(vao, shader) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    //f5_pos();

    let color = [1.0, 0.0, 0.0, 1.0];
    shader.setVec4("uColor", color);
    shader.setFloat("x", x);
    shader.setFloat("y", y);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    requestAnimationFrame(() => render(vao, shader));
}

async function main() {
    try {

        // WebGL 초기화
        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
        }

        // 셰이더 초기화
        shader = await initShader();

        // setup text overlay (see util.js)
        setupText(canvas, "Use arrow keys to move the rectangle", 1);
        
        // 키보드 이벤트 설정
        setupKeyboardEvents();
        
        // 나머지 초기화
        vao = setupBuffers(shader);
        shader.use();

        setInterval(() => {
            f5_pos();
        }, 50);
        
        // 렌더링 시작
        render(vao, shader);

        return true;

    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}

// call main function
main().then(success => {
    if (!success) {
        console.log('프로그램을 종료합니다.');
        return;
    }
}).catch(error => {
    console.error('프로그램 실행 중 오류 발생:', error);
});
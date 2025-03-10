// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element 
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context
gl.enable(gl.SCISSOR_TEST);

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// Set canvas size: 현재 window 전체를 canvas로 사용
canvas.width = 500;
canvas.height = 500;
let halfwidth = canvas.width / 2;
let halfheight = canvas.height / 2;
gl.viewport(0, 0, canvas.width, canvas.height);

// Initialize WebGL settings: viewport and clear color

// Start rendering
render();

// Render loop
function render() {
    gl.viewport(halfwidth, halfheight, halfwidth, halfheight);
    gl.scissor(halfwidth, halfheight, halfwidth, halfheight);
    gl.clearColor(0, 0.6, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, halfheight, halfwidth, halfheight);
    gl.scissor(0, halfheight, halfwidth, halfheight);
    gl.clearColor(1, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(halfwidth, 0, halfwidth, halfheight);
    gl.scissor(halfwidth, 0, halfwidth, halfheight);
    gl.clearColor(1, 1, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, halfwidth, halfheight);
    gl.scissor(0, 0, halfwidth, halfheight);
    gl.clearColor(0, 0.4, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw something here
}

// Resize viewport when window size changes
window.addEventListener('resize', () => {
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.height, canvas.height);

    halfwidth = canvas.width / 2;
    halfheight = canvas.height / 2;

    render();
});


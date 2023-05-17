// Create canvas for wavefunction collapse

const collapse_container = document.getElementById('collapse_container');
var canvas = document.createElement("canvas");
collapse_container.appendChild(canvas);

collapse_width = 60;
collapse_height = 60;
canvas.style.width = String(collapse_width) + "%";
canvas.style.height = String(collapse_height) + "%";
canvas.style.position = "absolute";
canvas.style.top = "50%";
canvas.style.left = "50%";
canvas.style.transform = "translate(-50%, -50%)";

var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Maintain proper heights and weights
const window_height = document.getElementById('height_field');
const window_width = document.getElementById('width_field');
          
window_height.addEventListener('input', (event) => {
    height = event.target.value
    if (height !== '') {
        if (height < 4) {
            event.target.value = 4;
        } else if (height > 10) {
            event.target.value = 10;
        }
        collapse_height = event.target.value * 10;
        canvas.style.height = String(collapse_height) + "%";
    }
});

window_height.addEventListener('focus', (event) => {
    window_height.placeholder = '';
    if (event.target.value === '') {
        event.target.value = collapse_height / 10;
    }
});

window_width.addEventListener('input', (event) => {
    width = event.target.value
    if (width !== '') {
        if (width < 4) {
            event.target.value = 4;
        } else if (width > 10) {
            event.target.value = 10;
        }
        collapse_width = event.target.value * 10;
        canvas.style.width = String(collapse_width) + "%";
    }
});

window_width.addEventListener('focus', (event) => {
    window_width.placeholder = '';
    if (event.target.value === '') {
        event.target.value = collapse_width / 10;
    }
});


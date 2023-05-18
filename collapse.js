//
//  Wave Function Collapse Visualization
//  Author: Quinn Booth
//

//#region HTML Setup

// Create canvas for wavefunction collapse

const collapse_container = document.getElementById('collapse_container');
var canvas = document.createElement("canvas");
collapse_container.appendChild(canvas);

var maxHeight = Math.floor(collapse_container.clientHeight / 100);
var maxWidth = Math.floor(collapse_container.clientWidth / 100);
collapse_width = Math.floor(maxWidth * 0.75);
collapse_height = Math.floor(maxHeight * 0.75);
canvas.width = String(collapse_width * 100);
canvas.height = String(collapse_height * 100);

var ctx = canvas.getContext("2d");
draw_gridlines();

// Maintain proper heights and weights

const window_height = document.getElementById('height_field');
const window_width = document.getElementById('width_field');
          
window_height.addEventListener('input', (event) => {
    height = event.target.value
    if (height !== '') {
        if (height < 2) {
            event.target.value = 2;
        } else if (height > maxHeight) {
            event.target.value = maxHeight;
        }
        collapse_height = event.target.value;
        canvas.height = String(collapse_height * 100);
    }
    draw_gridlines();
});

window_width.addEventListener('input', (event) => {
    width = event.target.value
    if (width !== '') {
        if (width < 2) {
            event.target.value = 2;
        } else if (width > maxWidth) {
            event.target.value = maxWidth;
        }
        collapse_width = event.target.value;
        canvas.width = String(collapse_width * 100);
    }
    draw_gridlines();
});

window_height.addEventListener('focus', (event) => {
    window_height.placeholder = '';
    if (event.target.value === '') {
        event.target.value = collapse_height;
    }
    draw_gridlines();
});

window_width.addEventListener('focus', (event) => {
    window_width.placeholder = '';
    if (event.target.value === '') {
        event.target.value = collapse_width;
    }
    draw_gridlines();
});

// Resize canvas when window is resized

var abort_generation = false;

window.addEventListener('resize', function() {
    maxHeight = Math.floor(collapse_container.clientHeight / 100);
    maxWidth = Math.floor(collapse_container.clientWidth / 100);
    if (collapse_height > maxHeight) {
        collapse_height = maxHeight;
        window_height.value = collapse_height;
        canvas.height = String(collapse_height * 100);
    }
    if (collapse_width > maxWidth) {
        collapse_width = maxWidth;
        window_width.value = collapse_width;
        canvas.width = String(collapse_width * 100);
    }
    draw_gridlines()
});

//#endregion

function draw_gridlines() {

    ctx.fillStyle = "#442b9e";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black";
    
    const cellDim = 100;
    const fillDim = cellDim - 2;
    x_cells = collapse_width;
    y_cells = collapse_height;

    for (let i = 0; i < x_cells; i++) {
        for (let j = 0; j < y_cells; j++) {
            ctx.fillRect(i * 100 + 1, j * 100 + 1, fillDim, fillDim);
        }
    }

    ctx.fillStyle = "#E7DFDD";
}

function generate() {
    
}
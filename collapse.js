//
//  Wave Function Collapse Visualization
//  Author: Quinn Booth
//

var cells = [];
var images = [];
var rotated_images = [];
var matrix = [];
var image_set = "circuit";
var generate_ready = true;
var cellSize = 50;

const image_count = {
    basic: 6,
    circuit: 12,
    roots: 12,
    octo: 8,
    blob: 7
}

class Cell {
    constructor(image, colors) {
        this.image = image;
        this.colors = colors;
        this.top = [];
        this.right = [];
        this.bottom = [];
        this.left = [];
    }
}

class Box {

    constructor(total_cells, x, y) {
        this.done = false;
        this.x = x;
        this.y = y;
        this.possibilities = [];
        for (let i = 0; i < total_cells; i++) {
            this.possibilities.push(i);
        }
    }

    // set done(val) {
    //     this._done = val;
    //     if (this._done) {
    //         // Pick a random possibility
    //         let randIndex = Math.floor(Math.random() * this.possibilities.length);
    //         this.possibilities = [this.possibilities[randIndex]];
    //     }
    // }

    // get done() {
    //     return this._done;
    // }
}

//#region HTML Setup

// Create canvas for wavefunction collapse

const collapse_container = document.getElementById('collapse_container');
var canvas = document.createElement("canvas");
collapse_container.appendChild(canvas);

var heightCap = 10;
var widthCap = 12;
var maxHeight = Math.min(Math.floor(collapse_container.clientHeight / 50), heightCap);
var maxWidth = Math.min(Math.floor(collapse_container.clientWidth / 50), widthCap);
collapse_width = Math.min(maxWidth, widthCap);
collapse_height = Math.min(maxHeight, heightCap);
canvas.width = String(collapse_width * 50);
canvas.height = String(collapse_height * 50);

var generate_button = document.getElementById("generate_button");

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
        canvas.height = String(collapse_height * 50);
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
        canvas.width = String(collapse_width * 50);
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

// Resize canvas and image selector when window is resized

window.addEventListener('resize', function() {
    maxHeight = Math.min(Math.floor(collapse_container.clientHeight / 50), heightCap);
    maxWidth = Math.min(Math.floor(collapse_container.clientWidth / 50), widthCap);
    if (collapse_height > maxHeight) {
        collapse_height = maxHeight;
        window_height.value = collapse_height;
        canvas.height = String(collapse_height * 50);
    }
    if (collapse_width > maxWidth) {
        collapse_width = maxWidth;
        window_width.value = collapse_width;
        canvas.width = String(collapse_width * 50);
    }
    draw_gridlines()
});

const left_panel = document.getElementById('left_panel');
const image_selector = document.getElementById('image_selector');

window.addEventListener('resize', function() {
    if (window.innerWidth <= 1035) {
        image_selector.style.top = "200px";
        image_selector.style.height = (left_panel.offsetHeight - 200) + 'px';
    } else {
        image_selector.style.top = "150px";
        image_selector.style.height = (left_panel.offsetHeight - 150) + 'px';
    }
});

// Swap between slow and fast generation modes

var generation_mode = "slow";
const instant_button = document.getElementById('instant_button');
instant_button.addEventListener('click', function() {
    instant_button.classList.toggle('button-active');
    if (instant_button.classList.contains('button-active')) {
        heightCap = 14;
        widthCap = 16;
        instant_button.style.backgroundColor = "#A239CA";
        instant_button.style.borderTop = "5px solid #E7DFDD";
        instant_button.style.borderLeft = "5px solid #E7DFDD";
        instant_button.style.color = "white";
        instant_button.textContent = "FAST";
        generation_mode = "fast";
    } else {
        heightCap = 10;
        widthCap = 12;
        instant_button.style.backgroundColor = "#E7DFDD";
        instant_button.style.borderTop = "5px solid #A239CA";
        instant_button.style.borderLeft = "5px solid #A239CA";
        instant_button.style.color = "black";
        instant_button.textContent = "SLOW";
        generation_mode = "slow";
    }
    window.dispatchEvent(new Event('resize'));
});

// Make image set previews clickable so user can select one

const basic_selector = document.getElementById('basic_selector');
const circuit_selector = document.getElementById('circuit_selector');
const roots_selector = document.getElementById('roots_selector');
const octo_selector = document.getElementById('octo_selector');
const blob_selector = document.getElementById('blob_selector');
var selectors = [basic_selector, circuit_selector, roots_selector, octo_selector, blob_selector];

function setSelection(button) {
    for (let i = 0; i < selectors.length; i++) {
        if (selectors[i] == button) {
            image_set = selectors[i].innerText.toLowerCase();
            console.log("Chose image set: " + image_set);
            load_new_images();
        }
    }
}

for (let i = 0; i < selectors.length; i++) {
    selectors[i].addEventListener('click', function() {
        setSelection(selectors[i])
    });
}

//#endregion

//#region Loading Images

function draw_gridlines() {

    ctx.fillStyle = "#442b9e";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black";
    
    const cellDim = 50;
    const fillDim = cellDim - 2;
    let x_cells = collapse_width;
    let y_cells = collapse_height;

    for (let i = 0; i < x_cells; i++) {
        for (let j = 0; j < y_cells; j++) {
            ctx.fillRect(i * cellDim + 1, j * cellDim + 1, fillDim, fillDim);
        }
    }

    ctx.fillStyle = "#E7DFDD";
}

function load_images(image_set) {

    // console.log("Loading image set.");

    generate_ready = false;
    generate_button.textContent = "LOADING...";
    draw_gridlines();
    images = [];
    const folder = `images/${image_set}`;
    var loaded = 0;
  
    function imageLoaded() {
      loaded++;
      if (loaded === image_count[image_set]) {
        generate_ready = true;
      }
    }
  
    for (let i = 0; i < image_count[image_set]; i++) {
      var image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = imageLoaded;
      image.src = `${folder}/${image_set}${i}.png`;
      images.push(image);
    }

}

function get_rgb(image, callback) {

    // Setup a blank testing canvas to read image data
    let test_canvas = document.createElement("canvas");
    test_canvas.width = 50;
    test_canvas.height = 50;
    let test_ctx = test_canvas.getContext("2d", { willReadFrequently: true });
    test_ctx.drawImage(image, 0, 0, 50, 50);

    // Make sure image loads before testing for RGB values
    setTimeout(() => {

        const rgb_top1 = test_ctx.getImageData(12, 0, 1, 1).data;
        const rgb_top2 = test_ctx.getImageData(25, 0, 1, 1).data;
        const rgb_top3 = test_ctx.getImageData(37, 0, 1, 1).data;

        const rgb_right1 = test_ctx.getImageData(49, 12, 1, 1).data;
        const rgb_right2 = test_ctx.getImageData(49, 25, 1, 1).data;
        const rgb_right3 = test_ctx.getImageData(49, 37, 1, 1).data;

        const rgb_bottom1 = test_ctx.getImageData(12, 49, 1, 1).data;
        const rgb_bottom2 = test_ctx.getImageData(25, 49, 1, 1).data;
        const rgb_bottom3 = test_ctx.getImageData(37, 49, 1, 1).data;

        const rgb_left1 = test_ctx.getImageData(0, 12, 1, 1).data;
        const rgb_left2 = test_ctx.getImageData(0, 25, 1, 1).data;
        const rgb_left3 = test_ctx.getImageData(0, 37, 1, 1).data;
      
        let rgb_top = rgb_top1.slice(0, 3).join('') + rgb_top2.slice(0, 3).join('') + rgb_top3.slice(0, 3).join('');
        let rgb_right = rgb_right1.slice(0, 3).join('') + rgb_right2.slice(0, 3).join('') + rgb_right3.slice(0, 3).join('');
        let rgb_bottom = rgb_bottom1.slice(0, 3).join('') + rgb_bottom2.slice(0, 3).join('') + rgb_bottom3.slice(0, 3).join('');
        let rgb_left = rgb_left1.slice(0, 3).join('') + rgb_left2.slice(0, 3).join('') + rgb_left3.slice(0, 3).join('');

        callback(image, [rgb_top, rgb_right, rgb_bottom, rgb_left]);

    }, 10);

}

function get_rotations(images, callback) {

    // Wait until images are loaded
    if (!generate_ready) {
        window.setTimeout(get_rotations, 100, images/*, callback*/);
        return;
    }

    // console.log("Rotating images.");

    rotated = false;
    generate_ready = false;
    rotated_images = [];

    function addRotation(count, rot) {
        rotated_images.push(rot);

        // Load cells once all images have been rotated
        /*if (count >= images.length - 1) {
            setTimeout(() => {
                callback();
            }, 10);
        }*/
    }

    for (let i = 0; i < images.length; i++) {

        let image = images[i];

        // 0 degree rotation
        let canvas0 = document.createElement("canvas");
        canvas0.width = 50; canvas0.height = 50;
        let ctx0 = canvas0.getContext("2d", { willReadFrequently: true });
        ctx0.drawImage(image, 0, 0, 50, 50);

        // 90 degree rotation
        let canvas90 = document.createElement("canvas");
        canvas90.width = 50; canvas90.height = 50;
        let ctx90 = canvas90.getContext("2d", { willReadFrequently: true });
        ctx90.rotate(90 * Math.PI / 180);
        ctx90.drawImage(image, 0, -image.height, image.width, image.height);

        // 180 degree rotation
        let canvas180 = document.createElement("canvas");
        canvas180.width = 50; canvas180.height = 50;
        let ctx180 = canvas180.getContext("2d", { willReadFrequently: true });
        ctx180.rotate(180 * Math.PI / 180);
        ctx180.drawImage(image, -image.width, -image.height, image.width, image.height);

        // 270 degree rotation
        let canvas270 = document.createElement("canvas");
        canvas270.width = 50; canvas270.height = 50;
        let ctx270 = canvas270.getContext("2d", { willReadFrequently: true });
        ctx270.rotate(270 * Math.PI / 180);
        ctx270.drawImage(image, -image.width, 0, image.width, image.height);

        // Make sure images load before testing differences
        setTimeout(() => {

            let rgb0 = ctx0.getImageData(0, 0, canvas0.width, canvas0.height).data;
            let rgb90 = ctx90.getImageData(0, 0, canvas90.width, canvas90.height).data;
            let rgb180 = ctx180.getImageData(0, 0, canvas180.width, canvas180.height).data;
            let rgb270 = ctx270.getImageData(0, 0, canvas270.width, canvas270.height).data;

            let unique_rotations = [1, 0, 0, 0];

            // Check if anything is equivalent to initial orientation
            for (let j = 0; j < rgb0.length; j++) {
                if (rgb0[j] != rgb90[j]) {
                    unique_rotations[1] = 2;
                }
                if (rgb0[j] != rgb180[j]) {
                    unique_rotations[2] = 2;
                }
                if (rgb0[j] != rgb270[j]) {
                    unique_rotations[3] = 2;
                }
            }

            // Check if anything is equivalent to 90 degree rotation if necessary
            if (unique_rotations[1] >= 2) {
                for (let j = 0; j < rgb90.length; j++) {
                    if (rgb90[j] != rgb180[j] && unique_rotations[2] >= 2) {
                        unique_rotations[2] = 3;
                    }
                    if (rgb90[j] != rgb270[j] && unique_rotations[3] >= 2) {
                        unique_rotations[3] = 3;
                    }
                }
            } else {
                if (unique_rotations[2] >= 2) {
                    unique_rotations[2] = 3;
                }
                if (unique_rotations[3] >= 2) {
                    unique_rotations[3] = 3;
                }
            }

            // Check if anything is equivalent to 180 degree rotation if necessary
            if (unique_rotations[2] >= 3) {
                for (let j = 0; j < rgb180.length; j++) {
                    if (rgb180[j] != rgb270[j] && unique_rotations[3] >= 3) {
                        unique_rotations[3] = 4;
                    }
                }
            } else {
                if (unique_rotations[3] >= 3) {
                    unique_rotations[3] = 4;
                }
            }

            // Push relevant images to list
            let rgb_list = [canvas0, canvas90, canvas180, canvas270];
            for (let j = 0; j < 4; j++) {
                if (unique_rotations[j] == j + 1) {
                    const rotated_image = new Image();
                    rotated_image.crossOrigin = "Anonymous";
                    rotated_image.onload = addRotation(i, rotated_image);
                    rotated_image.src = rgb_list[j].toDataURL();
                }
            }

        }, 10);
    }
}

function load_cells(callback) {

    // console.log("Loading images into cells.")
    cells = [];

    for (let i = 0; i < rotated_images.length; i++) {
        get_rgb(rotated_images[i], function (image, rgb) {
            let cell = new Cell(image, rgb);
            cells.push(cell);
        });   
    }

    callback();

}

function determine_constraints() {

    let bad_cells = [];

    // Determine which cells match which in every direction as constraints
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            if (cells[i].colors[0] == cells[j].colors[2]) {
                cells[i].top.push(j);
            }
            if (cells[i].colors[1] == cells[j].colors[3]) {
                cells[i].right.push(j);
            }
            if (cells[i].colors[2] == cells[j].colors[0]) {
                cells[i].bottom.push(j);
            }
            if (cells[i].colors[3] == cells[j].colors[1]) {
                cells[i].left.push(j);
            }
        }

        // Note if a cell has no neighbors on some side
        if (cells[i].top.length == 0 || cells[i].right.length == 0 || cells[i].bottom.length == 0 || cells[i].left.length == 0) {
            bad_cells.push(cells[i]);
        }
    }

    // Remove cells that have no neighbors on some side
    for (let i = 0; i < bad_cells.length; i++) {
        const badIndex = cells.indexOf(bad_cells[i]);
        if (badIndex > -1) {
            cells.splice(badIndex, 1);
        }
    }
}

function load_new_images() {
    load_images(image_set);

    // get_rotations(images, function () {
    //     load_cells(function () {
    //         setTimeout(() => {
    //             determine_constraints();
    //             generate_ready = true;
    //             generate_button.textContent = "GENERATE";
    //         }, 10);
    //     });
    // });

    get_rotations(images);
    setTimeout(() => {
        load_cells(function () {
            setTimeout(() => {
                determine_constraints();
                generate_ready = true;
                generate_button.textContent = "GENERATE";
            }, 100);
        });
    }, 1000);
}

//#endregion

//#region Perform Wave Function Collapse

function draw_current_state(matrix, mode) {

    if (mode == "fast") {

        draw_gridlines();

            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    let current_box = matrix[i][j];
                    if (current_box.done == true) {
                        ctx.drawImage(rotated_images[current_box.possibilities[0]], j * 50, i * 50, cellSize, cellSize);
                    }
                }
            }

    } else {

        return new Promise(resolve => {

            draw_gridlines();

            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    let current_box = matrix[i][j];
                    if (current_box.done == true) {
                        ctx.drawImage(rotated_images[current_box.possibilities[0]], j * 50, i * 50, cellSize, cellSize);
                    }
                }
            }

            setTimeout(() => {
                resolve();
            }, 10);
        });
    }
}

function solve_next_cell(matrix) {
    
    // Get boxes with minimum entropy (possibilities) -- ignore solved cells
    let lowestEntropy = 0;
    let lowEntropyCells = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let currentBox = matrix[i][j];
            let currentEntropy = currentBox.possibilities.length;
            if (!currentBox.done) {
                if (lowEntropyCells.length == 0 || currentEntropy == lowestEntropy) {
                    lowestEntropy = currentEntropy;
                    lowEntropyCells.push(currentBox);
                } else if (currentEntropy < lowestEntropy) {
                    lowestEntropy = currentEntropy;
                    lowEntropyCells = [currentBox];
                }
            }
        }
    }

    // Pick a box at random to solve from the low entropy list
    let randIndex = Math.floor(Math.random() * lowEntropyCells.length);
    lowEntropyCells[randIndex].done = true;
    return lowEntropyCells[randIndex];
    
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function recalculate_constraints(matrix, box) {

    const x = box.x;
    const y = box.y;
    const top_possibilities = (y-1 >= 0 && !matrix[y-1][x].done) ? matrix[y-1][x].possibilities : null;
    const right_possibilities = (x+1 < collapse_width && !matrix[y][x+1].done) ? matrix[y][x+1].possibilities : null;
    const bottom_possibilities = (y+1 < collapse_height && !matrix[y+1][x].done) ? matrix[y+1][x].possibilities : null;
    const left_possibilities = (x-1 >= 0 && !matrix[y][x-1].done) ? matrix[y][x-1].possibilities : null;
    shuffle(box.possibilities);

    for (let i = 0; i < box.possibilities.length; i++) {

        let constraints = cells[box.possibilities[i]];
        let side_scores = [];

        if (top_possibilities != null) {
            let top_score = top_possibilities.filter((element) => constraints.top.includes(element)).length;
            side_scores.push(top_score);
        }

        if (right_possibilities != null) {
            let right_score = right_possibilities.filter((element) => constraints.right.includes(element)).length;
            side_scores.push(right_score);
        }

        if (bottom_possibilities != null) {
            let bottom_score = bottom_possibilities.filter((element) => constraints.bottom.includes(element)).length;
            side_scores.push(bottom_score);
        }

        if (left_possibilities != null) {
            let left_score = left_possibilities.filter((element) => constraints.left.includes(element)).length;
            side_scores.push(left_score);
        }

        if (side_scores == []) {
            box.done = true;
            box.possibilities = [box.possibilities[i]];
            return;
        } else {

            if (side_scores.indexOf(0) == -1) {

                box.done = true;
                box.possibilities = [box.possibilities[i]];

                if (top_possibilities != null) {
                    matrix[y-1][x].possibilities = top_possibilities.filter((element) => constraints.top.includes(element));
                }
                
                if (right_possibilities != null) {
                    matrix[y][x+1].possibilities = right_possibilities.filter((element) => constraints.right.includes(element));
                }

                if (bottom_possibilities != null) {
                    matrix[y+1][x].possibilities = bottom_possibilities.filter((element) => constraints.bottom.includes(element));
                }

                if (left_possibilities != null) {
                    matrix[y][x-1].possibilities = left_possibilities.filter((element) => constraints.left.includes(element));
                }

                return;
            }
        }
    }

    // console.log("\nFAILED");
    // console.log("(x, y) : " + String(x) + ", " + String(y));

    return -1;

}

function test_rotated_images() {

    console.log(images);
    console.log(rotated_images);
    console.log(cells);

    let x = 0;
    let y = 0;

    for (let i = 0; i < rotated_images.length; i++) {
        ctx.drawImage(rotated_images[i], x, y, 50, 50);
        x += 50;
        if (x > canvas.width - 50) {
            x = 0;
            y += 50;
        }
    }

    y += 100;

    for (let i = 0; i < cells.length; i++) {
        ctx.drawImage(cells[i].image, x, y, 50, 50);
        x += 50;
        if (x > canvas.width - 50) {
            x = 0;
            y += 50;
        }
    }
}


function generate() {

    if (!generate_ready) return;
    // test_rotated_images();
    // return;

    // Create matrix to store state of wave function collapse
    matrix = [];
    for (let i = 0; i < collapse_height; i++) {
        matrix.push([]);
        for (let j = 0; j < collapse_width; j++) {
            let box = new Box(cells.length);
            box.x = j;
            box.y = i;
            matrix[i].push(box);
        }
    }
    draw_current_state(matrix, "fast");

    // Fill the matrix box-by-box

    let c = 0;
    let max = collapse_height * collapse_width;

    async function next_matrix() {

        while (c < max) {
            c++;
    
            let solved_box = solve_next_cell(matrix);
            // Restart generation if any box has zero possible images that fit constraints
            if (recalculate_constraints(matrix, solved_box) == -1) {
                // console.log("Dead-end. Regenerating.");
                // draw_current_state(matrix);
                // break;
                generate();
                break;
            }
    
            await draw_current_state(matrix, generation_mode);
        }

    }
    
    next_matrix();

    // let max = collapse_height * collapse_width;
    // next_matrix(matrix, max, 0);

}

//#endregion

window.dispatchEvent(new Event('resize'));
load_new_images();



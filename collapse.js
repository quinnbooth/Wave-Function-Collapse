// Maintain proper heights and weights
const window_height = document.getElementById('height_field');
const window_width = document.getElementById('width_field');
          
window_height.addEventListener('input', (event) => {
    height = event.target.value
    if (height !== '') {
        if (height < 2) {
            event.target.value = 2;
        } else if (height > 8) {
            event.target.value = 8;
        }
    }
});

window_height.addEventListener('focus', (event) => {
    window_height.placeholder = '';
    if (event.target.value === '') {
        event.target.value = 4;
    }
});

window_width.addEventListener('input', (event) => {
    width = event.target.value
    if (width !== '') {
        if (width < 2) {
            event.target.value = 2;
        } else if (width > 8) {
            event.target.value = 8;
        }
    }
});

window_width.addEventListener('focus', (event) => {
    window_width.placeholder = '';
    if (event.target.value === '') {
        event.target.value = 4;
    }
});


const body = document.getElementsByTagName("body")[0];
let r, g, b = 0;
let bd = true;

setInterval(function() {
    if(bd) {
        b++;
    } else {
        b--;
    }
    if(b >= 255) {
        b = 255;
        bd = false;
    } else if(b <= 0) {
        b = 0;
        bd = true;
    }
    body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}, 10);

document.addEventListener("mousemove", function(event) {
    r = Math.floor(256 * (event.clientX / window.innerWidth));
    g = Math.floor(256 * (event.clientY / window.innerHeight));
    b = t;
    body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
});


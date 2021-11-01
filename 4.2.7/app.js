function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}

let t = prompt("Please enter your text.");

document.getElementsByTagName("title")[0].innerText = t;

const h1 = document.querySelector("h1");
let nt = "";

t.split('').forEach(l => {
    if(l !== " ") {
        nt += `<span class="letter">${l}</span>`;
    }
    else {
        nt += " ";
    }
});
h1.innerHTML = nt;

const letters = document.querySelectorAll('.letter');

setInterval(function() {

    for(let l of letters) {
        l.style.color = getRandomRGB();
    }
    
}, 300);
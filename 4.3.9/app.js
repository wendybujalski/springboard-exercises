const form = document.querySelector("#textForm");
const userText = document.querySelector('input[name="userText"]');
const userColor = document.querySelector('input[name="color"]');
const userFontSize = document.querySelector('input[name="fontSize"]');
const generated = document.getElementById("generated");

form.addEventListener('submit', function(event) {
    event.preventDefault();
    if(userText.value !== "") {
        const newText = makeText(userText.value, userColor.value, userFontSize.value);
        generated.appendChild(newText);
    } else {
        alert("You need to enter some text!");
    }
});

function makeText(text, color, size) {
    const t= document.createElement('h2');
    t.innerText = text;
    t.style.color = color;
    t.style.fontSize = size + "px";
    return t;
}
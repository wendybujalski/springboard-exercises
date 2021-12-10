const giphyAPIKey = "uvySe6sx03AG43Rv4G9Gg89WSJ4G7zAA";
const resetForm = document.getElementById("reset");
const giphyForm = document.getElementById("giphyForm");
const giphyFormInput = document.querySelector("#giphyForm input");
const gifsDiv = document.getElementById("gifs");

async function getGif(inputString) {
    const res = await axios.get("https://api.giphy.com/v1/gifs/search", {params: {api_key: giphyAPIKey, q: inputString}});

    if(res.data.data.length === 0) {
        alert("No GIFs found for your search :(");
    } else {
        addGifToPage(res.data.data);
    }        
}

function addGifToPage(data) {
    const randomImageID = Math.floor(data.length * Math.random());
    const imageToUse = data[randomImageID].images.original;
    const newImg = document.createElement("img");
    newImg.src = imageToUse.url;
    gifsDiv.append(newImg);
}

giphyForm.addEventListener("submit", function(event) {
    event.preventDefault();

    getGif(giphyFormInput.value);

    giphyFormInput.value = "";
});

resetForm.addEventListener("submit", function(event) {
    event.preventDefault();

    gifsDiv.innerHTML = "";
});
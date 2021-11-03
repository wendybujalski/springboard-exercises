const gameContainer = document.getElementById("game");
const hud = document.getElementById("hud");
const gameTitle = document.getElementById("gameTitle");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CARDS = [];
let c1 = null;
let c2 = null;
let gameTimer = 0;
let gameTimerID = null;
let pairs = 0;
let moves = 0;

class Card {
  constructor(name) {
    this.name = name;
    this.randomizeColor();
  }

  randomizeColor() {
    let h = Math.floor(Math.random() * 360);
    let s = 70;
    let l = 50;

    this.color = `hsl(${h},${s}%,${l}%)`;
  }
}

for(let letter of alphabet) {
  let card1 = new Card(letter);
  let card2 = new Card(letter);

  card2.color = card1.color;

  CARDS.push(card1);
  CARDS.push(card2);
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledCards = shuffle(CARDS);

// this function loops over the array of cards
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForCards(cardArray) {
  for (let card of cardArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over, also the card class
    newDiv.classList.add(card.name);
    newDiv.classList.add("card");

    // set up the back of the card with a ?
    let cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.classList.add("face");
    cardBack.innerText = "?";
    newDiv.appendChild(cardBack);

    // set up the front of the card
    let cardFront = document.createElement("div");
    cardFront.innerText = card.name;
    cardFront.classList.add("card-front");
    cardFront.classList.add("face");
    cardFront.style.backgroundColor = card.color;
    newDiv.appendChild(cardFront);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function resetCards() {
  c1.classList.remove("flip");
  c2.classList.remove("flip");

  c1 = null;
  c2 = null;
}

let goodbyeID;
function goodbye(card1, card2) {
  if(card1.dataset.s === undefined) {
    card1.dataset.s = 1;
    card1.dataset.delay = 0;
  } else if(card1.dataset.delay < 120) {
    card1.dataset.delay++;
    return;
  }

  card1.dataset.s = card1.dataset.s - 0.01;

  if(card1.dataset.s > 0) {
    card1.children[1].style.transform = `scale(${card1.dataset.s}, ${card1.dataset.s}) rotateY(180deg)`;
    card2.children[1].style.transform = `scale(${card1.dataset.s}, ${card1.dataset.s}) rotateY(180deg)`;
  } else {
    card1.style.visibility = "hidden";
    card2.style.visibility = "hidden";
    
    c1 = null;
    c2 = null;

    clearTimeout(goodbyeID);
  }
}

function handleCardClick(event) {
  //console.dir(event.target.parentElement);

  let cardSide = event.target;
  let card = event.target.parentElement;

  if(cardSide.classList.contains("card-back") && !cardSide.classList.contains("flip")) {
    if(c1 === null) {
      moves++;
      c1 = card;
      card.classList.add("flip");
    } else if(c2 === null) {
      moves++;
      c2 = card;
      card.classList.add("flip");
      if(c1.classList[0] === c2.classList[0]) { // A MATCH!
        pairs++;
        goodbyeID = setInterval(goodbye, 2, c1, c2);
        if(pairs >= CARDS.length/2) {
          clearTimeout(gameTimerID);
          setTimeout(youWin, 1000);
        }
      } else { // NO MATCH!
        setTimeout(resetCards, 1500);
      }
    }
  }
}

function runGameTimer() {
  hud.innerText = `MOVES: ${moves} | TIME: ${gameTimer} | PAIRS: ${pairs}`;
  gameTimer++;
}

function youWin() {
  let best = localStorage.getItem("best");
  let newBest = false;

  if(best === null || best > gameTimer) {
    best = gameTimer;
    localStorage.setItem("best", best);
    newBest = true;
  }

  gameTitle.innerText = "YOU FINISHED!";
  hud.innerText = "Your Time: " + gameTimer;
  gameContainer.innerHTML = `<h3>Best Time: ${best}</h3>`;
  if(newBest) {
    gameContainer.innerHTML += "<h1>NEW BEST!</h1>";
  }
  let playGame = document.createElement("div");

  playGame.classList.add("gameButton");
  playGame.innerText = "PLAY AGAIN";

  playGame.addEventListener("click", startGame);

  gameContainer.appendChild(playGame);
}

function startGame() {
  gameTitle.innerText = "MEMORY GAME";
  gameContainer.innerHTML = "";
  gameContainer.style.width = "90vw";
  gameContainer.style.paddingBottom = "2em";
  createDivsForCards(shuffledCards);
  gameTimerID = setInterval(runGameTimer, 1);
  pairs = 0;
  moves = 0;
}

function clickHereToPlay() {
  gameTitle.innerText = "MEMORY GAME";
  gameContainer.innerHTML = "";

  let playGame = document.createElement("div");

  playGame.classList.add("gameButton");
  playGame.innerText = "START";

  playGame.addEventListener("click", startGame);

  gameContainer.appendChild(playGame);

  let best = localStorage.getItem("best");

  if(best !== null) {
    hud.innerText = "BEST TIME: " + best;
  }
}

// when the DOM loads
clickHereToPlay();
const MAIN_GAME_DIV_ID = "game";
const mainGameDiv = document.getElementById(MAIN_GAME_DIV_ID);

let currentGame;

class Boggle {
    constructor(gameID, time = 600) {
        // Setting up instance variables
        this.time = time;
        this.gameID = gameID;
        this.score = 0;
        this.guessedWords = new Set();
        this.guessedWordsInOrder = [];
        this.gameDiv = document.getElementById(`${gameID}`);
        this.boardDiv = document.querySelector(`#${gameID} .board`);
        this.guessForm = this.gameDiv.querySelector(".guess-form");

        // Checking local storage to see if there's data we need to keep after a refresh
        // If there isn't, then set up local storage so that we track everything there
        const localStorageTime = window.localStorage.getItem("time");
        const localStorageScore = window.localStorage.getItem("score");
        const localStorageGuessed = window.localStorage.getItem("guessed");

        if(Number(localStorageTime) != NaN && Number(localStorageScore) != NaN && localStorageTime != null && localStorageScore != null) {
            // load relevant data from localstorage
            this.time = Number(localStorageTime);
            this.score = Number(localStorageScore);
            this.guessedWordsInOrder = JSON.parse(localStorageGuessed);
            if(this.guessedWordsInOrder === null) {
                this.guessedWordsInOrder = [];
            }
            this.guessedWords = new Set(this.guessedWordsInOrder);
        }
        else {
            // local storage is either invalid or not initialized, so set it
            window.localStorage.setItem("score", this.score);
            window.localStorage.setItem("time", this.time);
        }

        // Setting up and starting the timer
        const boundTimerFunction = this.doTimer.bind(this);
        this.timerID = setInterval(boundTimerFunction, 100);

        // Updating the DOM at the start
        this.updateScore();
        this.updateTime();
        this.updateMessage();

        // Binding the function for and setting up the event handler for guess submissions.
        const boundSubmissionFunction = this.handleGuessSubmission.bind(this);
        this.gameDiv.querySelector(".guess-form").addEventListener("submit", boundSubmissionFunction);
    }

    // Updating the score span in the DOM
    updateScore(increase = 0) {
        this.score += increase

        const scoreSpan = this.gameDiv.querySelector(".score");

        scoreSpan.innerHTML = `Score: ${this.score}`
        window.localStorage.setItem("score", this.score);
    }

    // Updating the time span in the DOM
    updateTime() {
        const timeSpan = this.gameDiv.querySelector(".time");

        window.localStorage.setItem("time", this.time);
        timeSpan.innerHTML = `Time: ${this.time}`
    }

    // Updating the messages div in the DOM
    updateMessage(msg = "Make A Guess!") {
        const msgDiv = this.gameDiv.querySelector(".messages");

        msgDiv.innerText = msg;
    }

    // Updating the list of guessed words
    updateGuessedWords(word) {
        this.guessedWords.add(word);
        this.guessedWordsInOrder.push(word);

        const guessedString = JSON.stringify([...this.guessedWordsInOrder]);

        window.localStorage.setItem("guessed", guessedString);
    }

    // Code for the timer which runs once per second
    doTimer() {
        if(this.time > 0) {
            this.time--;
        } else {
            clearInterval(this.timerID);
            this.endGame();
        }
        this.updateTime();
    }

    // Handling submission of the guess form
    async handleGuessSubmission(event) {
        event.preventDefault();

        this.submitGuess(this.guessForm.querySelector("input").value.toLowerCase());

        this.guessForm.reset();
    }

    // Submitting a guess to the server and handling the results
    async submitGuess(guess) {
        if(this.time <= 0) {
            return;
        }

        const res = await axios.get("/submit_guess", {params: {guess: guess}});
    
        const guess_cap = guess.toUpperCase();
        const result = res.data.result;
        let message = "";
    
        if(result == "ok") { // Word is on the board and okay!
            if(this.guessedWords.has(guess_cap)) {
                message = `"${guess_cap}" Already Found!`;
            } else {
                message = `"${guess_cap}" Found!`
                this.updateGuessedWords(guess_cap);
                this.updateScore(guess_cap.length);
            }
        } else if(result == "not-on-board") { // Word is not on the board.
            message = `"${guess_cap}" Not On Board!`
        } else if("not-word") { // That's not a valid word!
            message = `"${guess_cap}" Is Not A Word!`
        } else { // Not a valid response!
            message = "ERROR: Invalid Response"
        }
    
        this.updateMessage(message);
    }

    // Do all the steps involved with ending the game
    async endGame() {
        this.updateMessage("");
        this.guessForm.innerHTML = "";
        this.boardDiv.innerHTML = "";
        this.boardDiv.style.display = "None";

        const highScore = await this.postGameStats();

        window.localStorage.clear();

        const gameOverScreen = this.generateGameOverScreen(highScore);

        this.gameDiv.appendChild(gameOverScreen);
    }

    // Post the stats for the game you just finished to the server
    async postGameStats() {
        const res = await axios.post("/game-over", {score: this.score, num_words: this.guessedWords.size, words: this.guessedWordsInOrder});

        return res.data.highscore;
    }

    // Generate the game over screen and append it to the DOM
    generateGameOverScreen(highscore) {
        const gameOverScreen = document.createElement("div");
        gameOverScreen.classList.add("game-over");
        
        const gameOverTitle = document.createElement("h2");
        gameOverTitle.innerText = "GAME OVER!";
        gameOverScreen.appendChild(gameOverTitle);

        if(highscore) {
            const highScoreText = document.createElement("h2");
            highScoreText.innerText = "You got a high score!";
            gameOverScreen.appendChild(highScoreText);
        }

        const gameOverWordsTitle = document.createElement("h3");
        gameOverWordsTitle.innerText = "Your Words:";
        gameOverScreen.appendChild(gameOverWordsTitle);

        const gameOverWords = document.createElement("ol");

        for(const word of this.guessedWordsInOrder) {
            const wordLi = document.createElement("li");
            wordLi.innerText = word;
            gameOverWords.appendChild(wordLi);
        }

        gameOverScreen.appendChild(gameOverWords);

        const backToTitleForm = document.createElement("form");
        backToTitleForm.setAttribute("action", "/new-game");

        const backToTitleButton = document.createElement("button");
        backToTitleButton.innerText = "Play Again!";
        backToTitleForm.appendChild(backToTitleButton);

        gameOverScreen.appendChild(backToTitleForm);

        return gameOverScreen;
    }
}

currentGame = new Boggle(MAIN_GAME_DIV_ID);
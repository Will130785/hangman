//Get UI elements
const elements = {
    startBtn: document.querySelector(".btn-start"),
    guessBtn: document.querySelector(".btn-guess"),
    resetBtn: document.querySelector(".btn-reset"),
    wordInput: document.querySelector(".word-input"),
    letterInput: document.querySelector(".letter-input"),
    wordContainer: document.querySelector(".word-container"),
    gameMessageContainer: document.querySelector(".game-messages"),
    hangmanImage: document.querySelector(".hangman-image")
}

let gameWord = [];
let wordMapped;
let hangImg = 1;
let gamestatus = 0; //0 = game over, 1 = active
var regex = /\s/;
let wordStr;

//Function to display items in UI
function consoleDisplay(img) {
    elements.gameMessageContainer.innerHTML = "";
    let html = `
            <img class="console-messages" src="img/${img}.png">
        `

        elements.gameMessageContainer.innerHTML = html;
}

//Function to check that user enters a single word
function singleWord() {
    //Capture input value
    wordStr = elements.wordInput.value;
    if(regex.test(wordStr)) {
        consoleDisplay("single")
        //keep status at 0
        gamestatus = 0;
    } else {
        //Set game status to 1
        gamestatus = 1;
    }
}


//Function to start game
function startGame() {

    //Capture value from input and check user has entered a single word
    singleWord();
    
    //Check that there has been an input
    if(elements.wordInput.value !== "" && gamestatus === 1) {
        //Capture word and push to the gameWord array

        for(let i = 0; i < wordStr.length; i++) {
            gameWord.push(wordStr[i].toLowerCase());
        }

        //Clear input
        elements.wordInput.value = "";
    
    //Loop through game word and display a placeholder in the UI for each letter
    wordMapped = gameWord.map(item => {
        //Create element for each word and append to word container
        let html = `
            <img class="word-placeholder" src="img/hangman_letter.png">
        `

        elements.wordContainer.insertAdjacentHTML("beforeend", html);

        return item;
    });

    //Hide word input and start button and display letter input, guess button and reset button
    elements.wordInput.style.display = "none"
    elements.startBtn.style.display = "none";
    elements.letterInput.style.display = "block";
    elements.guessBtn.style.display = "block";
    elements.resetBtn.style.display = "block";

    //If no input, alert user to enter something and clear after 4 seconds
    } else {
        consoleDisplay("single");
        setTimeout(() => {
            elements.gameMessageContainer.innerHTML = "";
        }, 4000);
    }

    elements.letterInput.value = "";
};

//Function to process guess
function processGuess() {
    //Check status of game
    if(gameWord.length > 0 && gamestatus === 1) {
        //Capture guess letter, clear input, assign gameWordLenght variable in order to track the progress of the game and clear wordContainer
        let guessLetter = elements.letterInput.value.toLowerCase();
        elements.letterInput.value = "";
        let gameWordLength = gameWord.length;
        elements.wordContainer.innerHTML = "";

        //Loop through word array and check for matches
        for(let i = gameWord.length; i >= 0; i--) {
            if(guessLetter === gameWord[i]) {
                //it there is a match splice the word from the gameWord array
                gameWord.splice(i, 1);
        
            }


            //if gameWord length is zero or below this means all matches have been found and the game has been won
            if(gameWord.length <= 0) {
                consoleDisplay("win");
                //Set gamestatus to 0
                gamestatus = 0;
            }
        }

        //If gameWordLength is equal to gameWord length, this means that no matches were found and the next hangman image shoule be displayed
        if(gameWordLength === gameWord.length) {
            hangImg++;
            elements.hangmanImage.src = `img/hangman${hangImg}.png`;
            
            //If image 7 is reached this means that it is game over
            if(hangImg === 7) {
                consoleDisplay("lose");
                gamestatus = 0;
            }
        }

        //Loop through the wordMapped variable that was created earlier and push the html to the array if there is a match
        for(let i = 0; i < wordMapped.length; i++) {
            if(guessLetter === wordMapped[i]) {
             wordMapped[i] = `
                <span>${wordMapped[i]}</span>
             `;

            } 
        }

        //Loop through the wordMapped again to determine what should be output to UI
        wordMapped.forEach((item, index) => {
            if(item.length > 1) {
                //If the length of the item is larger than 1, the html for a match should be output
                elements.wordContainer.insertAdjacentHTML("beforeend", item);

            } else {
                //if not then the image for the placeholder should be output
                let html = `
                <img class="word-placeholder" src="img/hangman_letter.png">
                `;
                elements.wordContainer.insertAdjacentHTML("beforeend", html);
            }
        });
    }
};

//Function for restart
function restart() {
    //reset all gameplay variables
    gamestatus = 0;
    gameWord = [];
    wordMapped = null;
    hangImg = 1;

    //Clear the gameMessageContainer and set the image back to the first
    elements.gameMessageContainer.innerHTML = "";
    elements.hangmanImage.src = `img/hangman${hangImg}.png`;

    //Display correct buttons and inputs
    elements.wordInput.style.display = "block"
    elements.startBtn.style.display = "block";
    elements.letterInput.style.display = "none";
    elements.guessBtn.style.display = "none";
    elements.resetBtn.style.display = "none";
    //Clear the wordContainer content
    elements.wordContainer.innerHTML = "";
}

//Event listeners
elements.startBtn.addEventListener("click", startGame);
elements.guessBtn.addEventListener("click", processGuess);
elements.resetBtn.addEventListener("click", restart);
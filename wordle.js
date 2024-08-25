const words = ["apple", "grape", "berry", "lemon"]; // Sample words
const correctWord = words[Math.floor(Math.random()*words.length)].toUpperCase();
const board = document.getElementById("board");
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");

let currentRow = 0;

// Create the grid
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("id", `tile-${i}-${j}`);
        board.appendChild(tile);
    }
}

// Handle the guess submission
submitBtn.addEventListener("click", () => {
    const guess = guessInput.value.toUpperCase();
    if (guess.length != 5) {
        alert("Please enter a 5-letter word.");
        return;
    }

    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);
        tile.textContent = guess[i];

        if (guess[i] === correctWord[i]) {
            tile.classList.add("green");
        }
        else if (correctWord.includes(guess[i])) {
            tile.classList.add("yellow");
        }
        else {
            tile.classList.add("gray");
        }
    }

    if (guess === correctWord) {
        setTimeout(() => alert("Congratulations! You guessed the word!"), 100);
        guessInput.value = "";
        guessInput.disabled = true;
        submitBtn.disabled = true;
        return;
    } else if (currentRow == 5) {
        setTimeout(() => alert(`Game over! The correct word was ${correctWord}.`), 100);
        guessInput.value = "";
        guessInput.disabled = true;
        submitBtn.disabled = true;
        return;
    }

    currentRow++;
    guessInput.value = "";
});

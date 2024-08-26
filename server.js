const express = require('express');
const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

const wordList = ["APPLE", "BANJO", "CRANE", "DRINK", "EAGLE"];

let currentWord = wordList[Math.floor(Math.random() * wordList.length)];

// Serve static files (index.html, styles.css, wordle.js)
app.use(express.static('public'));

// API to get the current word
app.get('/api/word', (req, res) => {
    res.json({ word: currentWord });
});

// API to handle guesses
app.post('/api/guess', (req, res) => {
    const { guess } = req.body;
    const feedback = checkGuess(guess.toUpperCase(), currentWord);
    res.json(feedback);
});

// Helper function to check the guess
function checkGuess(guess, correctWord) {
    let result = {
        correct: [],
        misplaced: [],
        wrong: []
    };

    // Check each letter of the guess
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        if (letter === correctWord[i]) {
            result.correct.push(letter);
        } else if (correctWord.includes(letter)) {
            result.misplaced.push(letter);
        } else {
            result.wrong.push(letter);
        }
    }

    return result;
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

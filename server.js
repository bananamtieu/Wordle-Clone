const express = require('express');
const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

const wordList = ["APPLE", "BANJO", "CRANE", "DRINK", "EAGLE"];
let currentWord = wordList[Math.floor(Math.random() * wordList.length)];

// API to get the current word
app.get('/api/word', (req, res) => {
    res.json({ word: currentWord });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

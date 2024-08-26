const wordle = {
    constants: {
        wordSize: 5,
        maxTries: 6
    },
    elements: {
        rows: null,
        input: null,
        successMessage: null
    },
    state: {
        attempts: [],
        correctWord: null // Store the correct word here
    },
    handlers: {
        changeLetter: async function(event) {
            const keyPressed = event.key;
            const currentInput = event.currentTarget;
            const currentRow = currentInput.parentElement;

            if (keyPressed === "Enter") {
                const word = Array.from(currentRow.querySelectorAll('input'))
                                  .map(input => input.value)
                                  .join('');
                
                if (word.length === wordle.constants.wordSize) {
                    wordle.state.attempts.push(word);
                    const isCorrect = await wordle.helpers.checkAnswer(word, currentRow);
                    
                    if (isCorrect) {
                        wordle.elements.successMessage.classList.remove('hidden');
                        setTimeout(() => {
                            wordle.elements.successMessage.classList.add('hidden');
                        }, 3000);
                    } else {
                        Array.from(currentRow.querySelectorAll('input')).forEach(input => {
                            input.setAttribute('disabled', 'true');
                        });
                        wordle.helpers.focusNextRow(currentInput);
                    }
                }
            } else if (keyPressed === "Backspace") {
                wordle.helpers.focusPrevious(currentInput);
            } else if (/^[a-zA-Z]$/.test(keyPressed)) {
                currentInput.value = keyPressed.toUpperCase();
                wordle.helpers.focusNext(currentInput);
            }
        }
    },
    helpers: {
        createRows: function(parentElement) {
            const sections = [];
            const inputs = [];
            
            const parent = parentElement || document.createElement('div');
            
            for (let i = 0; i < wordle.constants.maxTries; i++) {
                const row = document.createElement('section');
                
                for (let j = 0; j < wordle.constants.wordSize; j++) {
                    const input = document.createElement('input');
                    input.setAttribute('maxLength', '1');
                    input.addEventListener('keyup', wordle.handlers.changeLetter);
                    row.appendChild(input);
                    inputs.push(input);
                }
                
                sections.push(row);
                parent.appendChild(row);
            }
            
            return [sections, inputs];
        },
        focusNext: function(input) {
            const nextInput = input.nextElementSibling;
            if (nextInput && nextInput.tagName === 'INPUT') {
                nextInput.focus();
            }
        },
        focusPrevious: function(input) {
            const previousInput = input.previousElementSibling;
            if (previousInput && previousInput.tagName === 'INPUT') {
                previousInput.focus();
            }
        },
        focusNextRow: function(input) {
            const parentRow = input.parentElement;
            const nextRow = parentRow.nextElementSibling;
            if (nextRow) {
                const firstInputInNextRow = nextRow.querySelector('input');
                if (firstInputInNextRow) {
                    firstInputInNextRow.focus();
                }
            }
        },
        checkAnswer: function(word, currentRow) {
            let allCorrect = true;

            // Loop through the inputs and assign classes based on the word comparison
            Array.from(currentRow.querySelectorAll('input')).forEach((input, index) => {
                const letter = word[index].toUpperCase();
                const correctLetter = wordle.state.correctWord[index];

                if (letter === correctLetter) {
                    input.classList.add('right-place');
                } else if (wordle.state.correctWord.includes(letter)) {
                    input.classList.add('right-letter');
                } else {
                    input.classList.add('wrong');
                }

                if (letter !== correctLetter) {
                    allCorrect = false;
                }
            });

            return allCorrect;
        },
        fetchCorrectWord: async function() {
            try {
                const response = await fetch('/api/word');
                const data = await response.json();
                wordle.state.correctWord = data.word;
                console.log("Correct word fetched from API:", wordle.state.correctWord);
            } catch (error) {
                console.error("Error fetching the correct word:", error);
            }
        }
    },
    initialize: async function() {
        // Get reference to the main element in the HTML document
        const mainElement = document.querySelector('main');
        
        // Call createRows and assign rows and inputs
        const [rows, inputs] = wordle.helpers.createRows(mainElement);
        wordle.elements.rows = rows;
        wordle.elements.input = inputs;
        
        // Assign successMessage to a reference in the HTML document
        wordle.elements.successMessage = document.querySelector('#successMessage');
        
        // Fetch the correct word from the API
        await wordle.helpers.fetchCorrectWord();
        
        console.log("Wordle game initialized with rows and inputs!");
    }
};

// Call the initialize method
wordle.initialize();

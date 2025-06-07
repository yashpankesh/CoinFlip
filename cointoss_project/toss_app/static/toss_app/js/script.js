document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const coin = document.getElementById('coin');
    const resultDiv = document.getElementById('result');
    const headsCountSpan = document.getElementById('heads-count');
    const tailsCountSpan = document.getElementById('tails-count');
    const streakResultSpan = document.getElementById('streak-result');
    const streakCountSpan = document.getElementById('streak-count');
    const historyList = document.getElementById('history-list');
    const resetButton = document.getElementById('reset-button');
    const flipSound = document.getElementById('flip-sound');
    const landSound = document.getElementById('land-sound');

    // State
    let state = {
        headsCount: 0,
        tailsCount: 0,
        history: [],
        currentStreak: { type: null, count: 0 },
        isFlipping: false,
        totalRotation: 0, // Keep track of the coin's total rotation
    };

    // --- Event Listeners ---
    coin.addEventListener('click', handleCoinClick);
    resetButton.addEventListener('click', resetGame);

    // --- Functions ---
    function handleCoinClick() {
        if (state.isFlipping) return;

        state.isFlipping = true;
        resultDiv.textContent = 'Flipping...';
        playSound(flipSound);

        // --- MOCK BACKEND: Replace this with your actual fetch call ---
        // Simulating a fetch call to get a random result
        const randomResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const promise = Promise.resolve({ result: randomResult });
        // ----------------------------------------------------------------

        promise // In a real scenario, this would be your fetch('/toss/') call
            .then(data => {
                const result = data.result;

                // --- NEW ANIMATION LOGIC ---
                // 1. Add a base number of spins (e.g., 5 full spins = 1800deg)
                state.totalRotation += 1800;

                // 2. Adjust to land on the correct face
                if (result === 'Tails') {
                    // If the current rotation would land on Heads (a multiple of 360), add 180deg to land on Tails
                    if (state.totalRotation % 360 === 0) {
                        state.totalRotation += 180;
                    }
                } else { // Result is 'Heads'
                    // If the current rotation would land on Tails, add 180deg to land on Heads
                    if (state.totalRotation % 360 !== 0) {
                        state.totalRotation += 180;
                    }
                }
                
                // 3. Apply the new rotation to the coin element to trigger the CSS transition
                coin.style.transform = `rotateY(${state.totalRotation}deg)`;

                // 4. Process the result after the animation finishes (1.5s)
                setTimeout(() => processFlipResult(result), 1500);
            })
            .catch(error => {
                console.error('Error fetching toss result:', error);
                setTimeout(() => processFlipResult('Error'), 1500);
            });
    }
    
    function processFlipResult(result) {
        if (result === 'Error') {
             resultDiv.textContent = 'Flip failed!';
             state.isFlipping = false;
             return;
        }
        
        // The coin is already in its final position from the animation.
        // We just need to play the sound and update the stats and UI.
        playSound(landSound);
        updateState(result);
        updateUI();
        
        state.isFlipping = false;
    }

    function updateState(result) {
        // Update counts
        result === 'Heads' ? state.headsCount++ : state.tailsCount++;

        // Update history (add to the beginning)
        state.history.unshift(result);
        if (state.history.length > 10) {
            state.history.pop(); // Keep history to a max of 10
        }

        // Update streak
        if (state.currentStreak.type === result) {
            state.currentStreak.count++;
        } else {
            state.currentStreak.type = result;
            state.currentStreak.count = 1;
        }
    }

    function updateUI() {
        // Update result text
        resultDiv.textContent = `It's ${state.history[0]}!`;
        
        // Update counts
        headsCountSpan.textContent = state.headsCount;
        tailsCountSpan.textContent = state.tailsCount;

        // Update streak display
        streakResultSpan.textContent = state.currentStreak.type || '--';
        streakCountSpan.textContent = state.currentStreak.count;

        // Update history list
        historyList.innerHTML = ''; // Clear list
        if (state.history.length === 0) {
            historyList.innerHTML = '<li>No flips yet...</li>';
        } else {
            state.history.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.classList.add(item); // Adds 'Heads' or 'Tails' class for styling
                historyList.appendChild(li);
            });
        }
    }

    function resetGame() {
        state = {
            headsCount: 0,
            tailsCount: 0,
            history: [],
            currentStreak: { type: null, count: 0 },
            isFlipping: false,
            totalRotation: 0, // Also reset rotation
        };
        // Reset the coin's visual rotation
        coin.style.transform = 'rotateY(0deg)';
        resultDiv.textContent = '';
        updateUI();
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.error("Error playing sound:", e));
    }
});
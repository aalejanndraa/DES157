(function () {
    "use strict";
    console.log("reading js");

    // grabbing the main buttons
    const serveBtn = document.querySelector("#serve");
    const passBtn = document.querySelector("#pass");
    const newMatchBtn = document.querySelector("#newmatch");

    // grabbing the score areas
    const score1 = document.querySelector("#score1");
    const score2 = document.querySelector("#score2");
    const turn1 = document.querySelector("#turn1");
    const turn2 = document.querySelector("#turn2");

    // grabbing the player cards so I can highlight them
    const player1Card = document.querySelector("#player1");
    const player2Card = document.querySelector("#player2");

    // grabbing the text areas and volleyball image
    const rallyStatus = document.querySelector("#rally-status");
    const gameMessage = document.querySelector("#game-message");
    const volleyball = document.querySelector(".volleyball-img");

    // grabbing the audio files
    const hitSound = document.querySelector("#hit-sound");
    const winnerSound = document.querySelector("#winner-sound");

    // keeping track of both players
    const players = [
        { score: 0, rally: 0 },
        { score: 0, rally: 0 }
    ];

    let currentPlayer = 0;
    let gameActive = true;
    let hitTimeout;
    let winnerTimeout;

    // rolls one die and gives a number from 1 to 6
    function rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    // updates the numbers and shows whose turn it is
    function updateDisplay() {
        score1.textContent = players[0].score;
        score2.textContent = players[1].score;

        turn1.textContent = currentPlayer === 0 ? players[0].rally : 0;
        turn2.textContent = currentPlayer === 1 ? players[1].rally : 0;

        if (currentPlayer === 0) {
            rallyStatus.textContent = "Player 1's turn";
            player1Card.classList.add("active-player");
            player2Card.classList.remove("active-player");
        } else {
            rallyStatus.textContent = "Player 2's turn";
            player2Card.classList.add("active-player");
            player1Card.classList.remove("active-player");
        }
    }

    // switches to the next player and clears the current rally points
    function switchPlayer() {
        players[currentPlayer].rally = 0;
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        updateDisplay();
    }

    // makes the volleyball spin a little when serve is pressed
    function spinBall() {
        volleyball.style.transition = "none";
        volleyball.style.transform = "rotate(0deg) scale(1)";
        volleyball.offsetHeight;
        volleyball.style.transition = "transform 0.6s ease";
        volleyball.style.transform = "rotate(360deg) scale(1.08)";

        setTimeout(function () {
            volleyball.style.transform = "rotate(0deg) scale(1)";
        }, 650);
    }

    // removes the winner glow so it can reset for a new match
    function clearWinnerGlow() {
        player1Card.classList.remove("winner");
        player2Card.classList.remove("winner");
    }

    // this is the main serve action
    function serveBall() {
        let die1;
        let die2;
        let total;

        if (!gameActive) {
            return;
        }

        spinBall();

        // plays the hit sound but keeps it short
        clearTimeout(hitTimeout);
        hitSound.pause();
        hitSound.currentTime = 0;
        hitSound.play();

        hitTimeout = setTimeout(function () {
            hitSound.pause();
            hitSound.currentTime = 0;
        }, 250);

        die1 = rollDie();
        die2 = rollDie();
        total = die1 + die2;

        if (die1 === 1 && die2 === 1) {
            players[currentPlayer].score = 0;
            players[currentPlayer].rally = 0;
            gameMessage.textContent = "Double fault! Player " + (currentPlayer + 1) + "'s match score resets to 0.";
            updateDisplay();
            switchPlayer();
        } else if (die1 === 1 || die2 === 1) {
            players[currentPlayer].rally = 0;
            gameMessage.textContent = "Foot fault! Player " + (currentPlayer + 1) + " loses the rally.";
            updateDisplay();
            switchPlayer();
        } else {
            players[currentPlayer].rally += total;
            gameMessage.textContent = "Ace! Player " + (currentPlayer + 1) + " earns " + total + " rally points.";
            updateDisplay();
        }
    }

    // this banks the rally points into the main score
    function passBall() {
        if (!gameActive) {
            return;
        }

        players[currentPlayer].score += players[currentPlayer].rally;

        if (players[currentPlayer].score >= 30) {
            gameActive = false;
            gameMessage.textContent = "Match winner! Player " + (currentPlayer + 1) + " wins with " + players[currentPlayer].score + " points.";
            rallyStatus.textContent = "Player " + (currentPlayer + 1) + " wins!";

            clearWinnerGlow();

            if (currentPlayer === 0) {
                player1Card.classList.add("winner");
            } else {
                player2Card.classList.add("winner");
            }

            updateDisplay();

            // plays the winner sound a little longer
            clearTimeout(winnerTimeout);
            winnerSound.pause();
            winnerSound.currentTime = 0;
            winnerSound.play();

            winnerTimeout = setTimeout(function () {
                winnerSound.pause();
                winnerSound.currentTime = 0;
            }, 1100);

            serveBtn.disabled = true;
            passBtn.disabled = true;
            return;
        }

        gameMessage.textContent = "Player " + (currentPlayer + 1) + " passes and banks the rally points.";
        updateDisplay();
        switchPlayer();
    }

    // resets everything for a brand new match
    function newMatch() {
        players[0].score = 0;
        players[0].rally = 0;
        players[1].score = 0;
        players[1].rally = 0;

        currentPlayer = 0;
        gameActive = true;

        serveBtn.disabled = false;
        passBtn.disabled = false;

        gameMessage.textContent = "Press Serve to start the match.";
        rallyStatus.textContent = "Player 1's turn";

        volleyball.style.transform = "rotate(0deg) scale(1)";

        clearWinnerGlow();

        clearTimeout(hitTimeout);
        clearTimeout(winnerTimeout);

        hitSound.pause();
        hitSound.currentTime = 0;
        winnerSound.pause();
        winnerSound.currentTime = 0;

        updateDisplay();
    }

    // button clicks
    serveBtn.addEventListener("click", serveBall);
    passBtn.addEventListener("click", passBall);
    newMatchBtn.addEventListener("click", newMatch);

    // shows the starting state right away
    updateDisplay();
})();
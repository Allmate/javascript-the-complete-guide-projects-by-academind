const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';
const DEFAULT_USER_CHOICE = ROCK;

const RESULT_PLAYER_WINS = 'PLAYER_WINS';
const RESULT_COMPUTER_WINS = 'COMPUTER WINS';
const RESULT_DRAW = 'DRAW';

const startGameBtn = document.getElementById('startGameBtn');

let gameIsRunning = false;

const getPlayerChoice = function () {
    const playerChoice = prompt(`${ROCK}, ${PAPER} or ${SCISSORS}?`, DEFAULT_USER_CHOICE).toUpperCase();

    if (![ROCK, PAPER, SCISSORS].includes(playerChoice)) {
        return ROCK;
    }

    return playerChoice;
};

const getComputerChoice = function () {
    const randomNumber = Math.random();

    if (randomNumber < 0.34) return ROCK;

    if (randomNumber < 0.67) return PAPER;

    return SCISSORS;
};

const computeWinner = function (playerChoice, computerChoice) {
    const playerWinCondition =
        (playerChoice === ROCK && computerChoice === SCISSORS) ||
        (playerChoice === PAPER && computerChoice === ROCK) ||
        (playerChoice === SCISSORS && computerChoice === PAPER);

    if (playerChoice === computerChoice) return RESULT_DRAW;

    if (playerWinCondition) return RESULT_PLAYER_WINS;

    return RESULT_COMPUTER_WINS;
};

startGameBtn.addEventListener('click', () => {
    if (!gameIsRunning) {
        gameIsRunning = true;
        console.log('Game is starting...');
        const playerSelection = getPlayerChoice();
        const computerSelection = getComputerChoice();
        const winner = computeWinner(playerSelection, computerSelection);

        let winnerMessage =
            `You picked ${playerSelection}, computer picked ${computerSelection}.\nTherefore You `;

        switch (winner) {
            case RESULT_PLAYER_WINS:
                winnerMessage += 'wins';
                break;
            case RESULT_COMPUTER_WINS:
                winnerMessage += 'lost';
                break;
            case RESULT_DRAW:
                winnerMessage += 'had a draw.';
                break;
        }

        alert(winnerMessage);
    }
});

const invoice = {
    amount: 25,
    logAmount() {
        return setTimeout(() => {
            console.log(this.amount);
        }, 1000);
    }
};
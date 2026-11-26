const boardEl = document.getElementById('board');
const turnEl = document.getElementById('turn-indicator');
const diceEl = document.getElementById('dice-box');
const rollBtn = document.getElementById('roll-btn');
const resetBtn = document.getElementById('reset-btn');
const p1PosEl = document.getElementById('p1-pos');
const p2PosEl = document.getElementById('p2-pos');
const logEl = document.getElementById('game-log');

const LADDERS = { 4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92 };
const SNAKES = { 27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41 };
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

let positions = [1, 1];
let currentPlayer = 0; // 0 = Player 1, 1 = Player 2
let gameOver = false;

function buildBoard() {
  boardEl.innerHTML = '';
  // Top row (row 9) is 100..91, next row (row 8) is 81..90 (boustrophedon)
  for (let r = 9; r >= 0; r--) {
    const isEvenRowFromBottom = r % 2 === 0;
    for (let c = 0; c < 10; c++) {
      const num = isEvenRowFromBottom ? r * 10 + c + 1 : r * 10 + (10 - c);
      const cell = document.createElement('div');
      cell.className = 'cell ' + (num % 2 === 0 ? 'even' : 'odd');
      cell.id = `cell-${num}`;

      if (LADDERS[num]) cell.classList.add('ladder-start');
      if (SNAKES[num]) cell.classList.add('snake-start');

      const numSpan = document.createElement('span');
      numSpan.textContent = num;
      cell.appendChild(numSpan);

      const tokensDiv = document.createElement('div');
      tokensDiv.className = 'tokens';
      tokensDiv.id = `tokens-${num}`;
      cell.appendChild(tokensDiv);

      if (LADDERS[num]) {
        const tag = document.createElement('span');
        tag.className = 'cell-tag';
        tag.textContent = `🪜→${LADDERS[num]}`;
        cell.appendChild(tag);
      } else if (SNAKES[num]) {
        const tag = document.createElement('span');
        tag.className = 'cell-tag';
        tag.textContent = `🐍→${SNAKES[num]}`;
        cell.appendChild(tag);
      }

      boardEl.appendChild(cell);
    }
  }
}

function renderTokens() {
  document.querySelectorAll('.tokens').forEach((el) => (el.innerHTML = ''));
  positions.forEach((pos, idx) => {
    const container = document.getElementById(`tokens-${pos}`);
    if (container) {
      const token = document.createElement('div');
      token.className = `token p${idx + 1}`;
      token.title = `Player ${idx + 1}`;
      container.appendChild(token);
    }
  });
  p1PosEl.textContent = positions[0];
  p2PosEl.textContent = positions[1];
}

function addLog(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  logEl.prepend(li);
}

rollBtn.addEventListener('click', () => {
  if (gameOver) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  diceEl.textContent = `${DICE_FACES[roll - 1]} (${roll})`;

  const playerNum = currentPlayer + 1;
  let nextPos = positions[currentPlayer] + roll;

  if (nextPos > 100) {
    addLog(`Player ${playerNum} rolled ${roll} — needs exact number to reach 100.`);
  } else {
    if (LADDERS[nextPos]) {
      addLog(`Player ${playerNum} rolled ${roll} → climbed ladder ${nextPos} to ${LADDERS[nextPos]}!`);
      nextPos = LADDERS[nextPos];
    } else if (SNAKES[nextPos]) {
      addLog(`Player ${playerNum} rolled ${roll} → bitten by snake ${nextPos} to ${SNAKES[nextPos]}!`);
      nextPos = SNAKES[nextPos];
    } else {
      addLog(`Player ${playerNum} rolled ${roll} → moved to ${nextPos}.`);
    }
    positions[currentPlayer] = nextPos;
  }

  renderTokens();

  if (positions[currentPlayer] === 100) {
    gameOver = true;
    turnEl.textContent = `🎉 Player ${playerNum} Wins!`;
    rollBtn.disabled = true;
    addLog(`🏆 Player ${playerNum} reached 100 and won the game!`);
    return;
  }

  currentPlayer = currentPlayer === 0 ? 1 : 0;
  turnEl.textContent = `Player ${currentPlayer + 1}'s Turn`;
});

resetBtn.addEventListener('click', () => {
  positions = [1, 1];
  currentPlayer = 0;
  gameOver = false;
  rollBtn.disabled = false;
  diceEl.textContent = '🎲';
  turnEl.textContent = "Player 1's Turn";
  logEl.innerHTML = '';
  renderTokens();
  addLog('New game started!');
});

buildBoard();
renderTokens();
addLog('Game ready. Player 1 rolls first!');

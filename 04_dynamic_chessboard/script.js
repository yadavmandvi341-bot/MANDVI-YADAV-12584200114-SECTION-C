// Task 4: Dynamically create all HTML elements and apply all CSS properties via JavaScript

document.body.style.margin = '0';
document.body.style.padding = '24px';
document.body.style.minHeight = '100vh';
document.body.style.display = 'flex';
document.body.style.flexDirection = 'column';
document.body.style.alignItems = 'center';
document.body.style.justifyContent = 'center';
document.body.style.backgroundColor = '#1e1b4b';
document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
document.body.style.color = '#faf5ff';

const heading = document.createElement('h1');
heading.textContent = 'Dynamic JavaScript Chessboard';
heading.style.margin = '0 0 6px 0';
heading.style.fontSize = '1.6rem';
document.body.appendChild(heading);

const subtitle = document.createElement('p');
subtitle.textContent = 'All HTML elements & CSS styles generated via JS — Mandvi Yadav';
subtitle.style.margin = '0 0 20px 0';
subtitle.style.fontSize = '0.9rem';
subtitle.style.color = '#94a3b8';
document.body.appendChild(subtitle);

const boardFrame = document.createElement('div');
boardFrame.style.padding = '12px';
boardFrame.style.backgroundColor = '#4338ca';
boardFrame.style.borderRadius = '12px';
boardFrame.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.45)';
document.body.appendChild(boardFrame);

const board = document.createElement('div');
board.style.display = 'grid';
board.style.gridTemplateColumns = 'repeat(8, 60px)';
board.style.gridTemplateRows = 'repeat(8, 60px)';
board.style.border = '3px solid #312e81';
boardFrame.appendChild(board);

const statusText = document.createElement('p');
statusText.textContent = 'Click any square to inspect its coordinate (e.g., e4)';
statusText.style.margin = '16px 0 0 0';
statusText.style.fontSize = '0.95rem';
statusText.style.color = '#ddd6fe';
document.body.appendChild(statusText);

const initialPieces = {
  0: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  1: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  6: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  7: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
};

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    const isLight = (row + col) % 2 === 0;
    const coord = files[col] + (8 - row);

    square.style.width = '60px';
    square.style.height = '60px';
    square.style.display = 'flex';
    square.style.alignItems = 'center';
    square.style.justifyContent = 'center';
    square.style.fontSize = '2rem';
    square.style.userSelect = 'none';
    square.style.cursor = 'pointer';
    square.style.position = 'relative';
    square.style.backgroundColor = isLight ? '#f1d9b5' : '#b58863';
    square.style.color = row < 2 ? '#111827' : '#ffffff';
    square.style.textShadow = row < 2 ? 'none' : '0 1px 3px rgba(0,0,0,0.6)';
    square.style.transition = 'transform 0.12s ease';

    if (initialPieces[row]) {
      square.textContent = initialPieces[row][col];
    }

    square.addEventListener('click', () => {
      const piece = square.textContent ? ` (${square.textContent})` : ' (empty)';
      statusText.textContent = `Selected Square: ${coord}${piece}`;
    });

    board.appendChild(square);
  }
}

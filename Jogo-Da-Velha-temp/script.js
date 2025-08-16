const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusText = document.getElementById('statusText');
const playerMarkSel = document.getElementById('playerMark');
const firstMoveSel = document.getElementById('firstMove');
const btnStart = document.getElementById('btnStart');

let board;           // array de 9 com 'X','O' ou null
let human = 'X';
let ai = 'O';
let turn = 'human';  // 'human' | 'ai'
let gameOver = false;

btnStart.addEventListener('click', startGame);
cells.forEach(cell => cell.addEventListener('click', onHumanMove));

function startGame(){
  board = Array(9).fill(null);
  gameOver = false;
  cells.forEach(c => { c.textContent=''; c.disabled=false; c.classList.remove('win'); });
  human = playerMarkSel.value;
  ai = human === 'X' ? 'O' : 'X';
  turn = firstMoveSel.value; // 'human' ou 'ai'
  statusText.textContent = (turn === 'human') ? `Sua vez (${human})` : `Vez da IA (${ai})`;
  if(turn === 'ai'){
    setTimeout(aiMove, 300);
  }
}

function onHumanMove(e){
  if(gameOver) return;
  if(turn !== 'human') return;
  const idx = parseInt(e.currentTarget.dataset.idx, 10);
  if(board[idx]) return;
  makeMove(idx, human);
  const end = checkEnd();
  if(end) return finish(end);
  turn = 'ai';
  statusText.textContent = `Vez da IA (${ai})`;
  setTimeout(aiMove, 250);
}

function aiMove(){
  if(gameOver) return;
  const idx = bestMove(board, ai, human);
  makeMove(idx, ai);
  const end = checkEnd();
  if(end) return finish(end);
  turn = 'human';
  statusText.textContent = `Sua vez (${human})`;
}

function makeMove(idx, mark){
  board[idx] = mark;
  cells[idx].textContent = mark;
  cells[idx].disabled = true;
}

function checkEnd(){
  const w = winnerInfo(board);
  if(w){
    return { type:'win', mark: w.mark, line: w.line };
  }
  if(board.every(v => v)) return { type:'draw' };
  return null;
}

function finish(result){
  gameOver = true;
  cells.forEach(c => c.disabled = true);
  if(result.type === 'win'){
    result.line.forEach(i => cells[i].classList.add('win'));
    if(result.mark === ai){
      statusText.textContent = 'IA venceu. Tente de novo 😈';
    } else {
      statusText.textContent = 'Você venceu (isso não deveria acontecer 😉).';
    }
  } else {
    statusText.textContent = 'Empate. Boa defesa!';
  }
}

/* ---------- Lógica do jogo ---------- */
const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function winnerInfo(b){
  for(const line of LINES){
    const [a,b1,c] = line;
    if(b[a] && b[a] === b[b1] && b[a] === b[c]){
      return { mark: b[a], line };
    }
  }
  return null;
}

/* Minimax com poda alfa-beta */
function bestMove(b, aiMark, humanMark){
  // se tabuleiro vazio e IA começa, jogue no centro
  if(b.every(v => v === null)){
    return 4;
  }
  let best = { score: -Infinity, move: null };
  for(const m of availableMoves(b)){
    b[m] = aiMark;
    const score = minimax(b, false, aiMark, humanMark, -Infinity, Infinity, 0);
    b[m] = null;
    if(score > best.score){
      best = { score, move: m };
    }
  }
  return best.move;
}

function availableMoves(b){
  const arr=[];
  for(let i=0;i<9;i++) if(!b[i]) arr.push(i);
  return arr;
}

function minimax(b, isMax, aiMark, humanMark, alpha, beta, depth){
  const w = winnerInfo(b);
  if(w){
    if(w.mark === aiMark) return 10 - depth;
    if(w.mark === humanMark) return depth - 10;
  }
  if(b.every(v => v !== null)) return 0; // empate

  if(isMax){
    let best = -Infinity;
    for(const m of availableMoves(b)){
      b[m] = aiMark;
      const val = minimax(b, false, aiMark, humanMark, alpha, beta, depth+1);
      b[m] = null;
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if(beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for(const m of availableMoves(b)){
      b[m] = humanMark;
      const val = minimax(b, true, aiMark, humanMark, alpha, beta, depth+1);
      b[m] = null;
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if(beta <= alpha) break;
    }
    return best;
  }
}

/* Acessibilidade via teclado (setas + enter) */
boardEl.addEventListener('keydown', (e)=>{
  const focused = document.activeElement;
  if(!focused.classList.contains('cell')) return;
  const idx = parseInt(focused.dataset.idx,10);
  let next = idx;
  const col = idx % 3, row = Math.floor(idx/3);
  if(e.key === 'ArrowRight' && col < 2) next = idx + 1;
  if(e.key === 'ArrowLeft'  && col > 0) next = idx - 1;
  if(e.key === 'ArrowDown'  && row < 2) next = idx + 3;
  if(e.key === 'ArrowUp'    && row > 0) next = idx - 3;
  if(next !== idx){
    e.preventDefault();
    cells[next].focus();
  }
  if(e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    cells[idx].click();
  }
});

/* Início automático para quem quiser testar rápido */
startGame();
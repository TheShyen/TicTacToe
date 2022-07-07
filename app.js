"use strict";
const cells = document.getElementById('cells');
const result = document.getElementById('result');
const cell = document.querySelectorAll('.box');
const resetBtn = document.getElementById('restart');
const modalResult = document.getElementById('modal-result-wrapper');
const overlay = document.getElementById('overlay');
const aiPlayer = "О",
    huPlayer = "Х";

class Game {
    constructor() {
        this.turn = Math.floor(Math.random() * 2);
        this.result = result;
        this.turnCount = 0;
        resetBtn.addEventListener("click", () => {
            modalResult.style.display = 'none';
            this.resetGame();
        });
        this.cellList = [];
        this.rend();
        cells.addEventListener("click", this.humanPlay());
        this.cells = cells;
        this.checkWinner(huPlayer);
    }
    rend() {
        for (let i = 0; i < 9; i++) {
            let dd = document.getElementById(i);
            this.cellList.push(dd);
        }
        this.board = Array.from(Array(9).keys());
    }

    resetGame() {
        this.board = Array.from(Array(9).keys());
        result.innerHTML = "";
        cell.forEach((e) => (e.innerHTML = ""));
        this.turnCount = 0;
        this.cellList = [];
        this.rend();
    }

    humanPlay() {
        return (e) => {
            this.turnCount++;
            if (e.target.className == "box") {
                let id = e.target.getAttribute("id");
                this.cellList[+id].innerHTML = huPlayer;
                this.board[+id] = huPlayer;
            }
            if (this.checkWinner(this.board, huPlayer)) {
                result.innerHTML = "You win!";
                modalResult.style.display = 'block';
                return;
            }
            if (this.turnCount >= 9) {
                result.innerHTML = "Draw!";
                modalResult.style.display = 'block';
                return;
            }
            this.makeAiTurn();
        };
    }

    makeAiTurn() {
        this.turnCount += 1;
        const bestMove = this.minimax(this.board, aiPlayer);
        this.board[bestMove.idx] = aiPlayer;
        this.cellList[bestMove.idx].innerHTML = aiPlayer;
        if (this.turnCount >= 9) {
            result.innerHTML = "Draw!";
            modalResult.style.display = 'block';
            return;
        }
        if (this.checkWinner(this.board, aiPlayer)) {
            result.innerHTML = "AI win!";
            modalResult.style.display = 'block';
            return;
        }   
    }

    checkWinner(board, player) {
        if (board[0] === player && board[1] === player && board[2] === player ||
          board[3] === player && board[4] === player && board[5] === player ||
          board[6] === player && board[7] === player && board[8] === player ||
          board[0] === player && board[3] === player && board[6] === player ||
          board[1] === player && board[4] === player && board[7] === player ||
          board[2] === player && board[5] === player && board[8] === player ||
          board[0] === player && board[4] === player && board[8] === player ||
          board[2] === player && board[4] === player && board[6] === player) {
          return true;
        }
        return false;
    }

    minimax(board, player) {
        const emptyCells = this.findEmptyCells(board);
        if (this.checkWinner(board, huPlayer)) {
            return { score: -1 };
        } else if (this.checkWinner(board, aiPlayer)) {
            return { score: 1 };
        } else if (emptyCells.length === 0) {
            return { score: 0 };
        }

        let moves = [];

        for (let i = 0; i < emptyCells.length; i++) {
            let move = [];
            board[emptyCells[i]] = player;
            move.idx = emptyCells[i];
            if (player === huPlayer) {
                const payload = this.minimax(board, aiPlayer);
                move.score = payload.score;
            }
            if (player === aiPlayer) {
                const payload = this.minimax(board, huPlayer);
                move.score = payload.score;
            }
            board[emptyCells[i]] = move.idx;
            moves.push(move);
        }

        let bestMove = null;

        if (player === aiPlayer) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    findEmptyCells(board) {
        return board.filter((c) => c !== huPlayer && c !== aiPlayer);
    }

}

new Game();

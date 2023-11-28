function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  const dropToken = (row, column, playerMarker) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addValue(playerMarker);
    }
  };

  const resetBoard = (row, column, playerMarker) => {
    if (!(board[row][column].getValue() === 0)) {
      board[row][column].addValue(playerMarker);
    }
  };

  return { getBoard, printBoard, dropToken, resetBoard };
}

function Cell() {
  let value = 0;

  const addValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addValue,
    getValue,
  };
}

function gameState(player1, player2) {
  let playerOneName = player1;
  let playerTwoName = player2;

  const board = gameBoard();

  const players = [
    {
      name: player1,
      marker: "X",
      wins: 0,
    },
    {
      name: player2,
      marker: "O",
      wins: 0,
    },
  ];

  const player1score = () => players[0].wins;
  const player2score = () => players[1].wins;

  const incrementScore = () => {
    getActivePlayer().wins++;
  };

  let activePlayer = players[0];
  let turnCount = 0;
  const turnSwap = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    turnCount++;
  };
  const getActivePlayer = () => activePlayer;

  const testPrint = () => {
    board.printBoard();
  };
  const playRound = (row, column) => {
    console.log(`Placing ${getActivePlayer().marker}`);
    board.dropToken(row, column, getActivePlayer().marker);
    board.printBoard();
  };
  const winCheck = () => {
    const winState = [
      [
        board.getBoard()[0][0].getValue() +
          board.getBoard()[0][1].getValue() +
          board.getBoard()[0][2].getValue(),
      ],
      [
        board.getBoard()[1][0].getValue() +
          board.getBoard()[1][1].getValue() +
          board.getBoard()[1][2].getValue(),
      ],
      [
        board.getBoard()[2][0].getValue() +
          board.getBoard()[2][1].getValue() +
          board.getBoard()[2][2].getValue(),
      ],
      [
        board.getBoard()[0][0].getValue() +
          board.getBoard()[1][0].getValue() +
          board.getBoard()[2][0].getValue(),
      ],
      [
        board.getBoard()[0][1].getValue() +
          board.getBoard()[1][1].getValue() +
          board.getBoard()[2][1].getValue(),
      ],
      [
        board.getBoard()[0][2].getValue() +
          board.getBoard()[1][2].getValue() +
          board.getBoard()[2][2].getValue(),
      ],
      [
        board.getBoard()[0][0].getValue() +
          board.getBoard()[1][1].getValue() +
          board.getBoard()[2][2].getValue(),
      ],
      [
        board.getBoard()[2][0].getValue() +
          board.getBoard()[1][1].getValue() +
          board.getBoard()[0][2].getValue(),
      ],
    ];
    for (let i = 0; i < winState.length; i++) {
      if (
        winState[i] ==
        getActivePlayer().marker +
          getActivePlayer().marker +
          getActivePlayer().marker
      ) {
        return i;
      } else {
      }
    }
  };

  const tieCheck = () => {
    if (turnCount > 8) {
      return true;
    } else {
      return false;
    }
  };

  const resetGame = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board.resetBoard(i, j, 0);
      }
    }
    turnCount = 0;
    board.printBoard();
  };

  return {
    playRound,
    testPrint,
    turnSwap,
    getActivePlayer,
    winCheck,
    tieCheck,
    resetGame,
    player1score,
    player2score,
    incrementScore,
  };
}

(function displayState() {
  const textArea = document.querySelector(".turn-display");
  const gameArea = document.querySelector(".game-board");

  const winningStyle = () => {
    const winPos = [
      ["a00", "a01", "a02"],
      ["a10", "a11", "a12"],
      ["a20", "a21", "a22"],
      ["a00", "a10", "a20"],
      ["a01", "a11", "a21"],
      ["a02", "a12", "a22"],
      ["a00", "a11", "a22"],
      ["a20", "a11", "a02"],
    ];

    let i = game.winCheck();
    const winBox1 = document.querySelector(`#${winPos[i][0]}`);
    const winBox2 = document.querySelector(`#${winPos[i][1]}`);
    const winBox3 = document.querySelector(`#${winPos[i][2]}`);
    winBox1.classList.add("winner");
    winBox2.classList.add("winner");
    winBox3.classList.add("winner");
    textArea.textContent = `The winner is ${
      game.getActivePlayer().name
    }, congratulations!`;
    gameArea.style.pointerEvents = "none";
    resetBtn.textContent = "Play again";
  };

  const displayGenerate = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let boxID = "a" + i.toString() + j.toString();
        let box = document.createElement("div");
        box.classList.add("box");
        box.setAttribute("id", boxID);
        gameArea.appendChild(box);

        box.addEventListener("click", function clickFunction(e) {
          let positionArr = e.target.id.split("");
          game.playRound(positionArr[1], positionArr[2]);
          box.textContent = `${game.getActivePlayer().marker}`;
          if (game.winCheck() >= 0) {
            winningStyle();
            if (game.getActivePlayer().marker === "X") {
              game.incrementScore();
            } else {
              game.incrementScore();
            }
            winTracker1.textContent = `Wins: ${game.player1score()}`;
            winTracker2.textContent = `Wins: ${game.player2score()}`;
          } else {
            game.turnSwap();
            turnLogic();
            if (game.tieCheck()) {
              textArea.textContent = "Tie Game. Try again?";
              resetBtn.textContent = "Play again";
            }
            box.removeEventListener("click", clickFunction);
          }
        });
      }
    }
  };
  const resetDisplay = () => {
    for (let i = 0; i < 9; i++) {
      gameArea.lastChild.remove();
    }
    displayGenerate();
  };
  const turnLogic = () => {
    if (game.getActivePlayer().name == player1NameBox.id) {
      namePlateL.classList.add("currentTurnStyle");
      //   namePlateL.classList.remove("left");
      namePlateR.classList.remove("currentTurnStyle");
      //   namePlateR.classList.add("right");
    } else {
      namePlateR.classList.add("currentTurnStyle");
      //   namePlateR.classList.remove("right");
      namePlateL.classList.remove("currentTurnStyle");
      //   namePlateL.classList.add("left");
    }
    textArea.textContent = `${game.getActivePlayer().name}'s turn.`;
  };

  const resetGame = () => {
    resetDisplay();
    game.turnSwap();
    turnLogic();
    game.resetGame();
    gameArea.style.pointerEvents = "all";
    textArea.textContent = `${game.getActivePlayer().name}'s turn.`;
    resetBtn.textContent = "Reset Board";
  };
  const resetBtn = document.querySelector(".reset");
  resetBtn.addEventListener("click", resetGame);

  const playerForm = document.querySelector(".player-form");
  const player1Form = document.querySelector("#player1");
  const player2Form = document.querySelector("#player2");
  const main = document.querySelector(".main");
  const namePlateL = document.querySelector(".left");
  const namePlateR = document.querySelector(".right");
  const newPlayerBtn = document.querySelector(".new-players");

  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    game = gameState(player1Form.value, player2Form.value);
    gameArea.style.visibility = "visible";
    main.style.animation = "fadeIn 3s";
    resetBtn.style.visibility = "visible";
    newPlayerBtn.style.visibility = "visible";
    resetBtn.style.animation = "fadeIn 3s";
    newPlayerBtn.style.animation = "fadeIn 3s";
    playerForm.style.display = "none";
    main.style.display = "flex";
    textArea.style.visibility = "visible";
    textArea.textContent = `${game.getActivePlayer().name}'s turn.`;
    createNameBox();
    displayGenerate();
    player1Form.value = "";
    player2Form.value = "";
    namePlateL.classList.add("currentTurnStyle");
  });

  const player1NameBox = document.createElement("div");
  const player2NameBox = document.createElement("div");
  const winTracker1 = document.createElement("p");
  const winTracker2 = document.createElement("p");

  const createNameBox = () => {
    player1NameBox.setAttribute("id", `${player1Form.value}`);
    player2NameBox.setAttribute("id", `${player2Form.value}`);
    player1NameBox.style.display = "flex";
    player2NameBox.style.display = "flex";
    player1NameBox.style.flexDirection = "column";
    player2NameBox.style.flexDirection = "column";
    player1NameBox.style.justifyContent = "center";
    player2NameBox.style.justifyContent = "center";
    player1NameBox.style.alignItems = "center";
    player2NameBox.style.alignItems = "center";
    player1NameBox.textContent = `${player1Form.value}`;
    player2NameBox.textContent = `${player2Form.value}`;
    winTracker1.textContent = `Wins: ${game.player1score()}`;
    winTracker2.textContent = `Wins: ${game.player2score()}`;
    namePlateL.appendChild(player1NameBox);
    namePlateR.appendChild(player2NameBox);
    player1NameBox.appendChild(winTracker1);
    player2NameBox.appendChild(winTracker2);
  };

  return { displayGenerate, resetDisplay, createNameBox, turnLogic, resetGame };
})();

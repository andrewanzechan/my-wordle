import { useState } from "react";
import "./styles.css";

export function WordleGame() {
  const MAX_ATTEMPTS: number = 5;
  const [guessHistory, setGuessHistory]: [Array<string>, Function] = useState(Array(MAX_ATTEMPTS).fill(""));
  const targetWord: string = "tests";
  let attempts: number = 0;
  const WIN: string = "win";
  const LOSE: string = "lose";
  const IN_PROGRESS: string = "in progress";
  let gameStatus: string = IN_PROGRESS;
  let [currentGuess, setCurrentGuess]: [string, Function] = useState("");

  function handlePlay(nextGuess: string): void {
    console.log("processing guess: " + nextGuess)
    if (attempts >= MAX_ATTEMPTS) {
      console.log("max attempts reached; guess not registered")
      return;
    }
    if (nextGuess.length != targetWord.length) {
      console.log("guessed word has the wrong length, expected " + targetWord.length + ", saw " + nextGuess.length);
      return;
    }
    console.log("making a guess");
    const nextGuessHistory: Array<string> = [...guessHistory.slice(0, attempts), nextGuess];
    setGuessHistory(nextGuessHistory);  // puts the new guess history back into the state
    attempts += 1;
    if (nextGuess === targetWord) {
      console.log("win");
      gameStatus = WIN;
    } else if (attempts >= MAX_ATTEMPTS) {
      console.log("lose");
      gameStatus = IN_PROGRESS;
    }
  }

  return (
    <>
    <div className="game">
      <div className="game-board">
        <div className="status"> Attempts remaining: {MAX_ATTEMPTS - attempts} </div>
        <div className="status"> Game status: {gameStatus} </div>
        <Board guessHistory={guessHistory} />
      </div>
    </div>
    <div>
      <form>
        <label>Guess: </label>
        <input type="text" value={currentGuess} />
        <button type="button" onClick={handlePlay(currentGuess)}> Confirm </button>
      </form>
    </div>
    </>
  );
}

function Square({ letter }: { letter: string }) {
  return (
    <div className="square">
      {letter}
    </div>
  );
}

function Board({ guessHistory }: { guessHistory: Array<string> }) {
  return (
    <>
      {guessHistory.map((guessHistoryEntry : string) => 
        <div className="board-row">
          <Square letter={guessHistoryEntry[0]} />
          <Square letter={guessHistoryEntry[1]} />
          <Square letter={guessHistoryEntry[2]} />
          <Square letter={guessHistoryEntry[3]} />
          <Square letter={guessHistoryEntry[4]} />
      </div>
      )}
    </>
  );
}

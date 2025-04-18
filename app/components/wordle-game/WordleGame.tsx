import { useState } from "react";
import "./styles.css";

type LetterStatus = "correct" | "present" | "absent";

interface LetterGuess {
    letter: string;
    status: LetterStatus;
}

export function WordleGame() {
    const MAX_ATTEMPTS: number = 5;
    const WIN: string = "win";
    const LOSE: string = "lose";
    const IN_PROGRESS: string = "in progress";
    
    const targetWord: string = "tests";
    const targetLetters: Array<string> = targetWord.split("");
    const [currentGuess, setCurrentGuess]: [string, Function] = useState("");
    const [guessHistory, setGuessHistory]: [Array<LetterGuess[]>, Function] = useState(Array(MAX_ATTEMPTS).fill([]));
    const [attempts, setAttempts]: [number, Function] = useState(0);
    const [gameStatus, setGameStatus]: [string, Function] = useState(IN_PROGRESS);

    function reset(): void {
        console.log("reset game");
        setGuessHistory(Array(MAX_ATTEMPTS).fill(""));
        console.log("guessHistory: " + guessHistory);
        setCurrentGuess("");
        console.log("currentGuess: " + currentGuess);
        setAttempts(0);
        console.log("attempts: " + attempts);
        setGameStatus(IN_PROGRESS);
    }

    function handlePlay(nextGuess: string): void {
        nextGuess = nextGuess.toLowerCase().trim();
        console.log("processing guess: " + nextGuess);
        if (gameStatus !== IN_PROGRESS) {
            console.log("Game is over; please reset");
            return;
        }
        if (!/^[a-zA-z]+/.test(nextGuess)) {
            console.log("guess must only contain letters");
            return;
        }
        if (nextGuess.length != targetWord.length) {
            console.log("guessed word has the wrong length, expected " + targetWord.length + ", saw " + nextGuess.length);
            return;
        }
        if (guessHistory.some(g => g.map(l => l.letter).join("") === nextGuess)) {
            console.log("word already guessed");
            return;
        }

        console.log("making a guess");
        const nextLetterGuess: LetterGuess[] = Array(targetWord.length).fill(null).map((_, i) => ({
            letter: nextGuess[i],
            status: "absent" as LetterStatus
        }));
        const matchedIndices: Array<boolean> = Array(targetWord.length).fill(false);
        // first pass for exact matches
        for (let i = 0; i < targetWord.length; i++) {
            if (nextGuess[i] === targetLetters[i]) {
                nextLetterGuess[i].status = "correct";
                matchedIndices[i] = true;
            }
        }
        // second pass for present letters but not exact
        for (let i = 0; i < targetWord.length; i++) {
            if (nextLetterGuess[i].status === "correct") {
                continue;
            }
            const index = targetLetters.findIndex((c, idx) => c === nextGuess[i] && !matchedIndices[idx])
            if (index !== -1) {
                nextLetterGuess[i].status = "present";
                matchedIndices[index] = true;
            }
        }

        const nextGuessHistory: Array<LetterGuess[]> = [...guessHistory];
        nextGuessHistory[attempts] = nextLetterGuess;
        setGuessHistory(nextGuessHistory);  // puts the new guess history back into the state
        
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (nextGuess === targetWord) {
            console.log("win");
            setGameStatus(WIN);
        } else if (attempts >= MAX_ATTEMPTS) {
            console.log("lose");
            setGameStatus(LOSE);
        }
        console.log("attempts: " + attempts);
        setCurrentGuess("");
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
                    <input type="text" id="guessInput" onChange={e => setCurrentGuess(e.target.value)} />
                    <button type="button" onClick={() => handlePlay(currentGuess)}> Confirm </button>
                </form>
            </div>
            <div>
                <button type="button" onClick={() => reset()}> Reset </button>
            </div>
        </>
    );
}

function Square({ letter, letterStatus }: { letter: string, letterStatus: LetterStatus }) {
    return (
        <div className={`square ${letterStatus}`}>
            {letter}
        </div>
    );
}

function Board({ guessHistory }: { guessHistory: Array<LetterGuess[]> }) {
    return (
        <>
            {guessHistory.map((guessHistoryEntry: LetterGuess[], rowIndex: number) => (
                <div className="board-row" key={rowIndex}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <Square 
                            key={i} 
                            letter={guessHistoryEntry?.[i]?.letter || ""} 
                            letterStatus={guessHistoryEntry?.[i]?.status || "absent"}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

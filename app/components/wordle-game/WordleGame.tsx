import { useState } from "react";
import Button from "@mui/material/Button"
import "./styles.css";
import { TextField } from "@mui/material";

type LetterStatus = "correct" | "present" | "absent";

interface LetterGuess {
    letter: string;
    status: LetterStatus;
}

export function WordleGame() {
    const MAX_ATTEMPTS: number = 5;
    const WIN: string = "Win";
    const LOSE: string = "Lose";
    const IN_PROGRESS: string = "In progress";

    const targetWord: string = "tests";

    const ERROR_GAME_OVER = "The game is over; please reset the game."
    const ERROR_ALREADY_GUESSED = "You have already guessed this word."
    const ERROR_GUESS_WORD_LENGTH_INCORRECT = `Your guess must have ${targetWord.length} letters.`

    const ALPHA_REGEX = /^[a-zA-Z]+$/;
    
    const targetLetters: Array<string> = targetWord.split("");
    const [currentGuess, setCurrentGuess]: [string, Function] = useState("");
    const [guessHistory, setGuessHistory]: [Array<LetterGuess[]>, Function] 
        = useState<LetterGuess[][]>(Array.from({ length: MAX_ATTEMPTS }, () => []));
    const [attempts, setAttempts]: [number, Function] = useState(0);
    const [gameStatus, setGameStatus]: [string, Function] = useState(IN_PROGRESS);
    const [guessMessage, setGuessMessage]: [string, Function] = useState("");

    function reset(): void {
        console.log("reset game");
        setGuessHistory(Array.from({ length: MAX_ATTEMPTS }, () => []));
        setCurrentGuess("");
        setAttempts(0);
        setGameStatus(IN_PROGRESS);
    }

    function handlePlay(nextGuess: string): void {
        nextGuess = nextGuess.toLowerCase().trim();
        console.log("processing guess: " + nextGuess);
        if (gameStatus !== IN_PROGRESS) {
            console.log(ERROR_GAME_OVER);
            setGuessMessage(ERROR_GAME_OVER);
            return;
        }
        if (nextGuess.length != targetWord.length) {
            console.log(ERROR_GUESS_WORD_LENGTH_INCORRECT);
            setGuessMessage(ERROR_GUESS_WORD_LENGTH_INCORRECT);
            return;
        }
        if (guessHistory.some(g => g.map(l => l.letter).join("") === nextGuess)) {
            console.log(ERROR_ALREADY_GUESSED);
            setGuessMessage(ERROR_ALREADY_GUESSED);
            return;
        }
        setGuessMessage("");

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
            <div className="status"> Attempts remaining: {MAX_ATTEMPTS - attempts} </div>
            <div className="status"> Game status: {gameStatus} </div>
            <div className="game">
                <div className="game-board">
                    <Board guessHistory={guessHistory} />
                </div>
            </div>
            <div>
                <TextField 
                    className="guess-textfield" 
                    label="Guess" 
                    value={currentGuess} onChange={e => setCurrentGuess(e.target.value)}
                    onKeyDown={e => {
                        if (!ALPHA_REGEX.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
                <div className="status">
                    {guessMessage}
                </div>
            </div>
            <div>
                <Button type="button" onClick={() => handlePlay(currentGuess)}> Confirm </Button>
            </div>
            <div>
                <Button type="button" onClick={() => reset()}> Reset </Button>
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
        <div className="wordle-board">
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
        </div>
    );
}

import "./wordleGame.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Rand from "rand-seed";


type LetterStatus = "correct" | "present" | "absent";

interface LetterGuess {
    letter: string;
    status: LetterStatus;
}

const MAX_ATTEMPTS: number = 7;
const MAX_WORD_LENGTH: number = 7;
const WIN: string = "Win";
const LOSE: string = "Lose";
const IN_PROGRESS: string = "In progress";

const ERROR_GAME_OVER = "The game is over; please reset the game.";
const ERROR_ALREADY_GUESSED = "You have already guessed this word.";
const ERROR_GUESS_WORD_LENGTH_INCORRECT = `Your guess must have ${MAX_WORD_LENGTH} letters.`;
const ERROR_GUESS_NOT_IN_DICTIONARY = "Your guess is not in the dictionary.";
const ERROR_API_CALL_FAILED = "API call failed. Please try again.";

const ALPHA_REGEX = /^[a-zA-Z]+$/;

export function WordleGame() {
    const [currentGuess, setCurrentGuess]: [string, Function] = useState("");
    const [guessHistory, setGuessHistory]: [Array<LetterGuess[]>, Function] 
        = useState<LetterGuess[][]>(Array.from({ length: MAX_ATTEMPTS }, () => []));
    const [attempts, setAttempts]: [number, Function] = useState(0);
    const [gameStatus, setGameStatus]: [string, Function] = useState(IN_PROGRESS);
    const [guessMessage, setGuessMessage]: [string, Function] = useState("");
    const [targetWord, setTargetWord]: [string, Function] = useState("");
    const today = new Date();
    const seed = today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString();
    const rand = new Rand(seed);
    
    // Fetch a random word from the Datamuse API
    useEffect(() => {
        axios.get(`https://api.datamuse.com/words?sp=${Array(MAX_WORD_LENGTH).fill("?").join("")}&max=1000`)
            .then((response) => {
                const randomIndex: number = Math.floor(rand.next() * 1000);
                setTargetWord(response.data[randomIndex].word.toLowerCase());
            })
            .catch((error) => {
                console.error("Error fetching data from API:", error);
            });
    }, []);

    // Reset the game by clearing old guesses and attempts
    function reset(): void {
        console.log("Resetting game");
        setGuessHistory(Array.from({ length: MAX_ATTEMPTS }, () => []));
        setCurrentGuess("");
        setAttempts(0);
        setGameStatus(IN_PROGRESS);
    }

    // Checks if the guess is valid
    async function validateGuess(guess: string): Promise<boolean> {
        console.log("validating guess: " + guess);

        // Check if the game is over
        if (gameStatus !== IN_PROGRESS) {
            console.log(ERROR_GAME_OVER);
            setGuessMessage(ERROR_GAME_OVER);
            return false;
        }

        // Check if the guess has enough letters
        if (guess.length != targetWord.length) {
            console.log(ERROR_GUESS_WORD_LENGTH_INCORRECT);
            setGuessMessage(ERROR_GUESS_WORD_LENGTH_INCORRECT);
            return false;
        }

        // Check if the guess was already guessed
        if (guessHistory.some(g => g.map(l => l.letter).join("") === guess)) {
            console.log(ERROR_ALREADY_GUESSED);
            setGuessMessage(ERROR_ALREADY_GUESSED);
            return false;
        }

        // Check if the guess is a real word
        try {
            const response = await axios.get(`https://api.datamuse.com/words?sp=${guess}&max=1`);
            if (response.data.length === 0 || response.data[0].word.toLowerCase() !== guess) {
                console.log(ERROR_GUESS_NOT_IN_DICTIONARY);
                setGuessMessage(ERROR_GUESS_NOT_IN_DICTIONARY);
                return false;
            }
        } catch(error) {
            console.error("Error fetching data from API: ", error);
            setGuessMessage(ERROR_API_CALL_FAILED);
            return false;
        }
        return true;
    }

    // Processes the guess
    async function handlePlay(nextGuess: string): Promise<void> {
        nextGuess = nextGuess.toLowerCase().trim();
        
        if (await validateGuess(nextGuess) === false) {
            return;
        }

        setGuessMessage("");

        console.log("making a guess: " + nextGuess);
        const targetLetters: Array<string> = targetWord.split("");

        const nextLetterGuess: LetterGuess[] = Array(MAX_WORD_LENGTH).fill(null).map((_, i) => ({
            letter: nextGuess[i],
            status: "absent" as LetterStatus
        }));
        const matchedIndices: Array<boolean> = Array(MAX_WORD_LENGTH).fill(false);
        // first pass for exact matches
        for (let i = 0; i < MAX_WORD_LENGTH; i++) {
            if (nextGuess[i] === targetLetters[i]) {
                nextLetterGuess[i].status = "correct";
                matchedIndices[i] = true;
            }
        }
        // second pass for present letters but not exact
        for (let i = 0; i < MAX_WORD_LENGTH; i++) {
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
        setGuessHistory(nextGuessHistory);
        
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (nextGuess === targetWord) {
            console.log(WIN);
            setGameStatus(WIN);
        } else if (newAttempts >= MAX_ATTEMPTS) {
            console.log(LOSE);
            setGameStatus(LOSE);
        }
        console.log("attempts: " + newAttempts);
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
                    
                    // prevent typing non-alphabetic characters
                    onKeyDown={e => {
                        if (!ALPHA_REGEX.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
                <div className="status">
                    {guessMessage}
                </div>
                {gameStatus === LOSE && (
                <div className="status">The correct word was: {targetWord}</div>
                )}
            </div>
            <div>
                <Button type="button" onClick={() => handlePlay(currentGuess)}> Confirm </Button>
            </div>
            <div>
                <Button type="button" onClick={() => reset()}> New Game </Button>
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
                    {Array.from({ length: MAX_WORD_LENGTH }, (_, i) => (
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

import React, { useState, useEffect, useRef } from 'react';

interface WordData {
  word: string;
  hint: string;
}

const wordList: WordData[] = [
  { word: "LINKEDIN", hint: "Professional networking site" },
  { word: "GITHUB", hint: "Code hosting platform" },
  { word: "EMAIL", hint: "Electronic mail" },
  { word: "CONTACT", hint: "Reach out to me" },
  { word: "PROFILE", hint: "Summary of your skills and experience" },
];

const shuffleArray = (array: string[]): string[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateScrambledWord = (targetWord: string): string[] => {
  const letters = targetWord.split('');
  let scrambledLetters = shuffleArray([...letters]);
  // Ensure it's actually scrambled
  while (scrambledLetters.join('') === targetWord && targetWord.length > 1) {
    scrambledLetters = shuffleArray([...letters]);
  }
  return scrambledLetters;
};

interface Props {
  onGameComplete: (won: boolean) => void;
  gameDuration?: number; // Duration in seconds
}

const WordScrambleGame: React.FC<Props> = ({ onGameComplete, gameDuration = 5 }) => {
  const [wordData, setWordData] = useState<WordData>(wordList[Math.floor(Math.random() * wordList.length)]);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [isGameActive, setIsGameActive] = useState(true);

  useEffect(() => {
    const initialScrambled = generateScrambledWord(wordData.word);
    setScrambledLetters(initialScrambled);
    setCurrentGuess([...initialScrambled]);
  }, [wordData]);

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsGameActive(false);
          onGameComplete(false); // Time's up, lost
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, onGameComplete, gameDuration]);

  const handleLetterClick = (index: number) => {
    if (!isGameActive) return;

    if (selectedIndices.length === 0) {
      setSelectedIndices([index]);
    } else if (selectedIndices.length === 1) {
      const [firstIndex] = selectedIndices;
      const newGuess = [...currentGuess];
      // Swap letters
      [newGuess[firstIndex], newGuess[index]] = [newGuess[index], newGuess[firstIndex]];
      setCurrentGuess(newGuess);
      setSelectedIndices([]);

      if (newGuess.join('') === wordData.word) {
        setIsGameActive(false);
        onGameComplete(true); // Correct, won!
      }
    }
  };

  return (
    <div className="word-scramble-game game-card">
      <h3>Unscramble the Word!</h3>
      <p className="game-timer">Time Left: {timeLeft}s</p>
      <p className="game-hint">Hint: {wordData.hint}</p>
      <div className="scrambled-letters">
        {currentGuess.map((letter, index) => (
          <span
            key={index}
            className={`letter-tile ${selectedIndices.includes(index) ? 'selected' : ''}`}
            onClick={() => handleLetterClick(index)}
          >
            {letter}
          </span>
        ))}
      </div>
      {!isGameActive && (
        <p className="game-message">
          {currentGuess.join('') === wordData.word ? "You got it!" : "Time's up!"}
        </p>
      )}
    </div>
  );
};

export default WordScrambleGame;

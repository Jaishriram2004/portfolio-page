import React, { useState, useEffect } from 'react';

interface MathProblem {
  question: string;
  answer: number;
}

const generateRandomProblem = (): MathProblem => {
  const operations = ['+', '-', '*', '/'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1 = Math.floor(Math.random() * 10) + 1; // 1-10
  let num2 = Math.floor(Math.random() * 10) + 1; // 1-10
  let question = '';
  let answer = 0;

  switch (op) {
    case '+':
      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
      break;
    case '-':
      // Ensure positive result for simplicity
      if (num1 < num2) [num1, num2] = [num2, num1];
      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
      break;
    case '*':
      question = `${num1} * ${num2} = ?`;
      answer = num1 * num2;
      break;
    case '/':
      // Ensure whole number result
      answer = num1;
      num1 = num1 * num2; // Make num1 a multiple of num2
      question = `${num1} / ${num2} = ?`;
      break;
  }
  return { question, answer };
};

interface Props {
  onGameComplete: (won: boolean) => void;
  gameDuration?: number; // Duration in seconds
}

const MathGame: React.FC<Props> = ({ onGameComplete, gameDuration = 5 }) => {
  const [problem, setProblem] = useState<MathProblem>(generateRandomProblem());
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [isGameActive, setIsGameActive] = useState(true);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGameActive) return;

    const userAnswer = parseInt(inputValue, 10);
    if (!isNaN(userAnswer) && userAnswer === problem.answer) {
      setIsGameActive(false);
      onGameComplete(true); // Correct answer, won
    } else {
      // Optional: Give immediate feedback for wrong answer without ending game
      alert('Incorrect! Try again quickly.');
      setInputValue('');
      setProblem(generateRandomProblem()); // New problem on wrong answer
    }
  };

  return (
    <div className="math-game game-card">
      <h3>Solve the Math Problem!</h3>
      <p className="game-timer">Time Left: {timeLeft}s</p>
      <p className="game-question">{problem.question}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Your answer"
          disabled={!isGameActive}
          autoFocus
        />
        <button type="submit" disabled={!isGameActive}>Submit</button>
      </form>
    </div>
  );
};

export default MathGame;

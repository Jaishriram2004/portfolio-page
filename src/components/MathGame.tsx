import React, { useState, useEffect } from 'react';

interface MathProblem {
  question: string;
  answer: number;
}

// Function to generate a random math problem
const generateRandomProblem = (): MathProblem => {
  const operations = ['+', '-', '*', '/'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let question = '';
  let answer = 0;

  switch (op) {
    case '+':
      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
      break;
    case '-':
      if (num1 < num2) [num1, num2] = [num2, num1];
      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 9) + 2; // 2-10 for more interesting multiplication
      num2 = Math.floor(Math.random() * 9) + 2;
      question = `${num1} * ${num2} = ?`;
      answer = num1 * num2;
      break;
    case '/':
      answer = Math.floor(Math.random() * 9) + 2; // 2-10
      num2 = Math.floor(Math.random() * 9) + 2;
      num1 = answer * num2;
      question = `${num1} / ${num2} = ?`;
      break;
  }
  return { question, answer };
};

interface Props {
  onGameComplete: (won: boolean) => void;
  gameDuration?: number;
}

const MathGame: React.FC<Props> = ({ onGameComplete, gameDuration = 10 }) => {
  const [problem, setProblem] = useState<MathProblem>(generateRandomProblem());
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [isGameActive, setIsGameActive] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | ''>('');

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsGameActive(false);
          setFeedback("Time's up!");
          setFeedbackType('incorrect');
          setTimeout(() => onGameComplete(false), 1500);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, onGameComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGameActive || !inputValue) return;

    const userAnswer = parseInt(inputValue, 10);
    if (!isNaN(userAnswer) && userAnswer === problem.answer) {
      setIsGameActive(false);
      setFeedback('Correct!');
      setFeedbackType('correct');
      setTimeout(() => onGameComplete(true), 1500);
    } else {
      setInputValue('');
      setFeedback('Incorrect! Try again.');
      setFeedbackType('incorrect');
      // Hide feedback after a moment to allow another try
      setTimeout(() => {
        setFeedback('');
        setFeedbackType('');
      }, 1000);
      // Optional: generate a new problem on wrong answer
      // setProblem(generateRandomProblem());
    }
  };

  const timerPercentage = (timeLeft / gameDuration) * 100;

  return (
    <>
      <style>{`
        .math-game-container {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          text-align: center;
          width: 100%;
          max-width: 400px;
          font-family: var(--font-main);
          color: var(--text-color);
        }
        .math-game-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent-color);
          margin: 0 0 16px;
        }
        .timer-bar-container {
          width: 100%;
          background-color: #e9ecef;
          border-radius: 8px;
          height: 12px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .timer-bar {
          height: 100%;
          background: linear-gradient(90deg, #4dabf7, #228be6);
          border-radius: 8px;
          transition: width 0.5s linear;
        }
        .math-question {
          font-size: 2rem;
          font-weight: 600;
          margin: 24px 0;
          letter-spacing: 2px;
        }
        .math-form {
          display: flex;
          justify-content: center;
          gap: 12px;
          align-items: center;
        }
        .math-input {
          font-size: 1.5rem;
          padding: 10px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          width: 120px;
          text-align: center;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .math-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(var(--accent-color), 0.2);
        }
        .math-submit-btn {
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 14px 24px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
        }
        .math-submit-btn:hover:not(:disabled) {
          background-color: oklch(50% 0.15 265);
          transform: translateY(-2px);
        }
        .math-submit-btn:disabled {
          background-color: #ced4da;
          cursor: not-allowed;
        }
        .math-feedback {
          margin-top: 16px;
          font-size: 1.1rem;
          font-weight: 500;
          height: 24px; /* Reserve space */
          transition: opacity 0.3s;
        }
        .math-feedback.correct {
          color: #28a745;
        }
        .math-feedback.incorrect {
          color: #dc3545;
        }
      `}</style>
      <div className="math-game-container">
        <h3 className="math-game-title">Quick Math Challenge!</h3>
        <div className="timer-bar-container">
          <div className="timer-bar" style={{ width: `${timerPercentage}%` }}></div>
        </div>
        <p className="math-question">{problem.question}</p>
        <form className="math-form" onSubmit={handleSubmit}>
          <input
            className="math-input"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="?"
            disabled={!isGameActive}
            autoFocus
          />
          <button className="math-submit-btn" type="submit" disabled={!isGameActive}>
            Check
          </button>
        </form>
        <div className={`math-feedback ${feedbackType}`}>
          {feedback}
        </div>
      </div>
    </>
  );
};

export default MathGame;

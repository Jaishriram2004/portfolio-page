import React, { useState, useEffect, useCallback, useRef } from 'react';

const ITEM_SIZE = 30; // size of the falling item and catcher
const CATCHER_WIDTH = 80;
const GAME_AREA_WIDTH = 300;
const GAME_AREA_HEIGHT = 200;
const FALL_SPEED = 20; // pixels per frame

interface Props {
  onGameComplete: (won: boolean) => void;
  gameDuration?: number; // Duration in seconds
}

const CatchGame: React.FC<Props> = ({ onGameComplete, gameDuration = 5 }) => {
  const [itemPosition, setItemPosition] = useState({ x: GAME_AREA_WIDTH / 2 - ITEM_SIZE / 2, y: 0 });
  const [catcherPosition, setCatcherPosition] = useState(GAME_AREA_WIDTH / 2 - CATCHER_WIDTH / 2); // X position of catcher
  const [isGameActive, setIsGameActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (gameAreaRef.current && isGameActive) {
      const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
      let newCatcherX = e.clientX - gameAreaRect.left - CATCHER_WIDTH / 2;
      newCatcherX = Math.max(0, Math.min(newCatcherX, GAME_AREA_WIDTH - CATCHER_WIDTH));
      setCatcherPosition(newCatcherX);
    }
  }, [isGameActive]);

  useEffect(() => {
    if (!isGameActive) return;

    // Game Timer
    const gameTimer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(gameTimer);
          setIsGameActive(false);
          onGameComplete(false); // Time's up, lost
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Item Fall
    const fallInterval = setInterval(() => {
      setItemPosition((prevPos) => {
        const newY = prevPos.y + FALL_SPEED;

        // Check for catch
        if (newY + ITEM_SIZE >= GAME_AREA_HEIGHT &&
            prevPos.x + ITEM_SIZE > catcherPosition &&
            prevPos.x < catcherPosition + CATCHER_WIDTH) {
          clearInterval(fallInterval);
          clearInterval(gameTimer);
          setIsGameActive(false);
          onGameComplete(true); // Caught!
          return { ...prevPos, y: GAME_AREA_HEIGHT - ITEM_SIZE };
        }

        // Check if item hit bottom without being caught
        if (newY >= GAME_AREA_HEIGHT) {
          clearInterval(fallInterval);
          clearInterval(gameTimer);
          setIsGameActive(false);
          onGameComplete(false); // Missed!
          return { ...prevPos, y: GAME_AREA_HEIGHT - ITEM_SIZE };
        }

        return { ...prevPos, y: newY };
      });
    }, 200); // Adjust fall interval for speed

    return () => {
      clearInterval(gameTimer);
      clearInterval(fallInterval);
    };
  }, [isGameActive, onGameComplete, gameDuration, catcherPosition]);

  useEffect(() => {
    // Add mouse move listener to the game area
    const gameAreaElement = gameAreaRef.current;
    if (gameAreaElement) {
      gameAreaElement.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (gameAreaElement) {
        gameAreaElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [handleMouseMove]);

  return (
    <div className="catch-game game-card">
      <h3>Catch the Falling Item!</h3>
      <p className="game-timer">Time Left: {timeLeft}s</p>
      <div
        ref={gameAreaRef}
        className="catch-game-area"
        style={{
          width: GAME_AREA_WIDTH,
          height: GAME_AREA_HEIGHT,
          border: '2px solid var(--border-color)',
          backgroundColor: 'var(--background-color)',
          position: 'relative',
          overflow: 'hidden',
          cursor: isGameActive ? 'none' : 'default', // Hide cursor during game
        }}
      >
        {isGameActive && (
          <>
            <div
              className="falling-item"
              style={{
                position: 'absolute',
                left: itemPosition.x,
                top: itemPosition.y,
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                borderRadius: '50%',
                backgroundColor: 'var(--accent-color)', // Represent the "egg"
              }}
            ></div>
            <div
              className="catcher"
              style={{
                position: 'absolute',
                left: catcherPosition,
                bottom: 0,
                width: CATCHER_WIDTH,
                height: ITEM_SIZE / 2,
                backgroundColor: oklch(25% 0.02 240), // Darker color for catcher
                borderRadius: '5px 5px 0 0',
              }}
            ></div>
          </>
        )}
        {!isGameActive && (
          <p className="game-message">
            {timeLeft === 0 ? "Time's up!" : (itemPosition.y + ITEM_SIZE >= GAME_AREA_HEIGHT ? "Missed!" : "Caught!")}
          </p>
        )}
      </div>
    </div>
  );
};

export default CatchGame;

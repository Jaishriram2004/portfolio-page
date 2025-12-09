import React, { useState } from 'react';
import MathGame from './MathGame.tsx';

// This component orchestrates the game-based unlocking of content.
const InteractiveContactTile: React.FC = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Add a key to reset the game
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameComplete = (won: boolean) => {
    if (won) {
      setIsUnlocked(true);
    } else {
      alert("Try again to unlock the contacts!");
      setGameKey(prevKey => prevKey + 1); // Change the key to force re-mount
    }
  };

  if (isUnlocked) {
    // The child is the <div class="contact-grid reveal-on-scroll">...</div>
    // We need to add the 'is-visible' class to make it appear.
    const child = React.Children.only(children) as React.ReactElement<any>;
    const newClassName = `${child.props.className} is-visible`;
    return React.cloneElement(child, { className: newClassName });
  }

  if (!gameStarted) {
    return (
      <div className="interactive-tile">
        <div className="game-container centered-game">
          <h4>A Quick Challenge to See My Contacts!</h4>
          <button onClick={() => setGameStarted(true)} className="play-button">Let's Play!</button>
        </div>
      </div>
    );
  }

  return (
    <div className="interactive-tile">
      <div className="game-container">
        <h4>Solve the puzzle to reveal contact info!</h4>
        <MathGame key={gameKey} onGameComplete={handleGameComplete} />
      </div>
    </div>
  );
};

export default InteractiveContactTile;

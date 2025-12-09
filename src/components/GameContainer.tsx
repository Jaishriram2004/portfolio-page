
import React, { useState, useEffect } from 'react';
import MathGame from './MathGame.tsx';
import CatchGame from './CatchGame.tsx';
import WordScrambleGame from './WordScrambleGame.tsx';

const GameContainer = () => {
  const [gameState, setGameState] = useState('pre-start'); // 'pre-start', 'selecting', 'playing'
  const [transitionState, setTransitionState] = useState('fade-in'); // 'fade-in', 'fade-out'
  const [selectedGame, setSelectedGame] = useState(null);
  const [scores, setScores] = useState({ math: 0, catch: 0, word: 0 });
  const [scoreUpdate, setScoreUpdate] = useState('');

  const games = [
    { id: 'math', name: 'Math Game', description: 'Solve math problems against the clock.', component: MathGame },
    { id: 'catch', name: 'Catch Game', description: 'Catch the falling objects before they hit the ground.', component: CatchGame },
    { id: 'word', name: 'Word Scramble', description: 'Unscramble the letters to form a word.', component: WordScrambleGame },
  ];

  const changeGameState = (newState) => {
    setTransitionState('fade-out');
    setTimeout(() => {
      setGameState(newState);
      setTransitionState('fade-in');
    }, 500);
  };

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleStartGame = () => {
    if (selectedGame) {
      changeGameState('playing');
    }
  };

  const handleScoreUpdate = (gameId, points) => {
    setScores(prevScores => ({
      ...prevScores,
      [gameId]: prevScores[gameId] + points
    }));
    setScoreUpdate(gameId);
    setTimeout(() => setScoreUpdate(''), 500);
  };

  const handleGameEnd = () => {
    alert("Game over!");
    changeGameState('selecting');
    setSelectedGame(null);
  };

  const renderGameState = () => {
    return (
        <div className={`game-state-container ${transitionState}`}>
            {gameState === 'pre-start' && (
              <div className="pre-start-container">
                <button onClick={() => changeGameState('selecting')} className="play-game-btn">
                  Play Games
                </button>
              </div>
            )}
            {gameState === 'selecting' && (
              <div className="game-selection-container">
                <h2>Choose a Game</h2>
                <div className="game-card-grid">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className={`game-selection-card ${selectedGame === game.id ? 'selected' : ''}`}
                      onClick={() => handleGameSelect(game.id)}
                    >
                      <h3>{game.name}</h3>
                      <p>{game.description}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleStartGame}
                  disabled={!selectedGame}
                  className="start-game-btn"
                >
                  Start Game
                </button>
              </div>
            )}
            {gameState === 'playing' && (
                <div className="in-game-layout">
                    <div className="game-area">
                        <button onClick={() => {
                            changeGameState('selecting');
                            setSelectedGame(null);
                        }} className="back-btn">
                            Back to Selection
                        </button>
                        {(() => {
                            const GameComponent = games.find((game) => game.id === selectedGame)?.component;
                            if (!GameComponent) return <p>Game not found</p>;

                            if (selectedGame === 'math') {
                                return <MathGame 
                                    onScoreUpdate={(points) => handleScoreUpdate('math', points)}
                                    onGameEnd={handleGameEnd} 
                                />;
                            }
                            return <GameComponent onGameComplete={handleGameEnd} />;
                        })()}
                    </div>
                    <div className="score-card">
                        <h3>Scores</h3>
                        <p className={scoreUpdate === 'math' ? 'score-updated' : ''}>Math: <span>{scores.math}</span></p>
                        <p className={scoreUpdate === 'catch' ? 'score-updated' : ''}>Catch: <span>{scores.catch}</span></p>
                        <p className={scoreUpdate === 'word' ? 'score-updated' : ''}>Word: <span>{scores.word}</span></p>
                    </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <div>
      {renderGameState()}
    </div>
  );
};

export default GameContainer;

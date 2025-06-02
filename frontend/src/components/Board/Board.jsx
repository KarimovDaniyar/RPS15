import { useState, useEffect, useRef } from 'react';
import Card from '../Card/Card';
import Score from '../Scores/Scores';
import './Board.scss';

const Board = ({
  moves,
  myScore,
  opponentScore,
  myMove,
  opponentMove,
  result,
  gameOver,
  onCardClick,
  startNewGame,
}) => {
  const boardRef = useRef(null);
  const [showScore, setShowScore] = useState(false);
  const [showGameOverButton, setShowGameOverButton] = useState(false);

  // Handle card positioning in circle
  useEffect(() => {
    if (boardRef.current && moves.length > 0) {
      const cardWrappers = boardRef.current.querySelectorAll('.card-wrapper');
      const totalCards = cardWrappers.length;
      const radius = totalCards <= 8 ? 280 : 320; // Adjust radius based on number of cards

      cardWrappers.forEach((wrapper, index) => {
        // Calculate position in the circle
        const angle = (index / totalCards) * 2 * Math.PI; // angle in radians
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        // Position the card
        wrapper.style.left = `calc(50% + ${x}px - ${wrapper.offsetWidth / 2}px)`;
        wrapper.style.top = `calc(50% + ${y}px - ${wrapper.offsetHeight / 2}px)`;
      });
    }
  }, [moves]);

  // Handle card animation and score display
  useEffect(() => {
    if (myMove && opponentMove) {
      // First hide the score
      setShowScore(false);

      // Then show the score after 1 second
      const timer = setTimeout(() => {
        setShowScore(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [myMove, opponentMove]);

  // Handle game over button display
  useEffect(() => {
    if (gameOver) {
      // First hide the score (consistent with normal gameplay)
      setShowScore(false);
      setShowGameOverButton(false);

      // Then show the score after 1 second (same as in normal gameplay)
      const scoreTimer = setTimeout(() => {
        setShowScore(true);
      }, 1000);

      // Then show the button and hide the score after additional 2 seconds
      const buttonTimer = setTimeout(() => {
        setShowScore(false);
        setShowGameOverButton(true);
      }, 3000); // 1 second for score to appear + 2 seconds to show the score

      return () => {
        clearTimeout(scoreTimer);
        clearTimeout(buttonTimer);
      };
    } else {
      setShowGameOverButton(false);
    }
  }, [gameOver]);

  return (
    <div className="board-container">
      <div className="board" ref={boardRef}>
        {moves.map(move => {
          return (
            <div className="card-wrapper" key={move.name}>
              <Card
                title={move.name}
                onCardClick={() => {
                  if (!gameOver) onCardClick(move.name);
                }}
              />
              {move.name}
            </div>
          );
        })}

        {/* Center play area */}
        <div className="center-area">
          {/* Bot card slot */}
          <div
            className={`center-card bot ${showScore && result === 'LOSSES' ? 'animate-win' : ''}`}
          >
            {opponentMove && <Card title={opponentMove} onCardClick={() => {}} />}
          </div>

          {/* Center score - only show when not showing game over button */}
          {showScore && result && !showGameOverButton && (
            <div className="center-score">
              <div className="versus-text">
                {myScore} VS {opponentScore}
              </div>
              <div className={`result-text ${result.toLowerCase()}`}>{result}</div>
            </div>
          )}

          {/* Player card slot */}
          <div
            className={`center-card player ${showScore && result === 'WIN' ? 'animate-win' : ''}`}
          >
            {myMove && <Card title={myMove} onCardClick={() => {}} />}
          </div>
        </div>

        {/* Game over button */}
        {showGameOverButton && (
          <button className="center-button" onClick={startNewGame}>
            New Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Board;

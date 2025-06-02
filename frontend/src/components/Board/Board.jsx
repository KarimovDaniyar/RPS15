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
  myName,
  opponentName,
}) => {
  const boardRef = useRef(null);
  const [showScore, setShowScore] = useState(false);
  const [showGameOverButton, setShowGameOverButton] = useState(false);
  const [selectedCard, setSelectedCard] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winnerName, setWinnerName] = useState('');

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
      // First hide everything
      setShowScore(false);
      setShowGameOverButton(false);
      setShowWinner(false);

      // Determine the winner
      let winner = '';
      if (myScore > opponentScore) {
        winner = myName || 'You';
      } else if (opponentScore > myScore) {
        winner = opponentName || 'Opponent';
      } else {
        winner = "It's a tie!";
      }
      setWinnerName(winner);

      // First show the score after 1 second
      const scoreTimer = setTimeout(() => {
        setShowScore(true);
      }, 1000);

      // Then show winner message after 1.5 seconds
      const winnerTimer = setTimeout(() => {
        setShowScore(false);
        setShowWinner(true);
      }, 2500);

      // Finally show the button after additional 2 seconds
      const buttonTimer = setTimeout(() => {
        setShowWinner(false);
        setShowGameOverButton(true);
      }, 4500);

      return () => {
        clearTimeout(scoreTimer);
        clearTimeout(winnerTimer);
        clearTimeout(buttonTimer);
      };
    } else {
      setShowWinner(false);
      setShowGameOverButton(false);
    }
  }, [gameOver, myScore, opponentScore, myName, opponentName]);

  const handelSelectedCard = moveName => {
    setSelectedCard(moveName);
    if (!gameOver) onCardClick(moveName);

    setTimeout(() => {
      setSelectedCard(null);
    }, 2000);
  };

  return (
    <div className="board-container">
      <div className="board" ref={boardRef}>
        {moves.map(move => {
          return (
            <div className="card-wrapper" key={move.name}>
              <Card
                title={move.name}
                onCardClick={() => {
                  handelSelectedCard(move.name);
                }}
                isSelected={selectedCard === move.name}
              />
              <div className="card-name">{move.name}</div>
            </div>
          );
        })}

        {/* Center play area */}
        <div className="center-area">
          {/* Bot/opponent card slot */}
          <div
            className={`center-card bot ${showScore && result === 'LOSSES' ? 'animate-win' : ''}`}
          >
            {opponentMove && <Card title={opponentMove} onCardClick={() => {}} />}
          </div>

          {/* Center score - only show when not showing game over button */}
          {showScore && result && !showGameOverButton && (
            <div className="center-score">
              <div className="player-names">
                <span className="name">{myName || 'You'}</span>
                <span className="vs-text">VS</span>
                <span className="name">{opponentName || 'Opponent'}</span>
              </div>
              <div className="versus-text">
                {myScore} VS {opponentScore}
              </div>
              <div className={`result-text ${result.toLowerCase()}`}>{result}</div>
            </div>
          )}

          {/* Show winner announcement */}
          {showWinner && (
            <div className="winner-announcement">
              <div className="winner-text">Winner</div>
              <div className="winner-name">{winnerName}</div>
              <div className="winner-score">
                {myScore} - {opponentScore}
              </div>
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

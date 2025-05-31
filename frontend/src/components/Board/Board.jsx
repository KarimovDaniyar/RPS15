import { useState, useEffect } from 'react';
import Card from '../Card/Card';
import Score from '../Scores/Scores';
import './Board.scss';

const Board = () => {
  const [moves, setMoves] = useState([]);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myMove, setMyMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMoves = async () => {
    //fetch = извлечь
    try {
      const response = await fetch('http://localhost:8080/api/game/moves'); // response = Ответ
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      setMoves(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, []);

  const playGame = async myMove => {
    try {
      setMyMove(myMove);
      const response = await fetch(`http://localhost:8080/api/game/play?move=${myMove}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = await response.json();
      setMyScore(data.myScore);
      setOpponentScore(data.opponentScore);
      setOpponentMove(data.opponentMove);
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading moves...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="board-container">
      <Score myScore={myScore} opponentScore={opponentScore} />
      <div className="header">
        <h2>Choose move</h2>
        {result && (
          <div className="game-result">
            <p>You played: {myMove}</p>
            <p>Opponent played: {opponentMove}</p>
            <p className={`result ${result.toLowerCase()}`}>Result: {result}</p>
          </div>
        )}
      </div>
      <div className="board">
        {moves.map(move => {
          return (
            <Card
              className="card"
              key={move.name}
              title={move.name}
              onCardClick={() => {
                playGame(move.name);
              }}
            />
          );
        })}
      </div>
      <button>Start Game</button>
    </div>
  );
};

export default Board;

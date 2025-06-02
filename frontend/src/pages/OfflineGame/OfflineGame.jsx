import { useState, useEffect } from 'react'
import Board from '../../components/Board/Board';

const OfflineGame = () => {
  const [moves, setMoves] = useState([]);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myMove, setMyMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

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
        credentials: 'include',
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
      setGameOver(data.gameOver);
    } catch (err) {
      setError(err.message);
    }
  };

  const startNewGame = async () => {
    try {
      await fetch('http://localhost:8080/api/game/reset', {
        method: 'POST',
        credentials: 'include',
      });
      setMyScore(0);
      setOpponentScore(0);
      setMyMove(null);
      setOpponentMove(null);
      setResult(null);
      setGameOver(false);
    } catch (err) {
      setError('Ошибка при сбросе игры');
    }
  };

  if (loading) return <div className="loading">Loading moves...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <Board
      moves={moves}
      myScore={myScore}
      opponentScore={opponentScore}
      myMove={myMove}
      opponentMove={opponentMove}
      result={result}
      gameOver={gameOver}
      onCardClick={playGame}
      startNewGame={startNewGame}
    />
  );
};

export default OfflineGame;

import { useState, useEffect, useRef } from 'react';
import Board from '../../components/Board/Board';

const WS_URL = 'ws://localhost:8080/ws/game';

const OnlineGame = () => {
  const [moves, setMoves] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [joined, setJoined] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myMove, setMyMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState('');
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [timer, setTimer] = useState(7);
  const ws = useRef(null);

  // Получить список ходов (как в оффлайн-режиме)
  useEffect(() => {
    fetch('http://localhost:8080/api/game/moves')
      .then(res => res.json())
      .then(setMoves)
      .catch(() => setError('Ошибка загрузки ходов'));
  }, []);

  // Создать комнату
  const handleCreateRoom = () => {
    ws.current.send(JSON.stringify({ action: 'create_room', playerName }));
    setWaitingForOpponent(true);
  };

  // Войти в комнату
  const handleJoinRoom = () => {
    ws.current.send(JSON.stringify({ action: 'join_room', roomId, playerName }));
  };

  // Сделать ход
  const playGame = move => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(
        JSON.stringify({
          action: 'move',
          roomId,
          move,
        })
      );
    }
  };

  // Начать новую игру
  const startNewGame = () => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(
        JSON.stringify({
          action: 'reset',
          roomId,
        })
      );
    }
  };

  useEffect(() => {
    if (!joined || gameOver) return;
    setTimer(7);
    let interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [myMove, opponentMove, gameOver, joined]);

  // Подключение к WebSocket
  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {};

    ws.current.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'room_created') {
        setRoomId(msg.roomId);
        setWaitingForOpponent(true);
      }
      if (msg.type === 'player_joined') {
        setJoined(true);
        setWaitingForOpponent(false);
      }
      if (msg.type === 'game_update') {
        setMyMove(msg.myMove);
        setOpponentMove(msg.opponentMove);
        setMyScore(msg.myScore);
        setOpponentScore(msg.opponentScore);
        setResult(msg.result);
        setGameOver(msg.gameOver);
      }
      if (msg.type === 'reset') {
        setMyScore(0);
        setOpponentScore(0);
        setMyMove(null);
        setOpponentMove(null);
        setResult(null);
        setGameOver(false);
      }
      if (msg.type === 'error') {
        setError(msg.message);
      }
    };

    ws.current.onerror = () => setError('WebSocket error');
    return () => ws.current && ws.current.close();
  }, []);

  if (!joined) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
        <h2>Онлайн игра</h2>
        <input
          placeholder="Ваше имя"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          style={{ marginBottom: 10, width: '90%' }}
        />
        <div style={{ margin: '10px 0' }}>
          <button onClick={handleCreateRoom} disabled={!playerName || waitingForOpponent}>
            Создать комнату
          </button>
        </div>
        <div>
          <input
            placeholder="ID комнаты"
            value={roomId}
            onChange={e => setRoomId(e.target.value.toUpperCase())}
            style={{ marginBottom: 10, width: '90%' }}
            disabled={waitingForOpponent}
          />
          <button onClick={handleJoinRoom} disabled={!playerName || !roomId || waitingForOpponent}>
            Войти в комнату
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {waitingForOpponent && (
          <div style={{ marginTop: 20, color: 'blue' }}>
            <b>Ваш ID комнаты: {roomId}</b>
            <br />
            Ожидание второго игрока...
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {joined && !gameOver && (
        <div style={{ fontSize: 22, color: '#444', margin: 10 }}>Таймер: {timer} сек.</div>
      )}
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
    </>
  );
};

export default OnlineGame;

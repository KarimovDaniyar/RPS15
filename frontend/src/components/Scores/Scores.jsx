const Score = ({myScore, opponentScore}) => {
  return (
    <div className="score-container">
      {myScore} VS {opponentScore}
    </div>
  );
};

export default Score;

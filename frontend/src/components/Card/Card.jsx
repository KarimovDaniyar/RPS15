const Card = ({ title, onCardClick }) => {
  const imgSrc = `/src/assets/${title}.png`;

  return (
    <div className="card">
      <button className="card-title" onClick={onCardClick}>
        <img src={imgSrc} alt={title} style={{ width: 60, height: 90 }} />
      </button>
    </div>
  );
};

export default Card;

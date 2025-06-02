const Card = ({ title, onCardClick, isSelected }) => {
  const imgSrc = `/src/assets/${title}.png`;

  return (
    <div className={`card ${isSelected ? 'selected' : ''}`}>
      <button className={`card-title ${isSelected ? 'selected' : ''}`} onClick={onCardClick}>
        <img src={imgSrc} alt={title} style={{ width: 60, height: 90 }} />
      </button>
    </div>
  );
};

export default Card;

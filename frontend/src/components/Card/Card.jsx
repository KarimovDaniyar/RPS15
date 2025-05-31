const Card = ({ title, onCardClick }) => {
  return (
    <div className="card">
      <button className="card-title" onClick={onCardClick}>
        {title}
      </button>
    </div>
  );
};

export default Card;

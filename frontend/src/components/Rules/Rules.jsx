import { useState } from 'react';
import './Rules.scss';

const Rules = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <button className="rules-button" onClick={() => setShowRules(true)}>
        Game Rules
      </button>
      
      {showRules && (
        <div className="rules-modal-overlay" onClick={() => setShowRules(false)}>
          <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowRules(false)}>×</button>
            <h2>Game Rules</h2>
            <div className="rules-image-container">
              <img src="/src/assets/rule.png" alt="Rock Paper Scissors Rules" className="rules-image" />
            </div>
            <div className="rules-footer">
              <a href="https://www.umop.com/rps15.htm" target="_blank" rel="noopener noreferrer">
                Original game by David C. Lovelace
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rules;
import React from 'react';
import './SubmitOptionsModal.css';

export default function SubmitOptionsModal({ onClose, onSelectType }) {
  const options = [
    {
      type: 'notices',
      icon: '📢',
      label: 'Community Notice',
      description: 'Share announcements and updates'
    },
    {
      type: 'jobs',
      icon: '💼',
      label: 'Job Opportunity',
      description: 'Post available positions'
    },
    {
      type: 'skills',
      icon: '🛠️',
      label: 'Skill Offering',
      description: 'Share your expertise'
    }
  ];

  const handleSelect = (type) => {
    onSelectType(type);
    onClose();
  };

  return (
    <>
      <div className="submit-overlay" onClick={onClose} />
      <div className="submit-options-modal">
        <div className="submit-options-header">
          <h3>What would you like to submit?</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="submit-options-list">
          {options.map(option => (
            <button
              key={option.type}
              className="submit-option-card"
              onClick={() => handleSelect(option.type)}
            >
              <span className="option-icon">{option.icon}</span>
              <div className="option-content">
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
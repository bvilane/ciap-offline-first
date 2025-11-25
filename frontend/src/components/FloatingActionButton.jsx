import React, { useState } from 'react';
import './FloatingActionButton.css';
import SubmitOptionsModal from './SubmitOptionsModal';
import SubmitForm from './SubmitForm';

export default function FloatingActionButton() {
  const [showOptions, setShowOptions] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setShowSubmitForm(true);
  };

  const handleCloseSubmitForm = () => {
    setShowSubmitForm(false);
    setSelectedType(null);
  };

  const handleSuccess = () => {
    setShowSubmitForm(false);
    setSelectedType(null);
    // Could add a success toast here
  };

  return (
    <>
      {/* FAB Button (Mobile Only) */}
      <button
        className="fab-button"
        onClick={() => setShowOptions(!showOptions)}
        aria-label="Submit content"
      >
        <svg 
          className={`fab-icon ${showOptions ? 'fab-icon--rotated' : ''}`}
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {/* Options Modal */}
      {showOptions && (
        <SubmitOptionsModal
          onClose={() => setShowOptions(false)}
          onSelectType={handleSelectType}
        />
      )}

      {/* Submit Form */}
      {showSubmitForm && (
        <SubmitForm
          type={selectedType}
          onClose={handleCloseSubmitForm}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
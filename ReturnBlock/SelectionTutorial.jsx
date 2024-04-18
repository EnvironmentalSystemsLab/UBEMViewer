import React, { useState } from 'react';


const SelectionTutorial = () => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={`Selection-tutorial ${showDetails ? 'expanded' : 'collapsed'}`} onClick={toggleDetails}>
      <p className='third-title'>
        Selection tutorial
        <span className={`triangle ${showDetails ? 'up' : 'down'}`}>&#9654;</span>
      </p>

      {showDetails && (
        <>
          <p>
            Hold "Shift" to select multiple elements by either dragging a rectangle or clicking.
          </p>
          <p>
            Hold "Ctrl(Command)" to unselect by either dragging a rectangle or clicking.
          </p>
          <p>
            Press "Esc" to clear the current selection objects.
          </p>
        </>
      )}
    </div>
  );
};

export default SelectionTutorial;

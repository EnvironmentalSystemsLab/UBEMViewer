import React from 'react';

const FirstMobilitySelection = ({ propertiesNumber, handlePropertyChange, blockContainerVisible, mobilityContainerVisible }) => {
  return (
    <div>
   
        <div className="mobility-dropdown-container">
          <select
            className="mobility-dropdown"
            value={propertiesNumber.mode}
            onChange={(e) => handlePropertyChange('mode', e.target.value)}
          >
            <option value="-1">All Trip Modes</option>
            <option value="0">Walk</option>
            <option value="1">Bike</option>
            <option value="2">Car</option>
            {blockContainerVisible && (
              <option value="3">Public Transit</option>
            )}
          </select>

          <select
            className="mobility-dropdown"
            value={propertiesNumber.season}
            onChange={(e) => handlePropertyChange('season', e.target.value)}
          > 
            <option value="1">Spring</option>
       
       
          </select>

          <select
            className="mobility-dropdown"
            value={propertiesNumber.timeOfDay}
            onChange={(e) => handlePropertyChange('timeOfDay', e.target.value)}
          >
            <option value="-1">All Time Periods</option>
            <option value="0">Morning (12am - 6am)</option>
            <option value="1">Breakfast (6am - 11am)</option>
            <option value="2">Lunch (11am - 3pm)</option>
            <option value="3">Afternoon (3pm - 5pm)</option>
            <option value="4">Dinner (5pm - 9pm)</option>
            <option value="5">Night (9pm - 12am)</option>
          </select>
        </div>
     
    </div>
  );
};

export default FirstMobilitySelection;
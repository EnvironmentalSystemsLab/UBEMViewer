import React from 'react';

const SecondMobilitySelection = ({ propertiesNumber, handlePropertyChange }) => {
  return (
    <div className="mobility-dropdown-container">
      <select
        className="mobility-dropdown"
        value={propertiesNumber.weekday}
        onChange={(e) => handlePropertyChange('weekday', e.target.value)}
      >
        <option value="1">Weekday</option>
        <option value="0">Weekend</option>
      </select>

      <select
        className="mobility-dropdown-activity"
        value={propertiesNumber.fromActivity}
        onChange={(e) => handlePropertyChange('fromActivity', e.target.value)}
      >
        <option value="0">Home</option>
        <option value="1">Work/School</option>
        <option value="2">Leisure</option>
        <option value="-1">All From-Activities</option>
      </select>

      <select
        className="mobility-dropdown-activity"
        value={propertiesNumber.toActivity}
        onChange={(e) => handlePropertyChange('toActivity', e.target.value)}
      >
        <option value="0">Home</option>
        <option value="1">Work/School</option>
        <option value="2">Leisure</option>
        <option value="-1">All To-Activities</option>
      </select>
    </div>
  );
};

export default SecondMobilitySelection;
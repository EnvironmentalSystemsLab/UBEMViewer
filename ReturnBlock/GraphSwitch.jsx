import React, { useState } from 'react';

import {
    generateEndUseGraph,
    generateFuelUseGraph,
    generateWinterEnergyLoadGraph,
    generateSummerEnergyLoadGraph,
    generateLoadDurationGraph
  } from "./Containers/GraphGeneration/energyGraph"

const GraphSwitch = () => {
  const [endUseContainerVisible, setEndUseContainerVisible] = useState(false);
  const [fuelUseContainerVisible, setFuelUseContainerVisible] = useState(false);

  const handleGraphClick = (event) => {
    const selectedGraph = event.target.value;

    switch (selectedGraph) {
      case 'end-use':
        setEndUseContainerVisible(true);
        setFuelUseContainerVisible(false);
        break;

      case 'fuel-use':
        setFuelUseContainerVisible(true);
        setEndUseContainerVisible(false);
        break;

      default:
        setEndUseContainerVisible(false);
        setFuelUseContainerVisible(false);
        break;
    }
  };

  return (
    <div>
      <select 
        className="energy-dropdown"
        id="scenarioSelect"
        onChange={handleGraphClick}>
        <option value="end-use">Energy Use by End Use</option>
        <option value="fuel-use">Energy Use by Fuel Use</option>
      </select>

      {fuelUseContainerVisible && (
        <div>
          <div id="graph-container-energyfueluse" className="graph-container-energyfueluse"></div>
        </div>
      )}

      {endUseContainerVisible && (
        <div>
          <div id="graph-container-energyenduse" className="graph-container-energyenduse"></div>
        </div>
      )}
    </div>
  );
};

export default GraphSwitch;
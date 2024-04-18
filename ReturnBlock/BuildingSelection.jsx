import React from 'react';

const BuildingSelection = ({ buildingLayerCode, setBuildingLayerCode }) => {
  return (
    <select
      className="energy-dropdown"
      value={buildingLayerCode}
      onChange={(e) => setBuildingLayerCode(e.target.value)}
    >
      <option value="Gas[kWh_m2][Yr]">Gas Demand</option>
      <option value="Electricity[kWh_m2][Yr]">Electricity Demand</option>
      <option value="Heating[KWh_m2][Yr]">Heating Demand</option>
      <option value="Cooling[KWh_m2][Yr]">Cooling Demand</option>
      <option value="Equipment[KWh_m2][Yr]">Equipment Demand</option>
      <option value="Lighting[KWh_m2][Yr]">Lighting Demand</option>
      <option value="HotWater[KWh_m2][Yr]">Hotwater Demand</option>
      <option value="PV[KWh_m2][Yr]">Electricity Produced</option>
    </select>
  );
};

export default BuildingSelection;
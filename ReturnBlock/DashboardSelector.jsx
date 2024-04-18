import React from 'react';

// Import from other files
import streetImage from "../Image/street.png";
import houseImage from "../Image/house.png";
import buildingImage from "../Image/building.png";
import lightningImage from "../Image/lightning.png";

const DashboardSelector = ({ toggleableLayers, displayingLayers, handleLayerToggle }) => {
  const iconMap = {
    'mobility-Street-Detailed': streetImage,
    'mobility-Block-Detailed': houseImage,
    'energy-Building': buildingImage,
    'energy-Feeder': lightningImage,
  };

  return (
    <div className="dashboard-selector">
      <div className="hr-container">
        <span class="third-title">Map Dashboard Selector</span>
        <hr class="sidebar-divider" />
      </div>
      <div className="dashboard-button-menu">
        {toggleableLayers.map((layer) => (
          <button
            key={layer.id}
            className={`dashboard-button ${displayingLayers.includes(layer.id) ? 'active' : ''}`}
            onClick={() => handleLayerToggle(layer.id)}
          >
            <img
              src={iconMap[layer.id]}
              alt="Icon"
              className="icon-image"
              style={{ verticalAlign: 'middle' }}
            />
            <span className={`dashboard-${displayingLayers.includes(layer.id) ? 'label-selected' : 'label-unselected'}`}>
              {layer.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardSelector;
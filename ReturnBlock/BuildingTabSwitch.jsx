import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const BuildingTabSwitch = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}> {/* Ensure the Box container doesn't overflow */}
      <Tabs 
        value={selectedTab} 
        onChange={handleTabChange} 
        centered
        sx={{ 
          '.MuiTabs-flexContainer': {
            paddingLeft: '30px', // Add padding to the left of the first tab
          },
          '.MuiTab-root': {
            textTransform: 'none',
            marginRight: '8px', // Add some space between the tabs if needed
          }
        }}
      >
        <Tab label="Energy Summary" />
        <Tab label="Energy End Use" />
        <Tab label="Energy Fuel Use" />
      </Tabs>

      <div role="tabpanel" hidden={selectedTab !== 0}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-energysummaryuse" 
            className="graph-container-energysummaryuse"
          >
            {/* Content for Energy Use Summary */}
          </div>
        </Box>
      </div>

      <div role="tabpanel" hidden={selectedTab !== 1}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-energyenduse" 
            className="graph-container-energyenduse"
          >
            {/* Content for Energy End Use */}
          </div>
        </Box>
      </div>

      <div role="tabpanel" hidden={selectedTab !== 2}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-energyfueluse" 
            className="graph-container-energyfueluse"
          >
            {/* Content for Energy Fuel Use */}
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default BuildingTabSwitch;

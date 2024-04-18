// FeederTabSwitch.jsx
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const FeederTabSwitch = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Winter Energy Load" sx={{ textTransform: 'none' }} />
        <Tab label="Summer Energy Load" sx={{ textTransform: 'none' }} />
        <Tab label="Load Duration Curve" sx={{ textTransform: 'none' }} />
      </Tabs>

      <div role="tabpanel" hidden={selectedTab !== 0}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-energyone" 
            className="graph-container-energyone"
          >
    
          </div>
        </Box>
      </div>

      <div role="tabpanel" hidden={selectedTab !== 1}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-energytwo" 
            className="graph-container-energytwo"
          >

          </div>
        </Box>
      </div>

      <div role="tabpanel" hidden={selectedTab !== 2}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-energythree" 
            className="graph-container-energythree"
          >

          </div>
        </Box>
      </div>
    </Box>
  );
};

export default FeederTabSwitch;

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const MobilityTabSwitch = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Weekday Trip Volume" sx={{ textTransform: 'none' }} />
        <Tab label="Weekend Trip Volume" sx={{ textTransform: 'none' }} />
      </Tabs>

      <div role="tabpanel" hidden={selectedTab !== 0}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-weekday" 
            className="graph-container-weekday"
          >
            {/* Weekday content */}
          </div>
        </Box>
      </div>

      <div role="tabpanel" hidden={selectedTab !== 1}>
        <Box sx={{ p: 3 }}>
          <div 
            id="graph-container-weekend" 
            className="graph-container-weekend"
          >
            {/* Weekend content */}
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default MobilityTabSwitch;


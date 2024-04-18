import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';

const FeederSelection = ({ feederLayerCode, setFeederLayerCode }) => {
  const handleChange = (e) => {
    setFeederLayerCode(e.target.value);
  };

  return (
    <FormControl variant="outlined" className="custom-feeder-selection">
      
      <Select
     
        id="feeder-selection"
        value={feederLayerCode}
        onChange={handleChange}
   
        style={{
        
          width: '100%',
         height: '40px',
          fontSize: '12px',
          marginRight:'20px',
        }}
      >
        <MenuItem value="PeakHourGasDemand_KW">Peak Hour Gas Demand</MenuItem>
        <MenuItem value="PeakHourElectricityDemand_KW">Peak Hour Electricity Demand</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FeederSelection;


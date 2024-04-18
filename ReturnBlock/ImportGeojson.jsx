// only suitable for changing energy building data right now, need to be modified for other purposes.
// also need to change the related summary geojson file!!!!

import React, { useRef } from 'react';
import Button from '@mui/material/Button'; 

const ImportGeojson = ({ onDataImport }) => {
  const fileInputRef = useRef(null); // Reference to the hidden file input

  // Handler for file input change event
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Use FileReader to read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const blobUrl = URL.createObjectURL(file);
        onDataImport(blobUrl);
      } catch (error) {
        console.error('Error parsing the file', error);
      }
    };
    reader.readAsText(file);
  };

  // Handler to trigger the hidden file input click event
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
   
   <Button
        variant="contained"
        color="primary"
        onClick={handleImportClick}
        sx={{
          backgroundColor: 'gray',
          fontSize: '0.65rem', 
          padding: '2px 5px', 
        }}
      >
        + Add Data
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".geojson"
        style={{ display: 'none' }} // Hide the file input
      />
    </div>
  );
};

export default ImportGeojson;

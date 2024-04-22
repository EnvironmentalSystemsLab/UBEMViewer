import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ImportGeojson = ({
  onDataImport, addFile, mapRef, setTitle, setDisplayingLayers, setHomeContainerVisible, setGeneralContainerVisible
}) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dataType, setDataType] = useState('');
  const [fileContent, setFileContent] = useState(null);

  const fileInputRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFileNameChange = (event) => setFileName(event.target.value);
  const handleDataTypeChange = (event) => setDataType(event.target.value);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);
    setFileName(file.name); // Set initial file name when file is chosen

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result); // Store file content in state, process it later
      // Prompt to change file name or directly use a predefined file name
      const newFile = {
        file: file,
        name: fileName || file.name,
        content: e.target.result
      };
      addFile(newFile); // Add the file with the user-defined name
    };
    reader.readAsText(file);
  };

  const handleViewClick = () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    if (!dataType) {
      alert('Please select a data type!');
      return;
    }

    try {
      const blobUrl = URL.createObjectURL(file);
      onDataImport(blobUrl);

      const map = mapRef.current;
      const geojson = JSON.parse(fileContent);

      if (geojson.features && geojson.features.length > 0) {
        map.flyTo({
          center: [-76.5087, 42.4440], //need replaced!
          zoom: 13,
        });
      }
      setDisplayingLayers(['energy-Building', 'energy-Building-highlighted', 'energy-Building-other']);
      ['energy-Building', 'energy-Building-highlighted', 'energy-Building-other'].forEach(layerId => {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      });

      setTitle('UBEM Viewer / Ithaca');
      setHomeContainerVisible(false);
      setGeneralContainerVisible(true);
    } catch (error) {
      console.error('Error processing the file', error);
    }

    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          backgroundColor: 'gray',
          position: 'absolute',
          top: '35%',       
          left: '46%',
          fontSize: '1.25rem', 
          padding: '4px 12px', 
        }}
      >
        + Add Data
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload your GeoJSON file(s) Here.</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" sx={{ marginTop: 2 }}>
            Choose File
            <input type="file" hidden accept=".geojson" onChange={handleFileChange} ref={fileInputRef} />
          </Button>
          {file && (
            <>
              <TextField
                fullWidth
                label="File Name"
                variant="outlined"
                value={fileName}
                onChange={handleFileNameChange}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={dataType}
                  label="Data Type"
                  onChange={handleDataTypeChange}
                >
                  <MenuItem value="mobility">Mobility</MenuItem>
                  <MenuItem value="energy">Energy</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleViewClick}>View</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImportGeojson;

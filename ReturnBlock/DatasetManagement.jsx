import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, ListItemButton, IconButton, Icon } from '@mui/material';

const DatasetManagement = ({ selectedFile, setSelectedFile, onDataImport, files, setFiles, deleteFile}) => {
  const [open, setOpen] = useState(false);

  const [dataType, setDataType] = useState('');

  const fileInputRef = useRef(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDataTypeChange = (event) => setDataType(event.target.value);
  
  const handleFileNameChange = (event) => {
    const newName = event.target.value;
    setSelectedFile({ ...selectedFile, name: newName });
  
    // Update the files array with the new name
    const updatedFiles = files.map(f => {
      if (f === selectedFile) {
        return { ...f, name: newName };
      }
      return f;
    });
  
    setFiles(updatedFiles);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newFile = {
      file: file,
      name: file.name,
      content: null
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      newFile.content = e.target.result;
      setFiles(prevFiles => [...prevFiles, newFile]);
    };
    reader.readAsText(file);
  };

  const handleViewClick = () => {
    if (!selectedFile) {
      alert('Please select a file from the list!');
      return;
    }
    if (!dataType) {
      alert('Please select a data type!');
      return;
    }

    const blobUrl = URL.createObjectURL(selectedFile.file);
    onDataImport(blobUrl);

    handleClose();
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file); // Update the selected file
    onDataImport(file); // Assuming you want to import the file on select
  };

  const handleDeleteFile = (index, event) => {
    event.stopPropagation(); // Prevent the delete from triggering select
    deleteFile(index);
    if (selectedFile && files[index] === selectedFile) {
      setSelectedFile(null); // Reset selection if the deleted file was selected
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ backgroundColor: 'gray', fontSize: '0.75rem', padding: '2px 5px' }}>
        + Manage Data
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Manage your GeoJSON files</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" sx={{ marginTop: 2 }}>
            Add File
            <input type="file" hidden accept=".geojson" onChange={handleFileChange} ref={fileInputRef} />
          </Button>
          <List>
      {files.map((file, index) => (
        <ListItem key={index} disablePadding secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteFile(index, e)}>
            <Icon>X</Icon>
          </IconButton>
        }>
          <ListItemButton
            onClick={() => handleSelectFile(file)}
            selected={selectedFile === file} // Use object equality to determine selection
            sx={{
              bgcolor: (theme) => selectedFile === file ? theme.palette.primary.main : 'transparent',
            }}
          >
            <ListItemText primary={file.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    {selectedFile && (
  <>
    <TextField
      fullWidth
      label="File Name"
      variant="outlined"
      value={selectedFile.name}
      onChange={handleFileNameChange} // Use the new handler
      margin="normal"
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>Data Type</InputLabel>
      <Select value={dataType} label="Data Type" onChange={handleDataTypeChange}>
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

export default DatasetManagement;

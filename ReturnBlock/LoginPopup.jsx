import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';

const LoginPopup = () => {

  const [open, setOpen] = useState(false); 

  const handleOpen = () => setOpen(true); 
  const handleClose = () => setOpen(false); 

  return (
    <div>
    <button className="login-button" onClick={handleOpen}>Login</button>
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { 
          // Applying blur effect to the backdrop
          backdropFilter: 'blur(5px)',
          // Ensure the color and opacity of the backdrop are to your liking
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      }}
      >
              <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height:550,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              // Add any additional styles you need for the box here
            }}
          >
        <iframe
          src="https://urbano-frontend.onrender.com/"
          title="External Content"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        ></iframe>
      </Box>
    </Modal>
  </div>
);
 
};

export default LoginPopup;
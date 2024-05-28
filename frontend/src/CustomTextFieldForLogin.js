// CustomTextField.jsx
import React from 'react';
import TextField from '@mui/material/TextField';

const CustomTextField = (props) => (
  <TextField
    {...props}
    sx={{
      '& .MuiInputBase-root': {
        color: 'white', // Text color
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFC55A', // Border color
      },
      '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFF', // Keep border color the same on hover and other states except focused
      },
      '& .MuiInputBase-input': {
        color: 'white', // Input text color
      }, 
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFF', // Border color when focused
      },
    }}
  />
);

export default CustomTextField;

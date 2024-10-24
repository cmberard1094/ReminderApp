import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';

const CircularButton = styled(IconButton)({
  backgroundColor: '#3f51b5', // Customize color if needed
  color: '#fff',
  borderRadius: '50%',
  width: 56, // Adjust the size
  height: 56, // Adjust the size
  '&:hover': {
    backgroundColor: '#303f9f', // Customize hover color
  },
});

interface CircleButtonProps {
    onClick: () => void
}

export default function CircleButton({ onClick }: CircleButtonProps) {
  return (
    <CircularButton onClick={onClick}>
      <AddIcon />
    </CircularButton>
  );
}
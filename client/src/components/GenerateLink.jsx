import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const GenerateLink = ({ onGenerate }) => {
  const [meetingLink, setMeetingLink] = useState('');

  const generateLink = () => {
    const newLink = `${window.location.origin}/participant/${uuidv4()}`;
    setMeetingLink(newLink);
    onGenerate(newLink); // Call the onGenerate function with the new link
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={generateLink}>
        Generate Meeting Link
      </Button>
      <div style={{ marginTop: '10px' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Meeting Link"
          value={meetingLink}
          disabled
        />
      </div>
    </div>
  );
};

export default GenerateLink;

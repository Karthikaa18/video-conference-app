import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Navigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const ParticipantViewPage = () => {
  const [redirect, setRedirect] = useState(null);
  const [participantName, setParticipantName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNameChange = (event) => {
    setParticipantName(event.target.value);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const joinMeeting = () => {
    handleDialogOpen();
  };

  const redirectToMeeting = () => {
    // Emit participantJoined event with the participant's name
    socket.emit('participantJoined', participantName);

    // Redirect to ParticipantMeetingPage with participant name as query parameter
    const meetingId = window.location.pathname.split('/').pop();
    setRedirect(`/participant-meeting/${meetingId}?name=${encodeURIComponent(participantName)}`);
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={joinMeeting}>
        Join Meeting
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Enter Your Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={participantName}
            onChange={handleNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={redirectToMeeting} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ParticipantViewPage;

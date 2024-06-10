import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, IconButton, Button, TextField, List, ListItem, ListItemText, Paper, AppBar, Toolbar, Box } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import io from 'socket.io-client';
import CountdownTimer from './CountdownTimer';

const socket = io('http://localhost:3001');

const HostMeetingPage = () => {
  const { link } = useParams();
  const [timerDuration, setTimerDuration] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [meetingLink, setMeetingLink] = useState(link || ''); // Use the link from URL parameter if available
  const [participants, setParticipants] = useState([]); // State to store participant names
  const [participantCounts, setParticipantCounts] = useState({}); // State to store participant hand raise counts

  useEffect(() => {
    // Listen for timer duration selection from host
    socket.on('startTimer', (duration) => {
      setTimerDuration(duration);
    });

    // Listen for participant joining the call
    socket.on('participantJoined', (participantName) => {
      console.log(`Participant joined: ${participantName}`);
      setParticipants((prevParticipants) => [...prevParticipants, participantName]);
    });

    // Cleanup function to remove the listener when component unmounts
    return () => {
      socket.off('startTimer');
      socket.off('participantJoined');
    };
  }, []);

  useEffect(() => {
    socket.on('handRaised', (participantName) => {
      // Update participant hand raise count
      setParticipantCounts((prevCounts) => ({
        ...prevCounts,
        [participantName]: (prevCounts[participantName] || 0) + 1,
      }));
    });

    return () => {
      socket.off('handRaised');
    };
  }, []);

  const startTimer = (duration) => {
    // Emit socket event to start timer with selected duration
    socket.emit('startTimer', duration);
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
  };

  const toggleMic = () => {
    setMicOn(!micOn);
  };

  const endCall = () => {
    // Logic to end call
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    alert('Link copied to clipboard!');
  };

  const handleTimerComplete = () => {
    // Logic to handle timer completion
    console.log('Timer completed');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Meeting Link"
              variant="outlined"
              value={meetingLink}
              InputProps={{
                readOnly: true,
              }}
              size="small"
              sx={{ marginRight: 1 }}
            />
            <Button variant="contained" color="secondary" onClick={copyToClipboard}>
              Copy Link
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ height: '100%', overflowY: 'auto', padding: 2 }}>
            <Typography variant="h6">Participants who Raised Hands</Typography>
            <List>
              {Object.entries(participantCounts).map(([participantName, count]) => (
                <ListItem key={participantName}>
                  <ListItemText primary={`${participantName}: ${count}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h4" align="center">Welcome, Host</Typography>
            <Grid container spacing={2}>
              {participants.map((participant, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                      alt="Participant Avatar"
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <Typography variant="subtitle1" style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '2px 5px', borderRadius: '5px' }}>
                      {participant}
                    </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ marginTop: 2 }}>
              <Grid item>
                <IconButton onClick={toggleCamera}>
                  {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={toggleMic}>
                  {micOn ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={endCall} sx={{ color: 'red' }}>
                  <CallEndIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ marginTop: 2 }}>
              {[15, 30, 45, 60].map((duration) => (
                <Grid item key={duration}>
                  <Button variant="contained" onClick={() => startTimer(duration)}>
                    {duration}s
                  </Button>
                </Grid>
              ))}
            </Grid>
            {timerDuration && <CountdownTimer duration={timerDuration} onComplete={handleTimerComplete} />}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ height: '100%', overflowY: 'auto', padding: 2 }}>
            <Typography variant="h6">Participant Names</Typography>
            <List>
              {participants.map((participant, index) => (
                <ListItem key={index}>
                  <ListItemText primary={participant} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HostMeetingPage;

import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const ParticipantMeetingPage = () => {
  const [participantName, setParticipantName] = useState('');
  const [raisedHand, setRaisedHand] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setParticipantName(params.get('name') || 'Anonymous');

    const handleHandRaised = (name) => {
      if (name !== participantName) {
        alert(`${name} has raised their hand`);
      }
    };

    const handleStartTimer = (duration) => {
      startTimer(duration);
    };

    socket.on('handRaised', handleHandRaised);
    socket.on('startTimer', handleStartTimer);

    return () => {
      socket.off('handRaised', handleHandRaised);
      socket.off('startTimer', handleStartTimer);
    };
  }, [participantName]);

  const raiseHand = () => {
    socket.emit('raiseHand', participantName);
    setRaisedHand(true);

    // Reset the raisedHand state after emitting the socket event
    setTimeout(() => {
      setRaisedHand(false);
    }, 500); // Adjust the timeout value as needed
  };

  const startTimer = (duration) => {
    setTimer(duration);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          const audio = new Audio('https://dl.dropboxusercontent.com/s/1cdwpm3gca9mlo0/kick.mp3');
          audio.play();
          return null;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
  };


  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Welcome, {participantName}</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={raiseHand}
        disabled={raisedHand}
        sx={{ marginBottom: '1rem' }}
      >
        Raise Hand
      </Button>
      {timer !== null && (
        <Typography variant="h6">Countdown: {timer}s</Typography>
      )}
    </div>
  );
};

export default ParticipantMeetingPage;

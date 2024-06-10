import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import { Button, TextField } from "@mui/material";
import GenerateLink from "./GenerateLink"; // Import GenerateLink component
import { v4 as uuidv4 } from 'uuid';

function HostView({ email }) {
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    // Generate the meeting link when the component mounts
    const newLink = `${window.location.origin}/participant/${uuidv4()}`;
    setMeetingLink(newLink);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("Link copied to clipboard!");
  };

  const handleJoinCall = () => {
    // Redirect to HostMeetingPage with the provided link
    window.location.href = `/host-meeting/${encodeURIComponent(meetingLink)}`;
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <h2>Welcome, { email }!</h2>
      <TextField
        fullWidth
        label="Meeting Link"
        variant="outlined"
        value={meetingLink}
        InputProps={{
          readOnly: true,
        }}
        style={{ marginBottom: 10 }}
      />
      <div style={{ marginTop: "10px" }}>
        <Button variant="contained" color="secondary" onClick={copyToClipboard}>
          Share Link
        </Button>
      </div>
      <br />
      <Button variant="contained" onClick={handleJoinCall}>
        Join Call
      </Button>
    </div>
  );
}

HostView.propTypes = {
  username: PropTypes.string.isRequired, // Ensure username is a required prop
};

export default HostView;

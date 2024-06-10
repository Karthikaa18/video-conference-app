import React, { useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import Axios from "axios";

function Signup({ setRegisterStatus, handleLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const register = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!email || !username || !password) return;
    Axios.post("http://localhost:3001/register", {
      email: email,
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setRegisterStatus(response.data.message);
      } else {
        setRegisterStatus("ACCOUNT CREATED SUCCESSFULLY");
        handleLoginSuccess(username, email); // Update the logged-in user's state
        //window.location.href = "/host-view"; // Redirect to HostView
      }
    });
  };

  return (
    <div>
      <Typography variant="h4">Sign Up</Typography>
      <TextField
        fullWidth
        label="Email Address"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
        error={formSubmitted && !email}
        helperText={(formSubmitted && !email) && "Email is required"}
      />
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
        error={formSubmitted && !username}
        helperText={(formSubmitted && !username) && "Username is required"}
      />
      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        error={formSubmitted && !password}
        helperText={(formSubmitted && !password) && "Password is required"}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={register}
      >
        Sign Up
      </Button>
    </div>
  );
}

export default Signup;

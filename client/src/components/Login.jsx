import React, { useState } from "react";
import { Typography, TextField, Button, Link } from "@mui/material";
import Axios from "axios";

function Login({ setLoginStatus, handleLoginSuccess }) { // Pass handleLoginSuccess as prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const login = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!username || !password) return;
    Axios.post("http://localhost:3001/login", {
      email: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        const { username, email } = response.data[0]; // Assuming your response data contains both username and email
        handleLoginSuccess(username, email); // Call handleLoginSuccess with username and email
      }
    });
  };

  return (
    <div>
      <Typography variant="h4">Login</Typography>
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
        error={formSubmitted && !username}
        helperText={(formSubmitted && !username) && "Email is required"}
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
        onClick={login}
      >
        Login
      </Button>
      <Typography variant="subtitle1" align="center" gutterBottom>
        {/* Don't have an account?{" "}
        <Link href="#" onClick={() => {}}>Sign Up</Link> */}
      </Typography>
    </div>
  );
}

export default Login;

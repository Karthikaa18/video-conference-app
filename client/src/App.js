import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Grid, Typography, Button } from "@mui/material";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HostView from "./components/HostView";
import HostMeetingPage from "./components/HostMeetingPage"; 
import ParticipantViewPage from "./components/ParticipantViewPage"; 
import ParticipantMeetingPage from "./components/ParticipantMeetingPage"; 

function App() {
  const [loginStatus, setLoginStatus] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setRegisterStatus("");
    setLoginStatus("");
  };

  const handleLoginSuccess = (username, email) => {
    setLoggedInUser({ username, email });
    setLoginStatus("");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Container maxWidth="sm">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Routes>
              <Route
                path="/"
                element={
                  loggedInUser ? (
                    <HostView email={loggedInUser.email} />
                  ) : (
                    <>
                      {isLoginForm ? (
                        <Login setLoginStatus={setLoginStatus} handleLoginSuccess={handleLoginSuccess} />
                      ) : (
                        <Signup setRegisterStatus={setRegisterStatus} handleLoginSuccess={handleLoginSuccess} />
                      )}
                      <div>
                        <p>
                          <Typography variant="subtitle1" align="center" gutterBottom>
                            {isLoginForm
                              ? "Don't have an account? "
                              : "Already have an account? "}
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              onClick={toggleForm}
                            >
                              {isLoginForm ? "Sign Up" : "Login"}
                            </Button>
                          </Typography>
                        </p>
                      </div>
                      <p>{isLoginForm ? loginStatus : registerStatus}</p>
                    </>
                  )
                }
              />
              <Route
                path="/host-meeting"
                element={<HostMeetingPage />}
              />
              <Route
                path="/host-meeting/:link" // Update route to accept link as a parameter
                element={<HostMeetingPage />}
              />
              <Route
                path="/participant/:id"
                element={<ParticipantViewPage />}
              />
              <Route
                path="/participant-meeting/:id"
                element={<ParticipantMeetingPage />}
              />
            </Routes>
          </Grid>
        </Grid>
      </Container>
    </Router>
  );
}

export default App;
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Welcome@123',
  database: 'video-conference-app'
});

con.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  con.query("SELECT * FROM users WHERE username = ? AND email = ? AND password = ?", [username, email, password], (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      con.query("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [email, username, password], (err, result) => {
        if (err) {
          res.send({ message: "ENTER CORRECT DETAILS!" });
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  console.log('username is - ', username);
  console.log('password is', password);
  con.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password], (err, result) => {
    if (err) {
      res.send({ err });
    } else if (result.length > 0) {
      res.send(result);
    } else {
      res.send({ message: 'Wrong email/password combination!' });
    }
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('startTimer', (duration) => {
    io.emit('startTimer', duration);
  });

  socket.on('participantJoined', (participantName) => {
    console.log(`Participant joined: ${participantName}`);
    io.emit('participantJoined', participantName);
  });

  socket.on('raiseHand', (name) => {
    io.emit('handRaised', name);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});

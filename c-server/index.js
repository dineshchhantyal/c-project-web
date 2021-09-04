const express = require('express');
const app = express();
const fs = require('fs');
require('log-timestamp');
const http = require("http");
const socketIo = require("socket.io");


const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const PORT = process.env.PORT || 5000;

const buttonPressesLogFile = 'C:/Users/user/Desktop/project/c-project/files/votes';
const leaders = [];
const votes = {};

console.log(`Watching for file changes on ${buttonPressesLogFile}`);



app.use(cors());
app.use(morgan('dev'));
app.use(helmet());




const server = http.createServer(app);

const io = socketIo(server, { serveClient: false }); // < Interesting!



io.on("connection", (socket) => {
  console.log("New client connected");

  fs.watch(buttonPressesLogFile, (event, filename) => {
    // read the file and send it to the client
    fs.readdir(buttonPressesLogFile, (err, files) => {
      files.forEach(file => {
        fs.readFile(buttonPressesLogFile + '/' + file, 'utf8', (err, data) => {
          if (err) throw err;
          votes[file] = data;
          socket.emit('vote', { votes: votes });
        }
        );
      });
    }
    );

  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


server.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`)
})


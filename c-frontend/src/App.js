import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';


const socket = socketIOClient('http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: false,
})

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [channel, setChannel] = useState();
  const [votes, setVotes] = useState({});


  const handleSocket = () => {
    socket.open()
    socket.on('connect', () => {
      setChannel(socket.connected ? socket.id : '');

    })
    // listen to every socket emit and console it
    socket.on('change', (data) => {
      console.log(data);
    }
    )
    socket.on('vote', (data) => {
      setVotes(data.votes);
      console.log(data);
    }
    )
  }

  const handleToggle = () => {
    console.log(socket)
    socket.connected ? socket.close() : handleSocket()
    setConnectionStatus((prev) => !prev)
  }
  return (
    <div className="app">
      <div class="switch-holder">
        <div class="switch-label">
          <span className="status">{!connectionStatus ? 'Disconnect' : 'Connect'}</span>
        </div>
        <div class="switch-toggle">
          <input type="checkbox" id="bluetooth" onClick={handleToggle} />
          <label for="bluetooth"></label>
        </div>
      </div>

      <h1 className="result">RESULT</h1>
      <div className="votes">
        {Object.keys(votes).map((key) => {
          return (
            <div key={key} className="vote__card">
              <h2 className="vote__leaderName">{key.split(".txt")[0]}</h2>
              <div className={"vote__number"}>
                <span className="vote__text"> VOTE : </span>
                {votes[key]}</div>
            </div>
          )
        })}

      </div>
    </div >
  )
}

export default App;
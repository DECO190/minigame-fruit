const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors')
const utils = require('./utils')

app.use(cors({ origin: "*" }));

app.use(express.json());

let players = {}

let fruit = {pos: {x: 250, y: 250}}

io.on('connection', async (socket) => {
    let socket_id = await socket.id
    let player_id = await socket.handshake.query.id

    if (players[player_id]) {
        players[player_id].socket_id = socket_id
    }

    socket.broadcast.emit('updatePlayers', players)

    socket.on('updatePlayerPos', (data) => {
        let player_id = data.id
        
        if (!players[player_id]) {return}

        players[player_id].pos = data.pos

        socket.broadcast.emit('updatePlayers', players)
    })

    socket.on('disconnect', () => {
        let player_id = undefined
        let socket_id = socket.id

        for (let i in players) {
            if (players[i].socket_id == socket_id) {
                player_id = players[i].id
            }
        }

        if (player_id) {
            delete players[player_id]
            socket.broadcast.emit('updatePlayers', players)
        }

    })
});

app.post('/loginUser', (req, res) => {
    let id = utils.hash(20)
    
    players[id] = {pos: {x: 0, y: 0}, points: 0, id, socket_id: ''}

    return res.json({id, players, fruit})
})

server.listen(3000, () => {
    console.log('[SERVER STARTADO]');
});
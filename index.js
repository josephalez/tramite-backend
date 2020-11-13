'use strict'

require("dotenv").config();
//const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3005;

const server = app.listen(port,()=>{
    console.log('El servidor '+port+' esta funcionando');
});

const io = require('socket.io')(server);

const socketActions = require('./socket');

const socketJwt = require('socketio-jwt')

io.set('authorization', socketJwt.authorize({
    secret: process.env.SECRET_KEY_JWT,
    handshake: true,
}));

io.on('connection', async socket=>{

    console.log('\n\n\n\n new socket  emmited \n\n\n');

    let decoded= socket.conn.request.decoded_token;

    console.log(decoded);

    socketActions.validateJwtSocket(socket,decoded);
   
    socket.on('new-message', data=>{
        console.log('new message', data);
        let succesCb= (data)=>{
            io.sockets.to('to-'+data.user2).emit('message-add', data)
        }
        socketActions.newMessage(socket,data, succesCb);
    });

    socket.on('messages-list', ()=>{
        socketActions.getMessagesList(socket);   
    });

    socket.on('users-list', ()=>{
        socketActions.getUsersList(socket);
    });
});
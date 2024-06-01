const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const userColors = {};

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    console.log('User connected');
    
    // Assign a random color to the user
    userColors[socket.id] = getRandomColor();
    
    // Notify all clients about the new user
    io.emit('user joined', { message: 'A new user joined the chat', color: '#aaa' });

    // Handle chat messages
    socket.on('chat message', message => {
        io.emit('chat message', { message: message, color: userColors[socket.id] });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
        io.emit('user disconnected',{message:'A user left the chat' ,color: '#aaa'})
        delete userColors[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

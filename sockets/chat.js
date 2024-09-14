const socketIO = require('socket.io');

module.exports = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('New user connected');

        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`User joined group ${groupId}`);
        });

        socket.on('message', ({ groupId, message }) => {
            io.to(groupId).emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
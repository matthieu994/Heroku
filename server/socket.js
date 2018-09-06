module.exports = function (app, port) {
    const http = require('http')
    var server = http.createServer(app).listen(port)
    var io = require('socket.io').listen(server);
    io.set('origins', '*:*');

    io.on('connection', function (client) {
        client.on('joinRoom', (num) => {
            if (io.nsps['/'].adapter.rooms[num] && io.nsps['/'].adapter.rooms[num].length >= 2)
                return fullRoom(client, num);
            client.join(num);

            var clientsCount = io.sockets.adapter.rooms[num].length;
            if (clientsCount === 1)
                playerIs(client, 'X')
            else {
                playerIs(client, 'O')
                io.in(num).emit('start', true);
            }
            client.emit('inRoom', "Vous avez rejoint la salle #" + num);
        })

        client.on('play', data => {
            client.broadcast.to(data.room).emit('nextPlayer', { xIsNext: !data.xIsNext, i: data.i });
        })
    })

    // server.listen(5001, 'localhost');
}

const fullRoom = (client, num) => {
    client.emit('fullRoom', "La salle #" + num + " est pleine.");
}

const playerIs = (client, type) => {
    client.emit('playerIs', type);
}
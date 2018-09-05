module.exports = function (app) {
    var http = require("http").createServer(app);
    var io = require("socket.io")(http);
    
    io.set('origins', '*:*');
    io.on('connection', function (client) {
        client.on('joinRoom', (num) => {
            if (io.nsps['/'].adapter.rooms[num] && io.nsps['/'].adapter.rooms[num].length >= 2)
                return fullRoom(client, num);
            client.join(num);

            var clientsCount = io.sockets.adapter.rooms[num].length;
            if (clientsCount === 1)
                playerIs(client, 'X')
            else
                playerIs(client, 'O')

            client.emit('inRoom', "Vous avez rejoint la salle #" + num);
        })

        client.on('play', data => {
            client.broadcast.to(data.room).emit('nextPlayer', { xIsNext: !data.xIsNext, i: data.i });
        })
    })

    http.listen(5001, "localhost");
}

const fullRoom = (client, num) => {
    client.emit('fullRoom', "La salle #" + num + " est pleine.");
}

const playerIs = (client, type) => {
    client.emit('playerIs', type);
}
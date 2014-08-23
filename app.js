var static = require('node-static');
var file = new static.Server('./webclient');

var app = require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    }).resume();
});

var io = require('socket.io')(app);
var fs = require('fs');
var _ = require('underscore');

app.listen(process.env.PORT || 8090);
var activeBoards = {};


io.on('connection', function(socket) {

    socket.on('create_board', function(data) {
        var board = makeid();

        activeBoards[board] = {
            users: []
        };
        var user = {
            id: activeBoards[board].users.length + 1,
            name: data.name,
            is_admin: true
        };

        activeBoards[board].users.push(user);

        socket.join(board);

        socket.emit('connected_to_board', {
            board_id: board,
            user: user,
            socket_id: socket.id
        });

        io.to(board).emit('user_connected', activeBoards[board]);
    });

    socket.on('join_board', function(data) {
        if (data.board_id) {
            activeBoards[data.board_id] = {
                users: []
            };

            var user = {
                id: activeBoards[data.board_id].users.length + 1,
                name: data.name,
                socket_id: socket.id
            };

            activeBoards[data.board_id].users.push(user);

            socket.join(data.board_id);
            io.to(data.board_id).emit('user_connected', activeBoards[data.board_id]);

            socket.emit('connected_to_board', {
                board_id: data.board_id,
                user: user
            });
        }
    });

    /*socket.on('disconnect', function() {
        if (activeBoards[socket.rooms[1]]) {
            activeBoards[socket.rooms[1]].users.forEach(function(user, index) {
                if (user.socket_id === socket.id) {
                    activeBoards[socket.rooms[0]].users.splice(index, 1);
                }
            })

            io.to(socket.rooms[1]).emit('user_disconnected', activeBoards[data.board_id]);

        }
    });*/

    socket.on('draw', function(data) {
        console.log('draw', data);
        if (data.room) {
            io.to(data.room).emit('draw', data);
        }
    });

    socket.on('clear_page', function(data) {
        console.log("got clear page request");
        if (data.room) {
            io.to(data.room).emit('clear_page', data);
        }
    });
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
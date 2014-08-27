angular.module('WhiteboardApp')
    .service('Socket', ['$q', '$rootScope',
        function($q, $rootScope) {
            var socket;

            return {
                join: function(board_id, user) {
                    var defer = $q.defer();

                    socket = io();

                    socket.on('connected_to_board', function(data) {
                        localStorage.board_id = data.board_id;
                        localStorage.user = JSON.stringify(data.user);
                        defer.resolve(data);
                    });

                    socket.emit('join_board', {
                        board_id: board_id || localStorage.board_id,
                        name: user.name || localStorage.name || 'Mohammed'
                    });

                    return defer.promise;
                },
                create: function() {
                    var defer = $q.defer();
                    socket = io();

                    socket.on('connected_to_board', function(data) {
                        localStorage.board_id = data.board_id;
                        localStorage.user = JSON.stringify(data.user);
                        defer.resolve(data);
                    });

                    socket.emit('create_board', {
                        name: 'lalla'
                    });

                    return defer.promise;
                },
                is_connected: function() {
                    if (socket) {
                        return true;
                    } else {
                        return false;
                    }
                },
                getSocket: function() {
                    return socket;
                },
                connect: function() {
                    socket = io();
                    return socket;
                },
                send: function(event_name, data) {
                    if (event_name && data) {
                        socket.emit(event_name, data);
                    }
                },
                getOrJoin: function(room_id) {
                    var defer = $q.defer();
                    if (socket) {
                        defer.resolve(socket);
                    } else {
                        this.join(room_id, {
                            name: 'lalla'
                        }).then(function(data) {
                            defer.resolve(socket);
                        });
                    }
                    return defer.promise;
                }
            }
        }
    ]);
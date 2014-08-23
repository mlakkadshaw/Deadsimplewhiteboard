angular.module('WhiteboardApp')
    .service('Socket', ['$q', '$rootScope',
        function($q, $rootScope) {
            var socket;

            return {
                join: function(board_id, user) {
                    var defer = $q.defer();

                    socket = io('http://localhost:8090');

                    socket.on('connected_to_board', function(data) {
                        localStorage.board_id = data.board_id;
                        localStorage.user = JSON.stringify(data.user);
                        defer.resolve(data);
                    });

                    socket.emit('join_board', {
                        board_id: board_id || localStorage.board_id,
                        name: user.name || localStorage.name || 'Mohammed'
                    });

                    return defer.promise();
                },
                create: function() {

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
                    socket = io('http://localhost:8090');
                    return socket;
                }
            }
        }
    ]);
angular.module('WhiteboardApp')
    .controller('ConnectCtrl', ['$scope', '$location', 'Socket',
        function($scope, $location, Socket) {

            Socket.connect();
            var socket = Socket.getSocket();

            $scope.connect = function(board_id) {
                socket.emit('join_board', {
                    board_id: board_id,
                    name: 'Mohammed Lakkadshaw'
                });
            };

            $scope.create = function() {
                socket.emit('create_board', {
                    name: 'Mohammed Lakkadshaw'
                });
            };


            //Listeners
            socket.on('connected_to_board', function(data) {
                console.log("Connect to board event fired");
                localStorage.board_id = data.board_id;
                if (data.user) {
                    localStorage.user = JSON.stringify(data.user);
                }
                $location.path("/whiteboard");
                $scope.$apply();
            });

            if (localStorage.board_id) {
                $scope.connect(localStorage.board_id);
                $location.path("/whiteboard");
            }
        }
    ]);
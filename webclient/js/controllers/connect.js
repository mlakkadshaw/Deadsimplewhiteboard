angular.module('WhiteboardApp')
    .controller('ConnectCtrl', ['$scope', '$location', 'Socket',
        function($scope, $location, Socket) {
            $scope.connect = function(board_id) {
                Socket.join(board_id).then(function(data) {
                    $location.path("/whiteboard/" + data.board_id);
                    $scope.$apply();
                });
            };

            $scope.create = function() {
                Socket.create().then(function(data) {
                    $location.path("/whiteboard/" + data.board_id);
                    $scope.$apply();
                });
            };

            if (localStorage.board_id) {
                $scope.connect(localStorage.board_id);
                $location.path("/whiteboard/" + localStorage.board_id);
            }
        }
    ]);
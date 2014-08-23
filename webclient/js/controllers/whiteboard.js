angular.module('WhiteboardApp').controller('WhiteboardCtrl', ['$scope', 'Socket', '$location',
    function($scope, Socket, $location) {
        //Default selected tools
        $scope.pencilTool = true;
        $scope.colorOne = true;
        $scope.thinPen = true;

        $scope.me = JSON.parse(localStorage.user);
        $scope.board_id = localStorage.board_id;

        var colorObject = {
            colorOne: '#414141',
            colorTwo: '#009be7',
            colorThree: '#ed1c24',
            colorFour: '#4daf3e',
            colorFive: '#ff9300',
            colorSix: '#999999',
            colorSeven: '#662d91',
            colorEight: '#76817b'
        };

        var penSizes = {
            finePen: '1',
            thinPen: '3',
            mediumPen: '5',
            thickPen: '10'
        };

        $scope.activeColor = colorObject.colorOne;
        $scope.activePenSize = penSizes['thinPen'];

        var _activeColor, _activePenSize;


        $scope.connect = function(board_id) {
            $scope.socket = Socket.connect();
            $scope.socket.emit('join_board', {
                board_id: board_id,
                name: 'Mohammed Lakkadshaw'
            });
        };


        if (Socket.is_connected()) {
            $scope.socket = Socket.getSocket();
        } else if (localStorage.board_id) {
            Socket.connect();
            $scope.socket = Socket.getSocket();
            $scope.socket.emit('join_board', {
                board_id: localStorage.board_id,
                name: 'Mohammed Lakkadshaw'
            });
            $scope.connect(localStorage.board_id);

        } else {
            $location.path("/connect");
        }

        $scope.changeTool = function(tool) {
            $scope.pencilTool = false;
            $scope.eraserTool = false;
            $scope.textTool = false;

            $scope[tool] = true;

            if ($scope.pencilTool) {
                $scope.activeColor = _activeColor;
                $scope.activePenSize = _activePenSize;
            }

            if ($scope.eraserTool) {
                _activeColor = $scope.activeColor;
                _activePenSize = $scope.activePenSize;
                $scope.activeColor = '#ffffff';
                $scope.activePenSize = 20;
            }

            if ($scope.textTool) {
                _activeColor = $scope.activeColor;
                _activePenSize = $scope.activePenSize;
            }
        };

        $scope.changeColor = function(color) {
            if (!$scope.eraserTool) {
                $scope.colorOne = false;
                $scope.colorTwo = false;
                $scope.colorThree = false;
                $scope.colorFour = false;
                $scope.colorFive = false;
                $scope.colorSix = false;
                $scope.colorSeven = false;
                $scope.colorEight = false;

                $scope[color] = true;
                $scope.activeColor = colorObject[color];
            }
        };

        $scope.changePenSize = function(penSize) {
            if (!$scope.eraserTool) {
                $scope.finePen = false;
                $scope.thinPen = false;
                $scope.mediumPen = false;
                $scope.thickPen = false;

                $scope[penSize] = true;
                $scope.activePenSize = penSizes[penSize];
            }
        };

        $scope.clearPage = function() {
            paper.project.clear();
            paper.view.draw();

            $scope.socket.emit('clear_page', {
                room: localStorage.board_id
            });
        };

        $scope.disconnect = function() {
            delete localStorage.user;
            delete localStorage.board_id;
            $scope.socket.close();
            $location.path("/connect");
        }
    }
]);
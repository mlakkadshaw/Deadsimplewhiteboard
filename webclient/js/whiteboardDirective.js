angular.module('WhiteboardApp').directive('whiteboard', ['Socket',

    function(Socket) {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {}, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {
                // var socket = Socket.getSocket();
                console.log("Service", $scope.socket);


                var canvas = $(iElm).get()[0];
                paper.setup(canvas);
                var path;
                var tool = new paper.Tool();
                tool.minDistance = 2;

                //Variables to handle the textTool
                var start, end, tempPath;

                $scope.$watch('textTool', function() {
                    var textArea = $(".tempareas");
                    if (textArea.length > 0) {
                        var text = textArea.val();
                        var pointText = new paper.PointText(start);
                        pointText.content = text;
                        pointText.fontSize = 16;
                        pointText.fillColor = $scope.activeColor;
                    }
                    $(".tempareas").remove();
                });

                tool.onMouseDown = function(event) {

                    if ($scope.pencilTool || $scope.eraserTool) {
                        path = new paper.Path();
                        path.strokeColor = $scope.activeColor;

                        if ($scope.activePenSize)
                            path.strokeWidth = $scope.activePenSize;
                    }

                    if ($scope.textTool) {
                        //var text = new paper.PointText(event.point);
                        //text.content = "Hello world";

                        var textArea = $(".tempareas");
                        if (textArea.length > 0) {
                            var text = textArea.val();
                            var pointText = new paper.PointText(start);
                            pointText.content = text;
                            pointText.fontSize = 16;
                            pointText.fillColor = $scope.activeColor;

                            /*
                            $scope.socket.emit('draw', {
                                tool: 'textTool',
                                pointText: pointText.exportJSON(),
                                sender: $scope.me.socket_id,
                                room: localStorage.board_id,
                            });*/

                            $scope.$emit('whiteboard_draw', {
                                tool: 'textTool',
                                pointText: pointText.exportJSON(),
                            });
                        }
                        $(".tempareas").remove();

                        start = event.point;


                    }

                    var activeTool;
                    if ($scope.pencilTool) {
                        activeTool = 'pencilTool'
                    } else if ($scope.eraserTool) {
                        activeTool = 'eraserTool';
                    } else if ($scope.textTool) {
                        activeTool = 'textTool';
                    }
                    // $scope.socket.emit('draw', {
                    //     tool: activeTool,
                    //     point: event.point,
                    //     color: $scope.activeColor,
                    //     penSize: $scope.activePenSize,
                    //     sender: $scope.me.id,
                    //     room: localStorage.board_id,
                    //     activity: 'down'
                    // });

                }

                tool.onMouseDrag = function(event) {
                    if ($scope.socket) {
                        var activeTool;
                        if ($scope.pencilTool) {
                            activeTool = 'pencilTool'
                        } else if ($scope.eraserTool) {
                            activeTool = 'eraserTool';
                        } else if ($scope.textTool) {
                            activeTool = 'textTool';
                        }

                        // $scope.socket.emit('draw', {
                        //     tool: activeTool,
                        //     point: event.point,
                        //     color: $scope.activeColor,
                        //     penSize: $scope.activePenSize,
                        //     sender: $scope.me.id,
                        //     room: localStorage.board_id,
                        //     activity: 'drag'
                        // });
                    }

                    if ($scope.pencilTool || $scope.eraserTool) {
                        path.add(event.point);
                    }

                    if ($scope.textTool) {
                        if (tempPath) {
                            tempPath.remove();

                        }
                        end = event.point;
                        tempRect = new paper.Rectangle(start, end);

                        tempPath = new paper.Path.Rectangle(tempRect);
                        tempPath.fillColor = '#e9e9ff';
                    }
                    //   console.log(event.point);
                }

                tool.onMouseUp = function(event) {
                    //path.selected = false;
                    //path.smooth();
                    // path.simplify();
                    //  console.log(path.exportJSON());
                    //  
                    if ($scope.textTool) {
                        tempPath.remove();

                        console.log(event.point);
                        $("body").append("<textarea class='tempareas' style='position:absolute; top:" + (start.y + 75) + "px; left:" + start.x + "px; width: " + (end.x - start.x) + "px; height:" + (end.y - start.y) + "px;'></textarea>")
                        $(".tempareas").focus();
                    }

                    if ($scope.pencilTool || $scope.eraserTool) {
                        /*$scope.socket.emit('draw', {
                            tool: 'pencilTool',
                            path: path.exportJSON(),
                            color: $scope.activeColor,
                            penSize: $scope.activePenSize,
                            sender: $scope.me.socket_id,
                            room: localStorage.board_id,
                            activity: 'up'
                        });*/

                        $scope.$emit('whiteboard_draw', {
                            tool: 'pencilTool',
                            path: path.exportJSON(),
                            color: $scope.activeColor,
                            penSize: $scope.activePenSize,
                            activity: 'up'
                        });
                    }
                }


                $scope.$on('draw', function(ev, data) {
                    if ($scope.me.socket_id !== data.sender) {
                        if (data.tool === 'pencilTool') {

                            remotePath = new paper.Path();
                            remotePath.importJSON(data.path);
                            paper.view.draw();
                        }


                        if (data.tool === 'textTool') {
                            var pointText = new paper.PointText();
                            pointText.importJSON(data.pointText);
                            paper.view.draw();
                        }
                    }
                });

                $scope.$on('clear_page', function() {
                    paper.project.clear();
                    paper.view.draw();
                });


                /*if ($scope.socket) {
                    var remotePath;
                    $scope.socket.on('draw', function(data) {
                        if ($scope.me.socket_id !== data.sender) {
                            if (data.tool === 'pencilTool') {
                                // if (data.activity === 'down') {
                                //     remotePath = new paper.Path();
                                //     remotePath.strokeColor = data.color;
                                //     remotePath.strokeWidth = data.penSize
                                // }
                                //remotePath.add(new paper.Point(data.point[1], data.point[2]));

                                remotePath = new paper.Path();
                                remotePath.importJSON(data.path);
                                paper.view.draw();
                            }


                            if (data.tool === 'textTool') {
                                var pointText = new paper.PointText();
                                pointText.importJSON(data.pointText);
                                paper.view.draw();
                            }
                        }
                    });

                    $scope.socket.on('clear_page', function() {
                        paper.project.clear();
                        paper.view.draw();
                    });
                }*/
            }
        };
    }
]);
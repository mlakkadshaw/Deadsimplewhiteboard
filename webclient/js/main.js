/**
 * WhiteboardApp Module
 *
 * Description
 * Collaborative White-board app
 */
angular.module('WhiteboardApp', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('whiteboard', {
                    url: '/whiteboard',
                    templateUrl: 'partials/whiteboard.html',
                    controller: 'WhiteboardCtrl'
                })
                .state('connect', {
                    url: '/connect',
                    templateUrl: 'partials/connect.html',
                    controller: 'ConnectCtrl'
                });

            $urlRouterProvider.otherwise('/connect');
        }
    ]);
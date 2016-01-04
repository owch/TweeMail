/**
 * Created by owenchen on 16-01-02.
 */
var Twmail = angular.module('Twmail', []);



function mainController($scope, $http) {
    $scope.searchFormData = {};
    $scope.currentCity = {text:"Toronto"};
    //
    $http.post('/api/post/search', $scope.currentCity)
        .success(function(data) {
            $scope.tweets = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    //send request to sever to search for tweet
    $scope.searchTweet = function() {
        $http.post('/api/post/search', $scope.searchFormData)
            .success(function(data) {
                $scope.searchFormData = {}; // clear the form so our user is ready to enter another
                $scope.tweets = data;
            })
            .error(function(data) {
            });
    };

}
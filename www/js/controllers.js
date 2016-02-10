angular.module('cloudapp.controllers', [])

.controller('AppCtrl', function($scope, $http, $location) {

  $scope.user = {
    name: "test",
    second_name: "TEST", 
    email: "test@test.test",
    password: "Test111",
    img: "default.png"    
  }
  
  // login result comment
  $scope.login_result = ""; 
  
  // users from mongolab db array
  $scope.cloudusers = []; 

  // users count from mongolab db array
  $scope.cloudusers_count = null;
  
  // users local database url
  var server = 'index.php';
  
  // validation result
  $scope.valid_result = {};

  // create scope cookie property for 
  $scope.cookie = {
    name:               readCookie("name"), 
    second_name:        readCookie("second_name"),
    email:              readCookie("email"), 
    user_img:           readCookie("user_img"),
  }

  $scope.set_cookies = function (name, second_name, email, user_img) {
    setCookie("name",             name, 2);
    setCookie("second_name",      second_name, 2);
    setCookie("email",            email, 2);
    setCookie("user_img",         user_img, 2);

    $scope.cookie.name             = readCookie("name");
    $scope.cookie.second_name      = readCookie("second_name");
    $scope.cookie.email            = readCookie("email");
    $scope.cookie.user_img         = readCookie("user_img");
  }

  $scope.deleteCookie = function () {

    document.cookie = "name" +              "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "second_name" +       "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "email" +             "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "user_img" +          "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    $scope.cookie.name             = readCookie("name");
    $scope.cookie.second_name      = readCookie("second_name");
    $scope.cookie.email            = readCookie("email");
    $scope.cookie.user_img         = readCookie("user_img");
    
  }


  $scope.loginValidation = function(email, password){
    // $scope.valid_result consist validation errors or succes
    $scope.valid_result = {};
    
    // function valid_email(email) return "Ok" or error message
    $scope.valid_result.email = valid_email(email);
    console.log("$scope.valid_result.email: " + $scope.valid_result.email);
    // function valid_password(password) return "Ok" or error message
    $scope.valid_result.password = valid_password(password);
    console.log("$scope.valid_result.password: " + $scope.valid_result.password);
  }

  $scope.registrationValidation = function(name, second_name, email, password){
    // $scope.valid_result consist validation errors or succes
    $scope.valid_result = {};

    // function valid_name(name) return "Ok" or error message
    $scope.valid_result.name = valid_name(name);
    console.log("$scope.valid_result.name: " + $scope.valid_result.name);

    // function valid_second_name(second_name) return "Ok" or error message
    $scope.valid_result.second_name = valid_second_name(second_name);
    console.log("$scope.valid_result.second_name: " + $scope.valid_result.second_name);
    
    // function valid_email(email) return "Ok" or error message
    $scope.valid_result.email = valid_email(email);
    console.log("$scope.valid_result.email: " + $scope.valid_result.email);
    // function valid_password(password) return "Ok" or error message
    $scope.valid_result.password = valid_password(password);
    console.log("$scope.valid_result.password: " + $scope.valid_result.password);
  }

  $scope.doLogin = function(email, password){
    console.log("doLogin() " + email);
    $scope.login_result = "";

    $scope.loginValidation(email, password);

    if ($scope.valid_result.email     === "Ok" && 
        $scope.valid_result.password  === "Ok") {
      var data = $.param({
                  action: 'log_in',
                  email: email,
                  password: password
              });
      var config = {
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
          };
      $http.post(server, data, config)
        .then(function (response) {
          console.log(response);
          
          if(response.data.name){
            $scope.login_result = "Hello, " + response.data.name;
            $scope.set_cookies(
                response.data.name,
                response.data.second_name,
                response.data.email,
                response.data.img
              );

            // go to cloudusers page after 1 sec hello
            var cloudusers_timeout = setTimeout(function() {$scope.go_to_users()}, 1000);
          }
          else {
            $scope.login_result = "Login error";
          }  
        }
      );
    }
     
    else {
      console.log("validation false");
    }
  }

  $scope.doRegistration = function(user){
    console.log("doRegistration() " + user.name + " " + user.second_name + " " + user.email);
    
    // login result comment
    $scope.login_result = ""; 

    $scope.registrationValidation(user.name, user.second_name, user.email, user.password);
    if ($scope.valid_result.name        === "Ok" && 
        $scope.valid_result.second_name === "Ok" && 
        $scope.valid_result.email       === "Ok" && 
        $scope.valid_result.password    === "Ok") {
      user.img = "default.png";
      var data = $.param({
                  action: 'registration',
                  name: user.name,
                  second_name: user.second_name,
                  email: user.email,
                  password: user.password,
                  img: user.img
      });
      var config = {
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
      };

      $http.post(server, data, config)
        .then(function (response) {
          console.log(response.data);
          if(response.data == "registrating succes"){
            $scope.login_result = "Hello, " + user.name;
            $scope.set_cookies(
              user.name, 
              user.second_name, 
              user.email, 
              user.img
              );

            // go to cloudusers page after 2 sec hello
            var cloudusers_timeout = setTimeout(function() {$scope.go_to_users()}, 1500);
          }
          else if (response.data === "account already exist"){
            $scope.login_result = "This account already exist";
          }
          else {
            $scope.login_result = "Reristration error";
          }  
        }
      );
    }
    else {
      $scope.login_result = "Name: " + $scope.valid_result.name + 
                            "; Second name: " + $scope.valid_result.second_name + 
                            "; Email: " + $scope.valid_result.email + 
                            "; Password: " + $scope.valid_result.password;
    }  
  }

  $scope.doLogout = function(){
    console.log("doLogout()");
    
    var data = $.param({
                action: 'log_out'
              });
    var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
    $http.post(server, data, config)
      .then(function (response) {
        console.log("response php: ");
        console.log(response.data);

        $scope.deleteCookie();
        $scope.user = "";
        $scope.users = "";
        $scope.cloudusers = "";
        $scope.login_result = "";
      }
    );
  }

  // request for users count from mongolab db
  $scope.getCloudUsersCount = function(){

    if($scope.cookie.name !== null){
      console.log("getCloudUsersCount()");

      $scope.login_result = "";
      var data = $.param({
                  action: 'users_count'
                });
      var config = {
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
          };
          console.log(server, data, config);
      $http.post(server, data, config)
        .then(function (response) {
          console.log("PHP response: ");
          console.log(response);
          $scope.cloudusers_count = response.data;
        }
      );
    }
  }

  // request for users from mongolab db with skip limit parameters
  $scope.getCloudUsers = function(){

    if($scope.cookie.name !== null){
      console.log("getCloudUsers()");
      
      var skip = $scope.cloudusers.length;
      var limit = '5';

      $scope.login_result = "";
      var data = $.param({
                  action: 'users_skip_limit',
                  skip: skip,
                  limit: limit
                  });
      var config = {
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
          };
      $http.post(server, data, config)
        .then(function (response) {
          console.log("PHP response: ");
          console.log(response);
          $scope.cloudusers = response.data;
        }
      );
    }
  }


  $scope.getCloudUsersSkipLimit = function(){
    console.log("getCloudUsersSkipLimit()");
    var skip = '';
    var limit = '5';
    $scope.cloudusers.length == null ? skip = '0' : skip = $scope.cloudusers.length;
    skip = skip.toString();
    $scope.getCloudUsersSkLm(skip, limit);
  }

  // request for users from mongolab db with skip and limit parameters
  $scope.getCloudUsersSkLm = function(_skip, _limit){
    if($scope.cookie.name !== null){
      console.log("getCloudUsersSkLm(" + _skip + ", " + _limit + ")");
      var data = $.param({
                  action: 'users_skip_limit',
                  skip: _skip,
                  limit: _limit
                  });
      var config = {
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
          };
      $http.post(server, data, config)
        .then(function (response) {
          console.log("php response.data: ");
          console.log(response.data);
          Array.prototype.push.apply($scope.cloudusers, response.data);
        }
      );
    }

  }

  // redirect to cloudusers after succesful login or registration
  $scope.go_to_users = function(){
    $scope.getCloudUsers();
    $location.path("app/cloudusers");
  }

  // load more users from mongolab
  $scope.loadMore = function() {
    $scope.getCloudUsersSkipLimit();
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }
  
});

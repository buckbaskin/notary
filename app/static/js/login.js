"use strict";
/* globals $scope: true */

function __login(oldScope) {
  $scope = oldScope.clone(oldScope);
  $scope.authToken = "";
  $scope.hideConfirmBool = true;
  $scope.hideConfirmText = ("<input type=\"password\" class=\"form-control\" "+
    "id=\"confirm-password\" placeholder=\"confirm password\" "+
    "onblur=\"$scope.checkConfirmMatch();\">");

  $scope.sendLogin = function(redir) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log(username, password);
    
    if (username.length > 0 && password.length > 0) {
      var myRequest = {
        "atoken": [username,""],
        "action": "login",
        "username": username,
        "password": password
      };

      var myJson = JSON.stringify(myRequest);

      $scope.request("POST", "json", "/login", function(res) {
        if (res.readyState === 4 && res.status === 200) {
          var response = JSON.parse( res.responseText );
          console.log('login res', response);
          if (response !== "" && (typeof response === "string")) {
            console.log("response");
            console.log(response);
            $scope.authToken = response;
            $scope.username = username;
            // document.cookie = 'username='+$scope.username;
            // document.cookie = 'atoken='+$scope.authToken;
            console.log("doco cookie", document.cookie);
            console.log('winwinwin', redir);
            window.location = redir;
          } else {
            document.getElementById("password").value = "";
            document.getElementById("message").innerHTML = "Invalid username or password";
          }
        }
      }, myJson);

      console.log('end sendLogin');

    } else {
      document.getElementById("message").innerHTML = "Please enter a username and password";
    }
  };

  $scope.hideConfirm = function() {
    console.log("hideConfirm");
    $scope.hideConfirmBool = true;
    // var oldtext = document.getElementById("confirm-holder").innerHTML;
    document.getElementById("confirm-holder").innerHTML = "";
  };

  $scope.showConfirm = function() {
    console.log("showConfirm");
    $scope.hideConfirmBool = false;
    document.getElementById("confirm-holder").innerHTML = $scope.hideConfirmText;

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username.length > 0 && password.length > 0) {
      document.getElementById("message").innerHTML = ("Confirm your password "+
        "to create a new account");
    }
  };

  $scope.checkConfirmMatch = function() {
    // TODO(buckbaskin)
    console.log("checkConfirmMatch");
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    if (password === confirmPassword) {
      document.getElementById("confirm-password").style["background-color"] = "green";
      return true;
    } else {
      document.getElementById("confirm-password").style["background-color"] = "red";
      return false;
    }
  };

  $scope.createUser = function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if ($scope.hideConfirmBool) {
      $scope.showConfirm();
    } else {
      if (username.length > 0 && password.length) {
        var myRequest = {
          "atoken": [
          username,
          "",
          ],
          "action": "create",
          "username": username,
          "password": password,
        };

        var myJson = JSON.stringify(myRequest);

        $scope.request("POST", "json", "/u.json", function(res) {
          if (res.readyState === 4 && res.status === 200) {
            var response = JSON.parse( res.responseText );
            if (response !== "") {
              console.log("response");
              console.log(response);
              $scope.username = response;
            } else {
              document.getElementById("password").value = "";
              document.getElementById("message").innerHTML = "Invalid username or password";
            }
          }
        }, myJson);
      } else {
        document.getElementById("message").innerHTML = "Please enter a username and password";
      }
    }
  };
}

__login($scope);
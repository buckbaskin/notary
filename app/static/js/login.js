"use strict";
/* globals $cope: true */

function login(oldScope) {
  $cope = $cope.clone(oldScope);
  $cope.authToken = "";
  $cope.hideConfirmBool = true;
  $cope.hideConfirmText = ("<input type=\"password\" class=\"form-control\" "+
    "id=\"confirm-password\" placeholder=\"confirm password\" "+
    "onblur=\"$cope.checkConfirmMatch();\">");

  $cope.sendLogin = function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username.length > 0 && password.length) {
      var myRequest = {
        "atoken": [username,""],
        "action": "login",
        "username": username,
        "password": password
      };

      var myJson = JSON.stringify(myRequest);

      $cope.request("POST", "json", "/u.json", function(res) {
        if (res.readyState === 4 && res.status === 200) {
            var response = JSON.parse( res.responseText );
            if (response !== "") {
              console.log("response");
              console.log(response);
              $cope.authToken = response;
            } else {
              document.getElementById("password").value = "";
              document.getElementById("message").innerHTML = "Invalid username or password";
            }
          }
      }, myJson);
    } else {
      document.getElementById("message").innerHTML = "Please enter a username and password";
    }
  };

  $cope.hideConfirm = function() {
    console.log("hideConfirm");
    $cope.hideConfirmBool = true;
    // var oldtext = document.getElementById("confirm-holder").innerHTML;
    document.getElementById("confirm-holder").innerHTML = "";
  };

  $cope.showConfirm = function() {
    console.log("showConfirm");
    $cope.hideConfirmBool = false;
    document.getElementById("confirm-holder").innerHTML = $cope.hideConfirmText;

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username.length > 0 && password.length > 0) {
      document.getElementById("message").innerHTML = ("Confirm your password "+
        "to create a new account");
    }
  };

  $cope.checkConfirmMatch = function() {
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

  $cope.createUser = function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if ($cope.hideConfirmBool) {
      $cope.showConfirm();
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

        $cope.request("POST", "json", "/u.json", function(res) {
          if (res.readyState === 4 && res.status === 200) {
              var response = JSON.parse( res.responseText );
              if (response !== "") {
                console.log("response");
                console.log(response);
                $cope.username = response;
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

login($cope);
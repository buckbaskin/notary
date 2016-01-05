var authToken = "";
var hideConfirmBool = true;
const hideConfirmText = "<input type=\"password\" class=\"form-control\" id=\"confirm-password\" placeholder=\"confirm password\" onblur=\"checkConfirmMatch();\">";

function sendLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (username.length > 0 && password.length) {
    var myRequest = {
      'atoken': [username,''],
      'action': 'login',
      'username': username,
      'password': password
    }

    var myJson = JSON.stringify(myRequest);

    request("POST", "json", "/u.json", function(res) {
      console.log("response");
      console.log(response);
      if (res.readyState === 4 && res.status === 200) {
          var response = JSON.parse( res.responseText );
          if (response !== "") {
            console.log("response");
            console.log(response);
            authToken = response;
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

function hideConfirm() {
  console.log("hideConfirm");
  hideConfirmBool = true;
  var oldtext = document.getElementById("confirm-holder").innerHTML;
  document.getElementById("confirm-holder").innerHTML = "";
}

function showConfirm() {
  console.log("showConfirm");
  hideConfirmBool = false;
  document.getElementById("confirm-holder").innerHTML = hideConfirmText;

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username.length > 0 && password.length > 0) {
    document.getElementById("message").innerHTML = "Confirm your password to create a new account";
  }
}

function checkConfirmMatch() {
  // TODO(buckbaskin)
  console.log("checkConfirmMatch");
  return true;
}

function createUser() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (hideConfirmBool) {
    showConfirm();
  } else {
    if (username.length > 0 && password.length) {
      var myRequest = {
        'atoken': [
          username,
          '',
        ],
        'action': 'create',
        'username': username,
        'password': password
      }

      var myJson = JSON.stringify(myRequest);

      request("POST", "json", "/u.json", function(res) {
        if (res.readyState === 4 && res.status === 200) {
            var response = JSON.parse( res.responseText );
            if (response !== "") {
              console.log("response");
              console.log(response);
              var new_user_id = response;
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
}
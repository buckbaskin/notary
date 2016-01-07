"use strict";
/* globals $scope: true */

function __user(oldScope) {
    $scope = oldScope.clone(oldScope);
    // todo
}

__user($scope);
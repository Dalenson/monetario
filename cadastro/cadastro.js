var app = angular.module("aplicacao", ['ngCookies']);

app.controller("Rest", function ($scope, $cookies, $http) {
  $cookies.put('autorization', '')
  $scope.salvar = function () {
    var email = $('#email').val();
    var password = $('#password').val();
    var nome = $('#nome').val();

    var data = {
      nome: nome,
      email: email,
      senha: password
    }

    var req = {
      method: "POST",
      url: "https://monetario-back.onrender.com/api/usuarios",
      data: data
    }
  
    $http(req).then(function (data) {
      $cookies.put('autorization', data.data.token)
      window.location.href = "https://monetario-back.onrender.com/monetario/monetario.html";
    });

  }
});
var app = angular.module("aplicacao", ['ngCookies']);

app.controller("Rest", function ($scope, $cookies, $http) {
  $scope.senha = true;

  $scope.login = function () {
    var email = $('#email').val();
    var password = $('#password').val();

    var data = {
      email: email,
      senha: password
    }

    var req = {
      method: "POST",
      url: "https://monetario-back.onrender.com/api/usuarios/login",
      data: data
    }
    removeNotificacao();
    $http(req).then(function (data) {
      $cookies.put('autorization', data.data.token,{path:'/monetario'})
      window.location.href = "https://monetario-back.onrender.com/monetario/monetario.html";
    },function error(){
      lancaNotificacao();
    });

  }

  $scope.cadastro = function () {
    window.location.href = "https://monetario-back.onrender.com/cadastro/cadastro.html";
  }

  $scope.mostrarSenha = function(){
    console.log( $('.bi bi-eye'))
    if($scope.senha){
      $('#password').get(0).type = 'text';
      $('#eye').removeClass("bi bi-eye");
      $('#eye').addClass("bi bi-eye-fill");
      $scope.senha = false;
    }else{
      $('#password').get(0).type = 'password';
      $('#eye').removeClass("bi bi-eye-fill");
      $('#eye').addClass("bi bi-eye");
      $scope.senha = true;
    }
  }

  function lancaNotificacao(){
    $('.toast').append('<div class="toast-header">'+
            '<svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg"'+
            'aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="red"></rect></svg>'+
            '<strong class="me-auto">Usuário ou senha inválido</strong>'+
            '<small>Agora</small>'+
          '</div>'+
          '<div class="toast-body">'+
           'Por favor, verifique email e senha e tente novamente!'+
          '</div>')
  }

  function removeNotificacao(){
    $('.toast-header').remove()
    $('.toast-body').remove()
  }
 
});
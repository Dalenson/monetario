var app = angular.module("monetario", ['ngCookies']);

app.controller("Rest", function ($scope, $cookies, $http) {
  $scope.authorization = $cookies.get('autorization');

  buscaDados();
  $scope.pesquisa = '';
  $scope.tipo = '';

  $scope.filterMovimentoEntrada = function(item){
    var mes = $scope.mesValor + 1;
    mes = ("00" + mes).slice(-2)
    if(item.dataEntrada >= '2022-'+ mes +'-01' && item.dataEntrada <= '2022-'+ mes +'-31'){
      return item
    }
  }

  $scope.filterMovimentoSaida = function(item){
    var mes = $scope.mesValor + 1
    if(item.dataSaida >= '2022-'+ mes +'-01' && item.dataSaida <= '2022-'+ mes +'-31'){
      return item
    }
  }

  $scope.dataAtualFormatada = function(d){dataAtualFormatada(d);}

  function dataAtualFormatada(d){
    var data = new Date(d),
        dia  = (data.getDate()+1).toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return ano+"/"+mes+"/"+dia;
  }

  function retornarMes(d){
    var data = new Date(d),
        dia  = (data.getDate()+1).toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return mes;
  }

window.addEventListener('load', function(event) {
  const date = new Date();
  const mes = date.getMonth(); 

  $scope.mesValor = mes;
  $scope.mes = retornaMes(mes)

  }, true);

  function retornaMes(int){
    const mes = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'];

      return mes[int];
  }

  $scope.voltarMes = function(){
    $scope.mesValor--;
    if($scope.mesValor == '-1'){
      $scope.mesValor = 11;
    }
    $scope.mes = retornaMes($scope.mesValor)
  }

  $scope.avancarMes = function(){
    $scope.mesValor++
    if($scope.mesValor == '12'){
      $scope.mesValor = 0;
    }
    $scope.mes = retornaMes($scope.mesValor)
  }

  function geraDadosGrafico(dados, tipo){
    var meses = [1,2,3,4,5,6,7,8,9,10,11,12]
    var valoresEntradas = [];
    var valoresSaidas = [];
   if(tipo == 'entradas'){
    meses.forEach(function(mes){
      mes = ("00" + mes).slice(-2)
      var valor = 0;
      dados.forEach(function(item){
        if(item.dataEntrada >= '2022-'+ mes +'-01' && item.dataEntrada <= '2022-'+ mes +'-31'){
          valor += item.valor;
        }
      })
      valoresEntradas.push(valor);
    })
    }
    if(tipo == 'saidas'){
      meses.forEach(function(mes){
        mes = ("00" + mes).slice(-2)
        var valor = 0;
        dados.forEach(function(item){
          if(item.dataSaida >= '2022-'+ mes +'-01' && item.dataSaida <= '2022-'+ mes +'-31'){
            valor += item.valor;
          }
        })
        valoresSaidas.push(valor);
      })
    }
    if(valoresEntradas.length != 0){
      $scope.valoresEntradas = valoresEntradas;
    }
    if(valoresSaidas.length != 0){
      $scope.valoresSaidas = valoresSaidas;
    }
    
    if($scope.valoresEntradas != undefined && $scope.valoresSaidas != undefined ){
      const ctx = document.getElementById('myChart');
      
      const labels = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
      if($scope.canvas == undefined){
        $scope.canvas = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Entradas',
              data: $scope.valoresEntradas.map((item) => {
                return item;
              }),
              borderWidth: 1,
              backgroundColor: '#00ff0017'
            },{
              label: 'Saidas',
              data: $scope.valoresSaidas.map((item) => {
                return item;
              }),
              borderWidth: 1,
              backgroundColor: '#ff00000d'
            }
            ]
          }
        });
      }else{
        data = {
          labels: labels,
          datasets: [{
            label: 'Entradas',
            data: $scope.valoresEntradas.map((item) => {
              return item;
            }),
            borderWidth: 1
          },{
            label: 'Saidas',
            data: $scope.valoresSaidas.map((item) => {
              return item;
            }),
            borderWidth: 1
          }
          ]
        }
        $scope.canvas.data = data
        $scope.canvas.update();
      }
    }
  }

  $scope.salvar = function(value){salvar(value);}
  $scope.tipoFilter = function(){tipoFilter();}
  $scope.criarTipo = function(value){criarTipo(value);}
  $scope.excluirSaida = function(id){excluirSaida(id);}
  $scope.excluirEntrada = function(id){excluirEntrada(id);}

  $scope.tipoSelecionado = function(value){
    $scope.pesquisa = '';
    $scope.ngsearch = value;
  }

  $scope.moeda = function() {
    var i = $("#valor").val();
    var v = i.replace(/\D/g,'');
    v = (v/100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    console.log(v)
    document.getElementById("valor").value = v;
}

    function lancaNotificacao(){
      $('.toast').append('<div class="toast-header">'+
              '<svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>'+
              '<strong class="me-auto">Salvando registro</strong>'+
              '<small>  agora</small>'+
            '</div>'+
            '<div class="toast-body">'+
             'Adicionando registro'+
            '</div>')
    }

    function removeNotificacao(){
      $('.toast').remove()
    }

  function salvar(tipo){
    lancaNotificacao()
    $scope.tipo = tipo;
    if($('#valor').val() != '' && $('#data').val() != '' && $scope.tipo != ''){
      url = "";
      if($scope.tipo == 'up'){
        url = "https://monetario-back.onrender.com/api/monetario/entradas";
        data = {
          dataEntrada: $('#data').val().substring(0,10),
          valor: $('#valor').val().replace('.','').replace(',','.'),
          tipo: $('#filtro').val()
        }
      }else{
        url = "https://monetario-back.onrender.com/api/monetario/saidas";
        data = {
          dataSaida: $('#data').val().substring(0,10),
          valor: $('#valor').val().replace('.','').replace(',','.'),
          tipo: $('#filtro').val()
        }
      }

      var req = {
        method: "POST",
        url: url,
        headers: {'Authorization': $scope.authorization},
        data: data
      }

      $http(req).then(function (content) {
        buscaDados();
        limparCampos();
        $scope.tipo = '';
        removeNotificacao();
      }, function errorCallback(response) {
        trow(response)
      });
    }
  }

  function buscaDados(){
    $scope.totalEntrada = 0;
    $scope.totalSaida = 0;
    $scope.saldo = 0;

    var reqEntradas = {
      method: "GET",
      url: "https://monetario-back.onrender.com/api/monetario/entradas",
      headers: {'Authorization': $scope.authorization}
    }
  
    var reqSaidas = {
      method: "GET",
      url: "https://monetario-back.onrender.com/api/monetario/saidas",
      headers: {'Authorization': $scope.authorization}
    }
  
    $http(reqSaidas).then(function (data) {
      $scope.datasaidas = data.data;
      data.data.forEach(function(itens){
        $scope.totalEntrada += itens.valor;
      })
      geraDadosGrafico(data.data, 'saidas');
    }, function errorCallback(response) {
      trow(response)
    });
  
    $http(reqEntradas).then(function (data) {
      $scope.dataentradas = data.data;
      data.data.forEach(function(itens){
        $scope.totalSaida += itens.valor;
      })
      geraDadosGrafico(data.data, 'entradas');
    }, function errorCallback(response) {
      trow(response)
    });

    tipoFilter();
  }

  function trow(response){
    if(response.status == '403'){
      $cookies.put('autorization', '')
      window.location.href = 'https://monetario-back.onrender.com/login.html';

    }
  }

  function tipoFilter(){
    $scope.pesquisa = $('#filtro').val();
    var req = {
      method: "GET",
      url: "https://monetario-back.onrender.com/api/monetario/entradas/tipos",
      headers: {'Authorization': $scope.authorization}
    }
    $http(req).then(function (data) {
      lista = [];
      data.data.forEach(element => {
        lista.push(element.nome);
      });
      $scope.datalistOptions = lista;
    }, function errorCallback(response) {
      trow(response)
    });
  }

  function criarTipo(value){
    if(!$scope.datalistOptions.includes(value)){
      $scope.ngsearch = null;
      $scope.filtro = value;
      data = {"nome":value}
      var req = {
        method: "POST",
        url: "https://monetario-back.onrender.com/api/monetario/entradas/tipos",
        headers: {'Authorization': $scope.authorization},
        data: data
      }
      $http(req).then(function (data) {
        $scope.pesquisa = '';
        $scope.ngsearch = value;
      }, function errorCallback(response) {
        trow(response)
      });
    }
    if($scope.datalistOptions.includes(value)){
      $scope.pesquisa = '';
      $scope.ngsearch = value;
    }
  }

  function excluirSaida(id){
      var req = {
        method: "DELETE",
        url: "https://monetario-back.onrender.com/api/monetario/saida/"+id,
        headers: {'Authorization': $scope.authorization}
      }
      $http(req).then(function (data) {
        buscaDados();
      }, function errorCallback(response) {
        trow(response)
      });
  }

  function excluirEntrada(id){
    var req = {
      method: "DELETE",
      url: "https://monetario-back.onrender.com/api/monetario/entrada/"+id,
      headers: {'Authorization': $scope.authorization}
    }
    $http(req).then(function (data) {
      buscaDados();
    }, function errorCallback(response) {
      trow(response)
    });
  }

  function limparCampos(){
    $scope.data = '';
    $scope.valor = '';
    $scope.pesquisa = '';
    $scope.ngsearch = '';
  }
});
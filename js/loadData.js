'use strict';

const leitorDeCSV = new FileReader()
let file, fileArr, rawData;
let fileLine = [];

function selecionaModal(versao,iteracao){
  $('#modalVersion').modal('hide');
  document.getElementById("buttonGroup").removeAttribute("hidden");
  versaoGraf = versao;
  iteracaoGraf = iteracao;
}

function selecionarGrafico(tipo){
  if(primeiroGrafico == true){
    console.log("Primeiro gráfico !");
    tipoGrafico = tipo;
    habilitarFiltro(tipo);
    primeiroGrafico = false;
  }else{
    console.log("Outros gráficos !");
    tipoGrafico = tipo;
    clicaBotao(tipo);
  }
}

function consultaBanco(tipoconsulta){
  let dados = {
    consulta: tipoconsulta,
    iteracao: iteracaoGraf,
    versao: versaoGraf
  }

  return fetch('main/consultabanco.php', {
    method: 'POST',
    body: JSON.stringify(dados),
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

function insereBanco($dados){
  let dados;
  if($dados['tipo']=='visualization'){
    dados = {
      aqns: $dados['aqns'],
      modelo: $dados['modelo'],
      atributo: $dados['atributo'],
      poco: $dados['poco'],
      versao: $dados['versao'],
      iteracao: $dados['iteracao']
    }
  }else if($dados['tipo']=='version'){
    lados = {
      versao: $dados['versao'] ,
      data: $dados['data'] ,
      iteracao: $dados['iteracao']
    }
  }

  return fetch('main/inserebanco.php', {
    method: 'POST',
    body: JSON.stringify(dados),
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

function subirCSV(arquivo){
  // Linha 1: 'Versao,Iteracao,Data\n'
  // Demais linhas: 'AQNS,Modelo,Atributo,Poco\n'

  //Primeira Linha
  $dados = arquivo.split('\n');
  $linha1 = $dados[0].split(',');
  $dadosVersion = array(
    tipo => 'version',
    versao => $linha1[4],
    data => $linha1[6],
    iteracao => $linha1[5]
  )

  //Demais Linhas
  $dadosVisualization = array(
    tipo => 'visualization',
    versao => $linha1[4],
    iteracao => $linha1[5]
  )
  
  $dadosAqns = [];

  for(let i=3;i < $dados.length-1; i++) {
    fileLine = fileArr[i].split(';');
    $dadosAqns += toFixed(fileLine[3].replace(/\r/g,""))+',';
    $dadosAqns += fileLine[1]+',';
  }

  array_push($dadosVisualization,$dadosAqns);

  return new Promise((resolve,reject) => {

    insereBanco($dados).then( retorno => {

      return retorno.json();

  }).then(json => {

      resolve(json);

    }).catch(function() {

      reject(divFiltroPocos(erro));

    })
  })
}

// uses file filters.js
function habilitarFiltro(tipo){

  document.getElementById('titleFilters').innerHTML = (titleFilters());
  
  buscaPocos().then( pocos => {

    buscaAtributos().then( atributos => {
      //Construir div de filtros de atributos e modelos
      divFiltroAtributos(atributos);
      //Coloca o indice de número de modelos
      setRange();
      //Constro o botão de filtragem
      constructButtonFilter();
      //Aplica o botão de filtragem
      clicaBotao(tipo);
    }).catch( error => {
      document.getElementById('titleFilters').innerHTML = error;
      hideFilters();
    });

    //Contruir div de filtro de poços
    divFiltroPocos(pocos);

  }).catch( error => {
    document.getElementById('titelFilters').innerHTML = error;
    hideFilters();
  });
}

window.onload = function init() {
		leitorDeCSV.onload = readFile;
}

function pegaCSV(inputFile) {
     file = inputFile.files[0];
     leitorDeCSV.readAsText(file);
		 hideFilters();
}

function readFile(evt) {
	rawData = evt.target.result;
  fileArr = evt.target.result.split('\n');

  document.getElementById("buttonGroup").removeAttribute("hidden");
  $('#modalVersion').modal('toggle');
  $('#modalVersion').modal({backdrop:'static',keyboard:false});
  //subirCSV(GeneratedCSV(fileArr));

  var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(GeneratedCSV(fileArr));
    hiddenElement.target = '_blank';
    hiddenElement.download = 'produtos.csv';
    hiddenElement.click();

  link.click(); // This will download the data file named "my_data.csv".*/
}

const date = fileArr => {
	let fileLine = fileArr[1].split(';');
	return fileLine[1];
}

const version = fileArr => {
	let fileLine = fileArr[0].split(';');
	return fileLine[1];
}

const iteration = fileArr => {
	let fileLine = fileArr[3].split(';');
	return fileLine[0];
}

const models = fileArr => {
	let modelGroup = [];
  for (var i=3; i < fileArr.length-1; i++) {
       fileLine = fileArr[i].split(';');
			 modelGroup[i-3] = fileLine[1];
  }
  return d3.set(modelGroup).values();
}

const attribs = fileArr =>{
	let attribGroup = [];
  for (let i=3; i < fileArr.length-1; i++) {
       fileLine = fileArr[i].split(';');
       const fileLineCols = fileLine[2].split(' ');
       attribGroup.push(fileLineCols[1]);
  }
	return d3.set(attribGroup).values();
}

const aqns = fileArr => {
  let aqnsGroup = [];
  for (let i=3; i < fileArr.length-1; i++) {
       fileLine = fileArr[i].split(';');
			 aqnsGroup.push(fileLine[3]);
	 }
	return aqnsGroup;
}

const GeneratedCSV = fileArr => {
  //Primeira Linha: 'Versao,Iteracao,Data\n'
  //Demais Linhas: 'AQNS,Modelo,Atributo,Poco\n';
  let novoCSV = '';
  novoCsv += version(fileArr)+','+iteration(fileArr)+','+date(fileArr)+'\n';
  for(let i=3;i < fileArr.length-1; i++) {
    fileLine = fileArr[i].split(';');
    novoCSV += toFixed(fileLine[3].replace(/\r/g,""))+',';
    novoCSV += fileLine[1]+',';
    let fileColumn = fileLine[2].split(' ')
    novoCSV += fileColumn[1]+',';
    novoCSV += fileColumn[3]+'\n';
  }
  return novoCSV;
}

const normalizedAqns = aqns => {
	let aqnsNormalized;
			 if( aqns >= -1 && aqns <= 1){
				 aqnsNormalized = 1;
			 }else if ( (aqns >= -2 && aqns < -1 ) || (aqns > 1 && aqns <= 2 )) {
			 	 aqnsNormalized = 2;
			 }else if ( (aqns >= -5 && aqns < -2 ) || (aqns > 2 && aqns <= 5 )) {
				 aqnsNormalized = 3;
			 }else if ( (aqns >= -10 && aqns < -5 ) || (aqns > 5 && aqns <= 10 )) {
				 aqnsNormalized = 4;
			 }else if ( (aqns >= -20 && aqns < -10 ) || (aqns > 10 && aqns <= 20 )) {
				 aqnsNormalized = 5;
			 }else{
				 aqnsNormalized = 6;
			 }
	return aqnsNormalized;
}

// Fix exponential numberColumnsHeader
function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('E-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}

//Transform the AQNS value in the CSV in an float and unsigned number
const fixAqns = aqns => {
  //return parseFloat(toFixed(aqns.substring(0,1)==='-'?aqns.substring(1):aqns));
  return parseFloat(toFixed(aqns));
}
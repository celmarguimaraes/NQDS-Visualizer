'use strict';

function clicaBotao(tipoGraf){
  const tipo = tipoGraf;
  let pocosSelec = [];
  let atribsSelec = [];
  const pocos = document.getElementsByName('filtroPocos');
  const atributos = document.getElementsByName('filtroAtributos');
  const maxRangeModels = document.getElementById('maxRangeModels').value;
  const minRangeModels = document.getElementById('minRangeModels').value;

  //Percorrendo filtro de Pocos
  for(let i=0;i<pocos.length;i++){
    if( document.getElementById(pocos[i].id).checked ){
      pocosSelec.push(pocos[i].id);
    }
  }

  //Percorrendo filtro de atributos
  for(let i=0;i<atributos.length;i++){
    if(document.getElementById(atributos[i].id).checked){
      atribsSelec.push(atributos[i].id);
    }
  }
  
  gerarStringGrafico(tipo,pocosSelec,atribsSelec,maxRangeModels,minRangeModels).then( data => {
    if(primeiroGrafico == true){
      generateGraphic(data,maxRangeModels,minRangeModels,tipo);
    }else{
      clearGraphicArea();
      generateGraphic(data,maxRangeModels,minRangeModels,tipo);
    }
    //console.log(data);
    //console.log(tipoGrafico);
  }).catch( response => {
    console.log(response);
  });
}

function hideFilters(){
  //clearGraphicArea();
  //document.getElementById('titleFilters').innerHTML = "";
  document.getElementById('filters-1').innerHTML = "";
  document.getElementById('filters-2').innerHTML = "";
  document.getElementById('buttonFilter').innerHTML = "";
  //document.getElementById('exportImage').hidden = true;
  //alreadyDone = false;
}

const titleFilters = () =>{
 let divString = "<p class='h3 text-center col-12 mb-0 pb-0'>FILTROS</p>";
 return divString;
}

function buscaPocos(isMA = false)
{
  let divString = "";

  return new Promise((resolve,reject) => {

    consultaBanco('pocos').then( retorno => {

      return retorno.json();

    }).then(json => {

      resolve(json);

    }).catch(function() {

      reject(divFiltroPocos(erro));

    })
  })
}

function divFiltroPocos(pocos){

  let divString = "";

  divString += "<div class='row'><p class='font-weight-bolder text-center col-12 '>POÇOS</p></div>";
  divString += "<div class='row'>";

  Object.keys(pocos).map(function(key) {
      divString+= "<div class='form-check form-check-inline col-2 ml-5 mr-0 pr-0 text-center'>";
      divString+=  "<input class='form-check-input' type='checkbox' checked='true' name='filtroPocos' id='"+pocos[key].Poco+"' value='"+pocos[key].Poco+"'>";
      divString+=  "<label class='form-check-label' for='"+pocos[key].Poco+"'>"+pocos[key].Poco+"</label>";
      divString+= "</div>";
  });

  document.getElementById('filters-1').innerHTML = divString;

}

function buscaAtributos(){

  return new Promise((resolve,reject) => {

    consultaBanco('atributos').then( retorno => {

      return retorno.json();

    }).then(data => {
        
        return data;
      
    }).then( promessa =>{

      resolve(promessa);

    }).catch(erro => {

      reject(divErroFiltro(erro));
      
    })
  })
    
}

function divFiltroAtributos(atributos){
  let divString = "";

  divString += "<div class='row  text-center'><p class='font-weight-bolder col-12'>ATRIBUTOS</p></div>";
  divString += "<div class='row'>";
  divString += "<div class='text-center col-12'>";
      
  Object.keys(atributos).map(function(key) {
    divString += "<div class='form-check form-check-inline'> <input class='form-check-input' type='checkbox' name='filtroAtributos' id='"+atributos[key].Atributo+"' value='"+atributos[key].Atributo+"' checked='true'>";
    divString += "<label class='form-check-label' for='"+atributos[key].Atributo+"'>"+atributos[key].Atributo+"</label> </div>";
  });
  

  console.log(atributos);
  
  divString += "<div style='position:relative; margin:auto; width:90%' >";
  divString += "<div class='row'><p class='font-weight-bolder text-center col-12'>MODELOS</p></div>";
  divString += "<div class='row'>";
  divString += "<span class='font-weight-bolder text-center mt-4 pt-1' style='position:absolute;min-width:30px;'></span>";
  divString += "<p class='col-2'>Max: <span id='myMaxValue' class='font-weight-bolder'></span></p>"
  divString += "<input type='range' id='maxRangeModels' class='custom-range col-10 text-center' max='"+atributos[0].Max_Modelo.substring(4,8)+"' min='1' style='width:80%'>";
  divString += "</div>";
  divString += "<div class='row'>";
  divString += "<p class='col-2'>Min: <span id='myMinValue' class='font-weight-bolder'></span></p>"
  divString += "<input type='range' id='minRangeModels' class='custom-range col-10 text-center' max='"+atributos[0].Max_Modelo.substring(4,8)+"' min='1' style='width:80%'>";
  divString += "</div>";
  
  divString += "</div>";

  document.getElementById('filters-2').innerHTML = divString;
}

function divErroFiltro(erro){
  let divString = "";

  divString += "<p class='h3 text-center col-12 mb-0 pb-0'>ERRO NA CONSULTA DOS FILTROS NO BANCO DE DADOS</p>";
  divString += "<p class='h5 text-center col-12 mb-0 pb-0'>Consulte um técnico</p></p>";
  divString += "</div>";
  
  return divString;
}

function constructButtonFilter(){
  let divString = "";
  divString += "<div class='col-5'></div>";
  divString += "<button type='button' class='btn btn-secondary tent-center col-2 mt-1 mb-2' onclick='clicaBotao(tipoGrafico);'>Aplicar</button>";
  divString += "<div class='col-5'></div></div>";

  document.getElementById('buttonFilter').innerHTML = divString;
}

function setRange(longTime){
  //RANGE Script for the value stay below the circle
  let myMaxRange = document.querySelector('#maxRangeModels');
  let myMaxValue = document.querySelector('#myMaxValue');

  //Have to set boundary because this graphic takes too much time to be done
  if(longTime === true){
    if(myMaxRange.value >= 20){
      myMaxRange.value  = 20;
      myMaxValue.innerHTML = ' ('+20+')';
    }else{
      myMaxRange.value = myMaxRange.max;
      myMaxValue.innerHTML = ' ('+myMaxRange.value+')';
    }
  }else{
    myMaxRange.value = myMaxRange.max;
    myMaxValue.innerHTML = ' ('+myMaxRange.value+')';
  }

  myMaxRange.oninput =function(){
    myMaxValue.innerHTML = ' ('+myMaxRange.value+')';
  };

  //RANGE Script for the value stay below the circle
  let myMinRange = document.querySelector('#minRangeModels');
  let myMinValue = document.querySelector('#myMinValue');

  myMinRange.value = 0;
  myMinValue.innerHTML = ' ('+myMinRange.value+')';

  myMinRange.oninput =function(){
    myMinValue.innerHTML = ' ('+myMinRange.value+')';
  };
}

const clearGraphicArea = () => {
  d3.select('#my_dataviz').select('svg').remove();
};
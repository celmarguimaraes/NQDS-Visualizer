'use strict';  

function clicaBotao(tipoGraf){
  const tipo = tipoGraf;
  let pocosSelec = [];
  let atribsSelec = [];
  const pocos = document.getElementsByName('filtroPocos');
  const atributos = document.getElementsByName('filtroAtributos');
  const slider = document.getElementById('slider');
  
  
  const minRangeModels = parseInt(slider.noUiSlider.get()[0]);
  const maxRangeModels = parseInt(slider.noUiSlider.get()[1]);
  
  console.log('minRangeModels',minRangeModels);
  console.log('maxRangeModels',maxRangeModels);

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
      generateMatrixGraphic(data,maxRangeModels,minRangeModels,tipo);
    }else{
      clearGraphicArea();
      generateMatrixGraphic(data,maxRangeModels,minRangeModels,tipo);
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
 let divString = "<p class='h3 text-center col-12 mb-0 pb-0'>FILTERS</p>";
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

  divString += "<div class='row'><p class='font-weight-bolder text-center col-12 '>WELLS</p></div>";
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

  divString += "<div class='row  text-center'><p class='font-weight-bolder col-12'>ATTRIBUTES</p></div>";
  divString += "<div class='row'>";
  divString += "<div class='text-center col-12'>";
  Object.keys(atributos).map(function(key) {
    divString += "<div class='form-check form-check-inline'> <input class='form-check-input' type='checkbox' name='filtroAtributos' id='"+atributos[key].Atributo+"' value='"+atributos[key].Atributo+"' checked='true'>";
    divString += "<label class='form-check-label' for='"+atributos[key].Atributo+"'>"+atributos[key].Atributo+"</label> </div>";
  });

  console.log('atributos',atributos);

  divString += "</div>";
  divString += "</div>";

  divString += "<div style='position:relative; margin:auto; width:90%' >";
  divString += "<div class='row'><p class='font-weight-bolder text-center col-12'>MODELS</p></div>";
  divString += "</div>"
  divString += "<div id='slider'></div>"

  document.getElementById('filters-2').innerHTML = divString;

  //CRIANDO E COLOCANDO VALORES DINAMICAMENTE NO SLIDER DE 2 PONTAS

  const slider = document.getElementById('slider');

  noUiSlider.create(slider, {
    start: [parseInt(atributos[0].Min_Modelo.substring(4,8)),
       parseInt(atributos[0].Max_Modelo.substring(4,8))],
    connect: true,
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': parseInt(atributos[0].Min_Modelo.substring(4,8)),
        'max': parseInt(atributos[0].Max_Modelo.substring(4,8))
    },
    format: wNumb({
        decimals: 0,
    }),
    tooltips: true
  });

  slider.style.width='90%';
  slider.style.marginTop='25px'

}

function divErroFiltro(erro){
  let divString = "";

  divString += "<p class='h3 text-center col-12 mb-0 pb-0'>ERROR IN DATABASE FILTER CONSULTATION</p>";
  divString += "<p class='h5 text-center col-12 mb-0 pb-0'>Consult a specialist</p></p>";
  divString += "</div>";
  
  return divString;
}

function constructButtonFilter(){
  let divString = "";
  divString += "<div class='col-5'></div>";
  divString += "<button type='button' class='btn btn-secondary tent-center col-2 mt-1 mb-2' onclick='clicaBotao(tipoGrafico);'>Apply</button>";
  divString += "<div class='col-5'></div></div>";

  document.getElementById('buttonFilter').innerHTML = divString;
}

const clearGraphicArea = () => {
  d3.select('#my_dataviz').select('svg').remove();
};
'use strict';

function applyFilter(){
  if(currentGraphic=="modelsWells"){
    modelsWells();
  }else if(currentGraphic=="modelsAttributes"){
    modelsAttributes();
  }else{
    wellsAttributes();
  }
}

const titleFilters = () =>{
 let divString = "<p class='h3 text-center col-12 mb-0 pb-0'>FILTERS</p>";
 return divString;
}

const strFiltros1 = wells =>
{
  let divString = "<div class='row'><p class='font-weight-bolder text-center col-12 '>WELLS</p></div>";
  divString += "<div class='row'>";
  for(let i=0;i<wells.length;i++){
    divString+= "<div class='form-check form-check-inline col-2 ml-5 mr-0 pr-0 text-center'>";
    divString+=  "<input class='form-check-input' type='checkbox' id='"+wells[i]+"' value='"+wells[i]+"'>";
    divString+=  "<label class='form-check-label' for='"+wells[i]+"'>"+wells[i]+"</label>";
    divString+= "</div>";
  }
  divString += "</div>";

  return divString;

}

const strFiltros2 = (models,attribs) => {
  let divString = "";
  divString += "<div class='row  text-center'><p class='font-weight-bolder col-12'>ATTRIBUTES</p></div>";
  divString += "<div class='row'>";
  divString += "<div class='text-center col-12'>";
  for(let i=0;i<attribs.length;i++){
  divString += "<div class='form-check form-check-inline'> <input class='form-check-input' type='checkbox' id='"+attribs[i]+"' value='"+attribs[i]+"'>";
  divString += "<label class='form-check-label' for='"+attribs[i]+"'>"+attribs[i]+"</label> </div>";
  }
  divString += "</div>";
  divString += "<div style='position:relative; margin:auto; width:90%' >";
  divString += "<div class='row'><p class='font-weight-bolder text-center col-12'>MODELS</p></div>";
  divString += "<div class='row'>";
  //divString += "<span class='font-weight-bolder text-center mt-4 pt-1' style='position:absolute;min-width:30px;'></span>";
  divString += "<p class='col-2'>Max: <span id='myMaxValue' class='font-weight-bolder'></span></p>"
  divString += "<input type='range' id='maxRangeModels' class='custom-range col-10 text-center' max='"+models.length+"' min='1' style='width:80%'>";
  divString += "</div>";
  divString += "<div class='row'>";
  divString += "<p class='col-2'>Min: <span id='myMinValue' class='font-weight-bolder'></span></p>"
  divString += "<input type='range' id='minRangeModels' class='custom-range col-10 text-center' max='"+models.length+"' min='1' style='width:80%'>";
  divString += "</div>";
  return divString;
}

const buttonFilter = () => {
  let divString = "";
  divString += "<div class='col-5'></div>";
  divString += "<button type='button' class='btn btn-secondary tent-center col-2 mt-1 mb-2' onclick='applyFilter();'>Apply</button>";
  divString += "<div class='col-5'></div></div>";

  return divString;
}

function setRange(){
  //RANGE Script for the value stay below the circle
  let myMaxRange = document.querySelector('#maxRangeModels');
  let myMaxValue = document.querySelector('#myMaxValue');

  myMaxRange.value = myMaxRange.max;
  myMaxValue.innerHTML = ' ('+myMaxRange.value+')';

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

const clearFilters = () => {
  d3.select('#filters').selectAll().remove();
};

function checkFilters(wells,attribs){
   for(let i=0;i<attribs.length;i++){
     document.getElementById(attribs[i]).checked = true;
   }
   for(let i=0;i<wells.length;i++){
     document.getElementById(wells[i]).checked = true;
   }
}

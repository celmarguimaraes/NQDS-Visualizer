'use strict';

let myRange,myValue,myUnits,off,px;

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
  return parseFloat(toFixed(aqns.substring(0,1)==='-'?aqns.substring(1):aqns));
}

// Build another CSV for the ModelxWells Heatmap with the Maximum AQNS of the chosen filters
const filteredAQNS = (fileArr,checkQL,checkQO,checkQW,checkBHP,checkQWI) => {

  let maxAqns = 0.0, previousCol,previousLine,newCsv="model,well,value\n",fileLine = fileArr[3].split(';'),fileCol = fileLine[2].split(' ');

  //Check each line of the original CSV, starting from the fifth line, the fourth will be the previous line
  for(let i=4;i < fileArr.length-1;i++){
      previousLine = fileLine;
      fileLine = fileArr[i].split(';');
      previousCol = fileCol;
      fileCol = fileLine[2].split(' ');
      let fixedAqns = fixAqns(previousLine[3]);
      let wellCount = 0;

      //Until the previous WELL is equal of the current WELL of the CSV
      if(fileCol[3] == previousCol[3]){

        //Check the maximum AQNS of the attributes and apply the filters
        if(previousCol[1] == "QL" && checkQL == true){  if(maxAqns < fixedAqns) {  maxAqns = fixedAqns } }
        else if(previousCol[1] == "QW" && checkQW == true){  if(maxAqns < fixedAqns) {  maxAqns = fixedAqns } }
        else if(previousCol[1] == "QO" && checkQO == true){  if(maxAqns < fixedAqns) {  maxAqns = fixedAqns } }
        else if(previousCol[1] == "BHP" && checkBHP == true){  if(maxAqns < fixedAqns) {  maxAqns = fixedAqns } }
        else if(previousCol[1] == "QWI" && checkQWI == true){  if(maxAqns < fixedAqns) {  maxAqns = fixedAqns } }

        //If it is end of file, get the max AQNS of the last cell
        if(i==fileArr.length-2){
          newCsv+=previousLine[1]+',';
          newCsv+=previousCol[3]+',';
          newCsv+=normalizedAqns(maxAqns)+'\n';
        }

      //If the WELL changes in the CSV, get the maximum AQNS and generate a new line on the new CSV
      }else{
          //If the well is INJECTOR and the filter doesn't mark BHP or QWI doesn't record it on the CSV
          if( previousCol[3].substring(0,3) == 'INJ' && checkBHP == false && checkQWI == false){
            maxAqns = 0.0;
          //If the well is PRODUCTOR and the filter doesn't mark QL, QW, QO or BHP doesn't record it on the CSV
          }else if( previousCol[3].substring(0,4) == 'PROD' && checkQL == false && checkQW == false && checkQO == false && checkBHP == false){
            maxAqns = 0.0;
          }else{
            newCsv+=previousLine[1]+',';
            newCsv+=previousCol[3]+',';
            //Getting the maximum AQNS of the attributes
            if(previousCol[1] == "QL" && checkQL == true){  if(maxAqns < fixedAqns) { maxAqns = fixedAqns } }
            else if(previousCol[1] == "QW" && checkQW == true){  if(maxAqns < fixedAqns) { maxAqns = fixedAqns } }
            else if(previousCol[1] == "QO" && checkQO == true){  if(maxAqns < fixedAqns) { maxAqns = fixedAqns } }
            else if(previousCol[1] == "BHP" && checkBHP == true){  if(maxAqns < fixedAqns) { maxAqns = fixedAqns} }
            else if(previousCol[1] == "QWI" && checkQWI == true){  if(maxAqns < fixedAqns) { maxAqns = fixedAqns} }
            newCsv+=normalizedAqns(maxAqns)+'\n';
            maxAqns = 0.0;
          }
      }
  }
  return newCsv;
}

const filteredWELL = (fileArr,checkWells,filter1) => {
  const splitCSV = filter1.split('\n');
  const wellsV = wells(fileArr);
  let newCSV = 'model,well,value\n';

  //Check each item of the previous filtered CSV and split
  for(let i=0;i < splitCSV.length; i++){
    const filterSplited = splitCSV[i].split(',');
    //For each item in the previous filtered CSV check if has a corresponding filtered WELL, if it does have then saves it on a new CSV
    for(let j=0; j < wellsV.length; j++){
      if(filterSplited[1] == wellsV[j]){
        if(checkWells[j] == true){
          newCSV+=filterSplited[0]+','+filterSplited[1]+','+filterSplited[2]+'\n';
        }
      }
    }
  }

  return newCSV;
}

const filteredMODEL = (fileArr,rangeModels,filter2) => {
  const splitCSV = filter2.split('\n');
  const modelsV = wells(models);
  let newCSV = 'model,well,value\n', modelsCount=0;
  let flag=false;

  for(let i=1;i < splitCSV.length; i++){
    const prevfilterSplited = splitCSV[i-1].split(',');
    const filterSplited = splitCSV[i].split(',');

    if (prevfilterSplited[0] != filterSplited[0]){
       if(modelsCount == rangeModels){ flag=true }
       modelsCount++;
    }

    if(flag==true) {break;}

    newCSV+=filterSplited[0]+','+filterSplited[1]+','+filterSplited[2]+'\n';

  }
  return newCSV;
}

const strFiltros1 = (wells,models) =>
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

const strFiltros2 = models => {
  let divString = "";
  divString += "<div class='row  text-center'><p class='font-weight-bolder col-12'>ATTRIBUTES</p></div>";
  divString += "<div class='row'>";
  divString += "<div class='text-center col-12'>";
  divString += "<div class='form-check form-check-inline'>  <input class='form-check-input' type='checkbox' id='ql' value='ql'>  <label class='form-check-label' for='ql'>QL</label> </div>";
  divString += "<div class='form-check form-check-inline'>  <input class='form-check-input' type='checkbox' id='qw' value='qw'>  <label class='form-check-label' for='qw'>QW</label> </div>";
  divString += "<div class='form-check form-check-inline'>  <input class='form-check-input' type='checkbox' id='qo' value='qo'>  <label class='form-check-label' for='qo'>QO</label> </div>";
  divString += "<div class='form-check form-check-inline'>  <input class='form-check-input' type='checkbox' id='bhp' value='bhp'>  <label class='form-check-label' for='inlineCheckbox3'>BHP</label> </div>";
  divString += "<div class='form-check form-check-inline'>   <input class='form-check-input' type='checkbox' id='qwi' value='qwi'>  <label class='form-check-label' for='qwi'>QWI</label> </div> </div>";
  divString += "</div>";
  divString += "<div style='position:relative; margin:auto; width:90%' >";
  divString += "<span class='font-weight-bolder text-center mt-4 pt-1' style='position:absolute;min-width:30px;'><span id='myValue'></span></span>";
  divString += "<div class='row'><p class='font-weight-bolder text-center col-12'>MODELS</p></div>";
  divString += "<div class='row'>";
  divString += "<input type='range' id='rangeModels' class='custom-range col-12 text-center' max='"+models.length+"' min='0' style='width:80%'>";
  divString += "</div></div>";
  return divString;
}

const buttonFilter = () => {
  let divString = "";
  divString += "<div class='col-5'></div>";
  divString += "<button type='button' class='btn btn-secondary tent-center col-2 mt-5' onclick='modelsWells();'>Apply</button>";
  divString += "<div class='col-5'></div>";

  return divString;
}

//let strFiltros2 = "<div class='row'><p class='font-weight-bolder text-center col-12'>Get the maximum AQNS value of the below attributes:</p></div>";




function setRange(){
  //RANGE Script for the value stay below the circle
  myRange = document.querySelector('#rangeModels');
  myValue = document.querySelector('#myValue');
  myUnits = 'myUnits';
  off = myRange.offsetWidth / (parseInt(myRange.max) - parseInt(myRange.min));
  px =  ((myRange.valueAsNumber - parseInt(myRange.min)) * off) - (myValue.offsetParent.offsetWidth / 2);

  myValue.parentElement.style.left = px + 'px';
  myValue.parentElement.style.top = myRange.offsetHeight + 'px';
  myValue.innerHTML = myRange.value + ' ' ;

  myRange.oninput =function(){
    px = ((myRange.valueAsNumber - parseInt(myRange.min)) * off) - (myValue.offsetWidth / 2);
    myValue.innerHTML = myRange.value + ' ' ;
    myValue.parentElement.style.left = px + 'px';
  };
}

const clearGraphicArea = () => {
  d3.select('#my_dataviz').select('svg').remove();
};

const clearFilters = () => {
  d3.select('#filters').selectAll().remove();
};

function checkFilters(wells){
   document.getElementById("ql").checked = true;
   document.getElementById("qo").checked = true;
   document.getElementById("qw").checked = true;
   document.getElementById("bhp").checked = true;
   document.getElementById("qwi").checked = true;
   for(let i=0;i<wells.length;i++){
     document.getElementById(wells[i]).checked = true;
   }
}

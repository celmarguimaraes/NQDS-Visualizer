'use strict';

const buildCSV = fileArr =>{
  let newCSV = "model,well,attribute,value\n";
  let fileLine, fileCol;
  for(let i=3;i<fileArr.length-1;i++){
    fileLine = fileArr[i].split(";");
    newCSV += fileLine[1]+',';
    fileCol = fileLine[2].split(" ");
    newCSV += fileCol[3]+',';
    newCSV += fileCol[1]+',';
    newCSV += fileLine[3]+'\n';
  }
  return newCSV;
}

const allFilters = (csv,checkWells,wells,checkAttribs,attribs, maxRangeModels, minRangeModels, models) =>{

  let realAtt = [];
  let realWell = [];
  let realModel = [];
  let newCsv = "model,attribute,value\n";
  let maxValue = 0.0;

  for(let i=minRangeModels-1;i<maxRangeModels;i++){
    realModel.push(models[i]);
  }

  checkWells.forEach( function(element,index){
    if(checkWells[index] === true){
      realWell.push(wells[index]);
    }
  })

  for(let i=0;i<checkAttribs.length;i++){
    if(checkAttribs[i] === true){
      realAtt.push(attribs[i]);
    }
  }


  realModel.forEach(function (modelElement,modelIndex){
    realAtt.forEach( function(attElement,attIndex){
      maxValue = 0.0;
      realWell.forEach(function(wellElement,wellIndex){
          let linhas = csv.split('\n');
          for(let i=1;i<linhas.length-1;i++){
            let columns = linhas[i].split(',');
            if(columns[2] === attElement){
              if(maxValue < fixAqns(columns[3])) { maxValue=fixAqns(columns[3]) }
            }
          }
      })
      newCsv += modelElement+','+attElement+','+maxValue.toString()+'\n';
    })
  })
  console.log(newCsv);

  return newCsv;
}

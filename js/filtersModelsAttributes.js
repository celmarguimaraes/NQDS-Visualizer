'use strict';

//Build basic CSV for simplify the data
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

//Apply all filters once and builds a CSV
const allFilters = (csv,checkWells,wells,checkAttribs,attribs, maxRangeModels, minRangeModels, models) =>{
  console.log(csv);
  let realAtt = [];
  let realWell;
  let realModel = [];
  let newCsv = "model,attribute,value\n";
  let maxValue = 0.0;

  //Filter - range of models
  for(let i=minRangeModels-1;i<maxRangeModels;i++){
    realModel.push(models[i]);
  }

  //Filtering the search space to reduce processing time
  const isOver = (min,value) => min <= value;
  const isBelow = (max,value) => max => value;
  const isInRange = ( min, max ) => value => isOver(min,value) && isBelow(max,value);

  let linhas = csv.split('\n');
  let linhasFiltered = linhas.filter(function(linha,index,array){
    return isInRange(minRangeModels,maxRangeModels+1)(parseInt(linha.substring(4,8)));
  })

  //Filter - selected wells
  checkWells.forEach( function(element,index){
    if(checkWells[index] === true){
      realWell = wells[index];
    }
  })

  //Filter - selected attributes
  for(let i=0;i<checkAttribs.length;i++){
    if(checkAttribs[i] === true){
      realAtt.push(attribs[i]);
    }
  }

  //Validate if the well is Injector or Productor
  if(realWell.substring(0,3) === 'INJ'){
    realAtt = realAtt.filter(function(element){
      return element === 'BHP' || element ==='QWI';
  })}else if(realWell.substring(0,4) === 'PROD'){
    realAtt = realAtt.filter(function(element){
      return element === 'QL' || element ==='QW' || element === 'QO' || element === 'BHP';
  })}

  //Filter - for each attribute and well in N models build a CSV line
  for(let i=0;i<realModel.length;i++){
    for(let j=0;j<realAtt.length;j++){
      maxValue=0.0;
      let linhas = csv.split('\n');
      for(let l=0;l<linhasFiltered.length-1;l++){
        let columns = linhasFiltered[l].split(',');
        if(columns[2] === realAtt[j] && columns[1] === realWell){
          if(maxValue < fixAqns(columns[3])) { maxValue=fixAqns(columns[3]); }
        }
      }
    newCsv += realModel[i]+','+realAtt[j]+','+maxValue.toString()+'\n';
    }
  }


  return newCsv;
}

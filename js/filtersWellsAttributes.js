'use strict';

//Apply all filters once and builds a CSV
const allFiltersWA = (csv,checkWells,wells,checkAttribs,attribs, maxRangeModels, minRangeModels, models) =>{

  let realAtt = [];
  let realWell = [];
  let realModel = [];
  let newCsv = "well,attribute,value\n";
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
      realWell.push(wells[index]);
    }
  })

  //Filter - selected attributes
  for(let i=0;i<checkAttribs.length;i++){
    if(checkAttribs[i] === true){
      realAtt.push(attribs[i]);
    }
  }

  //Filter - for each well check each attribute in N models build a CSV line with the maximum AQNS
  for(let i=0;i<realWell.length;i++){
    for(let j=0;j<realAtt.length;j++){
      maxValue=0.0;
      let testModel;
      for(let k=0;k<realModel.length;k++){
        for(let l=0;l<linhasFiltered.length-1;l++){
          let columns = linhasFiltered[l].split(',');
          if(columns[0] === realModel[k] && columns[1] === realWell[i] && columns[2] === realAtt[j]){
            if(maxValue < fixAqns(columns[3])) { maxValue=fixAqns(columns[3]);}
          }
        }
      }
    newCsv += realWell[i]+','+realAtt[j]+','+maxValue.toString()+'\n';
    }
  }
  return newCsv;
}

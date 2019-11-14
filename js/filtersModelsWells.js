'use strict';

// Build another CSV for the ModelxWells Heatmap with the Maximum AQNS of the chosen filters
const filteredAttribsMW = (fileArr,checkAttribs,attribs) => {

  let maxAqns = 0.0, previousCol,previousLine;
  let newCsv="model,well,value\n";
  let fileLine = fileArr[3].split(';');
  let fileCol = fileLine[2].split(' ');

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
        for(let j=0;j<checkAttribs.length;j++){
          if(previousCol[1] == attribs[j] && checkAttribs[j] == true){  if(maxAqns < fixedAqns) {  maxAqns = fixedAqns } }
        }

        //If it is end of file, get the max AQNS of the last cell
        if(i==fileArr.length-2){
          newCsv+=previousLine[1]+',';
          newCsv+=previousCol[3]+',';
          newCsv+=normalizedAqns(maxAqns)+'\n';
        }

      //If the WELL changes in the CSV, get the maximum AQNS and generate a new line on the new CSV
      }else{
          //If the well is INJECTOR and the filter doesn't mark BHP or QWI doesn't record it on the CSV
          if( previousCol[3].substring(0,3) == 'INJ' && checkAttribs[3] == false && checkAttribs[4] == false){
            maxAqns = 0.0;
          //If the well is PRODUCTOR and the filter doesn't mark QL, QW, QO or BHP doesn't record it on the CSV
          }else if( previousCol[3].substring(0,4) == 'PROD' && checkAttribs[0] == false && checkAttribs[1] == false && checkAttribs[2] == false && checkAttribs[3] == false){
            maxAqns = 0.0;
          }else{
            newCsv+=previousLine[1]+',';
            newCsv+=previousCol[3]+',';
            //Getting the maximum AQNS of the attributes
            for(let k=0;k<checkAttribs.length;k++){
              if(previousCol[1] === attribs[k] && checkAttribs[k] === true){  if(maxAqns < fixedAqns) {  maxAqns = fixedAqns } }
            }
            newCsv+=normalizedAqns(maxAqns)+'\n';
            maxAqns = 0.0;
          }
      }
  }
  return newCsv;
}

//Filter of selected wells
const filteredWellMW = (fileArr,checkWells,filter1) => {
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

//Filter of selected models
const filteredModelMW = (fileArr,maxRangeModels,minRangeModels,filter2) => {
  const splitCSV = filter2.split('\n');
  const modelsV = wells(models);
  let newCSV = 'model,well,value\n', modelsCount=0;
  let flag=false;

  for(let i=1;i < splitCSV.length; i++){
    const prevfilterSplited = splitCSV[i-1].split(',');
    const filterSplited = splitCSV[i].split(',');

    if (prevfilterSplited[0] != filterSplited[0]){
       if(modelsCount == maxRangeModels){ flag=true }
       modelsCount++;
    }

    if(flag==true) {break;}

    if(modelsCount > minRangeModels-1){
      newCSV+=filterSplited[0]+','+filterSplited[1]+','+filterSplited[2]+'\n';
    }

  }
  return newCSV;
}

'use strict';

const leitorDeCSV = new FileReader()
let file, fileArr, rawData;
let fileLine = [];

	window.onload = function init() {
		leitorDeCSV.onload = readFile;
	}

function pegaCSV(inputFile) {
     file = inputFile.files[0];
     leitorDeCSV.readAsText(file);
}

function readFile(evt) {
	rawData = evt.target.result;
  fileArr = evt.target.result.split('\n');
  /*let strDiv = "";

  for (var i=0; i<2; i++) {
       var fileLine = fileArr[i].split(';');
			 strDiv += "<dt class='col-1'>"
       strDiv += fileLine[0];
       strDiv += '</dt>';
			 strDiv += "<dd class='col-5'>"+fileLine[1]+"</dd>";
  }

      let cabecalho = document.getElementById('cabecalho');
      cabecalho.innerHTML = strDiv;*/
			document.getElementById("buttonGroup").removeAttribute("hidden");
}

const date = fileArr => {
	let fileLine = fileArr[1].split(';');
	return fileLine[1];
}

const version = fileArr => {
	let fileLine = fileArr[0].split(';');
	return fileLine[1];
}

const models = fileArr => {
  let contador = 0;
  let modelGroup = [];
  for (var i=3; i < fileArr.length; i++) {
       let fileLinePrev = fileLine;
       fileLine = fileArr[i].split(';');
       if (fileLine[1] !== fileLinePrev[1]){
         if (i != 3){
           modelGroup[contador] = fileLinePrev[1];
           contador++;
         }
       }
  }
  return modelGroup;
}

const attribs = ['QL','QW','QO','BHP','QWI']

const wells = fileArr => {
  let contador = 0;
  let wellGroup = [];
	let wellGroupFiltered = [];
  for (let i=3; i < fileArr.length-1; i++) {
       fileLine = fileArr[i].split(';');
       const fileLineCols = fileLine[2].split(' ');
       if(i===3){
         wellGroup.push(fileLineCols[3]);
         contador++;
       }else{
				 	   if (wellGroup.indexOf(fileLineCols[3]) === -1){
							 wellGroup.push(fileLineCols[3]);
							 contador++;
						 }
       }
  }
	return wellGroup;
}

const aqns = fileArr => {
  let aqnsGroup = [];
  for (let i=3; i < fileArr.length-1; i++) {
       fileLine = fileArr[i].split(';');
			 aqnsGroup.push(fileLine[3]);
	 }
	return aqnsGroup;
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

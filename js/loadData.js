'use strict';

const leitorDeCSV = new FileReader()
let file, fileArr, rawData;
let fileLine = [];
let alreadyDone = false;

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

const wells = fileArr => {
	let wellGroup = [];
  for (let i=3; i < fileArr.length-1; i++) {
       fileLine = fileArr[i].split(';');
       const fileLineCols = fileLine[2].split(' ');
       wellGroup.push(fileLineCols[3]);
  }
	return d3.set(wellGroup).values();
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

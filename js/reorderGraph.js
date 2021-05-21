let svg, currentGraphic, timesClicked= 0, matrix = [];

//Changes the text or number to text value for the tooltip in the graphic
const textAQNS = (value) => {
  let text = "";
  switch (value) {
    case '0':
        text += "Unavailable"
        break;
    case '1':
        text += "Excelent"
        break;
    case '2':
        text += "Very Good"
        break;
    case '3':
        text += "Good"
        break;
    case '4':
        text += "Regular"
        break;
    case '5':
        text += "Bad"
        break;
    case '6':
        text += "Insatisfactory"
        break;
    case 0:
        text+= "Unavailable"
        break;
    case 1:
        text += "Excelent"
        break;
    case 2:
        text += "Very Good"
        break;
    case 3:
        text += "Good"
        break;
    case 4:
        text += "Regular"
        break;
    case 5:
        text += "Bad"
        break;
    case 6:
        text += "Insatisfactory"
        break;
  }
  return text;
}

// Build color scale
let myColor = d3.scaleLinear()
  .range(['#c7c6c3', "#00cc66", "#ff0000"])
  .domain([0,1,6]);

function construirLegenda(svg,myColor,tipo){
  // Add title to graph
  if(tipo=="MW"){
    svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("NQDS Graphic Wells by Models - Iteration "+iteracaoGraf);
  }else if(tipo == "MA"){
    svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("NQDS Graphic Attributes by Models - Iteration "+iteracaoGraf);
  }else{
    svg.append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "22px")
    .text("NQDS Graphic Attributes by Wells  - Iteration "+iteracaoGraf);
  }

  // Add subtitle to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("Date: "+dataGraf+"| Version: "+versaoGraf);

  let xRectBuffer = 500;
  let yRectBuffer = -40;
  let dataArray   = ['0','1','2','3','4','5','6'];

  //Rectangles subtitle
  svg.append("g").selectAll("rect")
          .data(dataArray)
          .enter()
          .append("rect")
          .attr("x",function(d){
              var spacing = 107;
              return xRectBuffer+(d-1)*spacing
          })
          .attr("y",yRectBuffer)
          .attr("width", 30)
          .attr("height", 25)
          .style("fill", function(d) { return myColor(d)} )
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 0.8);

  let xTextBuffer = 532;
  let yTextBuffer = -23;

  // Add a title to the legend
  svg.append("g").selectAll("text")
        .data(dataArray)
        .enter()
        .append("text")
        .attr("x",function(d){
          var spacing = 107;
          return xTextBuffer+(d-1)*spacing;
        })
        .attr("y",yTextBuffer)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        //.style("fill", "black")
        .text(function(d){
          return textAQNS(d);
        });
}

function onlyUnique (value, index, self) {
  return self.indexOf(value) === index;
}

function add_listener_order_buttons(parsed,
  row_values,column_values, unique_col_labels,unique_row_labels,tipo){

  buttonInitialOrder = document.getElementById("btnIO");
  buttonInitialOrder.addEventListener("click", function () {
    clearGraphicArea();
    matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
    table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},tipo);
    initial_order_permute(matrix);
  });

  buttonLeafOrderPermute = document.getElementById("btnLO");
  buttonLeafOrderPermute.addEventListener("click", function () {
    clearGraphicArea();
    matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
    table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},tipo);
    optimal_leaf_order_permute(matrix);
  });

  buttonFVSOrder = document.getElementById("btnFVS");
  buttonFVSOrder.addEventListener("click", function () {
    clearGraphicArea();
    matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
    table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},tipo);
    fvsSort(matrix);
  });

  buttonPolarSort = document.getElementById("btnPS");
  buttonPolarSort.addEventListener("click", function () {
    clearGraphicArea();
    matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
    table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},tipo);
    polarSort(matrix);
  });

  buttonBlockSort = document.getElementById("btnBS");
  buttonBlockSort.addEventListener("click", function () {
    clearGraphicArea();
    matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
    table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},tipo);
    blockSort(matrix);
  });
}

// 3 Funções da API reorder.js https://github.com/jdfekete/reorder.js
function random_permute(matrix) {
  table.order(reorder.randomPermutation(matrix.length),
  reorder.randomPermutation(matrix[0].length));
}

function optimal_leaf_order_permute(matrix) {
var transpose = reorder.transpose(matrix),
  dist_rows = reorder.dist()(matrix),
  dist_cols = reorder.dist()(transpose),
  order = reorder.optimal_leaf_order(),
  row_perm = order.distanceMatrix(dist_rows)(matrix),
  col_perm = order.distanceMatrix(dist_cols)(transpose);
  
  table.order(row_perm, col_perm);
}

function initial_order_permute(matrix) {
  table.order(reorder.permutation(matrix.length),
  reorder.permutation(matrix[0].length));
}

// Aditional ordering methods
// Lab. SEIS FT - Unicamp 2021
// From Miguel Amaral, available at:
// https://github.com/migueloiro/tcc-reorder
// ---------------------------------------------------------------------------
// Adapted in order to encapsulate each individual method

function fvsSort(matrix) {
  let rowPerm = new Array(numberOfRows),
      colPerm = new Array(numberOfCols);

  // Resultado das médias aritméticas das linhas:
  for (let i = 0; i < numberOfRows; i++) rowPerm[i] = reorder.mean(matrix[i]);

  // Resultado das médias aritméticas das colunas:
  for (let i = 0; i < numberOfCols; i++) colPerm[i] = reorder.meantranspose(matrix, i);

  table.order(reorder.sort_order(rowPerm), reorder.sort_order(colPerm));
}

function polarSort(matrix) {
  function mds(distanceMatrix, dimensions = 2) {
      /* square distances */
      let M = numeric.mul(-.5, numeric.pow(distanceMatrix, 2));

      let rowMeans = [],
          colMeans = [];

      for (let i in M) {
          rowMeans.push(reorder.mean(M[i]));
          colMeans.push(reorder.meantranspose(M, i))
      }

      let totalMean = reorder.mean(rowMeans);

      for (let i in M) {
          for (let j in M[0]) {
              M[i][j] += totalMean - rowMeans[i] - colMeans[j];
          }
      }

      // take the SVD of the double centred matrix, and return the points from it
      let ret = numeric.svd(M),
          eigenValues = numeric.sqrt(ret.S);

      return ret.U.map(function (row) {
          return numeric.mul(row, eigenValues).splice(0, dimensions);
      });
  };


  let distanceMatrix = reorder.dist()(matrix),
      cartesianCoords = mds(distanceMatrix, 2),
      polarCoords = [],
      xB = reorder.mean(reorder.transpose(cartesianCoords)[0]),
      yB = reorder.mean(reorder.transpose(cartesianCoords)[1]);

  /* Convert from Cartesian Coordinates System to Polar Coordinates System */
  for (let points of cartesianCoords) {
      var x = points[0],
          y = points[1],
          r = (Math.sqrt((Math.pow((x - xB), 2) + Math.pow((y - yB), 2))));

      /* I Quadrant */
      var theta = Math.atan(y / x) * (180 / Math.PI);

      /* II Quadrant */
      if (Math.sign(x) == -1 && Math.sign(y) == 1) theta += 180;

      /* III Quadrant */
      if (Math.sign(x) == -1 && Math.sign(y) == -1) theta += 180;

      /* IV Quadrant */
      if (Math.sign(x) == 1 && Math.sign(y) == -1) theta += 360;

      polarCoords.push([r, theta]);
  }

  let rowPerm = reorder.sort_order(reorder.transpose(polarCoords)[1]),
      colPerm = reorder.permutation(numberOfCols);

  polarCoords = reorder.permute(polarCoords, rowPerm);

  let max = 0,
      pair_distance = 0,
      head = 0;

  for (let i = 0; i < numberOfRows - 1; ++i) {
      for (let j = i + 1; j < numberOfCols; ++j, i++) {
          let theta1 = polarCoords[i][1],
              theta2 = polarCoords[j][1];

          pair_distance = theta2 - theta1;

          if (pair_distance > max) {
              max = pair_distance;
              head = j;
          } else break;
      }
  }

  var circularListPerm = [];

  for (let index in matrix) {
      if (head > numberOfRows - 1) head = 0;
      circularListPerm.push(head++);
  }

  rowPerm = reorder.permute(rowPerm, circularListPerm).reverse();

  table.order(rowPerm, colPerm);
}

function blockSort(matrix) {
  let orderOfColumns = [],
      optimals = [],
      columns = [];

  const SISTERHOOD_BOUNDARY = 0.6;

  // Get properties of columns:
  for (let i = 0; i < numberOfCols; ++i) {
      let col = { 'list': [], 'noise': null, 'similarity': null, 'index': i },
          numberZeros = 0;

      for (let j = 0; j < numberOfRows; ++j) {
          let cellVal = matrix[j][i],
              boolVal = (cellVal >= 0.5);
          col.list.push(boolVal);

          if (!boolVal) {
              numberZeros++;
          }
      }
      col.noise = Math.abs((parseFloat(numberZeros - (col.list.length / 2)))) / col.list.length;
      columns.push(col);
  }

  function NOISE_RANK(columns) {
      let NOISE_LIST = [];
      for (let col of columns) {
          NOISE_LIST.push(col.noise);
      }
      return reorder.sort_order(NOISE_LIST);
  }

  function SIMILARITY_RANK(columns) {
      let SIMILARITY_LIST = [];
      for (let col of columns) {
          SIMILARITY_LIST.push(col.similarity);
      }
      return reorder.sort_order_descending(SIMILARITY_LIST);
  }

  while (columns.length != 0) {
      // Current pivot of columns:
      columns = reorder.permute(columns, NOISE_RANK(columns));
      var pivot = columns[0];

      // Calc similarity:
      for (let col of columns) {
          if (JSON.stringify(col) == JSON.stringify(pivot)) {
              col.similarity = 1.0;
          } else {
              col.similarity = 0.0;
              for (let j = 0; j < col.list.length; ++j) {
                  if (pivot.list[j] == col.list[j]) {
                      col.similarity += 1;
                  }
              }
              col.similarity /= col.list.length;
          }
      }

      // Sort by similarity:
      columns = reorder.permute(columns, SIMILARITY_RANK(columns));

      // Identify sisters:
      let numberOfSisters = columns.filter((col) => (col.similarity >= SISTERHOOD_BOUNDARY)).length;

      // Populate col perm:
      for (let col of columns.slice(0, numberOfSisters)) {
          orderOfColumns.push(col.index);
      }

      // Make optimal column:
      let optimal = [];
      for (let i = 0; i < numberOfRows; ++i) {
          let numberOfZeros = 0;
          for (let col of columns.slice(0, numberOfSisters)) {
              if (!col.list[i]) {
                  numberOfZeros++;
              }
          }
          optimal.push(numberOfZeros < numberOfSisters / 2 ? false : true);
      }

      optimals.push(optimal);

      // Remove sisters:
      columns.splice(0, numberOfSisters);
  }

  // Populate row perm:
  let orderOfRows = reorder.permutation(numberOfRows);

  for (let optimal of optimals.reverse()) {
      for (let i = 1; i < numberOfRows; ++i) {
          for (let j = i; j > 0; --j) {
              if (optimal[j] && !optimal[j - 1]) {
                  for (let auxOptimal of optimals) {
                      let temp = auxOptimal[j];
                      auxOptimal[j] = auxOptimal[j - 1];
                      auxOptimal[j - 1] = temp;
                  }

                  // Sorts row perm:
                  let temp = orderOfRows[j];
                  orderOfRows[j] = orderOfRows[j - 1];
                  orderOfRows[j - 1] = temp;

              } else {
                  break;
              }
          }
      }
  }
  table.order(orderOfRows, orderOfColumns.reverse());
}

// Query data treatment to a matrix
function arrayParsedToMatrix(parsed, linesfilling, colsfilling, tipo){
  var matrix = [],
      column_labels = linesfilling.filter(onlyUnique),
      row_labels = colsfilling.filter(onlyUnique);
      
      column_count = column_labels.length,
      line_count = colsfilling.filter(onlyUnique).length,

      parsedAdress = 0,
      blankMatrix = [];

  for (var dummyLine = 0; dummyLine < line_count; dummyLine++) { // creating Matrix Model
    blankMatrix[dummyLine] = [];
    for (var dummyColumn = 0; dummyColumn < column_count; dummyColumn++) {
      if (tipo == 'MW') {
        blankMatrix[dummyLine][dummyColumn] =
          { Modelo: column_labels[dummyColumn], Poco: row_labels[dummyLine], ValorAQNS: '' }
      }
      else if (tipo == 'MA') {
        blankMatrix[dummyLine][dummyColumn] =
          { Modelo: column_labels[dummyColumn], Atributo: row_labels[dummyLine], ValorAQNS: '' }
      }
      else {
        for (var dummyColumn = 0; dummyColumn < column_count; dummyColumn++) {
          blankMatrix[dummyLine][dummyColumn] =
            { Poco: column_labels[dummyColumn], Atributo: row_labels[dummyLine], ValorAQNS: '' }
        }
      }
    }
  }

  for (dummyColumn = 0; dummyColumn < column_count; dummyColumn++) { // filling AQNS values
    for (dummyLine = 0; dummyLine < line_count; dummyLine++) {
      if (tipo == 'MW') {
        if (typeof parsed[parsedAdress] == 'undefined') {
          break;
        }
        if (blankMatrix[dummyLine][dummyColumn].Modelo == parsed[parsedAdress].Modelo
          && blankMatrix[dummyLine][dummyColumn].Poco == parsed[parsedAdress].Poco) {
          blankMatrix[dummyLine][dummyColumn].ValorAQNS = parsed[parsedAdress].ValorAQNS;
          parsedAdress++;
        }
        else {
          blankMatrix[dummyLine][dummyColumn].ValorAQNS = "0";
        }
      }
      else if (tipo == 'MA') {
        if (typeof parsed[parsedAdress] == 'undefined') {
          break;
        }
        if (blankMatrix[dummyLine][dummyColumn].Modelo == parsed[parsedAdress].Modelo
          && blankMatrix[dummyLine][dummyColumn].Atributo == parsed[parsedAdress].Atributo) {
          blankMatrix[dummyLine][dummyColumn].ValorAQNS = parsed[parsedAdress].ValorAQNS;
          parsedAdress++;
        }
        else {
          blankMatrix[dummyLine][dummyColumn].ValorAQNS = "0";
        }
      }
      else {
        if (typeof parsed[parsedAdress] == 'undefined') {
          break;
        }
        if (blankMatrix[dummyLine][dummyColumn].Poco == parsed[parsedAdress].Poco
          && blankMatrix[dummyLine][dummyColumn].Atributo == parsed[parsedAdress].Atributo) {
          blankMatrix[dummyLine][dummyColumn].ValorAQNS = parsed[parsedAdress].ValorAQNS;
          parsedAdress++;
        }
        else {
          blankMatrix[dummyLine][dummyColumn].ValorAQNS = "0";
        }
      }
    }
  }

  for (dummyLine = 0; dummyLine < line_count; dummyLine++) {
    matrix[dummyLine] = [];
    for (dummyColumn = 0; dummyColumn < column_count; dummyColumn++) {
      matrix[dummyLine][dummyColumn] = blankMatrix[dummyLine][dummyColumn].ValorAQNS;
    }
  }

  return matrix;
}

function generateMatrixGraphic(parsed,maxRangeModels,minRangeModels,tipo){

  var unique_row_labels,
      unique_col_labels,
      row_values,
      column_values;

  //Valores das linhas (i.e. linha 1 [1,2,3...])
  if(tipo=='MW'){
    row_values = parsed.map(dados => dados.Modelo);
  }else if(tipo=='MA'){
    row_values = parsed.map(dados => dados.Modelo);
  }else{
    row_values = parsed.map(dados => dados.Poco);
  }

  //Valores das colunas
  if(tipo=='MW'){
    column_values = parsed.map(dados => dados.Poco);
  }else if(tipo=='MA'){
    column_values = parsed.map(dados => dados.Atributo);
  }else{
    column_values = parsed.map(dados => dados.Atributo);
  }

  unique_col_labels = row_values.filter(onlyUnique);
  unique_row_labels = column_values.filter(onlyUnique);
     
  document.getElementById("orderButtonGroup").removeAttribute("hidden");
  add_listener_order_buttons(parsed,
    row_values,column_values, unique_col_labels,unique_row_labels,tipo);
  document.getElementById("btnIO").click();

  document.getElementById("exportImage").removeAttribute("hidden");
}

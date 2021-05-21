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

  buttonRandomPermute = document.getElementById("btnRO");
  buttonRandomPermute.addEventListener("click", function () {
    clearGraphicArea();
    matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
    table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},tipo);
    random_permute(matrix);
  });

  buttonLeafOrderPermute = document.getElementById("btnLO");
  buttonLeafOrderPermute.addEventListener("click", function () {
    clearGraphicArea();
    matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
    table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},tipo);
    optimal_leaf_order_permute(matrix);
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


let svg, currentGraphic, timesClicked= 0;

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

// 3 Funções da API reorder.js https://github.com/jdfekete/reorder.js
function random_permute() {
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

function initial_order_permute() {
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
  //console.log('modelMatrix', blankMatrix)

  for (dummyLine = 0; dummyLine < line_count; dummyLine++) {
    matrix[dummyLine] = [];
    for (dummyColumn = 0; dummyColumn < column_count; dummyColumn++) {
      matrix[dummyLine][dummyColumn] = blankMatrix[dummyLine][dummyColumn].ValorAQNS;
    }
  }
  console.log('finalMatrix', matrix)

  return matrix;
}

function generateMatrixGraphic(parsed,maxRangeModels,minRangeModels,tipo){

  // Legend SVG
  var margin_legend = {top: 80, right: 0, bottom: 10, left: 80},
    width_legend = 1280 - margin_legend.left - margin_legend.right,
    height_legend = 100 - margin_legend.top - margin_legend.bottom;

  svg_legend = d3.select("#dataviz_legend").append("svg")
    .attr("width", width_legend + margin_legend.left + margin_legend.right)
    .attr("height", height_legend + margin_legend.top + margin_legend.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_legend.left + "," + margin_legend.top + ")");

    construirLegenda(svg_legend,myColor,tipo);

  // Graph SVG
  var margin = { top: 80, right: 0, bottom: 10, left: 80 },
    width = 1280 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

  svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
 
  var matrix = arrayParsedToMatrix(parsed, row_values, column_values, tipo);
  //console.log('matrix', matrix)

  table({matrix: matrix, row_labels: unique_row_labels, col_labels: unique_col_labels},
     width, height, tipo);

  optimal_leaf_order_permute(matrix)

  //Set visible the button to export image of the graphic
  document.getElementById("exportImage").removeAttribute("hidden");
}

// LEGACY
function generateGraphic(parsed,maxRangeModels,minRangeModels,tipo){

  // set the dimensions and margins of the graph
  let margin = {top: 90, right: 0, bottom: 100, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("id","svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Construir eixos X e Y
  let x = construirEixoX(parsed,width,tipo);
  let y = construirEixoY(parsed,height,tipo);

  svg.append("g")
    .attr('class', 'rowLabels')
    .call(d3.axisLeft(y));

    if(tipo=='WA'){
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(-5," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.15em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)");

        d3.selectAll(".axis")
        .style("font","13px sans-serif");
    }else{
      if(maxRangeModels-minRangeModels<=100){
        svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(-5," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.15em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)");

        d3.selectAll(".axis")
        .style("font","13px sans-serif");
      }
    }
  
  construirGrafico(parsed,svg,x,y,tipo);

  construirLegenda(svg,myColor,tipo);

  //Set visible the button to export image of the graphic
  document.getElementById("exportImage").removeAttribute("hidden");
}

function construirEixoX(parsed,width,tipo){
  let myGroups;

  if(tipo=='MW'){
    myGroups = parsed.map(dados => dados.Modelo);
  }else if(tipo=='MA'){
    myGroups = parsed.map(dados => dados.Modelo);
  }else{
    myGroups = parsed.map(dados => dados.Poco);
  }

  // Build X scales and axis:
  let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);
  
  return x;
}

function construirEixoY(parsed,height,tipo){
  let myVars;
  
  if(tipo=='MW'){
    myVars = parsed.map(dados => dados.Poco);
  }else if(tipo=='MA'){
    myVars = parsed.map(dados => dados.Atributo);
  }else{
    myVars = parsed.map(dados => dados.Atributo);
  }

  // Build Y scales and axis:
  let y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01);

  return y;
}

function construirGrafico(parsed,svg,x,y,tipo){
  //Construct the graphic
  svg.selectAll()
    .data(parsed, function(d) {
      if(tipo=='MW'){
        return d.Modelo+':'+d.Poco;
      }else if(tipo=='MA'){
        return d.Modelo+':'+d.Atributo;
      }else{
        return d.Poco+':'+d.Atributo;
      }})
    .enter()
    .append("rect")
    .attr("x", function(d) { 
      if(tipo=='MW'){
        return x(d.Modelo);
      }else if(tipo=='MA'){
        return x(d.Modelo);
      }else{
        return x(d.Poco);
      }})
    .attr("y", function(d) { 
      if(tipo=='MW'){
        return y(d.Poco);
      }else if(tipo=='MA'){
        return y(d.Atributo);
      }else{
        return y(d.Atributo);
      }})
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor(parseInt(d.ValorAQNS))} )
    .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}

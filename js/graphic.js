'use strict';

let alreadyDone = false;

function modelsWells(){

  if(alreadyDone == true){
      clearGraphicArea();
  }else {
      let filtros1 = document.getElementById('filters-1');
      filtros1.innerHTML = strFiltros1(wells(fileArr));
      let filtros2 = document.getElementById('filters-2');
      filtros2.innerHTML = strFiltros2(models(fileArr));
      let button= document.getElementById('buttonFilter');
      button.innerHTML = (buttonFilter());
      setRange();

      checkFilters(wells(fileArr));
  }
  generateModelsWellsGraphic();
}

function generateModelsWellsGraphic(){

  alreadyDone = true;

  const checkQL = document.getElementById("ql").checked;
  const checkQO = document.getElementById("qo").checked;
  const checkQW = document.getElementById("qw").checked;
  const checkBHP = document.getElementById("bhp").checked;
  const checkQWI = document.getElementById("qwi").checked;

  const filter1 = filteredAQNS(fileArr,checkQL,checkQO,checkQW,checkBHP,checkQWI);

  let checkWells = [];

  for(let i=0;i<wells(fileArr).length;i++){
    const wellsV = wells(fileArr);
    checkWells.push(document.getElementById(wellsV[i]).checked);
  }

  const filter2 = filteredWELL(fileArr,checkWells,filter1);

  const rangeModels = document.getElementById('rangeModels').value;

  const filter3 = filteredMODEL(fileArr,rangeModels,filter2);

  //Generates a new CSV depending on the filters and parse it on an object
  const parsed = d3.csvParse(filter3);

  // set the dimensions and margins of the graph
  let margin = {top: 90, right: 0, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Labels of row and columns
  let myGroups = parsed.map(newCsv => newCsv.model);
  let myVars = parsed.map(newCsv => newCsv.well);

  // Build X scales and axis:
  let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);
  //svg.append("g")
    //.attr("transform", "translate(0," + height + ")")
    //.call(d3.axisBottom(x));

  // Build Y scales and axis:
  let y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01);

  let rowLabelGroup = svg.append("g")
    .attr('class', 'rowLabels')
    .call(d3.axisLeft(y));

  let click = function(d,i) {

    parsed.sort(function(a,b){
        return d3.descending(a.value,b.value) || d3.descending(a.model,b.model);
    })

    console.log(parsed);

    svg.selectAll("rect")
      .data(parsed, function(d) {return d.model+':'+d.well;})
      .enter()
      .attr("x", parsed.map(function(d){
        return x(d.model);
      }));;
  }

  d3.selectAll('.tick')
    .on("click",click)
    .on("mouseover", function (d){
      d3.select(this).attr('font-weight', 'bold').style('fill', 'red');
      d3.select(this).style('cursor', 'pointer');
    })
    .on("mouseout", function(d) {
			d3.select(this).attr('font-weight', 'normal').style('fill', 'black');
      d3.select(this).style('cursor', 'default');
		});

  // Build color scale
  let myColor = d3.scaleLinear()
    .range(["#00cc66", "#ff0000"])
    .domain([1,6]);

    // create a tooltip
  var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Three function that change the tooltip when user hover / move / leave a cell
  let mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  let mousemove = function(d) {
    tooltip
      .html("Well: "+d.well+"<br>Model: "+d.model+"<br>AQNS Value: " + d.value)
      .style("left", (d3.mouse(this)[0]) + "px")
      .style("top", (d3.mouse(this)[1]+300) + "px")
  }
  let mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  svg.selectAll()
    .data(parsed, function(d) {return d.model+':'+d.well;})
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.model) })
    .attr("y", function(d) { return y(d.well) })
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor(d.value)} )
    .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Add title to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("Models by Wells NQDS Heatmap");

  // Add subtitle to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("Date: "+date(fileArr)+"| Version: "+version(fileArr));
}

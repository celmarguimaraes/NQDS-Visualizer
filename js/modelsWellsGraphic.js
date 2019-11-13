'use strict';

let svg, currentGraphic, timesClicked= 0;

const textAQNS = (value) => {
  let text = "";
  switch (value) {
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
        text += "Unsatisfactory"
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
        text += "Unsatisfactory"
        break;
  }
  return text;
}

function modelsWells(){
  currentGraphic = "modelsWells";
  if(alreadyDone == true){
      clearGraphicArea();
  }else {
      let title = document.getElementById('titleFilters');
      title.innerHTML = (titleFilters());
      let filtros1 = document.getElementById('filters-1');
      filtros1.innerHTML = strFiltros1(wells(fileArr));
      let filtros2 = document.getElementById('filters-2');
      filtros2.innerHTML = strFiltros2(models(fileArr),attribs(fileArr));
      let button= document.getElementById('buttonFilter');
      button.innerHTML = (buttonFilter());
      setRange();

      checkFilters(wells(fileArr),attribs(fileArr));
  }
  generateModelsWellsGraphic();
}

// Build color scale
let myColor = d3.scaleLinear()
  .range(["#00cc66", "#ff0000"])
  .domain([1,6]);

// create a tooltip
let tooltip = d3.select("#my_dataviz")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px");

let mouseover = function(d) {
  tooltip
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
}
let mousemove = function(d) {
  tooltip
    .html("Well: "+d.well+"<br>Model: "+d.model+"<br>AQNS Value: "+textAQNS(d.value))
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

function reOrdering(data,parsed,x,y,myColor){

    let well = data;
    let order = [];
    let justTheWell = parsed.filter(function(d,i){ return d.well == well });

    if(timesClicked == 1){
      justTheWell.sort(function(a,b){
        return  d3.ascending(a.value,b.value) || d3.descending(a.model,b.model);
      });
    }else if(timesClicked == 2){
      justTheWell.sort(function(a,b){
        return  d3.descending(a.value,b.value) || d3.descending(a.model,b.model);
      });
    }else if(timesClicked == 3){
        timesClicked = 0;
        clearGraphicArea();
        generateModelsWellsGraphic();
    }

    justTheWell.forEach(function(element,index){
      order.push(element.model);
    })

    svg.selectAll("rect")
      .remove();

    svg.selectAll("rect")
      .data(justTheWell, function(d) {return d.model+':'+d.well;})
      .enter()
      .append("rect")
      .attr("x", function(d,i) {
        let xis = (x(d.model) - (x(d.model) - x.bandwidth()*i+1));
        return xis;
       })
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

      let otherWells = parsed.filter(function(d){ return d.well != well })
      let wellsArray = wells(fileArr);
      wellsArray.splice(wellsArray.indexOf(well),1);

      wellsArray.forEach(function(element,index){
        let filtered = parsed.filter(function(d){ return d.well == element });
        let result = [];

        order.forEach(function(key) {
            var found = false;
            filtered = filtered.filter(function(item) {
                if(!found && item.model == key) {
                    result.push(item);
                    found = true;
                    return false;
                } else
                    return true;
            })
        })

        let count=0;
        svg.selectAll("rect")
          .data(result, function(d) {return d.model+':'+d.well;})
          .enter()
          .append("rect")
          .attr("x", function(d) {
            let xis = (x(order[count]) - (x(order[count]) - x.bandwidth()*count+1));
            count++;
            return xis;
          })
          .attr("y", y(element) )
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) { return myColor(d.value)} )
          .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);
      })

      buildLegend(svg,myColor);
}

function buildLegend(svg,myColor){
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


  let xRectBuffer = 500;
  let yRectBuffer = -40;
  let dataArray   = ['1','2','3','4','5','6'];

  svg.append("g").selectAll("rect")
          .data(dataArray)
          .enter()
          .append("rect")
          .attr("x",function(d){
              var spacing = 100;
              return xRectBuffer+(d-1)*spacing
          })
          .attr("y",yRectBuffer)
          .attr("width", 30)
          .attr("height", 25)
          .style("fill", function(d) { return myColor(d)} )
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 0.8);

  let xTextBuffer = 535;
  let yTextBuffer = -23;

  // Add a title to the legend
  svg.append("g").selectAll("text")
        .data(dataArray)
        .enter()
        .append("text")
        .attr("x",function(d){
          var spacing = 100;
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

function generateModelsWellsGraphic(){

  alreadyDone = true;

  let checkAttribs = [];

  for(let i=0;i<attribs(fileArr).length;i++){
    const attribsV = attribs(fileArr);
    checkAttribs.push(document.getElementById(attribsV[i]).checked);
  }

  const filter1 = filteredAttribsMW(fileArr,checkAttribs,attribs(fileArr));

  let checkWells = [];

  for(let i=0;i<wells(fileArr).length;i++){
    const wellsV = wells(fileArr);
    checkWells.push(document.getElementById(wellsV[i]).checked);
  }

  const filter2 = filteredWellMW(fileArr,checkWells,filter1);

  const maxRangeModels = document.getElementById('maxRangeModels').value;
  const minRangeModels = document.getElementById('minRangeModels').value;

  const filter3 = filteredModelMW(fileArr,maxRangeModels,minRangeModels,filter2);

  //Generates a new CSV depending on the filters and parse it on an object
  const parsed = d3.csvParse(filter3);

  // set the dimensions and margins of the graph
  let margin = {top: 90, right: 0, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("id","svg")
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

  d3.selectAll('.tick')
    .on("click", function (d) {
      timesClicked++;
      reOrdering(d,parsed,x,y,myColor);
    })
    .on("mouseover", function (d){
      d3.select(this).attr('font-weight', 'bold').style('fill', 'red');
      d3.select(this).style('cursor', 'pointer');
    })
    .on("mouseout", function(d) {
			d3.select(this).attr('font-weight', 'normal').style('fill', 'black');
      d3.select(this).style('cursor', 'default');
		});

  // Three function that change the tooltip when user hover / move / leave a cell

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

    buildLegend(svg,myColor)

    document.getElementById("exportImage").removeAttribute("hidden");
}

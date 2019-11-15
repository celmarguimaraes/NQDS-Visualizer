'use strict';

let svg, currentGraphic, timesClicked= 0;

//Changes the text or number to text value for the tooltip in the graphic
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

  if(alreadyDone == true){
      hideFilters();
  }
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

  currentGraphic = "modelsWells";
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

//Reorder the heatmap by the click in the row of the graphic
function reOrderingMW(data,parsed,x,y,myColor){

    let well = data;
    let order = [];
    let justTheWell = parsed.filter(function(d,i){ return d.well == well });

    //Calculate times clicked to alter the sort order
    // 1 time - Ascendent
    // 2 times - Descendent
    // 3 times - Normal Visualization
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
        return false;
    }

    justTheWell.forEach(function(element,index){
      order.push(element.model);
    })

    //Remove all rectangles
    svg.selectAll("rect")
      .remove();

    //Build only the line of the well clicked
    svg.selectAll("rect")
      .data(justTheWell, function(d) {return d.model+':'+d.well;})
      .enter()
      .append("rect")
      .attr("x", function(d,i) {
        let xis = (x(d.model) - (x(d.model) - x.bandwidth()*i+1));
        return xis;
       })
      .style("padding",0.01)
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

      d3.selectAll(".axis")
      .remove();

      myGroups = order;

      // set the dimensions and margins of the graph
      let margin = {top: 90, right: 0, bottom: 100, left: 60},
        width = 1200 - margin.left - margin.right,
        height = 620 - margin.top - margin.bottom;

      // Build X scales and axis:
      let xx = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.01);

      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(-5," + height + ")")
      .call(d3.axisBottom(xx))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.15em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-90)");

      d3.selectAll(".axis")
      .style("font","13px sans-serif");


      let otherWells = parsed.filter(function(d){ return d.well != well })
      let wellsArray = wells(fileArr);
      wellsArray.splice(wellsArray.indexOf(well),1);

      // For each row's well that isn`t clicked
      wellsArray.forEach(function(element,index){
        let filtered = parsed.filter(function(d){ return d.well == element });
        let result = [];

        //Order the columns according to the order of the line clicked
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

        //Build all the other well lines following the order constructed above
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
          .style("padding",0.01)
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

      //Rebuild the legend
      buildLegendMW(svg,myColor);
}

function buildLegendMW(svg,myColor){
  // Add title to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("Wells by Models NQDS Heatmap - Iteration "+iteration(fileArr));

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

  //Rectangles legend
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

  //Apply filter of attributes
  const filter1 = filteredAttribsMW(fileArr,checkAttribs,attribs(fileArr));

  let checkWells = [];

  for(let i=0;i<wells(fileArr).length;i++){
    const wellsV = wells(fileArr);
    checkWells.push(document.getElementById(wellsV[i]).checked);
  }

  //Apply filter of wells
  const filter2 = filteredWellMW(fileArr,checkWells,filter1);

  const maxRangeModels = document.getElementById('maxRangeModels').value;
  const minRangeModels = document.getElementById('minRangeModels').value;

  //Apply filter range of models
  const filter3 = filteredModelMW(fileArr,maxRangeModels,minRangeModels,filter2);

  //Generates a new CSV depending on the filters and parse it on an object
  const parsed = d3.csvParse(filter3);

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

  // Labels of row and columns
  let myGroups = parsed.map(newCsv => newCsv.model);
  let myVars = parsed.map(newCsv => newCsv.well);

  // Build X scales and axis:
  let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);

  // Build Y scales and axis:
  let y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01);

  let rowLabelGroup = svg.append("g")
    .attr('class', 'rowLabels')
    .call(d3.axisLeft(y));

  //Y functions for the row legends
  d3.selectAll('.tick')
    .on("click", function (d) {
      timesClicked++;
      reOrderingMW(d,parsed,x,y,myColor);
    })
    .on("mouseover", function (d){
      d3.select(this).attr('font-weight', 'bold').style('fill', 'red');
      d3.select(this).style('cursor', 'pointer');
    })
    .on("mouseout", function(d) {
			d3.select(this).attr('font-weight', 'normal').style('fill', 'black');
      d3.select(this).style('cursor', 'default');
		});

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

  //Construct the graphic
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

    buildLegendMW(svg,myColor)

    //Set visible the button to export image of the graphic
    document.getElementById("exportImage").removeAttribute("hidden");
}

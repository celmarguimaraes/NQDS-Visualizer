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
  if(tipoGrafico=='MW'){
    tooltip
    .html("Well: "+d.Poco+"<br>Model: "+d.Modelo+"<br>AQNS Value: "+textAQNS(d.ValorAQNS))
    .style("left", (d3.mouse(this)[0]) + "px")
    .style("top", (d3.mouse(this)[1]+300) + "px")
  }else if(tipoGrafico=='MA'){
    tooltip
    .html("Attribute: "+d.Atributo+"<br>Model: "+d.Modelo+"<br>AQNS Value: "+textAQNS(d.ValorAQNS))
    .style("left", (d3.mouse(this)[0]) + "px")
    .style("top", (d3.mouse(this)[1]+300) + "px")
  }else{
    tooltip
    .html("Well: "+d.Poco+"<br>Attribute: "+d.Atributo+"<br>AQNS Value: "+textAQNS(d.ValorAQNS))
    .style("left", (d3.mouse(this)[0]) + "px")
    .style("top", (d3.mouse(this)[1]+300) + "px")
  }
  
    
}
let mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
}

//Reorder the heatmap by the click in the row of the graphic
function reOrdering(data,parsed,x,y,myColor,tipo){

    const dados = data;
    let order = [];
    const linhaClicada = reordenar(parsed,dados,tipo);

    if(linhaClicada != false){
      // set the dimensions and margins of the graph
      let margin = {top: 90, right: 0, bottom: 100, left: 60},
      width = 1200 - margin.left - margin.right,
      height = 620 - margin.top - margin.bottom;

      let xx = construirEixoX(linhaClicada,width,tipo);

      /*d3.selectAll(".axis")
        .remove();

      const maxRangeModels = document.getElementById('maxRangeModels').value;
      const minRangeModels = document.getElementById('minRangeModels').value;

      if(maxRangeModels-minRangeModels<=100){
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
      }*/

      linhaClicada.forEach(function(element,index){
        order.push(element.Modelo);
      })

      //Remove todos os retângulos
      svg.selectAll("rect")
        .remove();

      //Construir apenas a linha que foi clicada
      svg.selectAll("rect")
        .data(linhaClicada, function(d) {
          if (tipo=='MW'){
            return d.Modelo+':'+d.Poco;
          }else if(tipo== 'MA'){
            return d.Modelo+':'+d.Atributo;
          }else{
            return d.Poco+':'+d.Atributo;
          }
          })
        .enter()
        .append("rect")
        .attr("x", function(d,i) {
          let xis;
          if (tipo=='MW'){
            xis = 2+(xx(d.Modelo) - (xx(d.Modelo) - x.bandwidth()*i+1));
          }else if(tipo== 'MA'){
            xis = 2+(xx(d.Modelo) - (xx(d.Modelo) - x.bandwidth()*i+1));
          }else{
            xis = 2+(xx(d.Poco) - (xx(d.Poco) - x.bandwidth()*i+1));
          }
          return xis;
        })
        .attr("y", function(d) {
          if (tipo=='MW'){
            return y(d.Poco)
          }else if(tipo== 'MA'){
            return y(d.Atributo)
          }else{
            return y(d.Atributo)
          }
          })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        //.attr("transform", "translate(0.5,0)")
        .style("fill", function(d) { return myColor(d.ValorAQNS)} )
        .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

        let ordemLinhas = [];
        
        if (tipo == 'MW'){
          const pocos = document.getElementsByName('filtroPocos');
          //Percorrendo filtro de Pocos
          for(let i=0;i<pocos.length;i++){
            if( document.getElementById(pocos[i].id).checked ){
              ordemLinhas.push(pocos[i].id);
            }
          }
        }else if(tipo == 'MA'){
          const atributos = document.getElementsByName('filtroAtributos');
          //Percorrendo filtro de Atributos
          for(let i=0;i<atributos.length;i++){
            if( document.getElementById(atributos[i].id).checked ){
              ordemLinhas.push(atributos[i].id);
            }
          }
        }else{
          const atributos = document.getElementsByName('filtroAtributos');
          //Percorrendo filtro de Atributos
          for(let i=0;i<atributos.length;i++){
            if( document.getElementById(atributos[i].id).checked ){
              ordemLinhas.push(atributos[i].id);
            }
          }
        }
        
        construirGraficoReordenado(ordemLinhas,parsed,order,dados,xx,y,tipo);

        //Rebuild the legend
        //buildLegendMW(svg,myColor);
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
      }
}

function buildLegendMW(svg,myColor){
  // Add title to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("Wells by Models NQDS Heatmap - Iteration "+iteracaoGraf);

  // Add subtitle to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("Date: "+"Data aida não capturada"+"| Version: "+versaoGraf);


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

  //Y functions for the row legends
  d3.selectAll('.tick')
    .on("click", function (d) {
      timesClicked++;
      reOrdering(d,parsed,x,y,myColor,tipo);
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
  
  construirGrafico(parsed,svg,x,y,tipo);

  buildLegendMW(svg,myColor);

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
    .attr("x", function(d,i) { 
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

function reordenar(parsed,linha,tipo){

  let justTheWell = parsed.filter(function(d,i){ 
    if(tipo=='MW'){
      return d.Poco == linha
    }else if(tipo=='MA'){
      return d.Atributo == linha
    }else{
      return d.Atributo == linha
    }
  });

  const maxRangeModels = document.getElementById('maxRangeModels').value;
  const minRangeModels = document.getElementById('minRangeModels').value;

  //Calculate times clicked to alter the sort order
  // 1 time - Ascendent
  // 2 times - Descendent
  // 3 times - Normal Visualization
  if(timesClicked == 1){
    justTheWell.sort(function(a,b){
      if(tipo=='MW'){
        return  d3.ascending(a.ValorAQNS,b.ValorAQNS) || d3.descending(a.Modelo,b.Modelo);
      }else if(tipo=='MA'){
        return  d3.ascending(a.ValorAQNS,b.ValorAQNS) || d3.descending(a.Modelo,b.Modelo);
      }else{
        return  d3.ascending(a.ValorAQNS,b.ValorAQNS) || d3.descending(a.Poco,b.Poco);
      }
    });
  }else if(timesClicked == 2){
    justTheWell.sort(function(a,b){
      if(tipo=='MW'){
        return  d3.descending(a.ValorAQNS,b.ValorAQNS) || d3.descending(a.Modelo,b.Modelo);
      }else if(tipo=='MA'){
        return  d3.descending(a.ValorAQNS,b.ValorAQNS) || d3.descending(a.Modelo,b.Modelo);
      }else{
        return  d3.descending(a.ValorAQNS,b.ValorAQNS) || d3.descending(a.Poco,b.Poco);
      }
    });
  }else if(timesClicked == 3){
      timesClicked = 0;
      clearGraphicArea();
      generateGraphic(parsed,maxRangeModels,minRangeModels,tipo);
      return false;
  }

  return justTheWell;
}

function construirGraficoReordenado(ordemLinhas,parsed,order,dados,x,y,tipo){
  ordemLinhas.splice(ordemLinhas.indexOf(dados),1);

        // For each row's well that isn`t clicked
        ordemLinhas.forEach(function(element,index){
          let filtered = parsed.filter(function(d){
            if (tipo == 'MW'){
              return d.Poco == element 
            }else if(tipo == 'MA'){
              return d.Atributo == element 
            }else{
              return d.Atributo == element 
            }
          });

          let result = [];

          //Order the columns according to the order of the line clicked
          order.forEach(function(key) {
              var found = false;
              filtered = filtered.filter(function(item) {
                if (tipo == 'MW'){
                  if(!found && item.Modelo == key) {
                      result.push(item);
                      found = true;
                      return false;
                  } else{
                      return true;
                  }
                } else if(tipo == 'MA'){
                  if(!found && item.Modelo == key) {
                    result.push(item);
                    found = true;
                    return false;
                  } else{
                    return true;
                  }
                } else {
                  if(!found && item.Poco == key) {
                    result.push(item);
                    found = true;
                    return false;
                  } else{
                    return true;
                  }
                }
              })
          })

          //Build all the other well lines following the order constructed above
          let count=0;
          svg.selectAll("rect")
            .data(result, function(d) {
              if (tipo=='MW'){
                return d.Modelo+':'+d.Poco;
              }else if(tipo== 'MA'){
                return d.Modelo+':'+d.Atributo;
              }else{
                return d.Poco+':'+d.Atributo;
              }
            })
            .enter()
            .append("rect")
            .attr("x", function(d) {
              let xis = 2+(x(order[count]) - (x(order[count]) - x.bandwidth()*count+1));
              count++;
              return xis;
            })
            .style("padding",0.01)
            .attr("y", y(element) )
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.ValorAQNS)} )
            .style("stroke-width", 4)
              .style("stroke", "none")
              .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
        })
}
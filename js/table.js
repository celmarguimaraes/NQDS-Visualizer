function table(json, width, height, tipo) {
    var matrix = json.matrix,
	row_labels = json.row_labels,
	col_labels = json.col_labels,
	row_perm = json.row_permutation,
	col_perm = json.col_permutation,
	row_inv, col_inv,
	n = matrix.length,
	m = matrix[0].length,
	i;

    if (! row_labels) {
	row_labels = Array(n);
	for (i = 0; i < n; i++) 
	    row_labels[i] = i+1;
    }
    if (! col_labels) {
	col_labels = Array(m);
	for (i = 0; i < n; i++) 
	    col_labels[i] = i+1;
    }

    if (! row_perm)
	row_perm = reorder.permutation(n);
    row_inv = reorder.inverse_permutation(row_perm);

    if (! col_perm)
	col_perm = reorder.permutation(m);
    col_inv = reorder.inverse_permutation(col_perm);

	color = d3.scaleLinear()
		.range(['#c7c6c3', "#00cc66", "#ff0000"])
		.domain([0,1,6]);

    var gridSize = Math.min(width / matrix.length, height / matrix[0].length),
	h = gridSize,
	th = h*n,
	w = gridSize,
	tw = w*m;

    var x = function(i) { return w*col_inv[i]; },
	y = function(i) { return h*row_inv[i]; };

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
	let mouseover = function () {
		tooltip
			.style("opacity", 0.9)
		d3.select(this)
			.style("stroke", "black")
			.style("opacity", 0.9)
	}
	let mousemove = function (d) {
		if (tipo == 'MW') {
			tooltip
				.html("Well: " + d.Poco + "<br>Model: " + d.Modelo + "<br>NQDS Value: " + textAQNS(d))
				.style("left", (d3.mouse(this)[0]) + "px")
				.style("top", (d3.mouse(this)[1] + 400) + "px")
		} else if (tipo == 'MA') {
			tooltip
				.html("Attribute: " + d.Atributo + "<br>Model: " + d.Modelo + "<br>NQDS Value: " + textAQNS(d))
				.style("left", (d3.mouse(this)[0]) + "px")
				.style("top", (d3.mouse(this)[1] + 400) + "px")
		} else {
			tooltip
				.html("Well: " + d.Poco + "<br>Attribute: " + d.Atributo + "<br>NQDS Value: " + textAQNS(d))
				.style("left", (d3.mouse(this)[0]) + "px")
				.style("top", (d3.mouse(this)[1] + 400) + "px")
		}
	}
	let mouseleave = function () {
		tooltip
			.style("opacity", 0)
		d3.select(this)
			.style("stroke", "none")
			.style("opacity", 0.9)
	}

    var row = svg
	    .selectAll(".row")
	    .data(matrix, function(d, i) { return 'row'+i; })
	    .enter().append("g")
            .attr("id", function(d, i) { return "row"+i; })
            .attr("class", "row")
            .attr("transform", function(d, i) {
		return "translate(0,"+y(i)+")";
	    })

    var cell = row.selectAll(".cell")
	    .data(function(d) { return d; })
	    .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function(d, i) { return x(i); })
            .attr("width", w)
            .attr("height", h)
            .style("fill", function(d) { return color(d); })
			.style("stroke-width", 4)
			  .style("stroke", "none")
			  .style("opacity", 0.9)
			  .on("mouseover", mouseover)
			  .on("mousemove", mousemove)
			  .on("mouseleave", mouseleave);

    row.append("line")
	.attr("x2", tw);

    row.append("text")
	.attr("x", -6)
	.attr("y", h / 2)
	.attr("dy", ".32em")
	.attr("text-anchor", "end")
	.text(function(d, i) { return row_labels[i]; });

    var col = svg.selectAll(".col")
	    .data(matrix[0])
	    .enter().append("g")
	    .attr("id", function(d, i) { return "col"+i; })
	    .attr("class", "col")
	    .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; })

    col.append("line")
	.attr("x1", -th);

    col.append("text")
	.attr("x", 6)
	.attr("y", w / 2)
	.attr("dy", ".32em")
	.attr("text-anchor", "start")
	.text(function(d, i) { return col_labels[i]; });

    svg.append("rect")
	.attr("width", tw)
	.attr("height", th)
	.style("fill", "none")
	.style("stroke", "black");

    function order(rows, cols) {
	row_perm = rows;
	row_inv = reorder.inverse_permutation(row_perm);
	col_perm = cols;
	col_inv = reorder.inverse_permutation(col_perm);
	
	var t = svg.transition().duration(1500);

	t.selectAll(".row")
            .attr("transform", function(d, i) {
		return "translate(0," + y(i) + ")"; })
	    .selectAll(".cell")
            .attr("x", function(d, i) { return x(i); });

	t.selectAll(".col")
            .attr("transform", function(d, i) {
		return "translate(" + x(i) + ")rotate(-90)"; });
    }
    table.order = order;
}



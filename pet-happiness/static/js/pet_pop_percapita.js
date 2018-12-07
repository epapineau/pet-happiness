function petPerCapita(petType, divId, xAxisLabel){
    // Set up graph variables
    var svgWidth = 450;
    var svgHeight = 350;

    //adjust margins here (must be large enough to keep axis labels outside of chart)
    var margin = {
    top: 40,
    right: 20,
    bottom: 70,
    left: 90,
    };

    //chart area
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our scatter plot, and shift the latter by left and top margins.
    var svg = d3.select(`#${divId}`)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var scatter_chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Data route
    var url = "/get_pet_data_d3";
  
    d3.json(url).then(function(petData) {
        var data = petData[petType];

        // Define scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.per_capita) - .01,
                     d3.max(data, d => d.per_capita)])
            .range([0, width]);
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d=> d.hapiness_score) - .5,
                     d3.max(data, d => d.hapiness_score) + 1])
            .range([height, 0]);

        // Add axes and append to chart
        var bottomAxis = d3.axisBottom(xLinearScale);
        scatter_chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        var leftAxis = d3.axisLeft(yLinearScale);
        scatter_chart.append("g")
            .call(leftAxis);

        // Add axes labels
        scatter_chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 40 - margin.left)
            .attr("x", -100 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("National Happiness Score");
        scatter_chart.append("text")
            .attr("transform", `translate(${width/3}, ${height + margin.top})`)
            .attr("class", "axisText")
            .text(xAxisLabel);
        
        // Append data to circles
        var circlesGroup = scatter_chart.selectAll("circle")
            .data(data)
            .enter();

        // Add circles
        var d3Tip = circlesGroup.append("circle")
            .attr("cx", d => xLinearScale(d.per_capita))
            .attr("cy", d => yLinearScale(d.hapiness_score))
            .attr("r", "9")
            .attr("fill", "orange")
            .attr("opacity", ".5");

        // Circle labels
        circlesGroup.append("text")
            // .classed("stateText", true)
            .attr("x", d => xLinearScale(d.per_capita) - 8)
            .attr("y", d => yLinearScale(d.hapiness_score) + 2)
            .attr("stroke", "OrangeRed")
            .attr("font-size", "8px")
            .text(d => d.world_bank_code)
        
        // Hover tool tip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")  //used to get correct pop up
            .offset([-10, 0])
            .html(function(d) {
                return (`${d.country}<br>${xAxisLabel}: ${d.per_capita}<br>Nat'l Happiness Score: ${d.hapiness_score}`);
            });
    
        d3Tip.call(toolTip);

        d3Tip.on("mouseout", function(d, index) {
            d3.select(this).style("stroke", "red")
            toolTip.show(d, this);
          });

    });
}

petPerCapita('cat', 'cat-purrr-capita', 'Cats purr Capita');
petPerCapita('dog', 'dog-per-capita', 'Dogs per Capita');
petPerCapita('fish', 'fish-per-capita', 'Fish per Capita');
petPerCapita('bird', 'bird-per-capita', 'Bird per Capita');
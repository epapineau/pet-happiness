function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Remove previous figure
    d3.select("svg").remove();

    // Select pet type from input and run graphing function
    var petType = d3.select("#inputType").node().value;
    petGdp(petType);
}  
function petGdp(petType){
    var svgWidth = 810;
    var svgHeight = 500;

    //adjust margins here (must be large enough to keep axis labels outside of chart)
    var margin = {
    top: 20,
    right: 50,
    bottom: 100,
    left: 95
    };

    //chart area
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our scatter plot, and shift the latter by left and top margins.
    var svg = d3.select("#gdp")
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

        // xLinearScale function above csv import
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.per_capita_gdp),
                     d3.max(data, d => d.per_capita_gdp)])
            .range([0, width]);

        // Create y scale function
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.pet_population),
                    d3.max(data, d => d.pet_population) + 1])
            .range([height, 0]);
    
        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        //Append axes to the chart
        scatter_chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        scatter_chart.append("g")
            .call(leftAxis);

        //Create Circles.  
        var circlesGroup = scatter_chart.selectAll("circle")
            .data(data)
            .enter(); 

        //Separate append and attributes and use d3-tip.js
        var d3Tip = circlesGroup
            .append("circle")  
            .attr("cx", d => xLinearScale(d.per_capita_gdp))
            .attr("cy", d => yLinearScale(d.pet_population))
            .attr("r", "12")
            .attr("fill", "orange")
            .attr("opacity", ".5");

        //Create text labels with state abbreviation for each circle
        circlesGroup.append("text")
            // .classed("countryText", true)
            .attr("x", d => xLinearScale(d.per_capita_gdp) - 9)
            .attr("y", d => yLinearScale(d.pet_population) + 3)
            .attr("stroke", "OrangeRed")
            .attr("font-size", "10px")
            .text(d => d.world_bank_code)
    
        //Initialize the tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")  //used to get correct pop up
            .offset([-10, 0])
            .html(function(d) {
            return (`${d.country}<br>country GDP ${d.per_capita_gdp}<br>fish population: ${d.pet_population}`);
        });

        //Create tooltip in the chart
        d3Tip.call(toolTip)
        
        d3Tip.on("mouseout", function(d, index) {
            d3.select(this).style("stroke", "white")
                .attr("r", "15")
            toolTip.show(d, this);
        });

        // Create Y-axis label
        scatter_chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 2))
            .attr("y", 0 - (margin.left / 2) - 50)
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Pet Population");

        // Create X-axis label
        scatter_chart.append("text")
            .attr("transform", `translate(${width/3}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("GDP (In US Billion Dollar)");
    });
}

// Default load
petGdp('dog');
// Change dataset on click
d3.select("#submit").on("click", handleSubmit);
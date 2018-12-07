function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();   

    // Remove previous figure
    d3.select("svg").remove();

    // Select pet type from input and run graphing function
    var petType = d3.select("#inputType").node().value;
    petUrbanPop(petType);
}  

function petUrbanPop(petType){
    // Setting the dimensions for the SVG container
    var svgHeight = 500;
    var svgWidth  = 810;

    // Setting other Chart Params
    var margin = { 
    top: 20,
    right: 50,
    bottom: 100,
    left: 95
    };

    // chart area minus margins
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // create svg container, append an SVG group that will hold the chart.
    var svg = d3
        .select("#urban-population")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // shift everything over by the margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Data route
    var url = "/get_pet_data_d3";

    d3.json(url).then(function(petData) {
        var data = petData[petType];

        // define two x axis based on Happiness_Score and Life Expectancy to scale chart width
        var xLinearScaleHappiness_Score = d3.scaleLinear()
            .domain([d3.min(data, d => d.hapiness_score),
                     d3.max(data, d => d.hapiness_score)])
            .range([0, width]);
        var xLinearScaleHealth = d3.scaleLinear()
            .domain([d3.min(data, d => d.percent_urban_pop),
                     d3.max(data, d => d.percent_urban_pop)])
            .range([0, width]);

        // define two y axis based on Pet Population to scale chart height
        var yLinearScalePet_Population = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.pet_population)])
            .range([height, 0]);

        // Create axis functions
        var bottomAxisHappiness_Score = d3.axisBottom(xLinearScaleHappiness_Score);
        var bottomAxisHealth = d3.axisBottom(xLinearScaleHealth);
        var leftAxisPet_Population = d3.axisLeft(yLinearScalePet_Population);

        // Add x-axis to the bottom of the chart
        var bottomAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxisHealth);

        // Add x-axis to the bottom of the chart
        var bottomAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxisHealth);

        // set y to the y axis of the chart
        var leftAxis = chartGroup.append("g")
        .call(leftAxisPet_Population);

        // Create circles using data binding
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()

        var circles = circlesGroup.append("circle")
            .attr("cx", d => xLinearScaleHealth(d.percent_urban_pop))
            .attr("cy", d => yLinearScalePet_Population(d.pet_population))
            .attr("r", "12")
            .attr("fill", "orange")
            .attr("opacity", ".5");
        
        var text = circlesGroup.append("text")
            .attr("x", d => xLinearScaleHealth(d.percent_urban_pop) - 9)
            .attr("y", d => yLinearScalePet_Population(d.pet_population) + 3)
            .attr("fill", "OrangeRed")
            .text(d => d.world_bank_code)
            .style("text-align", "left")
            .style("font-size", "10px")
            .style("font-weight", "bold")
        
        // Define variable and initialize for Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .html(function(d) {
                return (`Country: ${d.country}<br>Urban Population: ${d.percent_urban_pop}<br>Total Pet Population: $${d.pet_population}`);
        });

        // Create the tooltip in circles and text.
        chartGroup.call(toolTip);

        // Create mouseover event listener to display tooltip
        circles.on("mouseover", function(d) {
            toolTip.show(d, this);
        })
        // mouseout event listener to hide tooltip
        .on("mouseout", function(d) {
            toolTip.hide(d, this);
        });

        // Create mouseover/mouseout  event listeneres for text
        text.on("mouseover", function(d) {
            toolTip.show(d, this);
        })
  
        // Create group for  2 y- axis labels  // ??
        var yAxis = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 2))
            .attr("y", 0 - (margin.left / 2) - 50)
            .attr("dy", "1em")
            .attr("class", "aText inactive")
            .text("Pet Population");

        // Create group for  2 x- axis labels
        var xAxis = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "aText active")
            .text("Urban Population (%)");
    });
}

// Default load
petUrbanPop('dog');
// Change dataset on click
d3.select("#submit").on("click", handleSubmit);

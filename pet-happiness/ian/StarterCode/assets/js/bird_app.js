var svgWidth = 900;
var svgHeight = 700;

// testing github
//adjust margins here (must be large enough to keep axis labels outside of chart)
var margin = {
  top: 30,
  right: 20,
  bottom: 70,
  left: 110,
};

//chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our scatter plot, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

// Append an SVG group
var scatter_chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

////////////////////////////////////////////////////////////////////////////////////////////////////
// Import data from the CSV file and execute everything below
d3.csv("assets/data/bird_data_for_chart.csv", function(err, data) {
  if (err) throw err;
 
 // Step 1: Parse Data
 data.forEach(function(d) {
    d.dpc = +d.dpc;
    d.nhs= +d.nhs;  
  });
/////////////////////////////////////////////////////////////////////////////
// Step 2: Create scale functions
// xLinearScale function above csv import

var xLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d.dpc), d3.max(data, d => d.dpc)])
  .range([0, width]);
// var chosenXAxis = "hair_length";
// xLinearScale = xScale(data, income);
/////////////////////////////////////////////////////////////////////////////////////////
// Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d.nhs), d3.max(data, d => d.nhs)+1])
  .range([height, 0]);
  
// Create axis functions
// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);
///////////////////////////////////////////////////////////////////////////////////////////////////////

//Append axes to the chart (see 03-example12)
scatter_chart.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
scatter_chart.append("g")
  .call(leftAxis);
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Create Circles.  
var circlesGroup = scatter_chart.selectAll("circle").data(data).enter(); 

//Separate append and attributes and use d3-tip.js
var d3Tip=circlesGroup
  .append("circle")  
  .classed("stateCircle", true)
  .attr("cx", d => xLinearScale(d.dpc))
  .attr("cy", d => yLinearScale(d.nhs))
  .attr("r", "15")
  .attr("opacity", ".5");
  
//Create text labels with state abbreviation for each circle
circlesGroup.append("text")
  .classed("stateText", true)
  .attr("x", d => xLinearScale(d.dpc))
  .attr("y", d => yLinearScale(d.nhs))
  .attr("stroke", "blue")
  .attr("font-size", "10px")
  .text(d => d.abbr)
    
  
//Initialize tool tip

  // var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   .offset([80, -60])
  //   .html(function(d) {
  //     return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
  //   });

var toolTip = d3.tip()
    .attr("class", "d3-tip")  //used to get correct pop up
    .offset([-10, 0])
    .html(function(d) {
      return (`${d.country}<br>Bird:Human Ratio: ${d.dpc}<br>Nat'l Happiness Score: ${d.nhs}`);
  });

//Create tooltip in the chart
d3Tip.call(toolTip);

// circlesGroup.call(toolTip);

// holder.append("circle")        // attach a circle
//     .attr("cx", 200)           // position the x-centre
//     .attr("cy", 100)           // position the y-centre
//     .attr("r", 50)             // set the radius
//     .style("stroke", "red")    // set the line colour
//     .style("fill", "none");    // set the fill colour
// d3Tip.on("mouseover", function(d) {
//   d3.select(this).style("stroke", "gray")
//   toolTip.show(d, this);
// })
  
  d3Tip.on("mouseout", function(d, index) {
    d3.select(this).style("stroke", "red")
    .attr("r", "15")
    toolTip.show(d, this);
  });

  // // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Number of Billboard 500 Hits");

// Create X-axis label
scatter_chart.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 40 - margin.left)
.attr("x", -100 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("National Happiness Score");

// Create Y-axis label
scatter_chart.append("text")
.attr("transform", `translate(${width/3}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("Bird:Human Population Ratio");
    
});
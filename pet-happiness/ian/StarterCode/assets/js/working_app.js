var svgWidth = 900;
var svgHeight = 700;

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
d3.csv("assets/data/data.csv", function(err, data) {
  if (err) throw err;
 
 // Step 1: Parse Data
 data.forEach(function(d) {
    d.income = +d.income;
    d.smokes= +d.smokes;  
  });
/////////////////////////////////////////////////////////////////////////////
// Step 2: Create scale functions
// xLinearScale function above csv import

var xLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d.income)-0.5, d3.max(data, d => d.income)+0.5])
  .range([0, width]);
// var chosenXAxis = "hair_length";
// xLinearScale = xScale(data, income);
/////////////////////////////////////////////////////////////////////////////////////////
// Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d.smokes), d3.max(data, d => d.smokes)+1])
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
  .attr("cx", d => xLinearScale(d.income))
  .attr("cy", d => yLinearScale(d.smokes))
  .attr("r", "15")
  .attr("opacity", ".5");
  
//Create text labels with state abbreviation for each circle
circlesGroup.append("text")
  .classed("stateText", true)
  .attr("x", d => xLinearScale(d.income))
  .attr("y", d => yLinearScale(d.smokes))
  .attr("stroke", "blue")
  .attr("font-size", "10px")
  .text(d => d.abbr)
    
  
//Initialize tool tip

var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>Median HH income: $${d.income}<br>Smokes: ${d.smokes}%`);
  });

//Create tooltip in the chart
d3Tip.call(toolTip);

//Create event listeners to display and hide the tooltip
d3Tip.on("mouseover", function(d) {
  d3.select(this).style("stroke", "black")
  toolTip.show(d, this);
})
  //on mouseout event
  .on("mouseout", function(d, index) {
    d3.select(this).style("stroke", "red")
    .attr("r", "15")
    toolTip.show(d);
  });

// Create Y-axis and X-axis labels
scatter_chart.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 60)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Percent population smokes (%)");

scatter_chart.append("text")
.attr("transform", `translate(${width/3}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("Median Household Income ($)");
    
});
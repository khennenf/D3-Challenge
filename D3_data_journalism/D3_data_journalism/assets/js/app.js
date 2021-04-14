//Define SVG height & width
var svgWidth = 960;
var svgHeight = 500;

//Define margine
var margin = {
  top: 30,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

 //Define Chartgroup 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

 //Add Chart Title 
chartGroup.append("text")
  .attr("x", (width / 2))             
  .attr("y", 0 - (margin.top / 5))
  .attr("text-anchor", "middle")  
  .style("font-size", "16px") 
  .style("text-decoration", "underline")  
  .text("Obesity vs Median Household Income");

//Bring in data  
d3.csv("assets/data/data.csv").then(function(theData) {

  //Parse Data/Cast as numbers
theData.forEach(function(data) {
    data.income = +data.income;
    data.obesity = +data.obesity;
});

//Create scale functions
var xLinearScale = d3.scaleLinear()
.domain([35000, 80000])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([20, 38])
.range([height, 0]);

//Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Append Axes to the chart
chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

//Create Circles
var circlesGroup = chartGroup.selectAll("circle")
.data(theData)
.enter()
.append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "royalblue")
    .attr("opacity", ".6")


//Add State Abbr Labels
var textGroup = chartGroup.selectAll("text.values")
.data(theData)
.enter()
.append("text")
.attr("x", d => xLinearScale(d.income) - 6)
.attr("y", d => yLinearScale(d.obesity) + 3)
.attr("stroke", "ghostwhite")
.attr("font-size", "10px")
    .text(function(d) {
      return d.abbr;
      })        


//Create tool tip
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60]) 
.html(function(d) { 
  return (`${d.abbr}<br>Income: ${d.income}<br>Obesity Rate: ${d.obesity}`);
});

//Create tooltip in the chart
chartGroup.call(toolTip)

//Create event listeners to display
circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

//Add y axis label
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

//Add x axis label    
chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Median Household Income($)");

//Log errors
  }).catch(function(error) {
    console.log(error);
  });

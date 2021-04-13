var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(theData) {

// Step 1: Parse Data/Cast as numbers
// ==============================
theData.forEach(function(data) {
    data.income = +data.income;
    data.obesity = +data.obesity;
});


//Create scale functions
var xLinearScale = d3.scaleLinear()
.domain([20000, d3.max(theData, d => d.income)])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([20, d3.max(theData, d => d.obesity)])
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
    .attr("fill", "lightskyblue")
    .attr("opacity", "1")
    .text(function(d) {
        console.log(d.abbr);
        return d.abbr;
        })

svg.selectAll("text")
.data(theData)
.enter()
.append("text")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.text(function(d) {
    console.log(d.abbr);
    return d.abbr;
    })



// var content = d3.select("g").selectAll("text").data(theData);
// content.enter().append("text").each(function(d){
//     d3.select(this).attr("cx", d => xLinearScale(d.income)).attr("cy", d => yLinearScale(d.obesity))
//     .text(theData.abbr)
// })



//Create tool tip
// var toolTip = d3.tip()
// .attr("class", "tooltip") //style
// .offset([80, -60]) //placement
// .html(function(d) { //structure/content
//   return (`${d.abbr}<br>Income: ${d.income}<br>Obesity Rate: ${d.obesity}`);
// });

// //Create tooltip in the chart
// chartGroup.call(toolTip)

// //Create event listeners to display
// circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data, this);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });


chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Household Income Median ($)");





// chartGroup.append("text")
//     .data(theData)
//     .enter()
//     .attr("cx", d => xLinearScale(d.income))
//     .attr("cy", d => yLinearScale(d.obesity))
//     .text(`${d.abbr}`);

  }).catch(function(error) {
    console.log(error);
  });

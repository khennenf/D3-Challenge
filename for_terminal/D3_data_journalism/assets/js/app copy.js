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
.range([height, 50]);

//Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Append Axes to the chart
chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

const g = d3.select(svg)
// .append('g')
  // .style('font-family', 'sans-serif')
  // .style('font-size', 10)

  g
  .selectAll('g')
  .data( data )
  // each data point is a group
  .join('g')
    .attr('class', 'scatter-point')
    .attr('transform', d => `translate(${xScale(d.income)},${yScale(d.obesity)})`)
  // .call() passes in the current d3 selection
  // This is great if we want to append something
  // but still want to work with the original selection after that
  .call(g => g
    // first we append a circle to our data point
    .append('circle')
      .attr('r', 5)
      .style('stroke', d => colors( d.state))
      .style('stroke-width', 2)
      .style('fill', 'transparent')
  )
  .call(g => g
    // then we append a text label to the data point
    .append('text')
      .attr('x', 8)
      .attr('dy', '0.35em')
    // I've filter out values too low in order to avoid label overlap
    // see what happens if you remove the condition and just return d.company
    .text(d => d.age > 0 ? '' : d.abbr)
   )







})

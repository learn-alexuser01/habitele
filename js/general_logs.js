vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  initViz();
});



function initViz() {

  $('[id^="loggraph_"]').html("");

  dataDisplay(vizData.visualizations.general_logs);

}



function dataDisplay(data) {

  // List data

  $('#total_phone_book_entries').text(data.total_phone_book_entries);
    
  // Bar Chart 0

  var names, values, json = [];
  names = ["duration_total", "duration_in", "duration_out"];
  values = [data.calls.duration_total, data.calls.duration_in, data.calls.duration_out];
  for (i in names) json.push({name: names[i], value: values[i]});
  displayTable(json, "loggraph_1", ['#8d3233', '#d9aa59', '#79a0c1']);

  // Bar Chart 1

  var names, values, json = [];
  names = ["total", "in", "out"];
  values = [data.calls.total, data.calls.in, data.calls.out];
  for (i in names) json.push({name: names[i], value: values[i]});
  displayTable(json, "loggraph_2", ['#8d3233', '#d9aa59', '#79a0c1']); 

  // Bar Chart 2

  var names, values, json = [];
  names = ["total", "in", "out"];
  values = [data.SMS.total + data.MMS.total, data.SMS.in + data.MMS.in, data.SMS.out + data.MMS.out];
  for (i in names) json.push({name: names[i], value: values[i]});
  displayTable(json, "loggraph_3", ['#8d3233', '#d9aa59', '#79a0c1']);

};

function displayTable(json, vizGraph, fillColor) {

  // Data

  var margin = {top: 10, right: 10, bottom: 10, left: 100},
    width = $("div.span8").width() - margin.right - margin.left,
    height = 120 - margin.top - margin.bottom;

  var format = d3.format(",.0f");

  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.ordinal().rangeRoundBands([0, height], .1);

  x.domain([0, d3.max(json, function(d) { return d.value; })]);
  y.domain(json.map(function(d) { return d.name; }));

  var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-height);
  var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  // Graphics

  var svg = d3.select("div#" + vizGraph).append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll("g.bar")
      .data(json)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

  console.log($("div#" + vizGraph + ' g.bar')[0]);

  // $("div#" + vizGraph + ' g.bar').first().hide();

  $("div#" + vizGraph + ' g.bar').each(function(i) {
    $(this).attr('fill', fillColor[i]);
  });

  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", y.rangeBand());

  bar.append("text")
      .attr("class", "value")
      .attr("x", function(d) { return x(d.value); })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", -3)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return format(d.value); });

  svg.append("g")
      .attr("class", "x axis bar")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis bar")
      .call(yAxis);

}
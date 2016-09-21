console.log('hi');
var colorRange = ["#5e4fa2", "#3288bd" , "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#fee08b"];
var data;
var colorBar;
var colorBarText = [0, 2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7];
var map = {
  h: 450,
  w: 1000
};
var helper = {
  allYearsArray: []
};//to store teamperature data

helper.dataAddress = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
var scale = {};
var monthStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var celStr = '°C';
var axis = {};

d3.json(helper.dataAddress, function(error, json) {
  if (error) return console.warn(error);
  data = json;
  visualise();
})


function visualise(){
  console.log('this data to be visualise it');
  console.log(data);
  //let's the scale for x, y and color first
  data.monthlyVariance.forEach(function(d){helper.allYearsArray.push(d.year);});
  scale.x = d3.scale.linear().domain([d3.min(helper.allYearsArray), d3.max(helper.allYearsArray)]).range([0, map.w]);
  scale.y = d3.scale.linear().domain([1, 12]).range([0, map.h]);
  scale.o = d3.scale.ordinal().domain(helper.allYearsArray).rangePoints([0, map.w]);
  scale.color = d3.scale.ordinal()
      .domain([0, 2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7])
      .range(["#5e4fa2", "#3288bd" , "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#fee08b"]);

  axis.x = d3.svg.axis().scale(scale.x).orient('bottom').tickFormat(formateDate);
  axis.y = d3.svg.axis().scale(scale.y).orient('left').tickFormat(formateYaxis);

  svg = d3.select('body').append('svg').attr('width', map.w+200).attr('height', map.h+200)
        //append g here to positon this shift
        .append('g').attr('transform', 'translate(100, 100)')
        .selectAll('rect').data(data.monthlyVariance)
        .enter().append('rect')
        //set rectangle size and position here
        .attr('x', function(d, i){
         return scale.x(d.year)
        })
        .attr('y', function(d){
          var evenY = map.h/12;
          var evenX = map.w/(helper.allYearsArray.length/12);
          return (d.month-1) * evenY;
        })
        .attr('width', function(d, i){ return map.w/(helper.allYearsArray.length/12); })
        .attr('height', function(d){ return map.h/12 })
        .attr('fill', function(d){
          return scale.color(giveMeColor(d.variance));
        })
        .style('cursor', 'pointer');

        // d3.select('svg').style('cursor', 'pointer');

      //add tooltop to it
      svg.on('mouseover', function(d){
        var currentMonth = giveMeMonth(d.month);
        d3.select('.tooltip').style('display', 'inline-block');
        d3.select('.tooltip').style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY-30) + "px");
        d3.select('.year').text(d.year);
        d3.select('.month').text(currentMonth);
        d3.select('.temp').text(d.variance+data.baseTemperature);
        d3.select('.diff').text(d.variance);
      }).on('mouseout', function(d){
        d3.select('.tooltip').style('display', 'none');
      })

d3.select('svg').append('g').attr('transform', 'translate(100, 550)').call(axis.x);
d3.select('svg').append('g').attr('transform', 'translate(100, 100)').call(axis.y);
colorBar = d3.select('svg').append('g');
colorBar.selectAll('rect').data(colorRange).enter().append('rect').attr('fill', function(d, i){
  return colorRange[i];
}).attr('width', 30).attr('height', 20).attr('x', function(d, i){ return i*30});

colorBar.selectAll('text').data(colorBarText).enter().append('text').text(function(d){
  return d;
}).attr('width', 30).attr('height', 20).attr('x', function(d, i){ return i*30});


}


function giveMeColor(diff){
  var temp = data.baseTemperature + diff;
  if(temp>=0 && temp<=2.7){
    return 0;
  }else if (temp>2.7 && temp<=3.9) {
    return 2.7;
  }else if (temp>3.9 && temp<=5) {
    return 3.9;
  }else if (temp>5 && temp<=6.1) {
    return 5;
  }else if (temp>6.1 && temp<=7.2) {
    return 6.1;
  }else if (temp>7.2 && temp<=8.3) {
    return 7.2;
  }else if (temp>8.3 && temp<=9.4) {
    return 8.3;
  }else if (temp>9.4 && temp<=10.5) {
    return 9.4;
  }else if (temp>10.5 && temp<=11.6) {
    return 10.5;
  }else if (temp>11.6 && temp<=12.7) {
    return 11.6;
  }else{
    return 12.7;
  }
}

function giveMeMonth(num){
  return monthStr[num-1];
}

function formateDate(d){
  return d;
}

function formateYaxis(d){
  return giveMeMonth(d);
}

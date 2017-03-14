$(document).ready(function () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();

  var audioElement = document.getElementById('audioElement');
  var source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  source.connect(audioCtx.destination);

  var frequencyData = new Uint8Array(350);

  var svgWidth = $(window).width();
  var svgHeight = $(window).height();
  // var svgHeight = '800';
  // var svgWidth = '800';

  var svg = d3.select('body').append('svg')
    .attr({
      height: svgHeight,
      width: svgWidth
    });

  function getData() {
    requestAnimationFrame(getData);
    analyser.getByteFrequencyData(frequencyData);

    var radiusScale = d3.scale.linear()
      .domain([0, d3.max(frequencyData)])
      .range([0, svgHeight-50]);

    var hueScale = d3.scale.linear()
      .domain([0, d3.max(frequencyData)])
      .range([335, 355]);

    var circles = svg.selectAll('circle')
      .data(frequencyData);

    circles.enter().append('circle');

    circles
      .attr({
        r: function(d) {
            return radiusScale(d); },
        cx: svgWidth / 2,
        cy: svgHeight / 2,
        fill: 'none',
              'stroke-width': 9,
              'stroke-opacity': 0.2,
        stroke: function(d) {
                  return d3.hsl(hueScale(d), 1, 0.5); }});

    circles.exit().remove();}
    getData();
});

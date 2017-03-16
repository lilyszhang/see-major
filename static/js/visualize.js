//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser(); //AnalyserNode allows us to get frequency data

  //connect AnalyserNode to audio source
  var audioElement = document.getElementById('audioElement');
  var source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser); //connect output of audioElement to input of analyser
  source.connect(audioCtx.destination);

  var animationToggle;

  function bar() {

      $("#visualizer").children().remove();
      var frequencyData = new Uint8Array(50); //where frequency data will be copied into

      var svgHeight = 2*$(window).height()/3;
      var svgWidth = $(window).width();
      var barPadding = '2';

      var svg = d3.select('#visualizer').append('svg').attr('height', svgHeight).attr('width', svgWidth);

      svg.selectAll('rect')
         .data(frequencyData)
         .enter()
         .append('rect')
         .attr('x', function (d, i) {
            return i * (svgWidth / frequencyData.length);
         })
         .attr('width', svgWidth / frequencyData.length - barPadding);

      function getData() {
         requestAnimationFrame(getData);
         analyser.getByteFrequencyData(frequencyData);
         console.log(frequencyData);

         svg.selectAll('rect')
            .data(frequencyData)
            .attr('y', function(d) {
               return svgHeight - d;
            })
            .attr('height', function(d) {
               return d;
            })
            .attr('fill', function(d) {
               return 'rgb(255, 92, '+ 2*Math.floor(d/3) +')';
            });
      }
      animationToggle = requestAnimationFrame(getData);
    }

    function circle() {
      $("#visualizer").children().remove();
      var frequencyData = new Uint8Array(350);

      var svgWidth = $(window).width();
      var svgHeight = $(window).height();
      // var svgHeight = '800';
      // var svgWidth = '800';

      var svg = d3.select('#visualizer').append('svg')
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

        circles.exit().remove();
      }
      animationToggle = requestAnimationFrame(getData);
    }

    function waveform() {
      $("#visualizer").children().remove();

      var frequencyData = new Uint8Array(50)

      var svgWidth = $(window).width();
      var svgHeight = $(window).height();

      var svg = d3.select('#visualizer').append('svg').attr('height', svgHeight/2).attr('width', svgWidth).attr('transform', "translate(0, " + svgHeight / 2 + ")");

      function getData() {
        requestAnimationFrame(getData);
        analyser.getByteFrequencyData(frequencyData);
        console.log(frequencyData);

        var xScale = d3.scale.linear()
            .range([0, svgWidth])
            .domain([0, numberOfPoints]);

        var yScale = d3.scale.linear()
            .range([svgHeight, 0])
            .domain([-1, 1]);

        var line = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d, i) { return yScale(d); });

        svg.selectAll('path')
          .data(frequencyData)
          .attr('d', line)
      }
      animationToggle = requestAnimationFrame(getData);
    }

    var viz = 1
    $('.play-button').click(function () {
        $(this).toggleClass('highlight')
    })

    $('.play-button').on("click", function(){
      if (viz == 1) {
        bar();
      }
      if (viz ==2) {
        circle();
      }
      if (viz == 3) {
        waveform();
      }
    });

    $('#bar').on("click", function(){
      bar();
      $(this).addClass('highlight')
      $('#circle').removeClass('highlight')
      viz = 1;
    });

    $('#circle').on("click", function(){
      circle();
      $(this).addClass('highlight')
      $('#bar').removeClass('highlight')
      viz = 2;
    });

});

var audioElement = document.getElementById("audioElement");
audioElement.loop = true;
function togglePlay() {
  return audioElement.paused ? audioElement.play() : audioElement.pause();
};

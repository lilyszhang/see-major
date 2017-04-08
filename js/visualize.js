$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();

  var audioElement = document.getElementById('audioElement');
  var source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  source.connect(audioCtx.destination);

  var animationToggle;

  function bar() {
      $("#visualizer").children().remove();
      var frequencyData = new Uint8Array(50);

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

         svg.selectAll('rect')
            .data(frequencyData)
            .attr('y', function(d) {
               return svgHeight - d;
            })
            .attr('height', function(d) {
               return d;
            })
            .attr('fill', function(d) {
               return 'rgb(255, '+ d +', 92)';
            });
      }
      animationToggle = requestAnimationFrame(getData);
    }

    function circle() {
      $("#visualizer").children().remove();
      var frequencyData = new Uint8Array(350);

      var svgWidth = $(window).width();
      var svgHeight = $(window).height();

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
          .range([300, 420]);

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

    /*function waveform() {
      $("#visualizer").children().remove();

      var frequencyBinCount = analyser.frequencyBinCount;
      var frequencyData = new Float32Array(frequencyBinCount);

      var svgWidth = $(window).width();
      var svgHeight = $(window).height();

      var numberOfPoints = Math.ceil(svgWidth / 2);

      var svg = d3.select('#visualizer').append('svg')
        .attr('height', svgHeight/2).attr('width', svgWidth).attr('transform', "translate(0, " + svgHeight / 2 + ")");

      function getData() {
        requestAnimationFrame(getData);
        //analyser.getByteFrequencyData(frequencyData);
        analyser.getFloatFrequencyData(frequencyData);

        var xScale = d3.scale.linear()
            .range([0, svgWidth])
            .domain([0, numberOfPoints]);

        var yScale = d3.scale.linear()
            .range([svgHeight, 0])
            .domain([-1, 1]);

        var line = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d); })
            .interpolate('basis');

        svg.select('path')
          .data(subsample(frequencyData))
          .attr('d', line)
          .attr('stroke', 'rgb(255,92,92)')
          .attr('stroke-width', 2);
      }

      function subsample(data) {
          var subsampledData = new Float32Array(numberOfPoints);
          for (var i = 0; i < numberOfPoints; i++) {
            subsampledData[i] = data[Math.floor(i / numberOfPoints * data.length)];
          }
          return subsampledData;
      }

      animationToggle = requestAnimationFrame(getData);
    }*/

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
      /*if (viz == 3) {
        waveform();
      }*/
    });

    $('#bar').on("click", function(){
      bar();
      $(this).addClass('highlight')
      $('#circle').removeClass('highlight')
      //$('#waveform').removeClass('highlight')
      viz = 1;
    });

    $('#circle').on("click", function(){
      circle();
      $(this).addClass('highlight')
      $('#bar').removeClass('highlight')
      //$('#waveform').removeClass('highlight')
      viz = 2;
    });

    var audioElement = document.getElementById("audioElement");

    $('#original').on("click", function() {
      var source = audioElement.src;
      $(this).addClass('highlight');
      $('#background').removeClass('highlight')
      audioElement.src = source.replace('bg', '');
      audioElement.load();
      audioElement.play();
    });

    $('#background').on("click", function() {
      var source = audioElement.src;
      $(this).addClass('highlight');
      $('#original').removeClass('highlight');
      $('#play').addClass('highlight');
      audioElement.src = source.replace(/(\.[\w\d_-]+)$/i, 'bg$1');
      audioElement.load();
      audioElement.play();
    });


    /*$('#waveform').on("click", function(){
      waveform();
      $(this).addClass('highlight')
      $('#bar').removeClass('highlight')
      $('#circle').removeClass('highlight')
      viz = 3;
    });*/

});

var audioElement = document.getElementById("audioElement");
audioElement.loop = true;
function togglePlay() {
  return audioElement.paused ? audioElement.play() : audioElement.pause();
};

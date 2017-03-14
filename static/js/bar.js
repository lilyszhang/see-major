//shape changes on each beat (librosa beat tracking)
//make shape that shows frequency more
//more contrast in peaks
//color contrast

//24 by 36
//mention packages
//next steps
//technical implementation
//screenshots


//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
$(document).ready(function () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser(); //AnalyserNode allows us to get frequency data

  //connect AnalyserNode to audio source
  var audioElement = document.getElementById('audioElement');
  var source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser); //connect output of audioElement to input of analyser
  source.connect(audioCtx.destination);

  var frequencyData = new Uint8Array(50); //where frequency data will be copied into

  var svgHeight = $(window).height();
  var svgWidth = $(window).width();
  var barPadding = '2';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, svgWidth);

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
           return 0.5* (svgHeight - d);
        })
        .attr('height', function(d) {
           return d*1.5;
        })
        .attr('fill', function(d) {
           return 'rgb(200, 50, ' + d + ')';
        });
  }
  getData();
});
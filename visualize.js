//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
$(document).ready(function () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser(); //AnalyserNode allows us to get frequency data

  //connect AnalyserNode to audio source
  var audioElement = document.getElementById('audioElement');
  var source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser); //connect output of audioElement to input of analyser
  source.connect(audioCtx.destination);

  var frequencyData = new Uint8Array(250); //where frequency data will be copied into

  function getData() {
     requestAnimationFrame(getData);
     analyser.getByteFrequencyData(frequencyData); //copy data into frequencyData array
     console.log(frequencyData)
  }
  getData();
});

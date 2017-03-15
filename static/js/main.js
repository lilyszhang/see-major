var audioElement = document.getElementById("audioElement");
audioElement.loop = true;
function togglePlay() {
  return audioElement.paused ? audioElement.play() : audioElement.pause();
};

var audioPicker = document.getElementById("audioSelect");
function updateSong() {
  var song = audioPicker.options[audioPicker.selectedIndex].value;
  if (song == "1") {
    audioElement.src = "/static/audio/kanye.mp3";
  }
  if (song == "2") {
    audioElement.src = '/static/audio/swift.wav';
  }
  audioElement.load();
}

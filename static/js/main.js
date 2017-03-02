var audioElement = document.getElementById("audioElement");
function togglePlay() {
  return audioElement.paused ? audioElement.play() : audioElement.pause();
};

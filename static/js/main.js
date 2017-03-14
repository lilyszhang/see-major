var audioElement = document.getElementById("audioElement");
audioElement.loop = true;
function togglePlay() {
  return audioElement.paused ? audioElement.play() : audioElement.pause();
};

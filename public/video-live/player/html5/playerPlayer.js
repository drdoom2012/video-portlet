/**
 *    Prototype used by playerMgr
 *    There are inherited prototypes playerShaka and playerHLS 
 * 
 */

var video_element = null;

function playerPlayer(video) {
if (!video){
    console.log("playerPlayer constructor - video must not be null");
  }
  video_element = video;
  this.lastSelectedQuality = 'auto';
  console.log("playerPlayer constructor - video-element created");
}


playerPlayer.prototype.init = function() {
  console.log("PLAYER INIT!!!!!!!!!!");//, player_mgr);
    video_element.addEventListener('timeupdate', function(event) { controls.onTimeUpdate(event); });
    video_element.addEventListener('progress', function(event) { controls.onBufferProgress(event); });
    video_element.addEventListener('ended', function(event) { player_mgr.onStreamEnd(); });
    video_element.addEventListener('loadeddata', function(event) {
    	playerShell.onLoadedData();
    	player_mgr.onStreamLoaded();
    });
    video_element.addEventListener('play', function(event) { player_mgr.onVideoPlayEvent(); });
    video_element.addEventListener('pause', function(event) { player_mgr.onVideoPausedEvent(); });
    video_element.addEventListener('waiting', function(event) { player_mgr.onVideoWaitingEvent(); });
    video_element.addEventListener('seeking', function(event) { player_mgr.onVideoSeekingEvent(); });
};

playerPlayer.prototype.onLoadedData = function() {
}

playerPlayer.prototype.play = function(){
  video_element.play();
};

playerPlayer.prototype.pause = function(){
  video_element.pause();
};

playerPlayer.prototype.unpause = function(){
  video_element.play();
};

playerPlayer.prototype.replay = function(){
  video_element.currentTime = 0;
  video_element.play();
  //console.log("shaka.js: replay -- not impled!!");
};

playerPlayer.prototype.setAutoPlay = function(on){
  console.log("playerPlayer.setAutoPlay", on);
  if (on){
    $(video_element).attr('preload', 'auto');
    $(video_element).attr('autoplay', '');
  } else {
    $(video_element).attr('preload', 'metadata');
    $(video_element).removeAttr('autoplay');
  }
};

playerPlayer.prototype.getVideoDuration = function() {
  return video_element.duration;
};

playerPlayer.prototype.breakOutOfPromise_ = function(fn) {
  return window.setTimeout.bind(window, fn, 0);
};

playerPlayer.prototype.onPlayerError_ = function(event, type, videoErrorCode, shakaCategory, shakaCode) {
  // player_mgr.invokeCallbackFunction('onHtml5PlayerError'); // neni nove podporovano
  console.log("player error:");
  console.log(event);
  player_mgr.scheduleVideoErrorScreen(true, type, videoErrorCode, shakaCategory, shakaCode);
};

playerPlayer.prototype.setQuality = function(value, maxBitrate){
	  this.setQualityInternal(value, maxBitrate);
	  this.lastSelectedQuality = value;
	  this.lastSelectedMaxBitrate = maxBitrate;
};

playerPlayer.prototype.setQualityInternal = function(value, maxBitrate){
};

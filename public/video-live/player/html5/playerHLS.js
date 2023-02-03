/**
 *  Prototype for playerHLS. Inherited from playerPlayer
 */

playerHLS.prototype = Object.create(playerPlayer.prototype);
playerHLS.prototype.constructor = playerHLS;
playerHLS.prototype.parent = playerPlayer.prototype;

function playerHLS(video) {
  console.log("playerHLS constructor - calling parent constructor");
  this.parent.constructor(video);
}

playerHLS.prototype.playerType = "HLS";

playerHLS.prototype.isShaka = false;

playerHLS.prototype.isHLS = true;

playerHLS.prototype.init = function() {
  this.parent.init();
  var thisPlayerHLS  = this;
  video_element.addEventListener('durationchange', ControlsFormatter.onSeekRangeChanged);
  video_element.addEventListener('error', function() { thisPlayerHLS.onHLSPlayerError(); });
};

playerHLS.prototype.onHLSPlayerError = function() {
	this.onPlayerError_(undefined, 'videoError', undefined, undefined, undefined);
}

playerHLS.prototype.onLoadedData = function() {
	// noop
}

playerHLS.prototype.stop = function(){
	this.unload();
};

playerHLS.prototype.playStream = function(streamUrl){
  console.log("Loading HLS stream from " + streamUrl);
  $(video_element).attr('src', streamUrl);
  $(video_element).load();
};

playerHLS.prototype.getVideoTracks = function(){
// HLS nema seznam videotracks	
	return undefined;
};

playerHLS.prototype.getAudioTracks = function() {
// HLS nema seznam audiotracks		
	return [ "cs" ];
};

playerHLS.prototype.setQualityInternal = function(value, maxBitrate){
// HLS nepodporuje nastavovani kvality - vzdy je auto
	return;
};

playerHLS.prototype.selectAudioTrack = function(id) {
// HLS nema seznam audio tracku, takze neni mozne vybirat
	return; 
}

playerHLS.prototype.getCurrentBandwidth = function() {
// HLS nepodporuje info o aktualni prehravane kvalite
	return;
};

playerHLS.prototype.unload = function() {
	  $(video_element).attr('src', '');
}

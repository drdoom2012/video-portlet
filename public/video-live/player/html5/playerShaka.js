
playerShaka.prototype = Object.create(playerPlayer.prototype);
playerShaka.prototype.constructor = playerShaka;
playerShaka.prototype.parent = playerPlayer.prototype;

function playerShaka(video) {
  console.log("playerShaka constructor - calling parent constructor");
  this.parent.constructor(video);
  this.polyfillsInstalled = false;
  this.streamCurrentlyLoading = false;  
}

playerShaka.prototype.playerType = "DASH";

playerShaka.prototype.isShaka = true;

playerShaka.prototype.isHLS = false;

playerShaka.prototype.init = function() {
  this.parent.init();
  if (!this.polyfillsInstalled) {
    shaka.polyfill.installAll();
    this.polyfillsInstalled = true;
  }
  this.shakaPlayer = new shaka.Player(video_element);
  console.log("init - shaka player created");
  var thisPlayerShaka = this;
  this.shakaPlayer.addEventListener('error', function(event) { thisPlayerShaka.onShakaPlayerError(event.detail); });
  this.shakaPlayer.addEventListener('adaptation', function() {
	  if (! thisPlayerShaka.streamCurrentlyLoading) {
		  player_mgr.updateAutoQualityInfo();
		  thisPlayerShaka.selectAudioForVideo();
	  }
  });
  
  window.setInterval(function() {
	  thisPlayerShaka.seekRangeCheck();
  }, 1000);
}

playerShaka.prototype.onShakaPlayerError = function(error) {
	this.onPlayerError_(error, 'shakaError', undefined, error.category, error.code);
}

playerShaka.prototype.seekRangeCheck = function() {
  var range = this.shakaPlayer.seekRange();
  if ((this.lastRangeStart != range.start) || (this.lastRangeEnd != range.end)) {
	  //console.log("SEEK RANGE CHANGED", range);
	  ControlsFormatter.onSeekRangeChanged(range);
  }
  this.lastRangeStart = range.start;
  this.lastRangeEnd = range.end;
};

playerShaka.prototype.onLoadedData = function() {
	// ulozime si informace o stopach - pri nastaveni restrikci Shaka skryje nevyhovujici stopy
	this.qualities = [];
	this.audioLanguages = [];
	this.audioQualityRange = {};
	this.streamCurrentlyLoading = false;
	this.shakaPlayer.getTracks().forEach(function(track) {
		if (track.type == 'video') {
			this.qualities.push({
				id: track.id,
				bandwidth: this.recomputeInvalidBandwidth(track.bandwidth)
			}); // nemuzeme ulozit rovnou track, protoze id se z nejakeho duvodu pozdeji meni
		} else if (track.type == 'audio') {
			var bandwidth = track.bandwidth;
			if (bandwidth == undefined) {
				bandwidth = 0; // hack kvuli divnym streamum, ktere hlasi bandwidth 0 a shaka to ma za undefined
			}
			var language = track.language;
			if ((language == 'und') || (language == undefined)) {
				language = 'cs';
			}
			var range = this.audioQualityRange[language];
			if (range == undefined) {
				this.audioLanguages.push(language);
				this.audioQualityRange[language] = {
						min: bandwidth,
						max: bandwidth
				}
			} else {
				range.min = Math.min(range.min, bandwidth);
				range.max = Math.max(range.max, bandwidth);
			}
			if (track.active) {
				this.currentAudioLanguage = language;
			}
		}
	}, this);
	
	this.qualities.sort(function(a, b) { return b.bandwidth - a.bandwidth; });
	
	console.log("Video qualities", this.qualities);
	console.log("Audio languages", this.audioLanguages);
	console.log("Audio quality ranges", this.audioQualityRange);
	console.log("Current audio language", this.currentAudioLanguage);
	
    this.selectAudioForVideo();
    
    this.seekRangeCheck();
}

playerShaka.prototype.recomputeInvalidBandwidth = function(bandwidth) {
	// IVYS-194 Nangu nekorektne reportuje bandwidth - nezapocitava audio
	if (bandwidth < 372000) {
		return bandwidth + 96000;
	} else {
		return bandwidth + 128000;
	}
}

playerShaka.prototype.stop = function(){
  if (typeof this.shakaPlayer != 'undefined'){
    this.shakaPlayer.unload();
  }
};

playerShaka.prototype.getCurrentBandwidth = function() {
	var videoTracks = this.getTracksOfType("video");
	for(var i = 0; i < videoTracks.length; i++) {
		if (videoTracks[i].active) {
//			console.log("Current bandwith", videoTracks[i].bandwidth);
			return this.recomputeInvalidBandwidth(videoTracks[i].bandwidth);
		}
	}
	return undefined;
};

playerShaka.prototype.getAudioTracks = function() {
    return this.audioLanguages;
};

playerShaka.prototype.playStream = function(streamUrl, startTime){
  console.log("Loading DASH stream from " + streamUrl);
  if (streamUrl == undefined) {
    console.log("STREAM not defined - ERROR!!");
//    console.trace();
  }
  // vypneme restrikce, v dalsim streamu by nemuselo byt mozne je dodrzet
  // playerMgr nam pozdeji zavola setQuality a tam je pripadne zase nastavime.
  this.shakaPlayer.configure({
	restrictions: {
		minVideoBandwidth: 0,
		maxVideoBandwidth: Infinity,
		minAudioBandwidth: 0,
		maxAudioBandwidth: Infinity
	}
  });
  this.streamCurrentlyLoading = true;
  var thisPlayerShaka = this;
  var loadPromise = this.shakaPlayer.load(streamUrl,startTime);
  loadPromise.then(undefined, function(err) {
	  thisPlayerShaka.onShakaPlayerError(err);
  });
};

playerShaka.prototype.getVideoTracks = function(){
	return this.qualities;
};

playerShaka.prototype.getTracksOfType = function(type) {
	return this.shakaPlayer.getTracks().filter(function(track) {
		return track.type == type;
	});
}

playerShaka.prototype.setQualityInternal = function(value, maxBitrate){
  var isAuto = (value == 'auto');
  var bandwidth = (isAuto && (maxBitrate != undefined)) ? maxBitrate * 1000 : Infinity;
  this.shakaPlayer.configure({
	  abr: {
		  enabled: isAuto
	  },
	  restrictions: {
		  maxVideoBandwidth: bandwidth
	  }
  });
  if (value != 'auto'){
      this.selectTrack("video", value);
  }
  
  this.selectAudioForVideo();
};

playerShaka.prototype.selectAudioTrack = function(language) {
    // TODO specialne osetrit "ad" parametr a "und" kod ve stope
	// prozatim nezvolime preferredAudioLanguage - stopa se zvoli automaticky vyberem streamu
	if (language == 'ad') {
		language = 'cs';
	}
	var restrictions = this.computeAudioRestrictions(language);
	this.shakaPlayer.configure({
		//preferredAudioLanguage: language
		restrictions: restrictions
	});
	this.currentAudioLanguage = language;
};

playerShaka.prototype.computeAudioRestrictions = function(language) {
	var videoBandwidth = this.getCurrentBandwidth();
	var audioBandwidth;
	var restrictions;
	if (videoBandwidth < 500000) {
		audioBandwidth = 96000;
	} else {
		audioBandwidth = 128000;
	}
	var range = this.audioQualityRange[language];
	
	if (range == undefined) {
		restrictions = {
			minAudioBandwidth: 0,
			maxAudioBandwidth: Infinity
		};
	} else {
		restrictions = {
			minAudioBandwidth: Math.min(audioBandwidth, range.max),
			maxAudioBandwidth: Math.max(audioBandwidth, range.min)
		};
	}
	console.log("Use audio restrictions:", restrictions);
	return restrictions;
}

playerShaka.prototype.selectAudioForVideo = function() {
	var restrictions = this.computeAudioRestrictions(this.currentAudioLanguage);
	
	var currentRestrictions = this.shakaPlayer.getConfiguration().restrictions;
	if (
		(currentRestrictions.minAudioBandwidth == restrictions.minAudioBandwidth) &&
		(currentRestrictions.maxAudioBandwidth == restrictions.maxAudioBandwidth)
	) {
		return;
	}
	
	this.shakaPlayer.configure({
		restrictions: restrictions
	});
}

playerShaka.prototype.selectTrack = function(type, id) {
	var tracks = this.getTracksOfType(type);
	tracks.forEach(function(track) {
		if (track.id = id) {
			this.shakaPlayer.selectTrack(track);
		}
	}, this);
}

playerShaka.prototype.unload = function() {
  this.shakaPlayer.unload();
};

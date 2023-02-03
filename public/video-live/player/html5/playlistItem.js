function PlaylistItem(isVast, param) {
  console.log("creating playlist item: ", isVast);
  this.isVast = isVast;
  if (isVast){
    this.vastUrl = param;
  } else {
    this.ctPlaylistItem = param;
    this.indexes = undefined;
    if (typeof this.ctPlaylistItem.subtitles == 'undefined'){
      this.ctPlaylistItem.subtitles = [];
    }
  }
  this.subtitleLoaders = [];
};

PlaylistItem.prototype.getId = function(){
  if (this.ctPlaylistItem){
    return this.ctPlaylistItem.id;
  } else {
	  return undefined;
  }
};

PlaylistItem.prototype.getGemiusParams = function() {
	if (this.ctPlaylistItem){
		return this.ctPlaylistItem.gemius;
	} else {
		return undefined;
	}
}

PlaylistItem.prototype.getAssetId = function(){
  if (this.ctPlaylistItem){
    return this.ctPlaylistItem.assetId;
  } else {
	  return undefined;
  }
};

PlaylistItem.prototype.getTitle = function(){
  if (this.ctPlaylistItem){
    return this.ctPlaylistItem.title;
  } else {
	  return undefined;
  }
};

PlaylistItem.prototype.getStreamUrl = function(streamId){
  return this.ctPlaylistItem ? this.ctPlaylistItem.streamUrls[streamId] : undefined;
};

PlaylistItem.prototype.hasStreamId = function(streamId) {
  return this.ctPlaylistItem ? (this.ctPlaylistItem.streamUrls[streamId] != undefined) : false;
}

PlaylistItem.prototype.hasAudioDescription = function(){
  return this.hasStreamId('audioDescription');
};

PlaylistItem.prototype.isLive = function(){
  if (this.isVast){
    return false;
  }
  return this.ctPlaylistItem.type == "LIVE" || this.ctPlaylistItem.type == 'live';
};

PlaylistItem.prototype.isVoD = function(){
  if (this.isVast){
    return false;
  }
  return this.ctPlaylistItem.type == "VOD" || this.ctPlaylistItem.type == 'vod';
};

PlaylistItem.prototype.getWidth = function(){
  if (this.isVast){
    return playlist.getWidth();
  }
  var width = this.ctPlaylistItem.width;
  if (typeof width != 'undefined'){
    var widths = ['1200', '960', '640', '480', '320', 1200, 960, 640, 480, 320];
    if (widths.indexOf(width) == -1){
      console.log("playlistItem.getWidth error: invalid width '" + width + "' of type " + typeof width + "; using default width 1200");
      width = 1200;
      this.ctPlaylistItem.width = 1200;
    }
    return width;
  }
};

PlaylistItem.prototype.getHeight = function(){
  return this.getWidth() * this.getAspect();
};

PlaylistItem.prototype.getAspect = function(){
  if (this.isVast){
    return 16.0/9;
  }
  var aspect = this.ctPlaylistItem.aspect || "";
  var vals = aspect.split(":");
  if (vals.length != 2){
    return 16.0/9;
  } else {
    return vals[0]/vals[1];
  }
};

PlaylistItem.prototype.getPreviewImageUrl = function(){
  if (this.ctPlaylistItem) {
    return this.ctPlaylistItem.previewImageUrl || playlist.getPreviewImageUrl();
  } else {
	  return playlist.getPreviewImageUrl();
  }
};

PlaylistItem.prototype.getPreviewTrackBaseUrl = function(){
  if (this.ctPlaylistItem) {
    return this.ctPlaylistItem.previewTrackBaseUrl;
  } else {
	  return undefined;
  }
};

PlaylistItem.prototype.getStartOffset = function(){
  if (this.isVast){
	  return 0;
  }
  if (typeof this.ctPlaylistItem.startOffset != 'undefined'){
    return parseInt(this.ctPlaylistItem.startOffset);
  } else {
    return 0;
  }
};

PlaylistItem.prototype.getEndOffset = function(){
  if (this.isVast){
	  return 0;
  }
  if (typeof this.ctPlaylistItem.endOffset != 'undefined'){
    return parseInt(this.ctPlaylistItem.endOffset);
  } else {
    return 0;
  }
};

PlaylistItem.prototype.getUrlStartOffset = function(){
  var result = this.urlStartOffset;
  if (result == undefined) {
	  result = 0;
  }
  return result;
};

PlaylistItem.prototype.getUrlEndOffset = function(){
  var result = this.urlEndOffset;
  if (result == undefined) {
	  result = 0;
  }
  return result;
};

PlaylistItem.prototype.getIndexes = function(){
  if (this.isVast) {
	  return [];
  }
  if (typeof this.indexes == 'undefined'){
    var indexesSource = this.ctPlaylistItem.indexes;
    this.indexes = [];
    if (indexesSource != undefined) {
      for (var i = 0; i < indexesSource.length; i++){
        var indexSource = indexesSource[i];
        var index = {};
        index.title = indexSource.title;
        index.time = parseInt(indexSource.time);
        index.imageUrl = indexSource.imageURL;
        this.indexes.push(index);
      }
    }
  }
  return this.indexes;
};

PlaylistItem.prototype.getSkipDelay = function(){
  if (this.isVast){
    return this.skipOffset;
  } else {
    return this.ctPlaylistItem.skipDelay;
  }
};

PlaylistItem.prototype.getClickThroughUrl = function() {
	return this.clickThroughUrl;
}

PlaylistItem.prototype.getSubtitlesInfo = function() {
	if (this.isVast) {
		return [];
	} else {
		return this.ctPlaylistItem.subtitles;
	}
}

PlaylistItem.prototype.getSubtitlesLoader = function(index) {
	return this.subtitleLoaders[index];
}

//vastovymu url mam vymenit klicove slovo flash za test a pak teprve poslat (vastu)
//zatim trackovani vubec neni implementovany (na jejich strane) a tudiz ho od nas nepredpokladaji 
//oba predchozi komentare viz issue 22
PlaylistItem.prototype.loadAndPlay = function(streamingProtocol, streamId, startTime){
//  console.trace();
  console.log("Loading streamId", streamId);
  player_mgr.showLoadingScreen();
  $(player_mgr.video).find('track').remove();//to by melo smazat existujici tracky
  
  this.remainingProgressEvents = [];
  this.nonProgressEvents = {};
  var subtitleLoaders = [];
  this.subtitleLoaders = subtitleLoaders;  
  
  if (this.isVast){
    //var url = this.vastUrl.replace('flash', 'test');//toto je pro testovaci potreby only!!
    //var url = this.vastUrl.replace(';;', ';test;');//toto je pro testovaci potreby only!!
    var url = this.vastUrl;
    var curItem = this;
    $.ajax(url, {
        beforeSend: false//toto disabluje security policy, ktera je pritomna ve strance
       })
      .success(function(data){
        if (typeof data == 'object'){
          console.log(data);
          console.log(data.VAST);
          console.log(curItem.isVast);
          var linearTag = $(data).find('Linear')[0];
          var skipOffset = (linearTag == undefined) ? 0 : curItem.parseVastTime(linearTag.getAttribute('skipoffset'));
          curItem.skipOffset = skipOffset;
          curItem.clickThroughUrl = $(data).find('ClickThrough').text().trim();
          if (curItem.clickThroughUrl == "") {
        	  curItem.clickThroughUrl = undefined;
          }

          var percentProgressEvents = {
        		  creativeView: 0,
        		  start: 0,
        		  firstQuartile: 25,
        		  midpoint: 50,
        		  thirdQuartile: 75
          };
          $(data).find('TrackingEvents > Tracking').each(function() {
        	  var event = this.getAttribute('event');
        	  var content = this.textContent.trim();
        	  var percentProgress = percentProgressEvents[event];
        	  if (percentProgress != undefined) {
        		  curItem.addProgressEvent('percent', percentProgress, content);
        	  } else if (event == 'progress') {
        		  var offset = this.getAttribute('offset');
        		  if ((offset != undefined) && (offset != '')) {
        			  if (offset.charAt(offset.length - 1) == '%') {
        				  curItem.addProgressEvent('percent', parseInt(offset), content);
        			  } else {
        				  curItem.addProgressEvent('seconds', curItem.parseVastTime(offset), content);
        			  }
        		  }
        	  } else {
        		  curItem.addNonProgressEvent(event, content);
        	  }
          });
          
          console.log('tracking events', curItem.remainingProgressEvents);
          console.log('tracking events', curItem.nonProgressEvents);

          var usableFile;
          var candidateFiles = $(data).find('MediaFile').toArray();
          for(var fileIndex = 0; fileIndex < candidateFiles.length; fileIndex++) {
        	var mediaFile = candidateFiles[fileIndex];
        	console.log("File ", fileIndex, " of ", candidateFiles.length, mediaFile);
            var streamUrl = $(mediaFile).text().trim();
            console.log('checking ', streamUrl);
            var playerTypeParam = curItem.parseParamFromUrl(streamUrl, 'playerType');
            if ((playerTypeParam == 'flash' && streamingProtocol == 'HLS') || (playerTypeParam == 'dash' && streamingProtocol == 'DASH')){
              console.log("playing advertisement");
              playerShell.playStream(streamUrl, startTime);
              usableFile = mediaFile;
              break;
            } else {
              console.log("playerType vs streamingProtocol mismatch; skipping", playerTypeParam, streamingProtocol);
            }
          }
          if (usableFile == undefined) {
        	console.log('no MediaFile with usable type found');
            player_mgr.playNextItem();
          }
        } else {
          console.log("empty vast response for url ", url, "; skipping");
          player_mgr.playNextItem();
        }
      })
      .error(function(err){
        console.log("Error loading vast response from ", url, "; skipping");
        player_mgr.playNextItem();
      });
  } else {
	this.ctPlaylistItem.subtitles.forEach(function(subtitlesTrack) {
		var loader = {
			status: 'loading',
			readyCallbacks: [],
			load: function() {
				console.log('Loading subtitles from', subtitlesTrack.url);
				$.ajax({
					url: subtitlesTrack.url,
			        beforeSend: false,
			        context: this,
					success: function(data) {
						var parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
						var cues = [];
						this.data = cues;
						parser.onregion = function(region) {};
						parser.oncue = function(cue) { cues.push(cue); };
						parser.onflush = function() {};
						parser.onparsingerror = function(e) {};
						parser.parse(data);
						parser.flush();
						
						this.status = 'ready';
						console.log('Subtitles loaded from', subtitlesTrack.url);
						this.fireReadyCallbacks();
					},
					error: function() {
						this.status = 'error';
						this.readyCallbacks = [];
						console.log('Subtitles load error:', subtitlesTrack.url);
				        player_mgr.logEvent('errors', 'subtitles_load');
					}
				});
			},
			callWhenReady: function(callback) {
				if (this.status == 'error') {
					return;
				}
				this.readyCallbacks.push(callback);
				if (this.status != 'loading') {
					this.fireReadyCallbacks();
				}
			},
			fireReadyCallbacks: function() {
				var toCall = this.readyCallbacks.splice(0, this.readyCallbacks.length);
				var data = this.data;
				toCall.forEach(function(callback) {
					callback.call(undefined, data);
				});
			}
		};
		
		loader.load();
		subtitleLoaders.push(loader);
	});

	//vyparsovat a ulozit hodnoty startOffset a endOffset ze streamUrl
    var streamUrl = this.getStreamUrl(streamId);
    this.urlStartOffset = this.parseIntParamFromUrl(streamUrl, 'startOffset', 0);
    this.urlEndOffset = this.parseIntParamFromUrl(streamUrl, 'endOffset', 0);
    console.log("url offsets: ", this.urlStartOffset, this.urlEndOffset);

    if (streamingProtocol == playerShell.playerType){
      console.log("loading stream " + streamId);
      playerShell.playStream(this.getStreamUrl(streamId, startTime));
    } else {
      console.log("Streamin protocol mismatch");
    }
  }
};

PlaylistItem.prototype.parseIntParamFromUrl = function(url, paramName, defaultValue) {
	var value = this.parseParamFromUrl(url, paramName);
	if (value == undefined) {
		return defaultValue;
	} else {
		return parseInt(value);
	}
}

PlaylistItem.prototype.parseParamFromUrl = function(url, paramName) {
	var queryMatch = /(\?[^#]*)/.exec(url);
	if (queryMatch == null) {
		return undefined;
	}
	var query = queryMatch[1];
	var paramMatch = new RegExp('(?:\\?|&)' + paramName + '=([^&]+)').exec(query);
	return (paramMatch == null) ? undefined : paramMatch[1];
}

PlaylistItem.prototype.parseVastTime = function(timestring) {
	if (timestring == undefined) {
		return 0;
	}
	var match = /^(\d\d):(\d\d):(\d\d)(?:\.(\d\d\d))?$/.exec(timestring);
	if (match == null) {
		return 0;
	}
	var result = 3600 * parseInt(match[1]) + 60 * parseInt(match[2]) + parseInt(match[3]);
	if (match[4] != undefined) {
		result += parseInt(match[4]) / 1000.0;
	}
	return result;
}

PlaylistItem.prototype.addProgressEvent = function(offsetUnit, offset, url) {
	this.remainingProgressEvents.push({
		offsetUnit: offsetUnit,
		offset: offset,
		url: url
	});
}

PlaylistItem.prototype.addNonProgressEvent = function(event, url) {
	this.nonProgressEvents[event] = url;
}

PlaylistItem.prototype.onProgress = function(currentTime, totalTime) {
	var thisItem = this;
	this.remainingProgressEvents = this.remainingProgressEvents.filter(function(event) {
		var eventTime;
		if (event.offsetUnit == 'percent') {
			eventTime = totalTime * (event.offset / 100.0);
		} else if (event.offsetUnit == 'seconds') {
			eventTime = event.offset;
		}
		
		if (currentTime >= eventTime) {
			thisItem.sendTrackingEvent(event.url);
			return false;
		} else {
			return true;
		}
	});

}

PlaylistItem.prototype.onEnded = function() {
	this.sendTrackingEvent(this.nonProgressEvents['complete']);
}

PlaylistItem.prototype.onMute = function() {
	this.sendTrackingEvent(this.nonProgressEvents['mute']);
}

PlaylistItem.prototype.onUnmute= function() {
	this.sendTrackingEvent(this.nonProgressEvents['unmute']);
}

PlaylistItem.prototype.onResume = function() {
	this.sendTrackingEvent(this.nonProgressEvents['resume']);
}

PlaylistItem.prototype.onFullscreen = function() {
	this.sendTrackingEvent(this.nonProgressEvents['fullscreen']);
}

PlaylistItem.prototype.onExitFullscreen = function() {
	this.sendTrackingEvent(this.nonProgressEvents['exitFullscreen']);
}

PlaylistItem.prototype.onSkip = function() {
	this.sendTrackingEvent(this.nonProgressEvents['skip']);
}

PlaylistItem.prototype.sendTrackingEvent = function(url) {
	if (url == undefined) {
		return;
	}
	console.log('launch event ', url);
	$.ajax(url, { beforeSend: false});
}


//****************************************************************/
//**********************  Globalni promenne  *********************/
//****************************************************************/

var player_mgr = new PlayerMgr();
var logger = null;
var controls = null;
var formatter = null;
var playlist = null;
var playerShell = null;

function PlayerMgr() {
  this.settings = null;
  this.version = "40.2";
  this.waitingForStream = false;
  this.currentItemIndex = 0;
  this.gemiusPlayerId = "player_" + Math.round(Math.random()*1000000);
}

//****************************************************************/
//************************  Inicializace  ************************/
//****************************************************************/

//nasledujici 3 metody jsou v podstate 1 spageta, umele rozdelena na 3 metody
//spojit do jedne spagety a okomentovat
PlayerMgr.prototype.init = function(mainShellSelector, settings, srcDirPath, newWindowData){
  console.log("PlayerMgr.init: start");
  
  player_mgr.videoErrorScreenTimerHolder = new TimerHolder(this.showErrorScreen);

  player_mgr.timeShiftOffset = settings.dvrBarDisableLastNSecs;
  if (player_mgr.timeShiftOffset == undefined) {
	  player_mgr.timeShiftOffset = 180; // 3 minuty 
  }
  player_mgr.timeShiftDuration = settings.dvrBarDuration;
  if (player_mgr.timeShiftDuration == undefined) {
	  player_mgr.timeShiftDuration = 10800; // 3 hodiny 
  }
  player_mgr.volumeBeforeMute = 100;
  player_mgr.isThisNewWindow = (newWindowData != undefined);
  player_mgr.newWindowData = newWindowData;
  var dir;
  if (typeof srcDirPath == 'undefined'){
    var jsFileLocation = $('script[src*=playerMgr]').attr('src');
    dir = jsFileLocation.substring(0, jsFileLocation.lastIndexOf("/") + 1);
    console.log("path: '" + dir + "'; path param was NOT present - using src dir of playerMgr");
  } else {
    dir = srcDirPath;
    console.log("path: '" + dir + "'; path param present");
  }

  var svgSprite = settings.svgSprite;
  if (svgSprite == undefined) {
	  svgSprite = "sprite.svg";
  }
  //load svg sprite
  $.ajax(dir + svgSprite, {beforeSend: false})
    .success(function(data){
      var div = document.createElement("div");
      if (typeof data == 'string'){
        div.innerHTML = data;
      } else {
        div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
      }
      $(div).css('display', 'none');
      document.body.insertBefore(div, document.body.childNodes[0]);
    });

  console.log("Settings:", settings);

  player_mgr.initHbbtv();

  player_mgr.mainShellId = mainShellSelector;
  var mainShell = $(mainShellSelector);  
  mainShell.empty();
  player_mgr.settings = settings;

  var defaultSettings = {
		  skinButtonForeground: '#b32025', //defaultni barva aktivnich ikon
		  indexLineColor: '#f0f300',
		  dvrBarElapsedTimeLineColor: '#b32025',
		  timeFontColor: '#ffffff',
		  skinColorIconPlayer: '#ffffff'
  };

  var gaTrackingId = player_mgr.settings.gaTrackingId;
  if (gaTrackingId == undefined) {
	  gaTrackingId = 'UA-63458229-1';
  }
  if (gaTrackingId != '') {
	  ga('create', gaTrackingId, 'auto', 'player');
  }

  var parameterizedCss = [ "param.css" ];
  if (player_mgr.settings.additionalCss) {
	  parameterizedCss.push(player_mgr.settings.additionalCss);
  }
  var parameterizedCssLoader = function() {
	  if (parameterizedCss.length == 0) {
		  console.log('all additional CSS files loaded');
		  return;
	  }
	  var cssName = parameterizedCss.shift();
	  console.log('loading additional CSS file:', cssName);
      $.ajax({
        url: dir + cssName,
        beforeSend: false,
        success:function(data){
      	  data = data.replace(/PARAM_(\w+)/g, function(string, paramName) {
      		 var paramValue = player_mgr.settings[paramName];
    		 if (paramValue == undefined) {
    			 paramValue = defaultSettings[paramName];
    		 }
    		 return paramValue;
    	  });
 		 // nacist nasledujici CSS
 		 parameterizedCssLoader.apply();
          $("head").append("<style>" + data + "</style>");
        }
      });
	  
  };
  parameterizedCssLoader.apply();

  $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', dir + 'index.css') );
  if (player_mgr.settings.uimode == 'full'/* && false*/){
    var playerHtmlString = videoPlayerHtmlString;
    $(player_mgr.mainShellId).css('overflow', 'hidden');
  } else if (player_mgr.settings.uimode == 'audio'/* || true*/){
    var playerHtmlString = audioPlayerHtmlString;
    $(player_mgr.mainShellId).css('overflow', 'visible');
  } else {
    console.log("flashvars.uimode not set");
    return;
  }
  var playerHtml = $.parseHTML ( playerHtmlString );
  var playerMainShellElement = $('<div/>', {'class': 'playerMainShell hiddenOverlay', 'tabindex': 1});
  playerMainShellElement.append(playerHtml);
  mainShell.append(playerMainShellElement);
  playerMainShellElement.focus();
  player_mgr.playerInserted();

  return {
    getPlayerAudioTrackList: function() {
    	var result = [];
    	player_mgr.getAudioTracks().forEach(function(item) {
    		result.push(item.language);
    	});
    	return result;
    },
    getPlayerSubtitleTrackList: function() {
    	var result = [];
    	player_mgr.getSubtitlesInfo().forEach(function(item) {
    		result.push(item.language);
    	});
    	return result;
    },
    getPlayerLevels: function() {
    	var result = [];
    	player_mgr.getQualityInfo().forEach(function(item) {
    		result.push(item.key);
    	});
    	return result;
    },
    setPlayerAudioTrack: function(langCode){
      return player_mgr.setAudioTrack(langCode, true);
    },
    setPlayerSubtitleTrack: function(langCode) {
    	return player_mgr.selectSubtitles(langCode, true);
    },
    setPlayerLevel: function(speedResolution){
      return player_mgr.setQuality(speedResolution);
    },
    getStreamPosition: function(){
      return player_mgr.getStreamPosition();
    },
    play: function() {
    	player_mgr.play(true);
    },
    pause: function() {
    	player_mgr.pause(true);
    },
    stop: function() {
    	player_mgr.stop(true);
    },
    seek: function(seekTime) {
      seekTime /= 1000;
      if (player_mgr.currentItem != undefined && player_mgr.currentItem.isLive()){
        if (player_mgr.isTimeshift){
          console.log('seek: ', player_mgr.getStreamRange().max + (seekTime + player_mgr.timeShiftOffset), ' against ', player_mgr.getStreamRange().max);
          player_mgr.seekTo(player_mgr.getStreamRange().max + (seekTime + player_mgr.timeShiftOffset));
        }
      } else {
        player_mgr.seekTo(seekTime);
      }
    },
    fullScreen: function(toFullScreen){
      if (toFullScreen != player_mgr.isFullScreen){
        player_mgr.toggleFullScreen(undefined, true);
      }
    },
    switchToLive: function(){
      if (player_mgr.currentItem != undefined && player_mgr.currentItem.isLive() && player_mgr.isTimeshift){
        player_mgr.switchTimeshift(false);
      }
    },
    switchToTimeshift: function(paused, position){
      if (player_mgr.currentItem != undefined && player_mgr.currentItem.isLive() && ! player_mgr.isTimeshift){
        player_mgr.switchTimeshift(true, paused, position);
      }
    },
    setAudioLevel: function(value) {
    	player_mgr.setVolume(value, true);
    },
    getCurrentPlaylistItem: function() {
    	return player_mgr.getCurrentItemCanonicalIndex();
    },
    setPlaylistItem: function(index) {
    	player_mgr.play_item(parseInt(index) + playlist.getPrerollItemCount(), false, undefined, 0);
    }
  }
};

PlayerMgr.prototype.initHbbtv = function() {
	this.availTVsInfo = [];
	this.selectedTvName = undefined;

	if (typeof Remote == 'function') {
		var hbbtv = new Remote(true, player_mgr.mobilePlayer ? 'Mobil' : 'PC');
		player_mgr.hbbtv = hbbtv;
		hbbtv.onConnected = function() { player_mgr.hbbtvOnConnected(); };
		hbbtv.onConnectError = function() { player_mgr.hbbtvOnConnectError(); };
		hbbtv.onDisconnected = function() { player_mgr.hbbtvOnDisconnected(); };
		hbbtv.onCommand = function(from, data) { player_mgr.hbbtvOnCommand(from, data); };
		hbbtv.onGetNewPairingId = function(pairingId) { player_mgr.hbbtvOnCommand(pairingId); };
		hbbtv.onPairDeviceResult = function(data) { player_mgr.hbbtvOnPairDeviceResult(data); };
		hbbtv.onUpdatePairedDeviceStatus = function(data) { player_mgr.onUpdatePairedDeviceStatus(data); };
	} else {
		player_mgr.hbbtv = undefined;
		console.log('HBBTV library NOT found');
	}
};

PlayerMgr.prototype.hbbtvOnConnected = function() {
	console.log('HBBTV connected');
	this.updateAvailTVs();
};

PlayerMgr.prototype.hbbtvOnConnectError = function() {
	console.log('HBBTV CONNECT ERROR');
	//this.hbbtv = undefined;
};

PlayerMgr.prototype.hbbtvOnDisconnected = function() {
	console.log('HBBTV DISCONNECTED');
	if (this.selectedTvName != undefined) {
		this.doDeactivateHbbTv();
	}
	//this.hbbtv = undefined;
	this.availTVsInfo = [];
	this.selectedTvName = undefined;
	formatter.formatHbbtv();
};

PlayerMgr.prototype.hbbtvOnCommand = function(from, data) {
	console.log('HBBTV command', from, data);
	if (this.selectedTvName == undefined) {
		console.log("HBBTV command IGNORED, not in HBBTV mode");
		return;
	}
	if (this.selectedTvName != from) {
		console.log("HBBTV command from'" + from + "' IGNORED, selected TV is", this.selectedTvName);
		return;
	}
	
	var auxData = data.data;
	
	switch(data.command) {
	case 'playvideo':
		console.log("HBBTV playvideo command is not supported by player");
		break;
		
	case 'pause':
		this.pause(false, true);
		break;
		
	case 'play':
		this.play(false, true);
		break;
		
	case 'stopvideo':
		if (auxData.videodata == undefined) {
			console.log("Ignoring stopvideo command withoute videodata");
		} else if (this.hbbtvPlayerCookie != auxData.videodata.exparam) {
			console.log('Ignoring stopvideo from another player');
		} else {
			this.doDeactivateHbbTv();
		}
		break;
		
	case 'seek':
		var position = auxData.position / 1000.0;
		this.seekTo(position, true);
		this.hbbtvAutoSwitchTimeshift();
		break;
		
	case 'live':
		this.switchTimeshift(false, undefined, undefined, true);
		break;
		
	case 'setquality':
		this.hbbtvSetQuality(auxData.quality);
		break;
		
	case 'setaudiostream':
		this.hbbtvSetAudiostream(auxData.audiostream);
		break;
		
	case 'setsubtitles':
		this.hbbtvSetSubtitles(auxData.subtitles);
		break;
		
	case 'skipad':
		console.log('HBBTV skipad not implemented');
		break;
	
	case 'playstate':
	case 'playstatechange':
		var videodata;
		if (auxData.videotype == 'AD') {
			videodata = auxData.addata;
		} else {
			videodata = auxData.videodata;
		}
		if (videodata != undefined) {
			if (videodata.duration != undefined) {
				this.lastKnownHbbtvDuration = videodata.duration / 1000.0;
			}
			if (videodata.position != undefined) {
				var position = videodata.position / 1000.0;
				this.storeHbbtvPosition(position, undefined);
			}
			if (videodata.playstate != undefined) {
				var playing;
				var wantPlay;
				switch (videodata.playstate) {
				case 1: // stav "playing" - jede video
					playing = true;
					wantPlay = true;
					break;
					
				case 0: // stav "stopped"
				case 2: // stav "paused"
				case 5: // stav "stopped"
					playing = false;
					wantPlay = false;
					break;
					
				case 3: // stav "buffering"
				case 4: // stav "buffering"
					playing = false;
					wantPlay = true;
				}
				if (wantPlay && (player_mgr.playerStatus == 'paused')) {
					this.play(false, true);
				} else if (!wantPlay && (player_mgr.playerStatus == 'playing')) {
					this.pause(false, true);
				}
				
				// ulozime stav prehravani zvlast, kvuli osetreni "buffering" stavu
				// (pri bufferingu zobrazime ikonu Pause a jsme v "playing" stavu, ale cas se nehybe)
				this.storeHbbtvPosition(undefined, playing);
			}
			
			if ((auxData.videotype == 'AD') && (videodata.skipSecs != undefined)) {
				if (!this.hbbtvSkipAdDisplayed) {
					controls.setupSkipOverlay(videodata.skipSecs);
					this.hbbtvSkipAdDisplayed = true;
				}
			} else {
				if (this.hbbtvSkipAdDisplayed) {
					controls.hideSkipOverlay();
					this.hbbtvSkipAdDisplayed = false;
				}
			}
			this.formatHbbtvSeekBarAndSkipAd();
			if (videodata.subtitles != undefined) {
				this.hbbtvSetSubtitles(videodata.subtitles);
			}
			if (videodata.audiostream != undefined) {
				this.hbbtvSetAudiostream(videodata.audiostream);
			}
			if (videodata.quality != undefined) {
				if (videodata.qualities != undefined) {
					this.maybeUpdateHbbtvQualitiesList(videodata.qualities, videodata.quality);
				}
				this.hbbtvSetQuality(videodata.quality);
			}
			
			if ((this.pendingHbbtvSeek != undefined) && ((videodata.playstate == 1) || (videodata.playstate == 2))) {
				this.sendHbbtvSeek(this.pendingHbbtvSeek);
				this.pendingHbbtvSeek = undefined;
			}
		}
		break;
		
	default:
		console.log('Unsupported HBBTV command', data.command);
	}
};

PlayerMgr.prototype.hbbtvSetSubtitles = function(index) {
	var language;
	if (index == 0) {
		language = 'cs';
	}
	if (language == this.selectedSubtitles) {
		return;
	}
	this.selectSubtitles(language, false, false, true);
}

PlayerMgr.prototype.maybeUpdateHbbtvQualitiesList = function(list, quality) {
	var thisPlayerMgr = this;
	var qualities = [];
	list.forEach(function(item) {
		qualities.push(item.replace(/^max/, ''));
	});
	var lastQualityNames = [];
	this.lastKnownHbbtvQualities.forEach(function(item) {
  		lastQualityNames.push(item.key);
	});
	if (qualities.join('-') != lastQualityNames.join('-')) {
		console.log('HBBTv qualities changed');
		this.lastKnownHbbtvQualities = [];
		qualities.forEach(function(item) {
			thisPlayerMgr.lastKnownHbbtvQualities.push({id: item, key: item, resolution: item});
		});
		this.currentQuality = quality;
		formatter.formatQualitySelector();
	}
}

PlayerMgr.prototype.hbbtvSetQuality = function(quality) {
	quality = quality.replace(/^max/, '');
	if (quality == this.currentQuality) {
		return;
	}
	this.setQuality(quality, true);
}

PlayerMgr.prototype.hbbtvSetAudiostream = function(stream) {
	var language;
	if (stream == 'main') {
		language = 'cs';
	} else if (stream == 'audioDescription') {
		language = 'ad';
	} else {
		return;
	}
	if (language == this.currentAudioTrack) {
		return;
	}
	this.setAudioTrack(language, false, true);
}

PlayerMgr.prototype.onGetNewPairingId = function(pairingId) {
	console.log('Unsolicited HBBTV pairing ID', pairingId);
};

PlayerMgr.prototype.onPairDeviceResult = function(data) {
	console.log('HBBTV pair device result', data);
	this.updateAvailTVs();
};

PlayerMgr.prototype.onUpdatePairedDeviceStatus = function(data) {
	console.log('HBBTV paired device status', data);
	this.updateAvailTVs();
};

PlayerMgr.prototype.updateAvailTVs = function(data) {
  var info = this.hbbtv.getPairedOnline();
  console.log('getPairedOnline result:', info);
  this.availTVsInfo = [];
  for (var key in info) {
	  if (info.hasOwnProperty(key)) {
	    this.availTVsInfo.push(key);
	  }
  }
  console.log('List of paired devices:', this.availTVsInfo);
  if ((this.selectedTvName != undefined) && this.availTVsInfo.indexOf(this.selectedTvName) == -1) {
	  this.doDeactivateHbbTv();
  }
  formatter.formatHbbtv();
}

PlayerMgr.prototype.removeHbbtvDevice = function(tvName) {
	console.log("Removing HBBTv device", tvName);
	this.hbbtv.removePairedDevice(tvName);
	this.updateAvailTVs();
}

PlayerMgr.prototype.activateHbbTv = function(tvName) {
	console.log('Activating HBBTv on device:', tvName);
	if (player_mgr.playerStatus == 'paused'){
		this.play(true); // HBBTv neumi zacinat v pauze
	}
	if (this.currentItem.isVast) {
		this.lastKnownHbbtvPosition = 0;
		this.lastKnownHbbtvDuration = 0;
		this.lastKnownHbbtvStartOffset = 0;
	} else if (this.currentItem.isLive()) {
		if (this.isTimeshift) {
			this.lastKnownHbbtvPosition = this.getStreamPosition();
		} else {
			this.lastKnownHbbtvPosition = 0;
		}
		this.lastKnownHbbtvDuration = this.timeShiftDuration;
		this.lastKnownHbbtvStartOffset = 0 - (this.timeShiftDuration + this.timeShiftOffset);
	} else {
		var range = this.getStreamRange();
		this.lastKnownHbbtvPosition = this.getStreamPosition();
		this.lastKnownHbbtvDuration = range.max - range.min;
		this.lastKnownHbbtvStartOffset = range.min;
	}
	this.lastKnownHbbtvPlaying = false;
	
	this.lastKnownHbbtvAudioTracks = this.getAudioTracks();
	this.lastKnownHbbtvSubtitles = this.getSubtitlesInfo();
	this.lastHbbtvTimestamp = new Date().getTime();
	
	this.hbbtvSkipAdDisplayed = false;
	controls.hideSkipOverlay();
	
	this.selectedTvName = tvName;
	
	// obvykle HBBTv kvality, upravi se pri pristim playstate
	var defaultHbbtvQualities = [ 'max288p', 'max404p', 'max576p', 'max720p' ];
	this.currentQuality = '720p';
	this.lastKnownHbbtvQualities = [];
	this.maybeUpdateHbbtvQualitiesList(defaultHbbtvQualities);

	this.formatHbbtvSeekBarAndSkipAd();
	formatter.formatHbbtv();
	this.sendGemiusEvent('stopped');
    playerShell.unload();

    var playVideoCommand = {};
    this.hbbtvPlayerCookie = Math.floor(Math.random() * 1000000);
    playVideoCommand.exparam = this.hbbtvPlayerCookie;
    if (this.currentItem.isVast) {
    	playVideoCommand.id = playlist.getPlaylistItem(0).getAssetId();
    } else {
    	playVideoCommand.id = this.currentItem.getAssetId();
    }
    if (!this.currentItem.isVast) {
    	playVideoCommand.adprerolldisable = true;
    	playVideoCommand.track = this.getCurrentItemCanonicalIndex();
    }
	if (this.currentAudioTrack != 'cs') {
		this.populateHbbtvSetAudioStreamCommand(playVideoCommand, this.currentAudioTrack);
	}
	if (this.selectedSubtitles != undefined) {
		this.populateHbbtvSetSubtitlesCommand(playVideoCommand, this.selectedSubtitles);
	}
	
    if (this.lastKnownHbbtvPosition != 0) {
    	this.pendingHbbtvSeek = this.lastKnownHbbtvPosition;
    } else {
    	this.pendingHbbtvSeek = undefined;
    }
    
    this.sendHbbtvCommand('playvideo', playVideoCommand);
}

PlayerMgr.prototype.formatHbbtvSeekBarAndSkipAd = function() {
  var start = this.lastKnownHbbtvStartOffset;
  var end = start + this.lastKnownHbbtvDuration;
  var position = this.computeHbbtvPosition();
  formatter.updateSeekBarRange(start, end);
  controls.updateSeekBar(position);
  controls.updateSkipOverlay(position);
}

PlayerMgr.prototype.deactivateHbbTv = function() {
	this.doDeactivateHbbTv();
}

PlayerMgr.prototype.doDeactivateHbbTv = function() {
	console.log('Deactivating HBBTv on device:', this.selectedTvName);
	var position = this.computeHbbtvPosition(); // spocitame jeste pred deaktivaci, aby byl vypocet platny
	this.selectedTvName = undefined;
	formatter.formatHbbtv();
	
	if (this.currentItem == undefined) {
		this.onPlaylistEnd();
	} else {
		if (this.currentItem.isLive()) {
			this.switchTimeshift(false, true);
			player_mgr.pauseTimestamp = new Date().getTime();
		} else {
			this.play_item(this.currentItemIndex, false, true, position);
		}
	}
}

PlayerMgr.prototype.sendHbbtvCommand = function(command, data) {
	if (data == undefined) {
		data = {};
	}
	var commandObject = {
		command: command,
		data: data
	};
	console.log("Sending HBBTv command to", this.selectedTvName, commandObject);
	this.hbbtv.sendCommand(this.selectedTvName, commandObject);
}

PlayerMgr.prototype.sendHbbtvSeek = function(position) {
	this.storeHbbtvPosition(position, undefined);
	this.sendHbbtvCommand('seek', { position: (position * 1000) });
}

PlayerMgr.prototype.sendHbbtvSetAudioStreamCommand = function(value) {
	var data = {};
	this.populateHbbtvSetAudioStreamCommand(data, value);
	this.sendHbbtvCommand('setaudiostream', data);
}

PlayerMgr.prototype.populateHbbtvSetAudioStreamCommand = function(data, value) {
	var hbbTvStream = (value == 'ad') ? 'audioDescription' : 'main';
	data.audiostream = hbbTvStream;
}

PlayerMgr.prototype.sendHbbtvSetSubtitlesCommand = function(language) {
	var data = {};
	this.populateHbbtvSetSubtitlesCommand(data, language);
	this.sendHbbtvCommand('setsubtitles', data);
}

PlayerMgr.prototype.populateHbbtvSetSubtitlesCommand = function(data, language) {
	var hbbtvSubtitles = (language == undefined) ? -1 : 0;
	data.subtitles = hbbtvSubtitles;
}

PlayerMgr.prototype.pairHbbTvDevice = function(pairId) {
	if (this.hbbtv != undefined) {
		this.hbbtv.pairDevice(pairId);
	}
}

PlayerMgr.prototype.hbbtvOnPairDeviceResult = function(data) {
	if (data.result == 'ok') {
		controls.closeSettings();
		this.updateAvailTVs();
	} else {
		// FIXME jak zobrazit chybu?
	}
}

PlayerMgr.prototype.computeHbbtvPosition = function() {
	var result = parseFloat(this.lastKnownHbbtvPosition);
	var sinceTimestamp = (new Date().getTime() - this.lastHbbtvTimestamp) / 1000.0;
	if (this.currentItem.isLive()) {
		if (!this.lastKnownHbbtvPlaying) {
			// LIVE - jsme v pauze, odecitame cas
			result -= sinceTimestamp;
		}
	} else {
		if (this.lastKnownHbbtvPlaying) {
			// VOD - nejsme v pauze, pricitame cas
			result += sinceTimestamp;
		}
	}
	return result;
}

PlayerMgr.prototype.storeHbbtvPosition = function(value, playing) {
	if (value == undefined) {
		value = this.computeHbbtvPosition();
	}
	this.lastKnownHbbtvPosition = value;
	if (playing != undefined) {
		this.lastKnownHbbtvPlaying = playing;
	}
	this.lastHbbtvTimestamp = new Date().getTime();
}

PlayerMgr.prototype.playerInserted = function(){
  console.log("player inserted start");
  player_mgr.video = $(player_mgr.mainShellId + ' #video')[0];
  player_mgr.setupLogLevel();
  player_mgr.log(player_mgr, INFO, "init");

  player_mgr.playerStatus = 'initialized';
  player_mgr.isPC = (player_mgr.settings.mobilePlayer != true);

  if (!player_mgr.settings.autoPlay || !player_mgr.isPC) {
      $(player_mgr.mainShellId + " #overlay #playBtn").addClass('autoPlay');
      $(player_mgr.mainShellId + " #overlay #customPlayBtn").addClass('autoPlay');
      player_mgr.autoPlayDisplayed = true;
      console.log("autoPlay displayed");
  } else {
      player_mgr.autoPlayDisplayed = false;
  }

  console.log("video: ", player_mgr.video);


  logger = player_mgr;

  
  //shaka.log.setLevel(shaka.log.Level.NONE);
  //vytvorit controls tridu
  //controls trida si precte vsechny HTML elementy, ktery budou zpocatku
  //vsechny neviditelny
  controls = new Controls();
  formatter = new ControlsFormatter();
  formatter.isSeekBarActive = false;

  // playerShell  - podle typu streamu je bud playerShaka, nebo playerHLS
  if (player_mgr.settings.streamingProtocol == "DASH"){
    playerShell = new playerShaka(player_mgr.video);
  } else {
    playerShell = new playerHLS(player_mgr.video);
  }
  
  playerShell.init();

  //vytvorit playlist tridu
  playlist = new devterium_ct_playlist();
  if (player_mgr.settings.playlist){
    playlist.init(player_mgr.settings.playlist);
  }

  var volume = parseInt(player_mgr.getCookie("volume"));
  if (! isNaN(volume)){
    console.log("setting volume from cookies", volume);
    player_mgr.setVolume(volume, true, true);
  } else {
    console.log("not setting volume from cookies", volume);
  }

  $(window).resize(function() { formatter.checkResize(); });
  
  window.setInterval(function() {
	  formatter.checkResize();
	  player_mgr.checkDeeplinking();
	  player_mgr.sendCurrentGemiusState();
  }, 200);
  
  formatter.setContainerSize();
  formatter.format();

  $(player_mgr.mainShellId).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(event) { player_mgr.onFullScreenToggle(); });
  
  $(player_mgr.mainShellId + ' #video').bind('webkitbeginfullscreen', function(event) {player_mgr.onFullScreenOn();});
  $(player_mgr.mainShellId + ' #video').bind('webkitendfullscreen', function(event) {player_mgr.onFullScreenOff();});

  
  player_mgr.on_start();
};

PlayerMgr.prototype.on_start = function(){
  console.log("Onstart: settings",player_mgr.settings);

  //prepsat defaultni, resp. z cookies nactenou hodnotu hlasitosti,
  //pokud to playlist vyzaduje
  if (player_mgr.settings.mute || player_mgr.settings.mute == "true"){
    player_mgr.setVolume(0, true, true);
  }

  if (player_mgr.settings.controlsHideable || player_mgr.settings.controlsHideable == "true"){
    player_mgr.hideControlsDelay = parseInt(player_mgr.settings.hideControlsDelayNormal);
  }
  console.log("hide controls delay set to " + player_mgr.hideControlsDelay);

  if (typeof player_mgr.settings.playlistURL != 'undefined' && player_mgr.settings.playlistURL != ""){
    player_mgr.loadPlaylistUrl(player_mgr.settings.playlistURL, player_mgr.on_playlist_loaded);
  } else if (typeof player_mgr.settings.playlist != 'undefined'){ 
    //jQuery.extend(true, player_mgr.settings, loadedPlaylist.setup);
    player_mgr.on_playlist_loaded();
  } else {
    console.log("ERROR: no playlist");
    console.log("playlistURL: ", player_mgr.settings.playlistURL);
    console.log("settings: ", player_mgr.settings);
    player_mgr.showErrorScreen(false, 'noPlaylist');
    return;
  }

  if (player_mgr.settings.editMode || player_mgr.settings.editMode == "true"){
    player_mgr.editMode = true;
    player_mgr.previousItemsTotalTime = 0;
    controls.showEditModeShell();
  }

  if (player_mgr.settings.skinVolumeActive){
    controls.setSkinVolumeActive(player_mgr.settings.skinVolumeActive);
  }
  if (player_mgr.settings.indexLineColor){
    controls.setIndexLineColor(player_mgr.settings.indexLineColor);
  } else {
    controls.setIndexLineColor('#f0f300');//defaultni barva indexu
  }
  if (player_mgr.settings.iconPlayPictureURL){
    controls.useCustomPlayIcon(player_mgr.settings.iconPlayPictureURL);
  } else {
    controls.useSystemPlayIcon();
  }

  setInterval(function(){
    if (! player_mgr.isLoading){
      player_mgr.saveCurrentPosition();
    }
  }, 5000);

  player_mgr.startTimeTick();
  
  player_mgr.performLiveTsChanger = false;
};

//****************************************************************/
//*********************  Logovani GA a Gemius ********************/
//****************************************************************/

PlayerMgr.prototype.logEvent = function(category, action) {
  player_mgr.logEventGA(category, action);

  //tady zavolat player_mgr.log(), coz je interni logovani (na konzoli)
  console.log("Log", category, action);
};

PlayerMgr.prototype.logEventGA = function(category, action) {
    //console.log("SENDING GA EVENT: " + category + "-" + action);
	if (this.settings.gaTrackingId == '') {
		return;
	}
	var prefix;
	if ((this.settings.gaPrefix != undefined) && (this.settings.gaPrefix != '')) {
		prefix = this.settings.gaPrefix;
	} else {
		prefix = 'html';
	}
    ga('player.send', 'event', prefix + '-' + category, action, (this.isPC ? 'desktop' : 'mobile'));
};

PlayerMgr.prototype.initializeGemius = function() {
  this.gemiusOpen = false;

  if ((typeof gemiusStream == 'undefined') || (typeof gemiusStream.newStream != 'function')) {
	  console.log("Gemius library not available");
	  return;
  }
  var mainGemiusParams = playlist.getGemius();
  if (mainGemiusParams == undefined) {
	  console.log("No gemius section in playlist");
	  return;
  }
  var gemiusParams = this.currentItem.getGemiusParams();
  if (gemiusParams == undefined) {
	  console.log("No gemius section in the current playlist item");
	  return;
  }
  
  this.gemiusMaterialIdentifier = gemiusParams.ID;

  var totalTime;
  if (this.currentItem.isLive()) {
	  totalTime = -1;
  } else {
	  var range = this.getStreamRange();
	  totalTime = range.max - range.min;
  }
  
  var customPackage = [];
  for (var property in gemiusParams) {
	  if (!gemiusParams.hasOwnProperty(property)) {
		  continue;
	  }
	  if (property == 'ID') {
		  continue;
	  }
	  var value = gemiusParams[property];
	  if ((value == undefined) || (value == '')) {
		  continue;
	  }
	  
	  customPackage.push({name: property, value: value});
  }

  console.log("Opening Gemius stream", this.gemiusPlayerId, this.gemiusMaterialIdentifier, totalTime, customPackage,
		  [], mainGemiusParams.IDENTIFIER, mainGemiusParams.HITCOLLECTOR, []);
  try {
	  gemiusStream.newStream(this.gemiusPlayerId, this.gemiusMaterialIdentifier, totalTime, customPackage,
			  [], mainGemiusParams.IDENTIFIER, mainGemiusParams.HITCOLLECTOR, []);
  } catch(err) {
	  console.log("Error opening Gemius stream", err);
  }
  
  this.gemiusOpen = true;
  this.gemiusCompleted = false;
};

PlayerMgr.prototype.gemiusStreamEnded = function(){
  if (!this.gemiusOpen) {
	  return;
  }
  if (this.gemiusCompleted) {
	  return;
  }

  console.log("Closing Gemius stream", this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime());
  try {
	  gemiusStream.closeStream(this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime());
  } catch(err) {
	  console.log("Error closing Gemius stream", err);
  }
  
  this.gemiusOpen = false;
};

PlayerMgr.prototype.sendGemiusEvent = function(eventType){
  if (!this.gemiusOpen) {
	  return;
  }

  console.log("Sending Gemius event", this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime(), eventType);
  try {
	  gemiusStream.event(this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime(), eventType);
  } catch(err) {
	  console.log("Error sending Gemius event", err);
  }
  
  if (eventType == 'complete') {
	  this.gemiusCompleted = true;
  }
  this.lastGemiusEventType = eventType;
};

PlayerMgr.prototype.sendCurrentGemiusState = function() {
	if (this.video.readyState == 4) {
		// ready
		if (this.video.paused) {
			switch(this.lastGemiusEventType) {
			case 'playing':
			case 'buffering':
			case 'seekingStarted':
				this.sendGemiusEvent('paused');
				break;
			case 'paused':
				//console.log('still paused');
				break;
			default:
				//console.log('other pause state');
			}
		} else {
			switch(this.lastGemiusEventType) {
			case 'paused':
			case 'stopped':
			case 'buffering':
			case 'seekingStarted':
				this.sendGemiusEvent('playing');
				break;
			case 'playing':
				//console.log('still playing');
				break;
			default:
				//console.log('weird playing state');
			}
		}
	} else {
		// buffering
		switch(this.lastGemiusEventType) {
		case 'playing':
		case 'paused':
		case 'seekingStarted':
			this.sendGemiusEvent('buffering');
			break;
		case 'buffering':
			//console.log('still buffering');
			break;
		default:
			//console.log('other buffering state');
		}
	}
}

//****************************************************************/
//********************* playlist loading  ************************/
//****************************************************************/

PlayerMgr.prototype.loadPlaylistUrl = function(playlistUrl, onSuccess){
  if (typeof playlistUrl !== 'undefined'){
	this.currentItemIndex = undefined;
	this.currentItem = undefined;
    $.ajax(playlistUrl)
	.done(function(data) {
          console.log("playlist loaded",data);
	  try{
            if (typeof data == 'string'){
	      var loadedPlaylist = JSON.parse(data);
            } else {
              var loadedPlaylist = data;
            }
	  }catch(err){
	    console.log("error parsing playlist from ", playlistUrl);
	    console.log("Catch error", err);
	    player_mgr.showErrorScreen(false, 'invalidPlaylist');
	    return;
	  }
          jQuery.extend(true, player_mgr.settings, loadedPlaylist.setup);
          console.log("loadPlaylist success:", loadedPlaylist);
          playlist.init(loadedPlaylist);
	  onSuccess();
	}).fail(function(){
	  console.log("loading playlist from url: '" , playlistUrl, "' failed");
	  player_mgr.showErrorScreen(false, 'playlistNotFound');
	});
  }
};

PlayerMgr.prototype.on_playlist_loaded = function(){
  console.log("playlist LOADED");
  player_mgr.playerStatus = 'loaded';
  if (player_mgr.editMode){
    player_mgr.previousItemsTotalTime = 0;
  }
  console.log("getting first item");
  var posterUrl = playlist.getPreviewImageUrl();
  if (typeof posterUrl != 'undefined' && playerShell.isShaka){
	  player_mgr.video.setAttribute('poster', posterUrl);
//	  FIXME: Udelat rucni nacteni posteru pro HLS platformu (safari nepodporuje crossorigin policaty) 
  }
  player_mgr.isTimeshift = false;
 
  if (player_mgr.isThisNewWindow){
	player_mgr.positionCookieKey = player_mgr.newWindowData.positionCookieKey;
	player_mgr.positionCookie = player_mgr.newWindowData.positionCookie;
    player_mgr.invokePlayCallbackOnStreamLoaded = false;
    var playlistItemIndex = player_mgr.newWindowData.playlistItemIndex;
    if (playlistItemIndex != undefined) {
    	player_mgr.play_item(playlistItemIndex, player_mgr.newWindowData.useTimeshift, player_mgr.newWindowData.shouldPauseNewWindow, player_mgr.newWindowData.startTime);
    } else {
    	player_mgr.play_item(0, false, player_mgr.autoPlayDisplayed);
    }
  } else {
    var audioTrackCookie = player_mgr.getCookie("audioTrack");
    player_mgr.currentAudioTrack = audioTrackCookie;
    
    player_mgr.computePositionCookieKey();
    player_mgr.allocatePositionCookie();

    player_mgr.invokePlayCallbackOnStreamLoaded = true;
    if (!player_mgr.attemptCookiePositioning(0, player_mgr.autoPlayDisplayed)) {
      player_mgr.play_item(0, false, player_mgr.autoPlayDisplayed);
    }
  }
};

PlayerMgr.prototype.attemptCookiePositioning = function(atItem, paused) {
	if (this.getItemCanonicalIndex(atItem) != 0) {
		console.log("Not at first regular item, cookie positioning skipped");
		return false;
	}
	var cookieValue = this.getCookie(this.positionCookie);
	if (cookieValue == '') {
		console.log("No position cookie stored");
		return false;
	}
	var cookieData = this.parsePositionCookie(cookieValue);
	if (cookieData.item >= playlist.getMainPlaylistItemCount()) {
		console.log("Cookie item " + cookieData.item + " does not exist");
		return false;
	}
	if (playlist.getPlaylistItem(cookieData.item).isLive()) {
		console.log("Ignoring position cookie - item #" + cookieData.item + " is LIVE");
		return false;
	}
	console.log("Position from cookie: item=" + cookieData.item + " time=" + cookieData.time + ", paused=" + paused);
	this.throwAwayDeeplinkingTarget();
	this.play_item(playlist.getPrerollItemCount() + cookieData.item, false, paused, cookieData.time);
	return true;
}
//****************************************************************/
//************** zobrazovani jednotlivych screen  ****************/
//****************************************************************/

PlayerMgr.prototype.showScreen = function(screenName) {
    var shell = $(player_mgr.mainShellId + ' .playerMainShell');
	var screens = [ 'loading', 'video', 'error', 'nextInSeries' ];
	screens.forEach(function(item) {
		var className = item + 'MainScreenActive';
		if (item == screenName) {
			shell.addClass(className);
		} else {
			shell.removeClass(className);
		}
	});
	
	if (screenName != 'error') {
		this.errorScreenDisplayed = false;
		if (this.errorCallbackInvoked) {
			window[player_mgr.settings.errorCallbackStatus].call(this);
		  	this.errorCallbackInvoked = false;
		}
	}
	this.videoErrorScreenTimerHolder.cancel();
};

PlayerMgr.prototype.showLoadingScreen = function(){
  player_mgr.showScreen('loading');
  player_mgr.isLoading = true;
  var size = Math.min(formatter.playerWidth, formatter.playerHeight) / 30;
  $(player_mgr.mainShellId + ' #loadingOverlay #loadingAnimationCircle').css('width', size + 'px');
  $(player_mgr.mainShellId + ' #loadingOverlay #loadingAnimationCircle').css('height', size + 'px');
};

PlayerMgr.prototype.showVideoScreen = function(){
  player_mgr.showScreen('video');
  player_mgr.isLoading = false;
};

PlayerMgr.prototype.scheduleVideoErrorScreen = function() {
	if (this.videoErrorScreenTimerHolder.isScheduled()) {
		console.log("Error screen already scheduled");
	} else {
		this.videoErrorScreenTimerHolder.setTimeout(500, this, arguments);
	}
}
PlayerMgr.prototype.showErrorScreen = function(logGAEvent, type, videoErrorCode, shakaCategory, shakaCode){
  if ((player_mgr.currentItem != undefined) && player_mgr.currentItem.isVast) {
	  // neobtezujeme se s error screen a preskocime na dalsi polozku
	  console.log('no error screen for VAST');
	  player_mgr.playNextItem();
	  return;
  }
  if (this.errorScreenDisplayed) {
	  console.log('error screen already displayed');
	  return;
  }
  this.errorScreenDisplayed = true;
  var showScreen;
  if (player_mgr.settings.errorCallbackStatus != undefined) {
	  showScreen = window[player_mgr.settings.errorCallbackStatus].call(this, type, videoErrorCode, shakaCategory, shakaCode);
      player_mgr.errorCallbackInvoked = true;
  } else {
	  showScreen = true;
  }
  if (showScreen) {
	  player_mgr.showScreen('error');
  }
  
  console.log("Error occured - Error sceen displayed", logGAEvent, type, videoErrorCode, shakaCategory, shakaCode);
//  console.trace();
  if (logGAEvent) {
	player_mgr.logEvent('errors', 'video_load');
  }
};

PlayerMgr.prototype.showNextInSeriesScreen = function(){
  player_mgr.showScreen('nextInSeries');
  player_mgr.isLoading = false;
};

PlayerMgr.prototype.play_item = function(itemIndex, useTimeshift, paused, startTime){
  // zavreme Gemius stream, pokud jsme nejaky meli
  player_mgr.gemiusStreamEnded();
  
  player_mgr.videoStartTime = startTime;
  var playlist_item = playlist.getItem(itemIndex);
  if (playlist_item){
    var adStreamId, streamId;
    if (useTimeshift) {
      streamId = 'timeshift';
      if (player_mgr.currentAudioTrack == 'ad') {
        adStreamId = 'audioDescriptionTimeshift';
      }
    } else {
      streamId = 'main';
      if (player_mgr.currentAudioTrack == 'ad') {
        adStreamId = 'audioDescription';
      }
    }
    if (adStreamId != null) {
      console.log('Checking adStreamId ', adStreamId, ': ', playlist_item.hasStreamId(adStreamId));
      if (playlist_item.hasStreamId(adStreamId)) {
        streamId = adStreamId;
      } else {
        player_mgr.currentAudioTrack = 'cs';
      }
    }
 
    player_mgr.currentItemIndex = itemIndex;
    player_mgr.currentItem = playlist_item;
    player_mgr.isTimeshift = useTimeshift;
    formatter.setContainerSize(); // srovnat aspect

    formatter.transformVideo(player_mgr.settings.offsetX, player_mgr.settings.offsetY);

    console.log("play_item pause requested: ", paused);
    var autoplay;
    if (paused == undefined) {
    	autoplay = (player_mgr.playerStatus == 'playing');
    } else {
    	autoplay = !paused;
    }
    player_mgr.setAutoPlay(autoplay);

    player_mgr.waitingForStream = true;
    playlist_item.loadAndPlay(player_mgr.settings.streamingProtocol, streamId, startTime);
  } else {
    console.log("play_item error: itemIndex==", itemIndex, " playlist_item is " + playlist_item); 
    //console.trace();
  }
};

//****************************************************************/
//*********************  on stream loaded ************************/
//****************************************************************/

PlayerMgr.prototype.onStreamLoaded = function(){
  console.log("Stream loaded");
  player_mgr.waitingForStream = false;

  if (typeof player_mgr.videoStartTime != 'undefined'){
    console.log("Setting time", player_mgr.videoStartTime);
    player_mgr.video.currentTime = player_mgr.videoStartTime;
    delete player_mgr.videoStartTime;
  } else console.log("videoStartTime is undefined");

  if (player_mgr.playerStatus == 'playing'){
	if (player_mgr.invokePlayCallbackOnStreamLoaded) {
		player_mgr.invokeCallbackFunction('play');
		player_mgr.invokePlayCallbackOnStreamLoaded = false;
	}
  }

  console.log("Current audiotrack is: ", player_mgr.currentAudioTrack);
  var audioTrackIndex;
  player_mgr.getAudioTracks().forEach(function(item, index) {
	  if (item.value == player_mgr.currentAudioTrack) {
		  audioTrackIndex = index;
	  }
  }, player_mgr);
  if (audioTrackIndex == undefined && player_mgr.getAudioTracks()[0] != undefined) {
	  player_mgr.currentAudioTrack = player_mgr.getAudioTracks()[0].value;
      player_mgr.saveCookiesAudiotrack();
	  console.log("Unsupported audiotrack, switched to", player_mgr.currentAudioTrack);
	  audioTrackIndex = 0;
  }
  if (audioTrackIndex != undefined)
	  player_mgr.selectAudioTrack(player_mgr.currentAudioTrack);

  
  if (typeof player_mgr.currentItem.getSkipDelay() != 'undefined'){
    controls.setupSkipOverlay(parseInt(player_mgr.currentItem.getSkipDelay()));
  } else {
    controls.hideSkipOverlay();
  }
  if (player_mgr.currentItem.isVast) {
    player_mgr.logEvent('ad', 'show');
  }
  player_mgr.showVideoScreen();
  if (player_mgr.isTimeshift){
	    controls.updateSeekBar(player_mgr.getStreamRange().max);
  }

  //zobrazit titulky podle infa v cookies
  var subtitles = player_mgr.getCookie("subtitles");
  //console.log("Subtitles loaded from cookies: ", subtitles);
  //console.log(document.cookie);
  if (!player_mgr.selectSubtitles(subtitles, true, true)) {
	  // titulky nenalezeny
	  player_mgr.selectSubtitles(undefined, true, true);
  }

  //vybrat zvolenou kvalitu videa podle infa v cookies
  var quality = player_mgr.getCookie("videoQuality");
  console.log("Quality loaded from cookies", quality);
  if (!player_mgr.setQuality(quality)) {
	// kvalita nenalezena
	player_mgr.setQuality('auto');
  }
  player_mgr.updateAutoQualityInfo();
  formatter.setupForLoadedSource();

  if (player_mgr.performLiveTsChanger){
    setTimeout(function(){player_mgr.switchTimeshift(! player_mgr.isTimeshift);}, player_mgr.liveTsChangerDelay * 1000);
  }

  player_mgr.storeTimeshiftPauseMarker();
  
  player_mgr.initializeGemius();
};

PlayerMgr.prototype.onVideoPlayEvent = function() {
	if (this.playerStatus == 'paused') {
		console.log('spurious play event');
		this.play();
	}

	this.removeAutoPlay();

	this.sendGemiusEvent('playing');
}

PlayerMgr.prototype.removeAutoPlay = function() {
	$(player_mgr.mainShellId + " #overlay #playBtn").removeClass('autoPlay');
	$(player_mgr.mainShellId + " #overlay #customPlayBtn").removeClass('autoPlay');
	player_mgr.autoPlayDisplayed = false;
}

PlayerMgr.prototype.onVideoPausedEvent = function() {
	this.sendGemiusEvent('paused');
}

PlayerMgr.prototype.onVideoWaitingEvent = function() {
	this.sendGemiusEvent('buffering');
}

PlayerMgr.prototype.onVideoSeekingEvent = function() {
	this.sendGemiusEvent('seekingStarted');
}

//****************************************************************/
//*********************  play, pause etc. ************************/
//****************************************************************/

PlayerMgr.prototype.play = function(skipCallback, skipHbbTvCommand){
  if (player_mgr.playerStatus == 'playing') {
	  return;
  }
  var hbbTvActive = this.isHbbTvActive();
  if (!skipCallback) {
    player_mgr.invokeCallbackFunction('play');
    player_mgr.logEvent('action', 'play');
    if (player_mgr.currentItem) {
	    player_mgr.currentItem.onResume();
    }
  }
  player_mgr.removeAutoPlay();
  controls.activateCentralButton("pause");
  player_mgr.playerStatus = 'playing';
  formatter.formatClickThrough();
  
  if (hbbTvActive) {
	  //this.storeHbbtvPosition(undefined, true); // nebudeme predpokladat, ze video hraje, radsi pockame na playstatechange
	  if (!skipHbbTvCommand) {
		this.sendHbbtvCommand('play');
	  }
  } else {
	  if (player_mgr.playerStatus == 'paused'){
	    //jsem-li v live/timeshift streamu a od zapauzovani ubehlo mene nez 3 minuty, loadni live stream 
	    if (player_mgr.currentItem != undefined && player_mgr.currentItem.isLive() && !player_mgr.isTimeshift){
	      var timeInPause = player_mgr.getTimeInPause();
	      if ((timeInPause < player_mgr.timeShiftOffset * 1000) && (timeInPause > 1000)) {//casy jsou v ms
	        player_mgr.switchTimeshift(false, false);
	        return;
	      }
	    }
	  }
	  if (player_mgr.afterTS){
	    player_mgr.switchTimeshift(false, false);
	  }
	  playerShell.play();
  }
};

PlayerMgr.prototype.stop = function(skipCallback, skipHbbTvCommand){
  var hbbTvActive = this.isHbbTvActive();
  if (!skipCallback) {
    player_mgr.invokeCallbackFunction('stop');
    player_mgr.logEvent('action', 'stop');
  }
  // playerShell.stop(); // misto stop budeme pouzivat pauzu a seek na zacatek
  player_mgr.pause(true);
  if (hbbTvActive) {
	  this.storeHbbtvPosition(undefined, false);
	  if (!skipHbbTvCommand) {
		this.sendHbbtvCommand('stop');
	  }
  } else {
	  if (player_mgr.currentItem != undefined) {
		if (player_mgr.currentItem.isLive()) {
			if (player_mgr.isTimeshift) {
				player_mgr.seekTo(player_mgr.getStreamRange().min);
			}
			player_mgr.setAfterTS();
		} else {
			player_mgr.seekTo(player_mgr.getStreamRange().min);
		}
	  }
  }
};

PlayerMgr.prototype.pause = function(skipCallback, skipHbbTvCommand){
  if (player_mgr.playerStatus == 'paused') {
	  return;
  }
  var hbbTvActive = this.isHbbTvActive();
  if (!skipCallback) {
    player_mgr.logEvent('action', 'pause');
    player_mgr.invokeCallbackFunction('pause');
  }
  controls.activateCentralButton("play");
  player_mgr.pauseTimestamp = new Date().getTime();
  player_mgr.playerStatus = 'paused';
  formatter.formatClickThrough();
  player_mgr.storeTimeshiftPauseMarker();
  if (hbbTvActive) {
	  this.storeHbbtvPosition(undefined, false);
	  if (!skipHbbTvCommand) {
		this.sendHbbtvCommand('pause');
	  }
  } else {
	  playerShell.pause();
  }
};

PlayerMgr.prototype.replay = function(){
  console.log("replay");
  controls.activateCentralButton("pause");
  formatter.activateReplayScreen(false);
  player_mgr.invokePlayCallbackOnStreamLoaded = true;
  player_mgr.play_item(0, false, false);
};

//****************************************************************/
//***********************  volume status  ************************/
//****************************************************************/

PlayerMgr.prototype.setVolume = function(value, skipCallback, skipStoreCookie) {
  var valueChanged = (value != player_mgr.video.volume * 100);
  if (!skipCallback) {
	if (player_mgr.isMuted() && valueChanged && (value > 0)) {
	  player_mgr.logEvent('sound', 'on');
	  if (player_mgr.currentItem) {
		  player_mgr.currentItem.onUnmute();
	  }
	} else if (!player_mgr.isMuted() && valueChanged && (value == 0)) {
	  player_mgr.logEvent('sound', 'off');
	  if (player_mgr.currentItem) {
		  player_mgr.currentItem.onMute();
	  }
	}
    player_mgr.invokeCallbackFunction('changevolume', value);
  }
  player_mgr.video.volume = value/100;
  controls.updateVolumeBar();
  if (! skipStoreCookie){
    player_mgr.saveCookiesVolume();
  }
  if (value != 0) {
	  player_mgr.volumeBeforeMute = value;
  }
};

PlayerMgr.prototype.getVolume = function(){
  return player_mgr.video.volume * 100;
};

PlayerMgr.prototype.switchMute = function(){
  if (player_mgr.isMuted()){
    player_mgr.setVolume(player_mgr.volumeBeforeMute);
  } else {
    player_mgr.setVolume(0);
  }
};

PlayerMgr.prototype.isMuted = function(){
  return player_mgr.video.volume == 0;
};



//****************************************************************/
//*****************  full screen toggle   ************************/
//****************************************************************/

//tohle muze byt volano bud bez parametru (stisk buttonu)
//anebo s parametrem false (event pri opusteni fullscreenu -- 
//-- toto je potreba pro pripad, kdy uzivatel opustil fullscreen
//stisknutim Esc); tedy parametr nikdy neni true
PlayerMgr.prototype.toggleFullScreen = function(value, skipCallback) {
	if (value == undefined || player_mgr.isFullScreen){
		if (player_mgr.isFullScreen){  //leave full screen
			if (!skipCallback) {
				player_mgr.invokeCallbackFunction('fromfullscreen');
				if (player_mgr.currentItem) {
					player_mgr.currentItem.onExitFullscreen();
				}
			}
			player_mgr.toggleFullScreenOff();
		} else { // Start FullScreen
			player_mgr.toggleFullScreenOn();
			if (!skipCallback) {
				player_mgr.invokeCallbackFunction('tofullscreen');
				if (player_mgr.currentItem) {
					player_mgr.currentItem.onFullscreen();
				}
			}
		}
		formatter.format();
	}
};

PlayerMgr.prototype.toggleFullScreenOff = function() {
	if (document.exitFullscreen){
		document.exitFullscreen();
		console.log("exitFullscreen (1)");

	} else if (document.mozCancelFullScreen){
		document.mozCancelFullScreen();
		console.log("mozCancelFullScreen (2)");

	} else if (document.webkitCancelFullScreen){
		document.webkitCancelFullScreen();
		console.log("webkitCancelFullScreen (3)");

	} else if (document.cancelFullScreen){
		document.cancelFullScreen();
		console.log("cancelFullScreen (4)");

	} else if (document.msExitFullscreen){
		document.msExitFullscreen();
		console.log("msExitFullscreen (5)");
	} else {
		console.log("Remove pseudo FullScreen class");
		$("body").removeClass("iOSfullscreen");
	}
	player_mgr.isFullScreen = false;
	formatter.setContainerSize();
	formatter.setFullScreenButtonIcon(false);
};

PlayerMgr.prototype.toggleFullScreenOn = function() {
	var playerMainShell = $(player_mgr.mainShellId + ' #videoShell')[0];
	if (playerMainShell.requestFullscreen){
		playerMainShell.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		console.log("requestFullscreen (1)");

	} else if (playerMainShell.mozRequestFullScreen){
		playerMainShell.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		console.log("mozRequestFullScreen (2)");

	} else if (playerMainShell.webkitRequestFullScreen){
		playerMainShell.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		console.log("webkitRequestFullScreen (3)");

	} else if (playerMainShell.requestFullScreen){
		playerMainShell.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		console.log("requestFullScreen (4)");

	} else if (playerMainShell.msRequestFullscreen){
		playerMainShell.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		console.log("msRequestFullscreen (5)");

	} else if (playerMainShell.webkitRequestFullscreen){
		playerMainShell.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		console.log("webkitRequestFullscreen (6)");
	} else {
		console.log("No working FullScreen command, try pseudoFS");
		$("body").addClass("iOSfullscreen");
	}
	player_mgr.isFullScreen = true;
	formatter.setContainerSize();
	formatter.setFullScreenButtonIcon(true);
};

//****************************************************************/
//*****************  ON full screen toggle   *********************/
//****************************************************************/

PlayerMgr.prototype.onFullScreenToggle = function(){
    var state = document.fullscreenElement;
    if (state){
      formatter.setFullScreenButtonIcon(true);
      player_mgr.logEvent('resize', 'toFullscreen');
    } else {
      formatter.setFullScreenButtonIcon(false);
      player_mgr.logEvent('resize', 'fromFullscreen');
    }
    controls.updateSeekBar();
  };

PlayerMgr.prototype.onFullScreenOn = function(){
    player_mgr.isFullScreen = true;
    formatter.setFullScreenButtonIcon(true);
    player_mgr.logEvent('resize', 'toFullscreen');
    controls.updateSeekBar();
}

PlayerMgr.prototype.onFullScreenOff = function(){  
    player_mgr.isFullScreen = false;
    formatter.setFullScreenButtonIcon(false);
    player_mgr.logEvent('resize', 'fromFullscreen');
    controls.updateSeekBar();
}

//****************************************************************/
//*************************** set autoPlay  **********************/
//****************************************************************/

PlayerMgr.prototype.setAutoPlay = function(videoAutoPlay){
  console.log("PlayerMgr.setAutoPlay", videoAutoPlay);
  controls.activateCentralButton(videoAutoPlay ? 'pause' : 'play');
  player_mgr.playerStatus = videoAutoPlay ? 'playing' : 'paused';
  playerShell.setAutoPlay(videoAutoPlay);
};

//****************************************************************/
//*********************** switch timeshift  **********************/
//****************************************************************/

PlayerMgr.prototype.switchTimeshift = function(value, paused, position, skipHbbTvCommand){
  var hbbTvActive = this.isHbbTvActive();
  player_mgr.unsetAfterTS();
  player_mgr.isTimeshift = value;
  if (value){
    player_mgr.logEvent('timeshift', 'toTimeshift');
    //console.trace();
    formatter.forceSeekBarRepaint = true;
  } else {
    player_mgr.logEvent('timeshift', 'toLive');
  }
  console.log('switchTimeshift pause requested:', paused);
  if (hbbTvActive) {
	  var hbbtvPosition;
	  if (!value) {
		  hbbtvPosition = 0;
	  } else {
		  var hbbtvPosition = position;
		  if (hbbtvPosition == undefined) {
			  hbbtvPosition = (0 - this.timeShiftOffset);
		  }
	  }

	  this.storeHbbtvPosition(hbbtvPosition, undefined);

	  if (!skipHbbTvCommand) {
		  if (!value) {
			  this.sendHbbtvCommand('live');
		  } else {
			  this.sendHbbtvSeek(hbbtvPosition);
		  }
	  }
  } else {
	  player_mgr.play_item(player_mgr.currentItemIndex, value, paused, position);
  }
  formatter.format();
};

PlayerMgr.prototype.updateAutoQualityInfo = function() {
	if (this.selectedTvName != undefined) {
		return;
	}
	if (this.currentQuality != 'auto') {
		// zobraz nejlepsi dosazitelnou kvalitu, nebo vubec nejlepsi kvalitu, pokud neni nastavena maxBitrate
		var bestPossibleSpeed = player_mgr.settings.maxBitrate || 9999;
		var bestResolution = this.getSpeedResolution(bestPossibleSpeed * 1000);
		formatter.updateAutoQualityText(bestResolution);
		return;
	}
	var bandwidth = playerShell.getCurrentBandwidth();
	if (bandwidth == undefined) {
		return;
	}
	var resolution = this.getSpeedResolution(bandwidth);
	formatter.updateAutoQualityText(resolution);
	
	if ((this.lastAdaptiveQualityResolution != undefined) && (this.lastAdaptiveQualityResolution != resolution)) {
		this.invokeCallbackFunction('switchlevel', this.lastAdaptiveQualityResolution, resolution);
	}
	this.lastAdaptiveQualityResolution = resolution;
};

PlayerMgr.prototype.setQuality = function(resolution, skipHbbTvCommand){
  var thisPlayer = this;
  var hbbTvActive = this.isHbbTvActive();
  var found = false;
  player_mgr.getQualityInfo().forEach(function(item) {
	  if (item.key == resolution) {
		  console.log('setting quality ', item.id);
		  if (hbbTvActive) {
			  if (!skipHbbTvCommand) {
				  var supportedHbbtvQualities = [ '288p', '404p', '576p', '720p' ];
				  if (supportedHbbtvQualities.indexOf(resolution) < 0) {
					  console.log('Quality', resolution, 'not supported by HBBTv');
				  } else {
					  var hbbTvQuality = 'max' + resolution;
					  thisPlayer.sendHbbtvCommand('setquality', { quality: hbbTvQuality });
				  }
			  }
		  } else {
			  playerShell.setQuality(item.id, player_mgr.settings.maxBitrate);
		  }
		  found = true;
	  }
  });
  
  if (found) {
	  player_mgr.currentQuality = resolution;
	  formatter.formatQualitySelector();
	  if (!hbbTvActive) {
		  player_mgr.saveCookiesVideoquality();
	  }
	  
	  player_mgr.lastAdaptiveQualityResolution = undefined;
	  player_mgr.updateAutoQualityInfo();
  }
  
  return found;
};

PlayerMgr.prototype.manualSetQuality = function(resolution){
	var oldQuality = player_mgr.currentQuality;
	this.setQuality(resolution);
	this.invokeCallbackFunction('manualswitchlevel', oldQuality, player_mgr.currentQuality);
	this.logEvent('action', ((resolution == 'auto') ? 'Auto' : resolution));
};

//****************************************************************/
//**************  konec streamu a jak k nemu dojde  **************/
//****************************************************************/

PlayerMgr.prototype.onStreamEnd = function() {
  player_mgr.log("PlayerMgr", INFO, "stream end");
  player_mgr.sendGemiusEvent('complete');
  if (player_mgr.currentItem) {
	  player_mgr.currentItem.onEnded();
  }
  if (player_mgr.currentItem && player_mgr.currentItem.isVoD()){
    player_mgr.deletePositionCookie();
  }
  player_mgr.playNextItem();
};

PlayerMgr.prototype.onSkip = function(skipHbbTvCommand){
  var hbbTvActive = this.isHbbTvActive();

  player_mgr.log("PlayerMgr", INFO, "stream skipped");
  if (player_mgr.currentItem) {
	    player_mgr.currentItem.onSkip();
  }
  controls.hideSkipOverlay();
  player_mgr.logEvent('ad', 'hide');
  if (hbbTvActive) {
	  if (!skipHbbTvCommand) {
		this.sendHbbtvCommand('skipad');
	  }
  } else {
	  player_mgr.playNextItem();
  }
};

PlayerMgr.prototype.playNextItem = function() {
  var playlistSize = playlist.getItemCount();
  var nextItemIndex = player_mgr.currentItemIndex + 1;
  console.log("play next item - ", nextItemIndex, " of ", playlistSize);
  if (nextItemIndex < playlistSize){
    console.log("play next item 1");
    player_mgr.invokeCallbackFunction('next');
    player_mgr.logEvent('action', 'next');
    player_mgr.invokePlayCallbackOnStreamLoaded = false;
   	if (!player_mgr.attemptCookiePositioning(nextItemIndex, player_mgr.autoPlayDisplayed)) {
      player_mgr.play_item(nextItemIndex, false, player_mgr.autoPlayDisplayed);
   	}
  } else if ((typeof player_mgr.settings.loop != 'string' && player_mgr.settings.loop) || player_mgr.settings.loop == "true"){
    console.log("play next item 2");
    player_mgr.invokeCallbackFunction('next');
    player_mgr.logEvent('action', 'next');
    player_mgr.invokePlayCallbackOnStreamLoaded = false;
    player_mgr.play_item(0, false, false);
  } else if (player_mgr.isFullScreen && typeof playlist.ct_playlist.setup.nextPlaylist != 'undefined' && playlist.ct_playlist.setup.nextPlaylistAutoplay){
    console.log("play next item 3");
    player_mgr.invokeCallbackFunction('next');
    player_mgr.logEvent('action', 'next');
    player_mgr.playerStatus = 'ended';
    playerShell.pause();
    player_mgr.invokePlayCallbackOnStreamLoaded = false;
    var delay;
    if (player_mgr.settings.loadNextPlaylistDelay == undefined) {
    	delay = 10;
    } else {
    	delay = parseInt(player_mgr.settings.loadNextPlaylistDelay);
    }
    var title = playlist.getPlaylistItem(0).getTitle();
    controls.setupNextInSeries(delay, title);
    //player_mgr.loadPlaylistUrl(player_mgr.settings.setup.nextPlaylist, player_mgr.on_playlist_loaded);
  } else {
	  player_mgr.onPlaylistEnd();
  }
};

PlayerMgr.prototype.onPlaylistEnd = function() {
    player_mgr.showVideoScreen();
    player_mgr.invokeCallbackFunction('ended');
    console.log("no more items to play; box should appear");
    controls.activateCentralButton("replay");
    formatter.activateReplayScreen(true);
    player_mgr.playerStatus = 'ended';
    playerShell.pause();
}

PlayerMgr.prototype.playNextInSeries = function(){
	console.log("play next in series NOW");
	this.settings.playlistURL = playlist.ct_playlist.setup.nextPlaylist;
	this.loadPlaylistUrl(this.settings.playlistURL, this.on_playlist_loaded);
};

PlayerMgr.prototype.playPreviousItem = function() {
  console.log("play privous item");
  player_mgr.logEvent('action', 'previous');
  if (player_mgr.currentItemIndex > playlist.getPrerollItemCount()) {
    player_mgr.play_item(player_mgr.currentItemIndex - 1, false, false);
  } else {
    player_mgr.play_item(player_mgr.currentItemIndex, false, false);
  }
};

//vyvola callback funkci, jejiz jmeno je prvnim parametrem volani invokeCallbackFunction
//tato callback funkce bude zavolana s prvnim parametrem settings.playerId, nasledovanym
//pripadnymi dalsimi parametry, uvedenymi ve volani invokeCallbackFunction za jmenem
//callback metody
PlayerMgr.prototype.invokeCallbackFunction = function(callbackFunctionName){
  var callback = this.settings.callbackStatus;
  if (callback != undefined) {
    var position;
    var duration;

    if (player_mgr.currentItem != undefined) {
    	if (this.selectedTvName) {
    		position = this.computeHbbtvPosition();
    		duration = this.lastKnownHbbtvDuration;
    	} else {
    		position = this.getStreamPosition();
    		var range = this.getStreamRange();
    		duration = range.max - range.min;
    	}
    	
    	if (player_mgr.currentItem.isLive()) {
    		position = undefined;
	        if (!player_mgr.isTimeshift){
		      duration = undefined;
	        }
	    }
    }
    
    var args = [ callbackFunctionName ];
    if (callbackFunctionName != 'ended') { // special case
      args.push(position);
    }
    args.push(duration);
//    console.log(Array.prototype.slice.call(arguments));
//    console.log(Array.prototype.slice.call(arguments).slice(1));
    args = args.concat(Array.prototype.slice.call(arguments).slice(1));
    
    if (player_mgr.currentItem.isLive() && (callbackFunctionName == 'seeking')) {
    	args[3] = undefined; // special case - seek v TS
    }

    for(var i = 0; i < args.length; i++) {
    	if (args[i] == undefined) {
    		args[i] = null;
    	}
    }
    
    try {
      window[callback].apply(null, args);
    } catch(err) {
      console.log('ERROR in callback (' + callback + ') for ' + callbackFunctionName + ': ' + err.message);
    }
  } else {
    console.log("CALLBACK " + callbackFunctionName + " not called, since callback method isn't specified");
  }
};

function onHtml5PlayerComplete(){
  console.log("complete CALLBACK", arguments);
};

//****************************************************************/
//***********  gettery na vlastnosti playeru a streamu  **********/
//****************************************************************/

PlayerMgr.prototype.getVideoDuration = function() {
  return playerShell.getVideoDuration();
};

PlayerMgr.prototype.getLanguageCode = function(languageName){
  var languages = player_mgr.settings.languages.languages || [];
  for (var i = 0; i < languages.length; i++){
    if (languages[i].name == languageName){
      return languages[i].code;
    }
  }
  return "df";//defaultni language kod
};

PlayerMgr.prototype.getLanguageName = function(code) {
  var languages = player_mgr.settings.languages.languages || [];
  for (var i = 0; i < languages.length; i++){
    if (languages[i].code == code){
      return languages[i].name;
    }
  }
  return undefined;
};

PlayerMgr.prototype.getAvailTVsInfo = function(){
  return this.availTVsInfo;
};

PlayerMgr.prototype.getSubtitlesInfo = function(){
  if (this.isHbbTvActive()) {
	  return this.lastKnownHbbtvSubtitles;
  }
  var result = [];
  if (this.currentItem != undefined) {
	  var textTracks = this.currentItem.getSubtitlesInfo();
	  var thisPlayer = this;
	  textTracks.forEach(function(item, index) {
		  result.push({value: index, text: item.title, language: thisPlayer.getLanguageCode(item.title)});
	  });
  }
  return result;
};

PlayerMgr.prototype.selectSubtitles = function(language, skipCallback, skipStoreCookie, skipHbbTvCommand) {
  var hbbTvActive = this.isHbbTvActive();

  var subtitlesTrackIndex = undefined;
  if (language != undefined) {
    player_mgr.getSubtitlesInfo().forEach(function(item, index) {
    	if (item.language == language) {
    		subtitlesTrackIndex = index;
    	}
    });
    if (subtitlesTrackIndex == undefined) {
    	console.log('subtitles not found: ', language);
    	return false;
    }
  }

  var oldSubtitles = player_mgr.selectedSubtitles;
  player_mgr.selectedSubtitles = language;
  if (hbbTvActive) {
	  if (!skipHbbTvCommand) {
		  this.sendHbbtvSetSubtitlesCommand(language);
	  }
  } else {
	  controls.setSubtitlesTrack(subtitlesTrackIndex);
  }
  formatter.formatSubtitlesSelector();

  if (!skipStoreCookie) {
  	player_mgr.saveCookiesSubtitles();
  }
  if (!skipCallback) {
    player_mgr.invokeCallbackFunction('subtitletrackchange', oldSubtitles, language);
    player_mgr.logEvent('subtitles', (language == undefined ? 'off' : 'on'));
  }
  return true;
};

PlayerMgr.prototype.getAudioTracks = function(){
  if (this.isHbbTvActive()) {
	  return this.lastKnownHbbtvAudioTracks;
  }
  
  var result = [];

  playerShell.getAudioTracks().forEach(function(value) {
	  result.push({
		  value: value,
		  text: player_mgr.getLanguageName(value),
		  language: value
	  });
  });
  if (player_mgr.currentItem != undefined && player_mgr.currentItem.hasAudioDescription()){
    result.push({value: 'ad', text: player_mgr.getLanguageName('ad'), language: 'ad'});
  }
  return result;
};

PlayerMgr.prototype.setAudioTrack = function(value, skipCallback, skipHbbTvCommand){
  var hbbTvActive = this.isHbbTvActive();
  
  console.log("set audio track", value);
  var oldAudioTrack = player_mgr.currentAudioTrack;

  player_mgr.currentAudioTrack = value;
  player_mgr.saveCookiesAudiotrack();

  if (!skipCallback) {
    player_mgr.invokeCallbackFunction('audiotrackchange', oldAudioTrack, value);
  }
  
  formatter.formatAudioSelector();
  
  if (hbbTvActive) {
	  if (!skipHbbTvCommand) {
		this.sendHbbtvSetAudioStreamCommand(value);
	  }
  } else {
	  var switchStream;
	  if (oldAudioTrack == 'ad') {
	    if (value == 'ad') {
	      return;
	    } else {
	      switchStream = true;
	    }
	  } else {
	    if (value == 'ad') {
	      switchStream = true;
	    } else {
	      switchStream = false;
	    }
	  }
	 
	  if (switchStream) {
	    player_mgr.play_item(player_mgr.currentItemIndex, player_mgr.isTimeshift, undefined, player_mgr.video.currentTime);
	  } else {
	      player_mgr.selectAudioTrack(id);
	  }
  }
};

PlayerMgr.prototype.selectAudioTrack = function(id) {
  playerShell.selectAudioTrack(id);
};

PlayerMgr.prototype.getVideoTracks = function(){
  return playerShell.getVideoTracks();
};

PlayerMgr.prototype.getQualityInfo = function(){
  if (this.isHbbTvActive()) {
	return this.lastKnownHbbtvQualities;
  }

  var result = [{key: 'auto', id: 'auto'}];
  
  var videoTracks = player_mgr.getVideoTracks();
  if(videoTracks != undefined) {
  	videoTracks.forEach(function(item) {
  		var resolution = player_mgr.getSpeedResolution(item.bandwidth);
  		result.push({key: resolution, id: item.id, bandwidth: item.bandwidth, resolution: resolution});
  	});
  }
  
  return result;
};

PlayerMgr.prototype.getSpeedResolution = function(bandwidth){
  var speedResolution = player_mgr.settings.speedResolution.speedResolution;
  
  var bestDifference = undefined;
  var bestResult = undefined;
  
  speedResolution.forEach(function(item) {
	 var itemBandwidth = item.speed * 1000;
	 var difference = Math.abs(itemBandwidth - bandwidth);
	 if ((bestDifference == undefined) || (bestDifference > difference)) {
		 bestDifference = difference;
		 bestResult = item.resolution;
	 }
  });
  return bestResult;
};

PlayerMgr.prototype.getQualityResolutionText = function(resolution){
  var qualityResolutions = player_mgr.settings.qualityResolutionText.qualityResolutionText || [];
  for (var i = 0; i < qualityResolutions.length; i++){
    var qualityResolution = qualityResolutions[i];
    if (qualityResolution.resolution == resolution){
      return qualityResolution.text;
    }
  }
  return resolution; // text not found
};

//****************************************************************/
//********************  Skakani po indexech  *********************/
//****************************************************************/

//tohle predpoklada, ze jsou indexy serazene vzestupne podle casu
PlayerMgr.prototype.findIndexTime = function(curTime, jumpForward){
  var prevIndexI;
  var indexes = player_mgr.currentItem.getIndexes();
  for (var i = 0; i < indexes.length; i++){
    var index = indexes[i];
    if (index.time < curTime){
      prevIndexI = i;
    } else {
      if (jumpForward){
        return index.time;
      } else {
        if (prevIndexI > 0){
          return indexes[prevIndexI - 1].time;
        } else {
          return indexes[prevIndexI].time;
        }
      }
    }
  }
  if (prevIndexI > 0){
    return indexes[prevIndexI - 1].time;
  } else {
    return indexes[prevIndex].time;
  }
};

PlayerMgr.prototype.jumpToIndex = function(jumpForward){
  var curTime = player_mgr.video.currentTime;
  var indexTime = player_mgr.findIndexTime(curTime, jumpForward);
  player_mgr.video.currentTime = indexTime;
  controls.updateSeekBar(indexTime);
};

//****************************************************************/
//*********************  Interni logovani  ***********************/
//****************************************************************/

var NO_LOGGING = 4;
var ERROR = 3;
var WARNING = 2;
var INFO = 1;
var DEBUG = 0;
var logLevelCodes = ["DBG", "INF", "WRN", "ERR"];

PlayerMgr.prototype.setupLogLevel = function(){
  player_mgr.logLevel = NO_LOGGING;//TODO: ma byt docasne jen kvuli nasazeni playeru do testu, pak smazat!
  return;
  if (player_mgr.settings.logLevel){
    switch (player_mgr.settings.logLevel){
      case "Error": player_mgr.logLevel = ERROR; break;
      case "Warning": player_mgr.logLevel = WARNING; break;
      case "Info": player_mgr.logLevel = INFO; break;
      case "Debug": player_mgr.logLevel = DEBUG; break;
    }
  } else {
    player_mgr.logLevel = NO_LOGGING;
  }
};

PlayerMgr.prototype.log = function(obj, logLevel, message){
  var logLevelIndex = logLevelCodes.indexOf(logLevel);
  if (logLevelIndex >= player_mgr.logLevel){
    var objName = (typeof obj == "string" ? obj : obj.constructor.name);
    console.log(logLevelCodes[logLevel] + "  " + objName + ":: " + message);
  }
};

/********************** SEEK *******************/

PlayerMgr.prototype.manualSeek= function(value){
  if (value == player_mgr.video.currentTime) {
    // ignore - seeked through callback
    return;
  }
  player_mgr.invokeCallbackFunction('seeking', value);
  player_mgr.logEvent("action", "seeking");
  player_mgr.seekTo(value);
};

PlayerMgr.prototype.seekToIndex = function(value){
  player_mgr.invokeCallbackFunction('index', value);
  player_mgr.logEvent("action", "index");
  player_mgr.seekTo(value);
};

PlayerMgr.prototype.seekTo = function(value, skipHbbTvCommand){
  var hbbTvActive = this.isHbbTvActive();
  controls.updateSeekBar(value); // prekreslit jeste nez se nacte video
  if (player_mgr.afterTS) {
	if (!hbbTvActive) {
		player_mgr.switchTimeshift(true, true, value);
	}
  } else {
	if (!hbbTvActive) {
		player_mgr.video.currentTime = value;
	}
    player_mgr.storeTimeshiftPauseMarker();
    player_mgr.saveCurrentPosition();
  }
  
  if (hbbTvActive) {
	  if (!skipHbbTvCommand) {
			this.sendHbbtvSeek(value);
	  } else {
		  this.storeHbbtvPosition(value, undefined);
	  }
  }
};

PlayerMgr.prototype.seekBy = function(offset) {
    if (this.currentItem && !this.currentItem.isVast) {
    	if (this.afterTS) {
    		this.switchTimeshift(true, true);
    	} else {
    		this.manualSeek(this.video.currentTime + offset);
    	}
      }
}

PlayerMgr.prototype.getTimeInPause = function() {
  var currentTime = new Date().getTime();
  return currentTime - this.pauseTimestamp;
}

PlayerMgr.prototype.storeTimeshiftPauseMarker = function(){
	// uschova pozici ve streamu, meze seekbaru a aktualni cas
	// pouziva se pro prekresleni seekbaru v TS, zatimco v live a VOD nema vyznam
	// zavola se pri prechodu do TS, zapnuti pauzy v TS a seeku v TS
	// nejsme-li v TS, muzeme hodnoty klidne prepsat a nicemu to nevadi
	this.lastPausedPosition = video_element.currentTime;
	this.lastPausedRange = this.getStreamRange();
	this.timeshiftPauseTimestamp = new Date().getTime();
	console.log("TSpauseMarkerFinished");
}

PlayerMgr.prototype.startTimeTick = function(){
	var thisPlayer = this;
	window.setTimeout(function() { thisPlayer.timeTick(); }, 1000);
}

PlayerMgr.prototype.timeTick = function(){
  // pouzivame timer misto intervalu, vysledek je pravidelnejsi
  this.startTimeTick();
  
  if (this.isHbbTvActive()) {
	  this.hbbtvAutoSwitchTimeshift();
	  // jsme v HBBTv, prekreslime seekbar
	  this.formatHbbtvSeekBarAndSkipAd();
	  return;
  }
  
  if (this.playerStatus != 'paused') {
	  return;
  }
  if (player_mgr.currentItem == undefined || !player_mgr.currentItem.isLive()){
	  return;
  }
  if (this.waitingForStream) {
	  return;
  }
  // HLS pri pauze po startu videa hlasi 0, ne zs rozbehne prehravani.

  var timeInPause = this.getTimeInPause();
  console.log("checking paused live: time in pause=" + timeInPause);

  if (!this.isTimeshift && (timeInPause > player_mgr.timeShiftOffset * 1000)) {
	  // prilis dlouho v pauze v Live, prepnout do TS
	  this.switchTimeshift(true, true);
  } else {
    var range = this.getStreamRange();
    // v HLS nedava toto checkovani smysl, protoze udaje v range a current time jsou nesmysly
    if (playerShell.isShaka &&  video_element.currentTime < (range.min + 5) && !player_mgr.afterTS) {
  	  // prilis blizko konce videa
      if (player_mgr.isTimeshift){
        player_mgr.setAfterTS();
      } else {
    	// jsme na konci Live streamu, znovu nacist
      	player_mgr.switchTimeshift(false, true);
      }
    }
    if (player_mgr.isTimeshift){
      var elapsed = (new Date().getTime() - this.timeshiftPauseTimestamp) / 1000;
      console.log("redraw TS seekbar: paused at " + this.lastPausedPosition + ", " + elapsed + " seconds elapsed");
      var range;
      if (player_mgr.afterTS) {
    	  range = {
    			  min: player_mgr.afterTSStreamRange.min + elapsed,
    			  max: player_mgr.afterTSStreamRange.max + elapsed,
    	  };
      } else {
    	  range = this.lastPausedRange;
      }
      controls.updateSeekBar(this.lastPausedPosition - elapsed, range.min, range.max);
    }
  }
}

PlayerMgr.prototype.hbbtvAutoSwitchTimeshift = function() {
  //console.log("HBBTv timeshift check - has item", (player_mgr.currentItem != undefined), "is live", player_mgr.currentItem.isLive(), "is timeshift", this.isTimeshift, "position", this.computeHbbtvPosition());
  if (player_mgr.currentItem != undefined && player_mgr.currentItem.isLive()) {
	  var timeshiftMax = (0 - this.timeShiftOffset);
	  if (!this.isTimeshift && (this.computeHbbtvPosition() <= timeshiftMax)) {
		  // jsme v HBBTv a prilis daleko v Live, prepneme do timeshiftu
		  this.switchTimeshift(true, undefined, undefined, true);
	  } else if (this.isTimeshift && (this.computeHbbtvPosition() > timeshiftMax)) {
		  // jsme v HBBTv a v TS a prilis blizko Live, prepneme do Live zobrazeni 
		  this.switchTimeshift(false, undefined, undefined, true);
	  }
  }
}

PlayerMgr.prototype.setAfterTS = function() {
  console.log("Zobrazuju konec timeshiftu");
  this.afterTSStreamRange = this.getStreamRange();
  $(player_mgr.mainShellId + ' .playerMainShell').addClass('afterTS');
  this.sendGemiusEvent('stopped');
  playerShell.unload();
  formatter.showReplayPoster();
  this.afterTS = true;
}

PlayerMgr.prototype.unsetAfterTS = function() {
  this.afterTS = false;
  $(player_mgr.mainShellId + ' .playerMainShell').removeClass('afterTS');
}


//****************************************************************/
//***************************  keyPresses  ***********************/
//****************************************************************/

PlayerMgr.prototype.onKeyPress = function(event){
  var keyCode = event.which;
  console.log("keyCode", keyCode);

  //space funguje jako click() na overlay
  if (keyCode == 32){
    $(player_mgr.mainShellId + " #overlay").click();
  } //konec space funguje jako click() na overlay

  //F prepne do fullscreenu
  else if (keyCode == 70) {
    if (! player_mgr.isFullScreen){
      player_mgr.toggleFullScreen();
    }
  } //konec F prepne do fullscreenu

  //volume (nahoru/dolu)
  else if (keyCode == 38){//38 - nahoru
    var volume = player_mgr.getVolume();
    player_mgr.setVolume(Math.min(volume + 10, 100));
  } else if (keyCode == 40){//40 - dolu
    var volume = player_mgr.getVolume();
    player_mgr.setVolume(Math.max(volume - 10, 0));
  } //konec volume

  //preskakovani na indexy (CTRL + vpravo/vlevo)
  else if (event.keyCode == 39) {
    if ((player_mgr.settings.jumpIndexKeyboardShortcut != "false" && player_mgr.settings.jumpIndexKeyboardShortcut != false) && event.ctrlKey) {
      player_mgr.jumpToIndex(true);
    } else {
      this.seekBy(+5);
    }
  }
  else if (event.keyCode == 37) {
    if ((player_mgr.settings.jumpIndexKeyboardShortcut != "false" && player_mgr.settings.jumpIndexKeyboardShortcut != false) && event.ctrlKey) {
      player_mgr.jumpToIndex(false);
    } else {
      this.seekBy(-5);
    }
  } //konec preskakovani na indexy

  //zobrazeni verze a konfigurace (proted @)
  else if (keyCode == 50 && event.shiftKey){
    //player_mgr.stop();
    //player_mgr.showErrorScreen();
    controls.displayVersionInformation();
  } else {
    console.log('other key');
    return;
  }

  console.log('stop key propagation');
  event.stopPropagation();
  event.preventDefault();
};

PlayerMgr.prototype.toNewWindow = function(){
  var width = 640;
  var aspect = playlist.getAspect();
  var height = width / aspect;
  var left = screen.width - width - 10;
  var windowName = "newPlayerWindow";
  
  var newWindow = window.open("", windowName, "width=" + width + ",height=" + height + ",left=" + left + ",top=0,menubar=no,titlebar=no,status=no,toolbar=no,location=no");

  var url = this.settings.newWindowBaseUrl;
  if (url == undefined) {
	  url = "http://www.ceskatelevize.cz/ivysilani/window";
  }
  var newGetParams = [];
  var currentGetParams = window.location.search.replace(/^\?/, "").split("&");
  [ "w=99", "external=1" ].forEach(function(toCopy) {
	  if (currentGetParams.indexOf(toCopy) != -1) {
		  newGetParams.push(toCopy);
	  }
  });
  if (newGetParams.length != 0) {
	  url += "?" + newGetParams.join("&");
  }
  
  var form = $("<form/>", {
	  method: 'POST',
	  action: url,
	  target: windowName
  });
  var params = [
		  [ 'windowTitle', document.title ],
		  [ 'settings', this.settings, true ],
		  [ 'newWindowData', {
			  shouldPauseNewWindow: (this.playerStatus == 'paused'),
			  playlistItemIndex: this.currentItemIndex,
			  useTimeshift: this.isTimeshift,
			  startTime: this.video.currentTime,
			  positionCookie: this.positionCookie,
			  positionCookieKey: this.positionCookieKey
		  }, true ]
  ];
  params.forEach(function(param) {
	  var name = param[0];
	  var value = param[1];
	  var json = param[2];
	  if (json) {
		  value = JSON.stringify(value);
	  }
	  value = encodeURIComponent(value);
	  form.append($("<input/>", {
		  name: name,
		  value: value
	  }));
  });
  
  var formShell = $(player_mgr.mainShellId + ' #newWindowFormShell');
  formShell.empty();
  formShell.append(form);
  
  form[0].submit();
  
  this.pause(true);
};

PlayerMgr.prototype.getCookie = function(cname){
  var cookies = this.getAllCookies();
  for(var i = 0; i < cookies.length; i++) {
	  var pair = cookies[i];
	 if (pair.name == cname) {
		 return pair.value;
	 } 
  };
  return "";
};

PlayerMgr.prototype.getAllCookies = function() {
  var result = [];
  if (document.cookie == undefined) {
	  return result;
  }
  document.cookie.split(/; */).forEach(function(item) {
	  var parts = item.split('=');
	  result.push({name: parts[0], value: parts[1] });
  });
  return result;
}

PlayerMgr.prototype.computePositionCookieKey = function() {
	var key = location.pathname;
	if (location.search != undefined) {
		var search = location.search;
		search = search.replace(/^\?hash=[^&]*$/, '');
		search = search.replace(/^\?hash=[^&]*&/, '?');
		search = search.replace(/&hash=[^&]*/g, '');
		key += search;
	}
	this.positionCookieKey = encodeURIComponent(key);
	console.log('position cookie key: ', this.positionCookieKey);
}

PlayerMgr.prototype.allocatePositionCookie = function() {
	var highestCookieNumber = -1;
	var cookies = this.getAllCookies();
	var positionCookieNumbers = [];
	for(var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var match = /^videopos(\d+)$/.exec(cookie.name);
		if (match != null) {
			var number = parseInt(match[1]);
			var content = this.parsePositionCookie(cookie.value);
			if (content.key == this.positionCookieKey) {
				console.log('pre-existing position cookie found:', cookie.name);
				this.positionCookie = cookie.name;
				return;
			} else {
				if (number > highestCookieNumber) {
					highestCookieNumber = number;
				}
				positionCookieNumbers.push(number);
			}
		}
	}
	var ourCookieNumber = highestCookieNumber + 1;
    positionCookieNumbers.sort(function(a,b) {return a - b;});
	console.log('no pre-existing position cookie. Current position cookies:', positionCookieNumbers, 'total', positionCookieNumbers.length, 'will use new number', ourCookieNumber);
	while(positionCookieNumbers.length >= 10) {
		var toRemove = positionCookieNumbers.shift();
		console.log('removing position cookie ', toRemove);
		this.deleteCookie("videopos" + toRemove);
	}
	this.positionCookie = "videopos" + ourCookieNumber;
}

PlayerMgr.prototype.deletePositionCookie = function(){
	console.log('Removing position cookie');
	this.deleteCookie(this.positionCookie);
}

PlayerMgr.prototype.parsePositionCookie = function(cookieValue){
	var parts = cookieValue.split(' ');
	return {
		key: parts[0],
		item: parseInt(parts[1]),
		time: parseFloat(parts[2])
	}
};

PlayerMgr.prototype.getExpiryString = function(){
  var expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 31);
  return "; expires=" + expiryDate.toUTCString(); 
};

PlayerMgr.prototype.saveCookiesVolume = function(){
//hlasitost
	  player_mgr.saveCookie("volume", player_mgr.getVolume());
};

PlayerMgr.prototype.saveCookiesSubtitles = function(){
//titulky
          var value = player_mgr.selectedSubtitles;
	  if (player_mgr.selectedSubtitles == 'subtitlesOff') {
            value = undefined;
          }
          player_mgr.saveCookie("subtitles", value);
};

PlayerMgr.prototype.saveCookiesAudiotrack = function(){
//zvukova stopa
        player_mgr.saveCookie("audioTrack", player_mgr.currentAudioTrack);
};

PlayerMgr.prototype.saveCookiesVideoquality = function(){
  player_mgr.saveCookie("videoQuality", player_mgr.currentQuality);
};

PlayerMgr.prototype.saveCurrentPosition = function(){
	if (!this.isInsideVod()) {
		return;
	}

	var cookieValue = this.positionCookieKey + " " + this.getCurrentItemCanonicalIndex() + " " + this.video.currentTime;
	this.saveCookie(this.positionCookie, cookieValue);
};

PlayerMgr.prototype.saveCookie = function(name, value) {
  if (name == undefined) {
	  return;
  }
  document.cookie = name + "=" + ((value == undefined) ? '' : value) + player_mgr.getExpiryString() + ";path=/";
};

PlayerMgr.prototype.deleteCookie = function(name) {
	var date = new Date(0);
	document.cookie = name + '=; expires=' + date.toUTCString() + ";path=/";
}

PlayerMgr.prototype.getStreamPosition = function() {
  if (player_mgr.currentItem != undefined && player_mgr.currentItem.isLive()) {
    if (player_mgr.isTimeshift){
      return Math.min(0, player_mgr.video.currentTime - player_mgr.getStreamRange().max) - player_mgr.timeShiftOffset;
    } else {
      return undefined;
    }
  } else {
    return player_mgr.video.currentTime;
  }
};

PlayerMgr.prototype.getGemiusMovieTime = function() {
  if (player_mgr.currentItem != undefined && player_mgr.currentItem.isLive()) {
	  return -1;
  } else {
	  return player_mgr.video.currentTime;
  }
};

PlayerMgr.prototype.getStreamRange = function() {
  var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
  return {
	min: parseFloat(seekBar.min),
	max: parseFloat(seekBar.max)
  }
};

PlayerMgr.prototype.isInsideVod = function() {
	return this.isInsideVodOrLive(false);
}

PlayerMgr.prototype.isInsideVodOrLive = function(allowLive) {
	if (this.currentItem == undefined || (this.currentItem.isLive() && !allowLive) || this.currentItem.isVast) {
		// nevhodna item
		return false;
	} else if (this.playerStatus != 'playing' && player_mgr.playerStatus != 'paused') {
		// nevhodny stav
		return false;
	} else if (this.waitingForStream) {
		// pockat
		return false;
	} else {
		return true;
	}
}

PlayerMgr.prototype.isHbbTvActive = function() {
	return this.selectedTvName != undefined;
}

// VAST tracking
PlayerMgr.prototype.sendTrackingEvents = function() {
  if (player_mgr.currentItem != undefined) {
    var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
    player_mgr.currentItem.onProgress(parseFloat(seekBar.value), parseFloat(seekBar.max));
  }
}

// Deep linking
PlayerMgr.prototype.checkDeeplinking = function() {
	if (!this.isInsideVod()) {
		return;
	}
	var oldHash = this.lastLocationHash;
	this.lastLocationHash = window.location.hash;
	if (oldHash != this.lastLocationHash) {
		console.log("Location hash changed: ", this.lastLocationHash, 'was', oldHash, 'player is ', this.playerStatus);
		if (this.lastLocationHash == undefined) {
			return;
		}
		var timestampMatch = /t=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(this.lastLocationHash);
		if (timestampMatch == null) {
			console.log('bad location');
			return;
		}
		var time = 0;
		for(var groupIndex = 1; groupIndex <= 3; groupIndex++) {
			time *= 60;
			var group = timestampMatch[groupIndex];
			if (group != undefined) {
				time += parseInt(group);
			}
		}
		this.seekTo(time);
	}
}
PlayerMgr.prototype.throwAwayDeeplinkingTarget = function() {
	this.lastLocationHash = window.location.hash;
}

PlayerMgr.prototype.getCurrentItemCanonicalIndex = function() {
    return this.getItemCanonicalIndex(this.currentItemIndex);
}

PlayerMgr.prototype.getItemCanonicalIndex = function(itemIndex) {
	// vrati "skutecne" cislo item v hlavnim playlistu, bez ohledu na pocet reklam
	// preroll reklamy maji zaporna cisla, postroll reklamy maji cisla vyssi nez pocet polozek v hlavnim playlistu
    return itemIndex - playlist.getPrerollItemCount();
}

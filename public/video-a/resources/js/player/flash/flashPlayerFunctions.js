var player_id = "flashPlayerDiv";

var ie = (function () {

	var undef,
		v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');

	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		all[0]
	);

	return v > 4 ? v : undef;

}());




function appendLog(txt) {
	var d = new Date();
	var msg = '[' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '] ' + txt;

	if (ie) {
		if (ie < 9) {
			//
		} else {
			console.log(msg);
		}
	} else {
		console.log(msg);
	}
}

function play(url) {
	if (url && current_url != url) {
		loadStream(url);
	}
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerPlay();
		appendLog("start playback");
		$(document).trigger('player:play', [{}]);
		gtag('event', 'stream_flash_play');
	}
}

function pause() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerPause();
		appendLog("pause playback");
		$(document).trigger('player:pause', [{}]);
		gtag('event', 'stream_flash_pause');
	}
}

function resume() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerResume();
		appendLog("resume playback");
		$(document).trigger('player:resume', [{}]);
	}
}

function stop() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerStop();
		appendLog("stopping playback");
		$(document).trigger('player:stop', [{}]);
		gtag('event', 'stream_flash_ended');
	}
}

function setlevel(level) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSetLevel(level);
		appendLog("force level to :" + level);
	}
}

function setstartfromlevel(level) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSetstartFromLevel(level);
		appendLog("set start From level to :" + level);
	}
}

function setseekfromlevel(level) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSetseekFromLevel(level);
		appendLog("set seek From level to :" + level);
	}
}


function seek(position) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSeek(position);
		appendLog("seek to :" + position);
		gtag('event', 'stream_flash_seek');
	}
}

function volume(percent) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerVolume(percent);
		appendLog("set volume to :" + percent + "%");
	}
}

function getbufferLength() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		return obj.getbufferLength();
	}
}

function getLowBufferLength() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		return obj.getlowBufferLength();
	}
}

function setlowBufferLength(new_len) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSetlowBufferLength(new_len);
		appendLog("force low buffer len to :" + new_len);
	}
}

function getMinBufferLength() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		return obj.getminBufferLength();
	}
}

function setminBufferLength(new_len) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSetminBufferLength(new_len);
		appendLog("force min buffer len to :" + new_len);
	}
}

function getMaxBufferLength() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		return obj.getmaxBufferLength();
	}
}

function setmaxBufferLength(new_len) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSetmaxBufferLength(new_len);
		appendLog("force max buffer len to :" + new_len);
	}
}

function toggleDebugLogs() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		var state = obj.getLogDebug();
		state = !state;
		obj.playerSetLogDebug(state);
		appendLog("toggle debug logs to:" + state);
	}
}

function toggleDebug2Logs() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		var state = obj.getLogDebug2();
		state = !state;
		obj.playerSetLogDebug2(state);
		appendLog("toggle debug2 logs to:" + state);
	}
}

function toggleFlushLiveURLCache() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		var state = obj.getflushLiveURLCache();
		state = !state;
		obj.playerSetflushLiveURLCache(state);
		appendLog("toggle flush live URL cache to:" + state);
	}
}

function toggleJSURLStream() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		var state = obj.getJSURLStream();
		state = !state;
		obj.playerSetJSURLStream(state);
		appendLog("toggle JS URL stream to:" + state);
	}
}

function toggleCapLeveltoStage() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		var state = obj.getCapLeveltoStage();
		state = !state;
		obj.playerCapLeveltoStage(state);
		appendLog("toggle cap Level to Stage to:" + state);
	}
}


function getAudioTrackList() {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		var ret = obj.getAudioTrackList();
		return ret;
	}
}

function setAudioTrack(val) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.playerSetAudioTrack(val);
	}
}

function onHLSReady(message) {
	listStreams(teststreams, "streamlist");
	appendLog("onHLSReady()");

	// warn about old swf file
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		if (!obj.getPlayerVersion || obj.getPlayerVersion() < 2) {
			alert('You are using an old swf player file, or perhaps your browser is using a cached version of the swf file.');
		}
	}
}

function onVideoSize(width, height) {
	appendLog("onVideoSize(), " + width + "x" + height);
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		var state = obj.getCapLeveltoStage();
		if (!state) {
			var ratio = width / height;
			if (height > 720) {
				height = 720;
				width = height * ratio;
			}
			appendLog("onVideoSize(),resize stage to " + width + "x" + height);
			obj.width = width;
			obj.height = height;
		}
	}
}

function onComplete(message) {
	appendLog("onComplete(), playback completed");
	$(document).trigger('player:oncomplete', [{}]);
}
function onError(code, url, message) {
	appendLog("onError():error code:" + code + " url:" + url + " message:" + message);

	measure.track({
		event: 'player:error',
		errorDescription: code + message,
		videoMetadata: {
			streamType: 'tv-live',
			tvStation: 'ČT1',
			program: 'Šťastné údolí (1/6)'
		}
	});

}

function onFragment(bandwidth, level, width) {
	//appendLog("onFragment(): bandwidth:" + bandwidth + " level:" + level + " width:" + width);
}
function onManifest(duration) {
	appendLog("manifest loaded, playlist duration:" + duration.toFixed(2));
	$(document).trigger('player:onmanifest', [
		{ duration: duration.toFixed(2) }
	]);
}

function onPosition(position, duration, live_sliding, buffer, program_date) {
	$(document).trigger('player:onposition', [
		{ position: position, duration: duration, live_sliding: live_sliding, buffer: buffer, program_date: program_date }
	]);
}

function onState(newState) {
	appendLog("switching state to " + newState);
	measure.track({
		event: 'player:' + newState,
		videoMetadata: {
			streamType: 'tv-live',
			tvStation: 'ČT1',
			program: 'Šťastné údolí (1/6)'
		}
	});
}

function onSwitch(newLevel) {
	appendLog("switching level to " + newLevel);
	$(document).trigger('player:onswitch', [
		{ newLevel: newLevel }
	]);
}

function onAudioTracksListChange(trackList) {
	// update audio switcher
	appendLog("new track list");
	for (var t in trackList) {
		appendLog("    " + trackList[t].title + " [" + trackList[t].id + "]");
	}
}

function onAudioTrackChange(trackId) {
	appendLog("switching audio track to " + trackId);
}

function onRequestResource0(URL) {
	appendLog("loading fragment " + URL + " for instance 0");
	URL_request(URL, URL_readBytes0, transferFailed0, "arraybuffer");
}

function onRequestResource1(URL) {
	appendLog("loading fragment " + URL + " for instance 1");
	URL_request(URL, URL_readBytes1, transferFailed1, "arraybuffer");
}

function URL_request(url, loadcallback, errorcallback, responseType) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, loadcallback ? true : false);
	if (responseType) {
		xhr.responseType = responseType;
	}
	if (loadcallback) {
		xhr.onload = loadcallback;
		xhr.onerror = errorcallback;
		xhr.send();
	} else {
		xhr.send();
		return xhr.status == 200 ? xhr.response : "";
	}
}
function transferFailed0(oEvent) {
	appendLog("An error occurred while transferring the file :" + oEvent.target.status);
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.resourceLoadingError0();
	}
}

function transferFailed1(oEvent) {
	appendLog("An error occurred while transferring the file :" + oEvent.target.status);
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.resourceLoadingError1();
	}
}


function URL_readBytes0(event) {
	appendLog("fragment loaded");
	var res = base64ArrayBuffer(event.currentTarget.response);
	resourceLoaded0(res);
}

function URL_readBytes1(event) {
	appendLog("fragment loaded");
	var res = base64ArrayBuffer(event.currentTarget.response);
	resourceLoaded1(res);
}


function resourceLoaded0(res) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.resourceLoaded0(res);
	}
}

function resourceLoaded1(res) {
	var obj = getFlashMovieObject(player_id);
	if (obj != null) {
		obj.resourceLoaded1(res);
	}
}

function base64ArrayBuffer(arrayBuffer) {
	var base64 = ''
	var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	var bytes = new Uint8Array(arrayBuffer)
	var byteLength = bytes.byteLength
	var byteRemainder = byteLength % 3
	var mainLength = byteLength - byteRemainder
	var a, b, c, d, chunk

	for (var i = 0; i < mainLength; i = i + 3) {
		chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
		a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
		b = (chunk & 258048) >> 12 // 258048 = (2^6 - 1) << 12
		c = (chunk & 4032) >> 6 // 4032 = (2^6 - 1) << 6
		d = chunk & 63 // 63 = 2^6 - 1
		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
	}

	if (byteRemainder == 1) {
		chunk = bytes[mainLength]
		a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
		b = (chunk & 3) << 4 // 3 = 2^2 - 1
		base64 += encodings[a] + encodings[b] + '=='
	} else if (byteRemainder == 2) {
		chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
		a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
		b = (chunk & 1008) >> 4 // 1008 = (2^6 - 1) << 4
		c = (chunk & 15) << 2 // 15 = 2^4 - 1
		base64 += encodings[a] + encodings[b] + encodings[c] + '='
	}

	return base64;
}


function getFlashMovieObject(movieName) {
	if (window.document[movieName]) {
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet") == -1) {
		if (document.embeds && document.embeds[movieName])
			return document.embeds[movieName];
	}
	else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
	{
		return document.getElementById(movieName);
	}
}

//59109745109247353 - id filmu "Pod hladinou" (Geislerka na bazenu)
//!! Ten puvodni objektovy navrh by sel pouzit; metoda $().bind(), pouzitelna pro
//odchytavani eventu, umoznuje poslat do zpracovavaci metody data !!//
var player = null;
var apiTarget;

/**
 * The main class, encapsulating the whole player.
 * @class
 */
function PlayerShell() {
}

PlayerShell.prototype.init = function() {
  //ajaxSetup, ktery kopiruje bezpecnostni nastaveni, jak ho ma ostra stranka
  $.ajaxSetup({
      beforeSend: function(xhr) {
          xhr.setRequestHeader('x-addr', '127.0.0.1');
      }
  });

  $('#applyInputsBtn').click(PlayerShell.play);
  $('#playDASH').click(PlayerShell.playDASH);
  $('#playHLS').click(PlayerShell.playHLS);
  $('#playLiveDASH').click(PlayerShell.playLiveDASH);
  $('#playLiveHLS').click(PlayerShell.playLiveHLS);
  $('#startChanger').click(PlayerShell.startLiveTsChanger);

  $('#playlistInputShell').css('float', 'left');
  $('#flashvarsInputShell').css('float', 'left');

  //$('#inputFieldsShell').css('height', '200px');

  $('#versionInfoShell h1').css('font-size', '60px');

  $('#shrinkPlayer').click(function() {
		 var player = $("#playerMainShell");
		 player.css('width', (player.width() - 50) + 'px');
	  });
  $('#enlargePlayer').click(function() {
		 var player = $("#playerMainShell");
		 player.css('width', (player.width() + 50) + 'px');
	  });
  $('#setPlayerWidth').click(function() {
	     var width = $("#playerWidthInput").val();
		 var player = $("#playerMainShell");
		 player.css('width', parseInt(width) + 'px');
	  });
  window.setInterval(function() {
	 $("#playerWidthInfo").text($("#playerMainShell").width()); 
  }, 100);
  
  this.initApiEmulator();
};


function showApiResult(result) {
  console.log("RESULT: ", result);
}

PlayerShell.prototype.initApiEmulator = function() {
  $("#showApiEmulator").click(function(e) {
    e.preventDefault();
    $("#apiEmulator").css('display', 'block');
  });
  $("#getPlayerAudioTrackList").click(function(e) {
	    e.preventDefault();
	    showApiResult(apiTarget.getPlayerAudioTrackList());
	  });
  $("#getPlayerSubtitleTrackList").click(function(e) {
	    e.preventDefault();
	    showApiResult(apiTarget.getPlayerSubtitleTrackList());
	  });
  $("#getPlayerLevels").click(function(e) {
    e.preventDefault();
    showApiResult(apiTarget.getPlayerLevels());
  });
  $("#setPlayerAudioTrack").click(function(e) {
	    e.preventDefault();
	     showApiResult(apiTarget.setPlayerAudioTrack($("#setPlayerAudioTrackArg1")[0].value));
	  });
  $("#setPlayerSubtitleTrack").click(function(e) {
	    e.preventDefault();
	    var value = $("#setPlayerSubtitleTrackArg1")[0].value;
	     showApiResult(apiTarget.setPlayerSubtitleTrack((value == '') ? undefined : value));
	  });
  $("#setPlayerLevel").click(function(e) {
    e.preventDefault();
     showApiResult(apiTarget.setPlayerLevel($("#setPlayerLevelArg1")[0].value));
  });
  $("#getStreamPosition").click(function(e) {
    e.preventDefault();
    showApiResult(apiTarget.getStreamPosition());
  });
  $("#play").click(function(e) {
    e.preventDefault();
    showApiResult(apiTarget.play());
  });
  $("#pause").click(function(e) {
    e.preventDefault();
    showApiResult(apiTarget.pause());
  });
  $("#stop").click(function(e) {
    e.preventDefault();
    showApiResult(apiTarget.stop());
  });
  $("#seek").click(function(e) {
    e.preventDefault();
     showApiResult(apiTarget.seek($("#seekArg1")[0].value));
  });
  $("#fullScreenOn").click(function(e) {
    e.preventDefault();
    showApiResult(apiTarget.fullScreen(true));
  });
  $("#fullScreenOff").click(function(e) {
    e.preventDefault();
    window.setTimeout(function() {
    	showApiResult(apiTarget.fullScreen(false));
    }, 3000);
  });
  $("#switchToLive").click(function(e) {
    e.preventDefault();
    showApiResult(apiTarget.switchToLive());
  });
  $("#switchToTimeshift").click(function(e) {
    e.preventDefault();
    var paused = $("input[name='switchToTimeshiftPaused']:checked").val();
    if (paused == 'undefined') {
    	paused = undefined;
    } else if (paused == 'true') {
    	paused = true;
    } else if (paused == 'false') {
    	paused = false;
    }
    var position = $("#switchToTimeshiftPosition")[0].value;
    if (position == '') {
    	position = undefined;
    } else {
    	position = parseInt(position);
    }
    showApiResult(apiTarget.switchToTimeshift(paused, position));
  });
  $("#setAudioLevel").click(function(e) {
	    e.preventDefault();
	     showApiResult(apiTarget.setAudioLevel($("#setAudioLevelArg1")[0].value));
	  });
  $("#getCurrentPlaylistItem").click(function(e) {
	    e.preventDefault();
	     showApiResult(apiTarget.getCurrentPlaylistItem());
	  });
  $("#setPlaylistItem").click(function(e) {
	    e.preventDefault();
	     showApiResult(apiTarget.setPlaylistItem($("#setPlaylistItemArg1")[0].value));
	  });
}

PlayerShell.prototype.parseInputs = function(){
  var flashvarsString = $('#flashvarsInput').val();
  try{
    var flashvarsInput = JSON.parse(flashvarsString);
    var playlistString = $('#playlistInput').val();
    try{
      var playlistInput = JSON.parse(playlistString);
      flashvarsInput.playlist = playlistInput;
      flashvarsInput.playlistURL = "";
    }catch(err){
    }
  } catch(err){
    console.log("error parsing settings");
    console.log(err);
    player_mgr.showErrorScreen();
    return;
  }
  var width = $('#playerWidthInput').val();
  //var isPC = $('#clientTypeInput').val();
  //var isLive = $('#streamTypeInput').val();

  flashvarsInput.width = width;
  //flashvarsInput.playlist.type = (isLive != 0 ? "LIVE" : "VOD");
  //console.log(flashvarsInput.playlist);
  return flashvarsInput;
};

PlayerShell.applyInputs = function(playlistURL, streamingProtocol) {
  var flashvarsInput = player.parseInputs();
  if (typeof flashvarsInput !== 'undefined'){
    if (typeof playlistURL !== 'undefined'){
      flashvarsInput.playlistURL = playlistURL;
      flashvarsInput.streamingProtocol = streamingProtocol;
    }
    apiTarget = player_mgr.init("#playerMainShell", flashvarsInput);//, "http://zizkohrad.no-ip.org/~ashley/!devel/devterium-player/");
    console.log('api target: ', apiTarget);
  } else {
    console.log("devteriumCtPlayer.init: Playlist was not found!");
  }
};

PlayerShell.play = function(){
  PlayerShell.applyInputs();
};

PlayerShell.playDASH = function(){
  PlayerShell.applyInputs("playlist_example.txt", "DASH");
};

PlayerShell.playHLS = function(){
  PlayerShell.applyInputs("playlist_example_HLS.txt", "HLS");
};

PlayerShell.playLiveDASH = function(){
  PlayerShell.applyInputs("playlist_example_live.txt", "DASH");
};

PlayerShell.playLiveHLS = function(){
  PlayerShell.applyInputs("playlist_example_live_HLS.txt", "HLS");
};

PlayerShell.startLiveTsChanger = function(){
  var changerDelay = parseInt($('#changerDelay').val());
  if (isNaN(changerDelay)){
    alert("Wrong delay");
    return;
  }
  if (! playlist || ! player_mgr.currentItem.isLive()){
    alert("Live playlist must be loaded to run changer");
  }
  if (playlist && player_mgr.currentItem.isLive()){
    player_mgr.performLiveTsChanger = true;
    player_mgr.liveTsChangerDelay = changerDelay;
    player_mgr.switchTimeshift(! player_mgr.isTimeshift, player_mgr.playerStatus == 'paused');
  }
};

PlayerShell.prototype.log = function(obj, mthd, msg) {
  if (typeof msg === 'object'){
    console.log(obj.constructor.name + ":: " + mthd + ":: " + msg.detail);
  } else {
    console.log(obj.constructor.name + ":: " + mthd + ":: " + msg);
  }
};

function init_player() {
  player = new PlayerShell();
  $('#versionInfoShell h1').text('verze ' + player_mgr.version);
  player.init();
};

document.addEventListener('DOMContentLoaded', init_player, false);

function testCallback() {
	console.log('CALLBACK CALLED');
	var args = Array.prototype.slice.call(arguments);
	args.forEach(function(item, index) {
		console.log('arg #' + index, item);
	});
}



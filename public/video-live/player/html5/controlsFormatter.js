//****************************************************************/
//******************  Formatovaci parametry  *********************/
//****************************************************************/

function ControlsFormatter(){
	this.activeSceeen = undefined;
}

//****************************************************************/
//********************  Set container size  **********************/
//****************************************************************/

ControlsFormatter.prototype.setContainerSize = function() {
  console.log("setContainerSize");
  formatter.playerWidth = $(player_mgr.mainShellId).width();
  if (player_mgr.settings.uimode == 'audio') {
	  return;
  }
  
  var aspect;
  if (player_mgr.currentItem != undefined){
	aspect = player_mgr.currentItem.getAspect();
  } else if (formatter.playerHeight == undefined) {
	aspect = 16.0 / 9;
  }
  if (aspect != undefined) {
	formatter.playerHeight = formatter.playerWidth / aspect; 
	$(player_mgr.mainShellId).css('height', formatter.playerHeight + 'px');
  }
  
  console.log("new dimensions: w " + formatter.playerWidth + ", h " + formatter.playerHeight + ", a " + aspect);
};

ControlsFormatter.prototype.checkResize = function(){
  if ($(player_mgr.mainShellId).width() != this.playerWidth) {
	  this.setContainerSize();
	  this.format();
  }
};

//****************************************************************/
//******************  Transform video element  *******************/
//****************************************************************/
ControlsFormatter.prototype.transformVideo = function (scaleX, scaleY) {
player_mgr.video.style.transform = "";
player_mgr.video.style.msTransform = "";
player_mgr.video.style.MozTransform = "";
player_mgr.video.style.webkitTransform  = "";

  if (scaleX){
    var transX = 1 / (1 - scaleX / 100);
//    player_mgr.video.style.transform += "scaleX(" + transX + ")";
    player_mgr.video.style.msTransform += "scaleX(" + transX + ")";
    player_mgr.video.style.MozTransform += "scaleX(" + transX + ")";
    player_mgr.video.style.webkitTransform += "scaleX(" + transX + ")";    
  }
  if (scaleY){
    var transY = 1 / (1 - scaleY / 100);
//    player_mgr.video.style.transform += "scaleY(" + transY + ")";
    player_mgr.video.style.msTransform += "scaleY(" + transY + ")";
    player_mgr.video.style.MozTransform += "scaleY(" + transY + ")";
    player_mgr.video.style.webkitTransform += "scaleY(" + transY + ")";
  }
};


//****************************************************************/
//********************  Seek range changed  **********************/
//****************************************************************/

ControlsFormatter.onSeekRangeChanged = function(event){
  // Neni-li v eventu hodnota nastavíme rozsah seekbaru od 0
  var min = event.start || 0;
  // Neni-li v eventu hodnota, pouzijeme duration a v TS magickou konstantu
  var max = event.end || (player_mgr.isTimeshift ? (player_mgr.timeShiftDuration) : video_element.duration);
  formatter.updateSeekBarRange(min, max);
};

ControlsFormatter.prototype.updateSeekBarRange = function(min, max){
  var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
  seekBar.min = min;
  seekBar.max = max;
  formatter.formatTotalTime();  
}

ControlsFormatter.prototype.formatTotalTime = function(){
 var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
 var totalTimeInfo = $(player_mgr.mainShellId + ' #totalTimeInfo');
  if (!isNaN(seekBar.max) && (player_mgr.currentItem != undefined) && !player_mgr.currentItem.isLive()){
    var totalTimeInfoText = controls.buildTimeString(seekBar.max);
    totalTimeInfo[0].textContent = totalTimeInfoText;
    var totalTimeInfoWidth = 60;
  } else {
    totalTimeInfo[0].textContent = "";
    var totalTimeInfoWidth = 0;
  }
};



//****************************************************************/
//*************************  format()  ***************************/
//****************************************************************/

ControlsFormatter.prototype.format = function(){
  var isPC = player_mgr.isPC;
  var isVoD = (player_mgr.currentItem == undefined) ? true : ! player_mgr.currentItem.isLive();
  var isTimeshift = (player_mgr.isTimeshift == true);

  console.log("Formatting buttons");
  //A) zformatovat videoButtons a ulozit jejich sirku
  formatter.formatVideoButtons(isPC, isVoD, isTimeshift);
  formatter.formatTimeShiftButtons(isPC, isVoD, isTimeshift);

  console.log("Formatting time info");
  //B) nastavit zobrazeni celkoveho casu videa
  formatter.formatTotalTime();

  if (! isVoD && ! isTimeshift){
    $(player_mgr.mainShellId + ' #seekBarShell').css('display', 'none');
  } else {
    $(player_mgr.mainShellId + ' #seekBarShell').css('display', 'block');
  }

  if (! isPC) {
	  $(player_mgr.mainShellId + ' #videoShell').removeClass('controlsExited');
	  $(player_mgr.mainShellId + ' .playerMainShell').addClass('mobilePlayer');
  }

  console.log("Formatting breakpoint values");
  if (player_mgr.settings.uimode != 'audio') {
	  var videoWidth = $(player_mgr.mainShellId).width();
      formatter.setControlsIconsLarge(!isPC);
  	  if (player_mgr.settings.fixedLayout){
        formatter.setBreakpointLevel(1);
        formatter.setSettingsLayout(1);
        formatter.setAddTvLayout(1);
        formatter.setSubtitlesLayout(2);
        formatter.setErrorLayout(1);
        formatter.setNextInSeriesLayout(1);
  	  } else if (videoWidth >= 1180){
	    if (!isPC){
	      formatter.setBreakpointLevel(2);
	      formatter.setSettingsLayout(2);
          formatter.setAddTvLayout(2);
	    } else {
	      formatter.setBreakpointLevel(1);
	      formatter.setSettingsLayout(1);
	      formatter.setAddTvLayout(1);
	    }
        formatter.setSubtitlesLayout(2);
	    formatter.setErrorLayout(1);
        formatter.setNextInSeriesLayout(1);
	  } else if (videoWidth >= 940){
	    if (!isPC){
	      formatter.setBreakpointLevel(2);
	      formatter.setSettingsLayout(2);
          formatter.setAddTvLayout(2);
	    } else {
	      formatter.setBreakpointLevel(1);
	      formatter.setSettingsLayout(1);
          formatter.setAddTvLayout(1);
	    }
        formatter.setSubtitlesLayout(4);
	    formatter.setErrorLayout(1);
        formatter.setNextInSeriesLayout(2);
	  } else if (videoWidth >= 620){
			if (!isPC) {
			  formatter.setSettingsLayout(3);
	          formatter.setAddTvLayout(4);
			} else {
			  formatter.setSettingsLayout(2);
	          formatter.setAddTvLayout(2);
			}
	        formatter.setBreakpointLevel(2);
	        formatter.setSubtitlesLayout(5);
		    formatter.setErrorLayout(1);
	        formatter.setNextInSeriesLayout(2);
	  } else if (videoWidth >= 540){
			if (!isPC) {
	          formatter.setAddTvLayout(4);
			} else {
	          formatter.setAddTvLayout(3);
			}
	        formatter.setBreakpointLevel(2);
			formatter.setSettingsLayout(3);
	        formatter.setSubtitlesLayout(5);
		    formatter.setErrorLayout(1);
	        formatter.setNextInSeriesLayout(3);
	  } else if (videoWidth >= 480){
	    formatter.setSubtitlesLayout(7);
	    formatter.setBreakpointLevel(3);
	    formatter.setSettingsLayout(3);
        formatter.setAddTvLayout(5);
	    formatter.setErrorLayout(1);
        formatter.setNextInSeriesLayout(3);
	  } else {
	    formatter.setSubtitlesLayout(8);
	    formatter.setBreakpointLevel(3);
	    formatter.setSettingsLayout(4);
        formatter.setAddTvLayout(6);
	    formatter.setErrorLayout(2);
        formatter.setNextInSeriesLayout(3);
	  }
  }
  
  formatter.formatHbbtv();
  
  formatter.addOrRemoveClass($(player_mgr.mainShellId + ' .playerMainShell'), player_mgr.isThisNewWindow, 'inNewWindow');
};

ControlsFormatter.prototype.setSubtitlesLayout = function(level){
  var overlay = $(player_mgr.mainShellId + " #overlay");
  var subtitlesShell = $(player_mgr.mainShellId + " #subtitlesShell");
  this.setOneOfClasses(overlay, 'subtitlesLayout', level, 8);
  this.setOneOfClasses(subtitlesShell, 'subtitlesLayout', level, 8);
};
ControlsFormatter.prototype.setErrorLayout = function(level){
	  var target = $(player_mgr.mainShellId + ' .playerMainShell');
	  this.setOneOfClasses(target, 'errorLayout', level, 2);
	};
ControlsFormatter.prototype.setNextInSeriesLayout = function(level){
  var target = $(player_mgr.mainShellId + ' .playerMainShell');
  this.setOneOfClasses(target, 'nextInSeriesLayout', level, 3);
};

ControlsFormatter.prototype.setBreakpointLevel = function(level){
  //var overlay = $(player_mgr.mainShellId + ' #overlay');
  var overlay = $(player_mgr.mainShellId + ' .playerMainShell');
  this.setOneOfClasses(overlay, 'breakpoint', level, 3);
  formatter.formatIndexes();
};

//----------------------------- rozlozeni settingu ------------------------------//
//
ControlsFormatter.prototype.setSettingsLayout = function(type){
  //console.log("settings layout", type);
  var settings = $(player_mgr.mainShellId + " #settingsDiv");
  this.setOneOfClasses($(player_mgr.mainShellId + ' .playerMainShell'), 'settingsLayout', type, 4);

  var leftColumnContent = settings.find("#leftColumn .columnContent");
  var rightColumnContent = settings.find("#rightColumn .columnContent");

  var settingsHbbtv = settings.find("#settingsHbbtv").detach();
  var settingsSubtitles = settings.find("#settingsSubtitles").detach();
  var settingsAudio = settings.find("#settingsAudio").detach();
  var settingsQuality = settings.find("#settingsQuality").detach();

  switch (type) {
    case 1:
    case 2:
      settingsHbbtv.appendTo(leftColumnContent);
      settingsHbbtv.removeClass("dropDown");
      settingsSubtitles.appendTo(leftColumnContent);
      settingsSubtitles.addClass("dropDown");
      settingsAudio.appendTo(leftColumnContent);
      settingsAudio.addClass("dropDown");
      settingsQuality.appendTo(rightColumnContent);
      settingsQuality.removeClass("dropDown");
      break;

    case 3:
      settingsHbbtv.appendTo(leftColumnContent);
      settingsHbbtv.removeClass("dropDown");
      settingsSubtitles.appendTo(rightColumnContent);
      settingsSubtitles.addClass("dropDown");
      settingsAudio.appendTo(rightColumnContent);
      settingsAudio.addClass("dropDown");
      settingsQuality.appendTo(rightColumnContent);
      settingsQuality.addClass("dropDown");
      break;

    case 4:
      settingsHbbtv.appendTo(leftColumnContent);
      settingsHbbtv.addClass("dropDown");
      settingsSubtitles.appendTo(leftColumnContent);
      settingsSubtitles.addClass("dropDown");
      settingsAudio.appendTo(leftColumnContent);
      settingsAudio.addClass("dropDown");
      settingsQuality.appendTo(leftColumnContent);
      settingsQuality.addClass("dropDown");
      break;

  }
  
  this.currentSettingsLayout = type;
  this.recenterSettings();
};

ControlsFormatter.prototype.recenterSettings = function() {
	var settingsDiv = $(player_mgr.mainShellId + ' #settingsDiv');
	if (player_mgr.settings.fixedLayout) {
		return;
	}
	if (this.currentSettingsLayout != 1) {
		  settingsDiv.css('right', '');
		  return;
	}

	var player = $(player_mgr.mainShellId);
	var settingsShell = $(player_mgr.mainShellId + ' #settingsShell');
	var qualitySelector = $(player_mgr.mainShellId + ' #settingsQuality .settingsSelector');
	
	if (settingsShell.width() == 0 || qualitySelector.width() == 0) {
		return;
	}
	
	var rightBorder = player.offset().left + player.width(); // absolutni souradnice praveho okraje playeru
	var targetPoint = settingsShell.offset().left + settingsShell.width() / 2; // absolutni souradnice stredu tlacitka Settings
	var targetPointFromRight = rightBorder - targetPoint; // vzdalenost stredu tlacitka settings od praveho okraje playeru
	
	var settingsRightBorder = settingsDiv.offset().left + settingsDiv.width(); // absolutni souradnice praveho okraje settingsdivu
	var qualitySelectorMiddle = qualitySelector.offset().left + qualitySelector.width() / 2; // absolutni souradnice stredu kvalit od praveho okraje settingsdivu
	var inSettingsWidth = settingsRightBorder - qualitySelectorMiddle; // vzdalenost stredu kvalit od praveho okraje settingsdivu
	
	var right = targetPointFromRight - inSettingsWidth; // o kolik musime posunout settingsdiv zprava, aby stred kvalit byl nad stredem tlacitka Settings
	if (right < 4) {
		right = 4;
	}
	
	settingsDiv.css('right', right + 'px');
}

ControlsFormatter.prototype.setAddTvLayout = function(index){
  this.setOneOfClasses($(player_mgr.mainShellId + " #settingsDiv"), 'addTvLayout', index, 6);
}

ControlsFormatter.prototype.closeSettingsDropDowns = function() {
  var settingsElements = $(player_mgr.mainShellId + " .settingsElement");
  settingsElements.removeClass("dropDownOpen");
}

ControlsFormatter.prototype.openSettingsDropDown = function(element) {
  var settingsElement = $(element).closest('.settingsElement');
  var hasFocus = settingsElement.find(':focus').length > 0;
  this.closeSettingsDropDowns();
  settingsElement.addClass("dropDownOpen");
  if (hasFocus) {
	  settingsElement.find('.settingsSelectorList .listItem')[0].focus();
  }
}

ControlsFormatter.prototype.setControlsIconsLarge = function(value){
  var playerMainShell = $(player_mgr.mainShellId + " .playerMainShell");
  if (value){
    playerMainShell.removeClass("smallControlsIcons");
    playerMainShell.addClass("largeControlsIcons");
  } else {
    playerMainShell.removeClass("largeControlsIcons");
    playerMainShell.addClass("smallControlsIcons");
  }
};

//****************************************************************/
//*******************  formatVideoButtons() **********************/
//****************************************************************/

ControlsFormatter.prototype.formatVideoButtons = function(isPC, isVoD, isTimeshift) {
  $(player_mgr.mainShellId + ' #volumeShell').css('display', player_mgr.settings.audioControlHidden ? 'none' : 'inline-block');
  $(player_mgr.mainShellId + ' #volumeButtons').css('display', player_mgr.settings.audioControlHidden ? 'none' : 'inline-block');
  $(player_mgr.mainShellId + ' #settingsShell').css('display', 'inline-block');
};

ControlsFormatter.prototype.formatTimeShiftButtons = function(isPC, isVoD, isTimeshift) {
  $(player_mgr.mainShellId + ' #liveShell').css('display', isVoD ? 'none' : 'inline-block');
  $(player_mgr.mainShellId + ' #backInTimeShell').css('display', (isVoD || isTimeshift || !player_mgr.settings.enableDVR) ? 'none' : 'inline-block');
  if (! isTimeshift){
    //formatter.setButtonActive(player_mgr.mainShellId + ' #liveShell', true);
    $(player_mgr.mainShellId + ' #liveShell').addClass('isLive');
    $(player_mgr.mainShellId + ' #liveShell').removeAttr('title');
    $(player_mgr.mainShellId + ' #liveShell').removeAttr('aria-label');
  } else {
    //formatter.setButtonActive(player_mgr.mainShellId + ' #liveShell', false);
    $(player_mgr.mainShellId + ' #liveShell').removeClass('isLive');
    $(player_mgr.mainShellId + ' #liveShell').attr('title', 'Živě');
    $(player_mgr.mainShellId + ' #liveShell').attr('aria-label', 'Živě');
  }
};

//****************************************************************/
//*************** seek bar format + activation *******************/
//****************************************************************/

ControlsFormatter.prototype.formatIndexes = function(){
  if (player_mgr.currentItem == undefined) {
	  return;
  }
  //console.log("formatting indexes");
  //indexy
  var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
  //var indexes = player_mgr.currentItem.indexes ? player_mgr.currentItem.indexes : [];
  var indexes = player_mgr.currentItem.getIndexes();
  var oldIndexes = $(player_mgr.mainShellId + ' .seekBarIndex');
//  console.log("Old indexes", oldIndexes);
  $(player_mgr.mainShellId + ' .seekBarIndex').remove();
  var remIndexes = $(player_mgr.mainShellId + ' .seekBarIndex');
//  console.log("Indexes afetr remove", remIndexes);
//  console.log("Indexes of actual item" , indexes); 

  for (var i = 0; i < indexes.length; i++){
    var seekBarWidth = $(player_mgr.mainShellId + ' #seekBar').innerWidth();
    var seekBarWidth2 = $(player_mgr.mainShellId + ' #seekBar').width();
//    console.log(seekBarWidth, seekBarWidth2);
    formatter.addFormattedIndex(indexes[i], seekBar.max, seekBarWidth);
  }
  //$(player_mgr.mainShellId + ' #seekBarThumbCircle').css('bottom', '-3px');
  /*$(player_mgr.mainShellId + ' #seekBarTimeInfo').css('bottom', '-6px');*/
  $(player_mgr.mainShellId + ' #seekBarTimeInfo').css('padding-left', '12px');
};

ControlsFormatter.prototype.addFormattedIndex = function(index, maxTime, barWidth){
//  console.log("Adding formatted index ", index, maxTime, barWidth);
  //vytvorit index
  var indexElement = $('<div/>', {'class': 'seekBarIndex'});
  //umistit ho na spravne misto v html
  indexElement.insertAfter($(player_mgr.mainShellId + ' #seekBar'));
  //nastavit css background, left a bottom
  indexElement.css('background', formatter.indexLineColor);
  indexElement.css('left', 100 * index.time / maxTime + "%");
  indexElement[0].addEventListener('mouseenter', function(event){
	var positionInSeekBar = $(event.target).position().left + 1;
	controls.showPreviewOrIndexImage(
		positionInSeekBar, 
		formatter.indexLineColor, 
		index.imageUrl, 
		0, 
		0, 
		controls.buildTimeString(index.time),
		index.title
	);
  });
  indexElement[0].addEventListener('mouseleave', function(event){
	  controls.hidePreviewImage();
  });
  $(indexElement[0]).click(function(event){
    player_mgr.seekToIndex(index.time);
  });
};

//****************************************************************/
//*************** full screen ikona (in, out)  *******************/
//****************************************************************/

ControlsFormatter.prototype.setFullScreenButtonIcon = function(value){
  $(player_mgr.mainShellId + ' #fullScreenShell').attr('title', (value ? 'Zrušit celou obrazovku' : 'Na celou obrazovku'));
  $(player_mgr.mainShellId + ' #fullScreenShell').attr('aria-label', (value ? 'Zrušit celou obrazovku' : 'Na celou obrazovku'));
  $(player_mgr.mainShellId + ' #fullScreenBtn #fullScreen').css('display', (value ? 'none' : 'inline-block'));
  $(player_mgr.mainShellId + ' #fullScreenBtn #smallScreen').css('display', (value ? 'inline-block' : 'none'));
};

//****************************************************************/
//********************** setupForLoadedSource  *******************/
//****************************************************************/

ControlsFormatter.prototype.setupForLoadedSource = function(){
  logger.log(formatter, INFO, "filling settings div with info about loaded stream");

  formatter.format();

  if (player_mgr.settings.uimode == 'full'){
	formatter.formatHbbtvSelector();
	formatter.formatSubtitlesSelector();
	formatter.formatAudioSelector();
	formatter.formatQualitySelector();
  } else {
    formatter.updateAudioSubtitles(player_mgr.getSubtitlesInfo());
    $(player_mgr.mainShellId + ' #seekBarShell').removeClass('notLoaded');
  }
  
  formatter.addOrRemoveClass($(player_mgr.mainShellId + ' .playerMainShell'), player_mgr.currentItem.isVast, 'isVast');

  formatter.formatHbbtv();
  $(player_mgr.mainShellId + ' #hbbTvOverlayImage').attr('src', playlist.getPreviewImageUrl());

  formatter.formatClickThrough();
  
  controls.updateSeekBar();
  
  console.log("setup over", player_mgr.video.currentTime);
};

ControlsFormatter.prototype.formatClickThrough = function() {
	var playing = (player_mgr.playerStatus == 'playing');
	var hasClickThrough = (player_mgr.currentItem.getClickThroughUrl() != undefined);
	formatter.addOrRemoveClass($(player_mgr.mainShellId + ' #overlay'), (playing && hasClickThrough), 'clickThrough');
}
ControlsFormatter.prototype.formatHbbtv = function(){
	var thisFormatter = this;
	this.formatHbbtvSelector();
	
	if (player_mgr.getAvailTVsInfo().length == 0) {
		  $(player_mgr.mainShellId + ' #hbbTvShell').css('display', 'none');
	} else {
		  $(player_mgr.mainShellId + ' #hbbTvShell').css('display', 'inline-block');
		  
		  var tvList = $(player_mgr.mainShellId + ' #hbbTvList');
		  tvList.empty();
		  player_mgr.getAvailTVsInfo().forEach(function(item) {
			  var isSelected = (item == player_mgr.selectedTvName);
			  var itemHtml = '<div class="listItem';
			  if (isSelected) {
				  itemHtml += ' selectedListItem';
			  }
			  itemHtml += '">' + item;
			  if (isSelected) {
				  itemHtml += '<svg><use xlink:href="#icon-ico-tv-linked"></use></svg>';
			  }
			  itemHtml += '</div>';

			  var jItemHtml = $(itemHtml);
			  jItemHtml.appendTo(tvList);
			  
			  jItemHtml.bind('click', function(event) {
				  event.stopPropagation();
				  player_mgr.activateHbbTv(item);
				  thisFormatter.deactivateScreen('hbbTv');
			  });
		  });
	}
	
	this.addOrRemoveClass($(player_mgr.mainShellId + ' .playerMainShell'), (player_mgr.selectedTvName != undefined), 'hbbTvActive');
	
	this.recenterSettings();
}

//****************************************************************/
//******************  Settings contents  *************************/
//****************************************************************/

ControlsFormatter.prototype.formatHbbtvSelector = function(){
    controls.setSettingsListItems("settingsHbbtv", player_mgr.getAvailTVsInfo(), 
            formatter.formatHbbtvItem, formatter.hbbtvItemSelected, 0, 'TV');
}

ControlsFormatter.prototype.formatHbbtvItem = function(availTv){
  var removeTitle = "Odebrat " + availTv;
  var content = 
	  '<span>' + availTv + '</span>' + 
	  '<svg class="hbbTvSettingsItemLinkedIcon"><use xlink:href="#icon-ico-tv-linked"></use></svg>' +
	  '<svg class="hbbTvSettingsItemRemoveIcon" id="removeHbbtvIcon-' + availTv + '" tabindex="4" title="' + removeTitle + '" aria-label="' + removeTitle + '" aria-role="button"><use xlink:href="#icon-ico-close"></use></svg>';
  return {
	  value: availTv,
	  text: content,
	  selected: (availTv == player_mgr.selectedTvName),
	  label: availTv,
	  iconHandlers: {
		  hbbTvSettingsItemRemoveIcon: function(event, value) {
			  var thisIcon = this;
			  var confirmButton = $(player_mgr.mainShellId + ' #removeTvConfirm');
			  confirmButton.off('click');
			  confirmButton.on('click', function() {
				  player_mgr.removeHbbtvDevice(value);
				  formatter.deactivateSettingsInnerPage();
				  if ($(this).is(':focus')) {
					  thisIcon.focus();
				  }
			  });
			  var cancelButton = $(player_mgr.mainShellId + ' #removeTvCancel');
			  cancelButton.off('click');
			  cancelButton.on('click', function() {
				  formatter.deactivateSettingsInnerPage();
				  if ($(this).is(':focus')) {
					  thisIcon.focus();
				  }
			  });
			  var focused = this.is(':focus');
			  if (focused) {
				  confirmButton.focus();
			  }
			  formatter.activateSettingsInnerPage('removeTvActive');
			  event.stopPropagation();
			  event.preventDefault();
		  }
	  }
  };
};

ControlsFormatter.prototype.hbbtvItemSelected = function(hbbtvName){
	if (player_mgr.selectedTvName == undefined) {
		player_mgr.activateHbbTv(hbbtvName);
	} else {
		player_mgr.deactivateHbbTv();
	}
};

ControlsFormatter.prototype.formatSubtitlesSelector = function(){
	var subtitlesInfo = player_mgr.getSubtitlesInfo().slice();
	var subtitlesOff = {value: 'subtitlesOff', language: undefined, text: 'Vypnuty'};
	subtitlesInfo.unshift(subtitlesOff);
	controls.setSettingsListItems("settingsSubtitles", subtitlesInfo, 
			formatter.formatSubtitlesItem, formatter.subtitlesItemSelected, 2, 'Titulky');
}

ControlsFormatter.prototype.formatSubtitlesItem = function(subtitle){
  console.log("Formating subtitles", subtitle);	
  var subtitleSpan = $('<span/>').text(subtitle.text);
  return { value: { id: subtitle.value, language: subtitle.language }, text: subtitleSpan.html(), selected: (subtitle.language == player_mgr.selectedSubtitles) };
};

ControlsFormatter.prototype.subtitlesItemSelected = function(subtitleValue){
  console.log("Selected subtitles", subtitleValue);
  player_mgr.selectSubtitles(subtitleValue.language);
};
ControlsFormatter.prototype.formatAudioSelector = function(){
	var audioTracks = player_mgr.getAudioTracks();
	controls.setSettingsListItems("settingsAudio", audioTracks, 
			formatter.formatAudioItem, formatter.audioItemSelected, 2, 'Zvuková stopa');
}

ControlsFormatter.prototype.formatAudioItem = function(audioTrack, index){
  var isSelected;
  if (player_mgr.currentAudioTrack == undefined) {
    isSelected = (index == 0);
  } else {
    isSelected = (audioTrack.value == player_mgr.currentAudioTrack);
  }
  var audioSpan = $('<span/>').text(audioTrack.text);
  return { value: audioTrack.value, text: audioSpan.html(), selected: isSelected };
};

ControlsFormatter.prototype.audioItemSelected = function(audioTrackValue) {
  console.log('audioItemSelected', audioTrackValue);
  player_mgr.setAudioTrack(audioTrackValue);
};

ControlsFormatter.prototype.formatQualitySelector = function(){
	var qualityInfo = player_mgr.getQualityInfo();
	controls.setSettingsListItems("settingsQuality", qualityInfo, 
			formatter.formatQualityItem, formatter.qualityItemSelected, 0, 'Kvalita');
	this.recenterSettings();
}

ControlsFormatter.prototype.updateAutoQualityText = function(resolution) {
	  var autoQualityResolution = $(player_mgr.mainShellId + ' .autoQualityResolution');
	  autoQualityResolution.text(resolution);
}

ControlsFormatter.prototype.formatQualityItem = function(quality) {
  var qualityDiv = $('<div/>');
  
  var speedResolution;
  var resolutionText;
  if (quality.key == 'auto') {
	  speedResolution = '';
	  resolutionText = 'Auto';
  } else {
	  speedResolution = quality.resolution;
	  resolutionText = player_mgr.getQualityResolutionText(speedResolution);
  }
  qualityDiv.append($('<span/>', {'class': 'name'}).text(resolutionText));
  var resolutionSpan = $('<span/>', {'class': 'value'}).text(speedResolution);
  if (quality.key == 'auto') {
	  resolutionSpan.addClass('autoQualityResolution');
  }
  qualityDiv.append(resolutionSpan);
  //console.log(quality.id, formatter.currentQuality, quality.id == formatter.currentQuality);
  return { value: quality.key, text: qualityDiv.html(), selected: (quality.key == player_mgr.currentQuality), label: resolutionText };
};

ControlsFormatter.prototype.qualityItemSelected = function(qualityValue){
  console.log("Quality select ", qualityValue);
  player_mgr.manualSetQuality(qualityValue);
};

ControlsFormatter.prototype.updateAudioSubtitles = function(subtitles){
  var subtitlesShell = $(player_mgr.mainShellId + ' #audioSubtitlesShell');
  if (subtitles.length == 0){
    subtitlesShell.addClass('empty');
  } else {
    subtitlesShell.removeClass('empty');
  }
};

ControlsFormatter.prototype.activateReplayScreen = function(activate) {
  var shell = $(player_mgr.mainShellId + ' .playerMainShell');
  if (activate) {
	  shell.addClass('replayScreenActive');
	  this.showReplayPoster();
  } else {
	  shell.removeClass('replayScreenActive');
  }
  controls.hidePreviewImage();
}

ControlsFormatter.prototype.showReplayPoster = function() {
  var videoWrapper = $(player_mgr.mainShellId + ' #videoWrapper');
  videoWrapper.find('#replayPoster').remove();
  if ((playlist != undefined) && (playlist.getPreviewImageUrl() != undefined)) {
	  	$("<img/>", {
	  		id: 'replayPoster',
	  		src: playlist.getPreviewImageUrl(),
	  	}).appendTo(videoWrapper);
  }
}

// ** Aktivni screeny **

ControlsFormatter.prototype.activateScreen = function(screenName, onDeactivate) {
	if (this.activeScreen != undefined) {
		if (this.activeScreen == screenName) {
			console.log('screen ' + screenName + ' already active');
			return;
		} else {
			console.log('deactivating screen ' + this.activeScreen + ' before activating ' + screenName);
			this.deactivateScreen(this.activeScreen);
		}
	}

	if (screenName != undefined) {
	  console.log('activating screen ', screenName);
      var shell = $(player_mgr.mainShellId + ' .playerMainShell');
	  shell.addClass(screenName + 'ScreenActive');
	  this.screenOnDeactivate = onDeactivate;
	}
	
	this.activeScreen = screenName;
}

ControlsFormatter.prototype.deactivateScreen = function(screenName) {
	if ((this.activeScreen != undefined) && (this.activeScreen == screenName)) {
        console.log('deactivating screen ', screenName);
		var shell = $(player_mgr.mainShellId + ' .playerMainShell');
		shell.removeClass(screenName + 'ScreenActive');
		this.activeScreen = undefined;
		
		var callback = this.screenOnDeactivate;
		this.screenOnDeactivate = undefined;
		if (callback != undefined ){
			callback.call();
		}
	} else {
		console.log('screen ' + screenName + ' already not active');
	}
}

ControlsFormatter.prototype.toggleScreenActive = function(screenName, onDeactivate) {
	if ((this.activeScreen != undefined) && (this.activeScreen == screenName)) {
		this.deactivateScreen(screenName);
	} else {
		this.activateScreen(screenName, onDeactivate);
	}
}

ControlsFormatter.prototype.activateSettingsScreen = function() {
	var thisFormatter = this;
	this.activateScreen('settings', function() {
		thisFormatter.closeSettingsDropDowns();
		thisFormatter.deactivateSettingsInnerPage();
	});
	this.recenterSettings();
}

ControlsFormatter.prototype.getActiveScreen = function() {
	return this.activeScreen;
}

ControlsFormatter.prototype.activateSettingsInnerPage = function(innerPageClass) {
	var adaptSize;
	var minWidth;
	switch (this.currentSettingsLayout) {
	case 1:
		adaptSize = true;
		minWidth = 346;
		break;
		
	case 2:
		adaptSize = true;
		minWidth = 536;
		break;
		
	default:
		adaptSize = false;
	}
	var settingsDiv = $(player_mgr.mainShellId + ' #settingsDiv');
	if (adaptSize) {
		settingsDiv.css('min-height', settingsDiv.height());
		settingsDiv.css('width', Math.max(minWidth, settingsDiv.width()));
	}
	settingsDiv.addClass('innerPageActive ' + innerPageClass);
	if (adaptSize) {
		var innerPage = $(player_mgr.mainShellId + ' #settingsInnerPage');
		innerPage.css('height', settingsDiv.height());
	}
}

ControlsFormatter.prototype.deactivateSettingsInnerPage = function() {
	var settingsDiv = $(player_mgr.mainShellId + ' #settingsDiv');
	settingsDiv.css('min-height', '');
	settingsDiv.css('width', '');
	$(player_mgr.mainShellId + ' #settingsInnerPage').css('height', '');
	settingsDiv.removeClass('innerPageActive addTvActive removeTvActive');
}

ControlsFormatter.prototype.addOrRemoveClass = function(target, condition, className) {
	if (condition) {
		target.addClass(className);
	} else {
		target.removeClass(className);
	}
}

ControlsFormatter.prototype.setOneOfClasses = function(target, prefix, toSet, count) {
  for(var i = 1; i <= count; i++) {
	  var className = prefix + i;
	  if (i == toSet) {
		  target.addClass(className);
	  } else {
		  target.removeClass(className);
	  }
  }
}

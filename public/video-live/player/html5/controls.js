//******************************************************************************/
//******************************* INIT *****************************************/
//******************************************************************************/

function Controls() {
  logger.log(this, INFO, "creating Controls");

  var thisControls = this;

  DraggableControl.initializeGlobal();
  
  this.hiddenOverlay = true;
  
  this.insideControls = new HoverKeeper('controls');
  this.insideControls.emptyCallback = function() { thisControls.showControls(); };
  this.insideControls.nonEmptyCallback = function() { thisControls.showControls(); };

  this.hideSettingsOnMouseLeaveTimer = new TimerHolder(function() { formatter.deactivateScreen('settings'); });
  this.insideSettings = new HoverKeeper('settings');
  this.insideSettings.emptyCallback = function() { thisControls.hideSettingsOnMouseLeaveTimer.setTimeout(20); }
  this.insideSettings.nonEmptyCallback = function() {
	  thisControls.hideSettingsOnMouseLeaveTimer.cancel();
	  formatter.activateSettingsScreen();
  }
  
  this.insidePlayer = new HoverKeeper('player');
  if (player_mgr.isPC) {
	  this.insidePlayer.emptyCallback = function() { $(player_mgr.mainShellId + ' #videoShell').addClass('controlsExited'); };
	  this.insidePlayer.nonEmptyCallback = function() { $(player_mgr.mainShellId + ' #videoShell').removeClass('controlsExited'); };
  }

  this.seekBarActive = new HoverKeeper('seekbar');
  this.seekBarActive.emptyCallback = function() { formatter.deactivateScreen('seek'); }
  this.seekBarActive.nonEmptyCallback = function() { formatter.activateScreen('seek'); }
  
  this.volumeActive = new HoverKeeper('volume');
  this.volumeActive.emptyCallback = function() { formatter.deactivateScreen('volume'); }
  this.volumeActive.nonEmptyCallback = function() { formatter.activateScreen('volume'); }
  
  this.versionInfoClickCount = 0;
  this.lastShowControls = new Date();
  
  $(player_mgr.mainShellId + " #versionInfoOpener").on('click', function() {
    if (controls.versionInfoClickTimeout != undefined) {
      window.clearTimeout(controls.versionInfoClickTimeout);
      controls.versionInfoClickTimeout = undefined;
    }
    controls.versionInfoClickCount++;
    console.log("Clickcount", controls.versionInfoClickCount);
    if (controls.versionInfoClickCount >= 8) {
      controls.versionInfoClickCount = 0;
      controls.displayVersionInformation();
    } else {
      controls.versionInfoClickTimeout = window.setTimeout(function() {
        controls.versionInfoClickTimeout = undefined;
        controls.versionInfoClickCount = 0;
      }, 1000);
    }
    
  });

  //---------------  aktivace ikon uprostred playeru ---------//
  //aktivni je cela plocha overlay (pruhledny div pres cele video)
  //
  //this.activeCentralButton = $('#playBtn');//ma tohle tady fakt bejt? -- myslim si, ze nema a ze ted, co kontroluju autoplay pri kazdym loadu itemu, uz to tu ani byt nemusi, proto zakomentovano
  $(player_mgr.mainShellId + ' #overlay').click(function(){
    console.log("click ", controls.hiddenOverlay, player_mgr.isPC);

    if (player_mgr.playerStatus == 'playing') {
        var clickThrough = player_mgr.currentItem.getClickThroughUrl();
        if (clickThrough != undefined) {
          window.open(clickThrough);
      	  player_mgr.pause();
      	  return;
        }
    }

    if (!player_mgr.isPC) {
        if (controls.hiddenOverlay) {
            if (player_mgr.autoPlayDisplayed) {
              // aktivni autoplay obrazovka -- jen spustime video
              player_mgr.play();
            } else {
              // skryte ovladani -- zobrazime ho
           	  controls.showControls();
            }
        	return;
        } else if (formatter.getActiveScreen() != undefined) {
        	formatter.activateScreen(undefined);
            controls.showControls(); // prodlouzit timer pro skryti controls
        	return;
        }
        
        // ovladani bylo videt a nebyli jsme v settings ani jine subscreen -
        // prodlouzit timer pro skryti controls
        controls.showControls();
    }
    
    var activeBtnId = controls.activeCentralButton.attr('id');
    switch(activeBtnId) {
    case 'playBtn':
    	player_mgr.play();
    	break;
    case 'customPlayBtn':
    	player_mgr.play();
    	break;
    case 'stopBtn':
    	player_mgr.stop();
    	break;
    case 'pauseBtn':
    	player_mgr.pause();
    	break;
    case 'replayBtn':
    	player_mgr.replay();
    	break;
    default:
    	console.log("Weird, unknown activeBtn id: ", activeBtnId);
    }
  });
  $(player_mgr.mainShellId + ' #overlay').dblclick(function(){
    player_mgr.toggleFullScreen();
  });
  $(player_mgr.mainShellId + ' #audioPlayBtn').click(function(){
	var focused = $(this).is(':focus');
    $(player_mgr.mainShellId + ' #audioPlayBtn').css('display', 'none');
    $(player_mgr.mainShellId + ' #audioStopBtn').css('display', 'inline-block');
    if (focused) {
    	$(player_mgr.mainShellId + ' #audioStopBtn').focus();
    }
    player_mgr.play();
  });
  $(player_mgr.mainShellId + ' #audioStopBtn').click(function(){
		var focused = $(this).is(':focus');
    $(player_mgr.mainShellId + ' #audioPlayBtn').css('display', 'inline-block');
    $(player_mgr.mainShellId + ' #audioStopBtn').css('display', 'none');
    if (focused) {
    	$(player_mgr.mainShellId + ' #audioPlayBtn').focus();
    }
    player_mgr.pause();
  });
  if (player_mgr.isPC) {
	    $(player_mgr.mainShellId + ' #audioSubtitlesShell').mouseenter(function() {
	    	formatter.activateSettingsScreen();
	    });
	    $(player_mgr.mainShellId + ' #audioSubtitlesShell').mouseleave(function() {
	    	formatter.deactivateScreen('settings');
	    });
  }
  $(player_mgr.mainShellId + ' #audioSubtitlesShell').click(function() {
	  var focused = $(this).is(':focus');
	  formatter.toggleScreenActive('settings');
	  if (focused) {
		  var settingsElement = $(player_mgr.mainShellId + ' #settingsSubtitles');
		  settingsElement.find('.settingsSelectorList .listItem')[0].focus();
	  }
  });
  //nektere oblasti, ktere jsou soucasti overlaye, maji jinou funkci nez klik na prostredni tlacitko, proto zde stopPropagation()
  $(player_mgr.mainShellId + ' #controls > *').click(function(event){
    event.stopPropagation();
  });
  $(player_mgr.mainShellId + ' #settingsDiv').click(function(event){
		formatter.closeSettingsDropDowns();
	    event.stopPropagation();
	  });
  $(player_mgr.mainShellId + ' .settingsSelector').click(function(event){
	  console.log('settingsSelector clicked ', event.target);
		formatter.openSettingsDropDown(event.target);
		event.preventDefault();
	    event.stopPropagation();
	  });

  //---------------- replay button na next in series screene --------//
  //
  $(player_mgr.mainShellId + ' .seriesReplayBtn').click(function(){
    clearTimeout(controls.nextInSeriesCountDownInterval);
    player_mgr.replay();
  });


  //--------------zobrazovani a skryvani ovladacich prvku podle akci uzivatele ---------//
  //
  /*$(player_mgr.mainShellId + ' #overlay').bind('mousemove', function(event){
    controls.showControls();
    if (player_mgr.hideControlsDelay > 0){
      if (controls.hideControlsTimeout != undefined){
	clearTimeout(controls.hideControlsTimeout);
      }
      controls.hideControlsTimeout = setTimeout(controls.hideControls, player_mgr.hideControlsDelay * 1000);
    }
  });
  $(player_mgr.mainShellId + ' #overlay').bind('mouseleave', function(event){
    controls.hideControls();
  });*/

  $(player_mgr.mainShellId + ' .dontHideControls').dblclick(function(event){
    event.stopPropagation();
  });
  
  $(player_mgr.mainShellId + ' .dontDblClick').dblclick(function(event){
	  console.log('dontDblClick stopPropagation');
	    event.stopPropagation();
	  });

  if (player_mgr.isPC) {
    $(player_mgr.mainShellId + ' .dontHideControls').bind('mouseenter', function(event){
	  controls.insideControls.enterElement(this);
    });
    $(player_mgr.mainShellId + ' .dontHideControls').bind('mouseleave', function(event){
	  controls.insideControls.leaveElement(this);
    });
  }
  $(player_mgr.mainShellId + ' .dontHideControls').bind('focus', function(event){
	  controls.insideControls.enterElement(this);
  });
  $(player_mgr.mainShellId + ' .dontHideControls').bind('blur', function(event){
    controls.insideControls.leaveElement(this);
  });
  
  if (player_mgr.isPC) {
    $(player_mgr.mainShellId + ' #overlay').bind('mousemove', function(event){
      controls.showControls();
    });
  }

  window.setInterval(function() {
	var canHide;
	if (player_mgr.isPC) {
		canHide = !controls.insideControls.isInElement();
	} else {
		canHide = (formatter.getActiveScreen() == undefined);
	}
    if (canHide) {
      var now = (new Date()).getTime();
      var sinceLastShow = now - controls.lastShowControls.getTime();
      if (sinceLastShow >= player_mgr.hideControlsDelay * 1000){
        controls.hideControls();
      }
    }
  }, 500);

  if (player_mgr.isPC) {
    $(player_mgr.mainShellId + ' #overlay').bind('mouseenter', function(event){
  	  controls.insidePlayer.enterElement(this);
    });

    $(player_mgr.mainShellId + ' #overlay').bind('mouseleave', function(event){
   	  controls.insidePlayer.leaveElement(this);
    });
  } else {
	  // bylo by mnohem jednodussi pouzit #overlay mouseleave, ale to funguje uplne divne na WinPhone8
	  $(player_mgr.mainShellId).click(function(event) {
		  event.stopPropagation(); // zabranime spusteni dalsiho handleru
	  });
	  document.addEventListener('click', function() {
		  // kliklo se mimo player
		  if (!controls.hiddenOverlay) {
			  console.log('hiding controls on #overlay mouseleave');
			  formatter.activateScreen(undefined);
			  controls.hideControls();
		  }
	  });
  }
  
  if (player_mgr.isPC) {
	    $(player_mgr.mainShellId + ' #hbbTvShell').bind('mouseenter', function(event){
	    	if (player_mgr.getAvailTVsInfo().length > 1) {
	    		formatter.activateScreen('hbbTv');
	    	}
	    });
  }
  $(player_mgr.mainShellId + ' #hbbTvShell').bind('mouseleave', function(event){
	  formatter.deactivateScreen('hbbTv');
  });
  $(player_mgr.mainShellId + ' #hbbTvShell').bind('click', function(event){
	  if (player_mgr.selectedTvName == undefined) {
		  if (player_mgr.getAvailTVsInfo().length == 1) {
			  player_mgr.activateHbbTv(player_mgr.getAvailTVsInfo()[0]);
		  } else {
			  formatter.activateScreen('hbbTv');
		  }
	  } else {
		  player_mgr.deactivateHbbTv();
	  }
  });
  
  $(player_mgr.mainShellId + ' #addTvCodeInput').keydown(function(event) {
	  if (event.which == 13) {
		  event.preventDefault();
		  player_mgr.pairHbbTvDevice(this.value);
	  }
  });
  //---------------posun v case pomoci seekBaru -----------------------//
  //

  if (player_mgr.isPC) {
    $(player_mgr.mainShellId + ' #seekBarArea').mouseenter(function() {
    	controls.seekBarActive.enterElement(this);
    });
    $(player_mgr.mainShellId + ' #seekBarArea').mouseleave(function() {
    	controls.seekBarActive.leaveElement(this);
    });
  } else {
	var seekBar = $(player_mgr.mainShellId + ' #seekBarArea');
	var hasTouch = ('ontouchstart' in document.documentElement);
	seekBar.on((hasTouch ? 'touchstart' : 'mousedown'), function(event){
      formatter.activateScreen('seek');
    });
	seekBar.on((hasTouch ? 'touchend' : 'mouseup'), function(event){
      formatter.deactivateScreen('seek');
      controls.showControls(); // prodlouzit timer pro skryti controls
    });
  }
  
  new DraggableControl($(player_mgr.mainShellId + " #seekBarTouchArea")[0], {
	  startDragging: function(draggable, element, position) {
		  [ thisControls.seekBarActive, thisControls.insidePlayer, thisControls.insideControls ].forEach(function(hoverKeeper) {
			  hoverKeeper.enterElement(element);
		  });
		  controls.showPreviewImage(position.pageX);
	  },
	  dragging: function(draggable, element, position) {
		  controls.showPreviewImage(position.pageX);
	  },
	  stopDragging: function(draggable, element, position) {
		  var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
		  var seekPosition = thisControls.computeDraggingPosition(element, 'horizontal', parseFloat(seekBar.min), parseFloat(seekBar.max), position.pageX);
		  console.log('draggable seek position', seekPosition);
		  player_mgr.manualSeek(seekPosition);
		  [ thisControls.seekBarActive, thisControls.insidePlayer, thisControls.insideControls ].forEach(function(hoverKeeper) {
			  hoverKeeper.leaveElement(element);
		  });
		  controls.hidePreviewImage();
	  }
  });
  $(player_mgr.mainShellId + " #seekBarTouchArea").click(function(event) {
	  event.preventDefault();
  });
  $(player_mgr.mainShellId + " #seekBarTouchArea").on('contextmenu', function(event) {
	  event.preventDefault();
  });
  
  $(player_mgr.mainShellId + ' #videoShell #seekBarTrackShell').mouseleave(function(){
    $(player_mgr.mainShellId + ' #seekBarCursor').css('display', 'none');
  });


  //-----------------zobrazovani a skryvani nahledovych obrazku-------------------//
  //
  if (player_mgr.isPC) {
	  $(player_mgr.mainShellId + ' #seekBarTouchArea')[0].addEventListener('mousemove', function(event){
		  controls.showPreviewImage(event.pageX);
	  });
  }
  
  $(player_mgr.mainShellId + ' #overlay').mouseleave(function(){
    controls.hidePreviewImage();
  });
  $(player_mgr.mainShellId + ' #videoButtons').mouseleave(function(){
    controls.hidePreviewImage();
  });
  $(player_mgr.mainShellId + ' #seekBarTouchArea').mouseleave(function(){
    controls.hidePreviewImage();
  });

  $(player_mgr.mainShellId + ' #nextInSeriesBtn').click(function(event){
	    event.preventDefault();
	    $(player_mgr.mainShellId + ' #nextInSeriesOverlay').removeClass('active');
	    
	    clearTimeout(controls.nextInSeriesCountDownInterval);
	    $(player_mgr.mainShellId + ' #skipNextInCountdownSvg').css('animation', '');
	    player_mgr.onPlaylistEnd();
	  });


  //-------------------tlacitka ovladaciho panelu a settingsDivu----------------------//
  //
  $(player_mgr.mainShellId + ' #backInTimeShell').click(function(){
    player_mgr.switchTimeshift(true);
  });
  $(player_mgr.mainShellId + ' #liveShell').click(function(){
    if (player_mgr.isTimeshift){
      player_mgr.switchTimeshift(false, false);
    }
  });
  if (player_mgr.isPC) {
    $(player_mgr.mainShellId + ' .dontHideSettings').mouseenter(function(){
	      controls.insideSettings.enterElement(this);
	});
    $(player_mgr.mainShellId + ' .dontHideSettings').mouseleave(function(){
        controls.insideSettings.leaveElement(this);
	});
  }
  $(player_mgr.mainShellId + ' #settingsShell').click(function(){
  	formatter.activateSettingsScreen();
  });
  $(player_mgr.mainShellId + ' #settingsDiv .dontHideSettings').focus(function(){
      controls.insideSettings.enterElement(this);
      controls.insidePlayer.enterElement(this);
	  });
  $(player_mgr.mainShellId + ' #settingsDiv .dontHideSettings').blur(function(){
      controls.insideSettings.leaveElement(this);
      controls.insidePlayer.leaveElement(this);
	  });
  $(player_mgr.mainShellId + ' #settingsCloseButton').click(function(){
	  controls.closeSettings();
	  });
  $(player_mgr.mainShellId + ' .tvSelectorBtn').click(function(event){
    console.log("TV select " + $(event.target).parent().attr('value'));
  });
  $(player_mgr.mainShellId + ' #addTvBtn').click(function(e){
	    e.stopPropagation();
	    formatter.activateSettingsInnerPage('addTvActive');
	    $(player_mgr.mainShellId + ' #addTvCodeInput').focus();
	  });
  $(player_mgr.mainShellId + ' #subtitlesManualSelectorDiv').mouseenter(function(){
    $(player_mgr.mainShellId + ' #subtitlesManualOptionsDiv').css('display', 'inline-block');
  });
  $(player_mgr.mainShellId + ' #subtitlesManualSelectorDiv').mouseleave(function(){
    $(player_mgr.mainShellId + ' #subtitlesManualOptionsDiv').css('display', 'none');
  });
  $(player_mgr.mainShellId + ' #audioTrackManualSelectorDiv').mouseenter(function(){
    $(player_mgr.mainShellId + ' #audioTrackManualOptionsDiv').css('display', 'inline-block');
  });
  $(player_mgr.mainShellId + ' #audioTrackManualSelectorDiv').mouseleave(function(){
    $(player_mgr.mainShellId + ' #audioTrackManualOptionsDiv').css('display', 'none');
  });
  $(player_mgr.mainShellId + ' .qualitySelectorBtn').click(function(event){
    console.log("Quality select " + $(event.target).parent().attr('value'));
  });
  $(player_mgr.mainShellId + ' #volumeShell').mouseenter(function(){
	    controls.volumeActive.enterElement(this);
  });
  $(player_mgr.mainShellId + ' #volumeShell').mouseleave(function(){
	    controls.volumeActive.leaveElement(this);
  });
  $(player_mgr.mainShellId + ' #volumeButtons').focus(function(){
	    controls.volumeActive.enterElement(this);
  });
  $(player_mgr.mainShellId + ' #volumeButtons').blur(function(){
	    controls.volumeActive.leaveElement(this);
  });
  $(player_mgr.mainShellId + ' #volumeButtons').click(function(){
    player_mgr.switchMute();
  });
  new DraggableControl($(player_mgr.mainShellId + " #volumeBar")[0], {
	  startDragging: function(draggable, element, position) {
		  [ thisControls.volumeActive, thisControls.insidePlayer, thisControls.insideControls ].forEach(function(hoverKeeper) {
			  hoverKeeper.enterElement(element);
		  });
		  controls.updateVolumeBarWhileDragging(element, position.pageY, true);
	  },
	  dragging: function(draggable, element, position) {
		  controls.updateVolumeBarWhileDragging(element, position.pageY, true);
	  },
	  stopDragging: function(draggable, element, position) {
		  controls.updateVolumeBarWhileDragging(element, position.pageY, false);
		  [ thisControls.volumeActive, thisControls.insidePlayer, thisControls.insideControls ].forEach(function(hoverKeeper) {
			  hoverKeeper.leaveElement(element);
		  });
	  }
  });
  $(player_mgr.mainShellId + ' #newWindowShell').click(function(){
    player_mgr.toNewWindow();
  });
  $(player_mgr.mainShellId + ' #fullScreenShell').click(function(){
    player_mgr.toggleFullScreen();
  });
  this.clickFocusPreventer = function(event) {
    // zabranime v ziskani focusu na click - jinak by se tlacitka zlute obarvovala
	event.preventDefault();
	event.stopImmediatePropagation(); 
  }; 
  this.enterHandler = function(event) {
    var keyCode = event.which || event.keyCode;
	if (keyCode == 13) {
	  $(event.target).click();
	}
  };
  var focusableButtons = $(player_mgr.mainShellId + ' .focusableBtn'); 
  focusableButtons.bind('mousedown', this.clickFocusPreventer);
  focusableButtons.bind('keypress', this.enterHandler);
  focusableButtons.bind('focus', function() { controls.insidePlayer.enterElement(this); });
  focusableButtons.bind('blur', function() { controls.insidePlayer.leaveElement(this); });
  $(player_mgr.mainShellId+ " #seekBarFocusTarget").on('focus', function() { controls.insidePlayer.enterElement(this); });
  $(player_mgr.mainShellId+ " #seekBarFocusTarget").on('blur', function() { controls.insidePlayer.leaveElement(this); });

  $(player_mgr.mainShellId+ " a[href]").bind('mousedown', this.clickFocusPreventer);
  
  //------------------------- tlacitko Preskocit --------------------//
  //
  $(player_mgr.mainShellId + ' #skipShell').click(function(event){
	if (!controls.skipCountDownOn) {
      player_mgr.onSkip();
	}
    event.stopPropagation();
  });


  //----------------------skryvani a zobrazovani version informaci ------------------//
  $(player_mgr.mainShellId + ' #versionInfoShell').click(function(event){
    event.stopPropagation();
  });
  $(player_mgr.mainShellId + ' #hideVersionInfoBtn').click(function(event){
    controls.hideVersionInformation();
    event.stopPropagation();
  });

  $(player_mgr.mainShellId + " .playerMainShell").keydown(function(event){
    //console.log(event);
    if (event.keyCode == 32){
      event.preventDefault();
    }
    player_mgr.onKeyPress(event);
  });

  //------------------------ eventy na error screene ---------------------------//
  //
  $(player_mgr.mainShellId + " #errorReloadShell").click(function(event){
    player_mgr.replay();
  });
  $(player_mgr.mainShellId + " #errorHelpShell").click(function(event){
    console.log("help clicked");
    window.open('http://www.ceskatelevize.cz/ivysilani/napoveda/?program-url=' + window.location.pathname + encodeURIComponent(window.location.search), '_blank');
  });

  $(player_mgr.mainShellId + " .settingsSelector").on('click', function(e) {
    var scroller = $(player_mgr.mainShellId + " #settingsContentScroller");
    scroller.scrollTop($(this).offset().top - scroller.offset().top + scroller.scrollTop());
    e.preventDefault();
  });

  logger.log(this, INFO, "Controls created");
}

//--------------------- plneni dropdownu/listu itemy -----------------------//
Controls.prototype.setSettingsListItems = function(target, items, itemFormatCallback, onClickCallback, minDisplayItemsCount, labelBase) {
  $(player_mgr.mainShellId + ' #' + target + ' :focus').blur();
  var list = $(player_mgr.mainShellId + " #" + target + " .settingsSelectorList");
  list.empty();
  var placeholder = $(player_mgr.mainShellId + " #" + target + " .settingsSelectorPlaceholder");
  placeholder.empty();
  
  var thisControls = this;
  
  items.forEach(function(item, index) {
    var formatted = itemFormatCallback(item, index);
    var label = formatted.label;
    if (label == undefined) {
    	label = formatted.text;
    }
    var label = labelBase + ": " + label;
    var attributes = {
        	"id": target + '-' + index,
        	"class": 'listItem' + (formatted.selected ? ' selectedListItem' : ''),
        	"tabindex": 4,
        	"aria-label": label,
        	"title": label,
        	"aria-role": "option"
    };
    var itemHtml = $("<div/>", attributes);
    itemHtml.html(formatted.text);
    console.log('Adding item (' + formatted.value + ') to ' + target);
    itemHtml.appendTo(list);
    if (formatted.selected) {
      attributes["id"] = "placeholder-" + attributes["id"];
      attributes["aria-role"] = "button";
      var placeholderHtml = $("<div/>", attributes);
      placeholderHtml.html(formatted.text);
      placeholder.append(placeholderHtml);
    }

    itemHtml.on('click', function(event) {
      onSettingsListItemClicked(this, onClickCallback, list, formatted.value, event);
    });
    
    if (formatted.iconHandlers != undefined) {
    	for(var iconClass in formatted.iconHandlers) {
    		if (formatted.iconHandlers.hasOwnProperty(iconClass)) {
    			console.log("Adding handler for", formatted.value, iconClass);
    			var icon = itemHtml.find('.' + iconClass);
    			icon.click(function(event) {
    				formatted.iconHandlers[iconClass].call(icon, event, formatted.value);
    			});
    			thisControls.addDefaultHandlersToSettingsControls(icon);
    		}
    	};
    }
  });

  if (items.length >= 3) {
    list.addClass("manyListItems");
  } else {
    list.removeClass("manyListItems");
  }

  if (items.length < minDisplayItemsCount){
    list.parents('.settingsElement').addClass('notAvailable');
  } else {
    list.parents('.settingsElement').removeClass('notAvailable');
  }

  var allItemsAndPlaceholder = $(player_mgr.mainShellId + " #" + target).find('.listItem');
  this.addDefaultHandlersToSettingsControls(allItemsAndPlaceholder);
}

Controls.prototype.addDefaultHandlersToSettingsControls = function(selected) {
  var thisControls = this;
  selected.focus(function(){
  	  thisControls.insidePlayer.enterElement(this);
  	  thisControls.insideSettings.enterElement(this);
  	  thisControls.insideControls.enterElement(this);
	});
  selected.blur(function(){
	  thisControls.insidePlayer.leaveElement(this);
	  thisControls.insideSettings.leaveElement(this);
	  thisControls.insideControls.leaveElement(this);
	});
  selected.bind('mousedown', this.clickFocusPreventer);
  selected.bind('keypress', this.enterHandler);
};


//----------------- vyber itemu z dropdownu/listu --------------------//
function onSettingsListItemClicked(item, onClickCallback, list, id, event) {
  event.preventDefault();
  event.stopPropagation();
  formatter.closeSettingsDropDowns();
  var focused = $(event.target).is(':focus');
  if (focused) {
	  $(player_mgr.mainShellId + ' #settingsShell').focus();
  }
//  console.log(id);
  onClickCallback(id);
}

//------------------ zobrazovani a skryvani ovladacich prvku ---------------//
//

//tady a ve dvou nasledujicich metodach je "dvojity schovavani overlayBtnu"
//v n ekterejch browserech blbo schovavani pres class active, prepsano na
//show()/hide(), ale musi se odstranit jeste ty display: blocky na active btnech
//coz ted nedelam, protoze to nemuzu otestovat
Controls.prototype.showControls = function(){
  $(player_mgr.mainShellId + ' .playerMainShell').removeClass('hiddenOverlay');
  controls.lastShowControls = new Date();
  controls.hiddenOverlay = false;
};

Controls.prototype.hideControls = function(){
  $(player_mgr.mainShellId + ' .playerMainShell').addClass('hiddenOverlay');
  controls.hiddenOverlay = true;
};

Controls.prototype.activateCentralButton = function(id){
  var wasFocused = $(player_mgr.mainShellId + ' .overlayBtn:focus').length > 0;
  if (controls.activeCentralButton){
    controls.activeCentralButton.addClass('inactive');
  }
  if (id == 'pause'){
    controls.activeCentralButton = $(player_mgr.mainShellId + ' #pauseBtn');
  } else if (id == 'play') {
    if (controls.usingCustomPlayBtn){
      controls.activeCentralButton = $(player_mgr.mainShellId + ' #customPlayBtn');
    } else {
      controls.activeCentralButton = $(player_mgr.mainShellId + ' #playBtn');
    }
  } else if (id == 'stop') {
    controls.activeCentralButton = $(player_mgr.mainShellId + ' #stopBtn');
  } else if (id == 'replay') {
    controls.activeCentralButton = $(player_mgr.mainShellId + ' #replayBtn');
  } else {
    alert("Unimpled central button '" + id + "'");
  }
  controls.activeCentralButton.removeClass('inactive');
  if (wasFocused) {
	  controls.activeCentralButton.focus();
  }
};

//----------------------- defaultni vs custom ikona Play ---------------//
//
Controls.prototype.useCustomPlayIcon = function(iconUrl){
  controls.usingCustomPlayBtn = true;
  $(player_mgr.mainShellId + ' #customPlayBtnImage').attr('src', iconUrl); 
};
Controls.prototype.useSystemPlayIcon = function(){
  controls.usingCustomPlayBtn = false;
};

//--------------------- nastavovani jednotlivych barvicek ikonek -----------------//
//
Controls.prototype.setSkinVolumeActive = function(value){
  logger.log(controls, INFO, "setting skinVolumeActive");
  $(player_mgr.mainShellId + ' #volumeBarFilledTrack').css("background", value);
};

//----------------------- nastavovani barvy indexu------------------------------//
//
Controls.prototype.setIndexLineColor = function(value){
  logger.log(controls, INFO, "setting indexLineColor" + value);
  //$('.seekBarIndex').css('background', value);
  formatter.indexLineColor = value;
};

//------------------------ zobrazeni edit modu ------------------------------//
//
Controls.prototype.showEditModeShell = function(){
  logger.log(controls, INFO, "showing editModeShell");
  $(player_mgr.mainShellId + ' #editModeShell').css('display', 'block');
};

Controls.prototype.computeDraggingPosition = function(element, direction, min, max, position) {
	var jElement = $(element);
	var offset = jElement.offset();
	var size;
	var start;
	if (direction == 'horizontal') {
		size = jElement.width();
		start = offset.left;
	} else if (direction == 'vertical') {
		size = jElement.height();
		start = offset.top;
	}
	var relativePosition = (position - start) / size;
	var constrainedPosition = Math.max(0, Math.min(1, relativePosition));
	return min + constrainedPosition * (max - min);
}

//*******************************************************/
//********************  Volume bar **********************/
//*******************************************************/

Controls.prototype.updateVolumeBarWhileDragging = function(element, pageY, skipCallback) {
  var newVolume = this.computeDraggingPosition(element, 'vertical', 100, 0, pageY);
  player_mgr.setVolume(newVolume, skipCallback);
};

Controls.prototype.updateVolumeBar = function(){
  var volume = player_mgr.getVolume();
  $(player_mgr.mainShellId + ' #volumeBarThumb').css("bottom", volume + "%");
  $(player_mgr.mainShellId + ' #volumeBarFilledTrack').css('height', volume + '%');
  if (player_mgr.isMuted() || player_mgr.getVolume() == 0){
    //$(player_mgr.mainShellId + ' #volumeBtn').text('h');
    $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-0').css('display', 'block');
    $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-50').css('display', 'none');
    $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-100').css('display', 'none');
  } else {
    if (player_mgr.getVolume() > 50){
      //$(player_mgr.mainShellId + ' #volumeBtn').text('g');
      $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-0').css('display', 'none');
      $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-50').css('display', 'none');
      $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-100').css('display', 'block');
    } else {
      //$(player_mgr.mainShellId + ' #volumeBtn').text('f');
      $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-0').css('display', 'none');
      $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-50').css('display', 'block');
      $(player_mgr.mainShellId + ' #volumeShell #volumeBtn-100').css('display', 'none');
    }
  }
};

//*******************************************************/
//**********************  Seek bar **********************/
//*******************************************************/

Controls.prototype.updateSeekBar = function(value, seekBarMin, seekBarMax){
  //console.log("update seek bar");
  //console.trace();
  //console.log();
  var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
  if (value == undefined){
    value = video_element.currentTime;
  }
  if (seekBarMin == undefined) {
	  seekBarMin = seekBar.min;
  }
  if (seekBarMax == undefined) {
	  seekBarMax = seekBar.max;
  }
  //console.log("Update seek bar: ", value, seekBarMin, seekBarMax);
  controls.updateSeekBarInternal(value, seekBarMin, seekBarMax);
};

Controls.prototype.updateSeekBarInternal = function(value, seekBarMin, seekBarMax) {
  if (player_mgr.currentItem == undefined || (player_mgr.currentItem.isLive() && !player_mgr.isTimeshift)){
    //console.log("not updating seek bar for live stream");
    return;
  }
//  console.log(seekBarMin + ", " + value + ", " + seekBarMax);
  //spocitat sirku pro seekBarFill
  //var seekBarTrackWidth = parseInt(seekBarTrack.css("width"), 10);
  //var seekBarFill = $(player_mgr.mainShellId + ' #seekBarFill');
  //  console.log(seekBarMin + ", " + value + ", " + seekBarMax);
  var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
  seekBar.min = seekBarMin;
  seekBar.max = seekBarMax;
  value = Math.max(seekBarMin, value);
  seekBar.value = value;
  this.updateSeekBarLine(player_mgr.mainShellId + ' .seekElapsed', value);

  var seekBarShell = $(player_mgr.mainShellId + ' #seekBarShell')
  seekBarShell.removeClass('lowSeekBarValue');
  seekBarShell.removeClass('highSeekBarValue');

  //spocitat string pro seekBarTimeInfo
  var seekBarTimeInfo = $(player_mgr.mainShellId + ' .seekBarTimeInfo');
  if (player_mgr.currentItem.isLive()){
    var displayTime = Math.max(player_mgr.timeShiftOffset, seekBarMax - value + player_mgr.timeShiftOffset);//180 jsou 3 minuty
    seekBarTimeInfo.html("-" + this.buildTimeString(displayTime));
  } else {
    seekBarTimeInfo.html(
	    this.buildTimeString(value));
  }

  var remainingTimeInfo = $(player_mgr.mainShellId + ' #remainingTimeInfo');
  if (player_mgr.currentItem.isLive()){
	  remainingTimeInfo.html("");
  } else {
	  remainingTimeInfo.html('-' + this.buildTimeString(seekBarMax - value));
  }
  
  if (player_mgr.isTimeshift && displayTime == 0){
    seekBarShell.addClass('hideTimeInfo');
  } else {
    seekBarShell.removeClass('hideTimeInfo');
  }
    
  var seekNonElapsed = $(player_mgr.mainShellId + ' .seekNonElapsed');
  if (seekNonElapsed.width() < 56){//56 je uvedeno vyslovne v zadani, cili natvrdo -- ale IMO nema byt
    seekBarShell.addClass('highSeekBarValue');
  } else {
    seekBarShell.addClass('lowSeekBarValue');
  }
  
  this.updateSeekBarBufferedLine();
};

Controls.prototype.updateSeekBarBufferedLine = function() {
  var bufferedInfo = video_element.buffered;
  var bufferedTo;
  if (bufferedInfo.length == 0) {
	  bufferedTo = 0;
  } else {
	  bufferedTo = bufferedInfo.end(bufferedInfo.length - 1);
  }
  this.updateSeekBarLine(player_mgr.mainShellId + ' .seekBuffered', bufferedTo);
}

Controls.prototype.updateSeekBarLine = function(selector, value) {
  var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
  var fromStart = value - seekBar.min; 
  var percent = 100 * fromStart / (seekBar.max - seekBar.min);

  var line = $(selector);
  line.css("width",  percent + '%');
}

Controls.prototype.countSeekBarFillWidth = function(curTime, maxTime, barWidth){
  //var onePxTimeStep = maxTime / barWidth;
  //return curTime / onePxTimeStep;
  return curTime * barWidth / maxTime;//predchozi komentare ilustruji vypocet
};

Controls.prototype.buildTimeString = function(displayTime){
  displayTime = Math.round(displayTime);
  var s = displayTime % 60;
  var allMinutes = (displayTime - s) / 60;
  var m = allMinutes % 60;
  var h = (allMinutes - m) / 60;

  if (s < 10) {
	  s = '0' + s;
  }
  
  if (h == 0) {
	  return m + ':' + s; 
  } else {
	  if (m < 10) {
		  m = '0' + m;
	  }
	  return h + ':' + m + ':' + s;
  }
};

//*******************************************************/
//**********************  Edit mode  ********************/
//*******************************************************/

Controls.prototype.updateEditModeValue = function(displayTime){
  var m = Math.floor(displayTime / 60);
  var s = Math.floor(displayTime % 60);
  if (s < 10) s = '0' + s;
  $(player_mgr.mainShellId + ' #editModeShell')[0].textContent = m + ":" + s;
};

//*******************************************************/
//********************  Preview images  *****************/
//*******************************************************/

Controls.prototype.showPreviewImage = function(positionInPage) {
    var previewTrackUrl = player_mgr.currentItem.getPreviewTrackBaseUrl();
    if (
    	player_mgr.settings.hidePreviewTrack == true || 
    	(player_mgr.currentItem.isLive() && ! player_mgr.isTimeshift) || 
    	(typeof previewTrackUrl == 'undefined' && !player_mgr.settings.forcePreviewImage) || 
    	player_mgr.settings.uimode == 'audio'
    ){
      return;
    }

	var jTarget = $(player_mgr.mainShellId + ' #seekBarTouchArea');
	var offset = jTarget.offset();
	var width = jTarget.width();
	var relativeX = positionInPage - offset.left;
	var timeRange = player_mgr.getStreamRange();
	var minTime = timeRange.min;
	var maxTime = timeRange.max;
	var timeLength = maxTime - minTime;
	var hoverTime = (relativeX / width) * timeLength + minTime;

    //seekBar pripousti (pri stisknute mysi a pohybu po cele obrazovce) i hodnoty mimo range,
    //upravim hoverTime tak, aby byl vzdy mezi min a max
    hoverTime = Math.min(hoverTime, maxTime);
    hoverTime = Math.max(hoverTime, minTime);

    var imageUrl;
    var rowOffset;
    var colOffset;
    if (typeof previewTrackUrl != 'undefined') {
	    var compoundImageIndex;
	    var subImageIndex;
	    //spocitat index preview obrazku
	    if (player_mgr.isTimeshift){
	      //postup: 
	      var videoTimeDiff = maxTime - hoverTime;//o kolik jsem na seekBaru vlevo od PRAVEHO kraje; casovy rozdil, ktery musim respektovat
	      var realHoverTime = (new Date()).getTime()/1000 - player_mgr.timeShiftOffset - videoTimeDiff;//prepocet aktualniho systemoveho casu podle vyse zjistene diference 
	      realHoverTime = realHoverTime + 6; // PUSKVEJCOVA KONSTANTA - kompenzace posunu timeshiftu
	      var imageIndex = Math.ceil(realHoverTime / 5);//index, jakobych mel jeden nepretrzity proud preview imagu
	      compoundImageIndex = 500 * Math.floor(imageIndex / 100); // na rozdil od VOD jsou matice cislovane po petistovce
	      subImageIndex = imageIndex % 100;
	      //console.log("timeshiftImage: ", hoverTime, minTime, maxTime);
	      //console.log(videoTimeDiff, realHoverTime, new Date(realHoverTime * 1000), compoundImageIndex, subImageIndex);
	    } else {
	      hoverTimeWithOffset = hoverTime + player_mgr.currentItem.getUrlStartOffset();
	      var imageIndex = Math.ceil(hoverTimeWithOffset / 5);//index, jakobych mel jeden nepretrzity proud preview imagu
	      compoundImageIndex = Math.floor(imageIndex / 100);//ve kterem dodanem (ktera stovka) souboru imagu mam hledat
	      subImageIndex = imageIndex - 100 * compoundImageIndex;//kterej image v souboru (stovky) imagu mam hledat
	    }
	    rowOffset = (subImageIndex % 10) * 128;//128 natvrdo -- nema byt
	    colOffset = Math.floor(subImageIndex / 10) * 72;//72 natvrdo -- nema byt
	    imageUrl = previewTrackUrl + compoundImageIndex + '.jpg';
    }
    
    var timeString;
    if (player_mgr.currentItem.isLive()){
  	var timeToFormat = maxTime - hoverTime + player_mgr.timeShiftOffset;
      var timeString = "-" + controls.buildTimeString(timeToFormat);
    } else {
      var timeString = controls.buildTimeString(hoverTime - minTime);
    }

    controls.showPreviewOrIndexImage(relativeX, 'white', imageUrl, rowOffset, colOffset, timeString);
}

Controls.prototype.showPreviewOrIndexImage = function(positionInSeekBar, cursorColor, imgUrl, imgOffsetX, imgOffsetY, timeText, text) {
  var leftOffset = $(player_mgr.mainShellId + " #seekBarArea").offset().left - $(player_mgr.mainShellId + ' #videoShell').offset().left;
  
  var cursorPosition = positionInSeekBar + leftOffset;
  var cursor = $(player_mgr.mainShellId + " #seekBarCursor");
  cursor.css('display', 'block');
  cursor.css('background', cursorColor);
  cursor.css('left', cursorPosition + 'px');

  var previewImageElement = $(player_mgr.mainShellId + ' #previewImage');
  previewImageElement.css('visibility', 'hidden');
  if (imgUrl != undefined) {
	  // preload image to cache
	  $("<img/>").attr('src', imgUrl).load(function() {
	    previewImageElement.css('background', 'url(' + imgUrl + ') no-repeat -' + imgOffsetX + 'px -' + imgOffsetY + 'px');
	    previewImageElement.css('visibility', 'visible');
	  });
  }
  $(player_mgr.mainShellId + ' #previewImageTimeText')[0].textContent = timeText;
 
  var previewImageLeft = positionInSeekBar - 64; // polovina sirky obrazku
  if (!player_mgr.settings.disableSmartPreviewImagePositioning) {
	previewImageLeft = Math.max(previewImageLeft, 0);
  }
  previewImageLeft += leftOffset;
  var previewImageShell = $(player_mgr.mainShellId + ' #previewImageShell');
  previewImageShell.css('left', previewImageLeft + 'px');
  previewImageShell.css('display', 'inline');

  var textElement = $(player_mgr.mainShellId + ' #previewImageText');
  if (text == undefined) {
	textElement.css('display', 'none');
  } else {
	textElement.css('display', 'block');
    textElement.text(text);
    var maxLines = 7;
    var fontSize = 14;
    var lineSize = 1.2;
    var maxHeight = maxLines * fontSize * lineSize;
    if (textElement.height() > maxHeight) {
      var words = text.split(" ");
      while (words.length > 0) {
        words.pop();
        textElement.text(words.join(" ") + " ...");
        if (textElement.height() <= maxHeight) {
          break;
        }
      }
    }
  }
}

Controls.prototype.hidePreviewImage = function(){
  var previewImageShell = $(player_mgr.mainShellId + ' #previewImageShell');
  previewImageShell.css('display', 'none');
  var seekBarCursor = $(player_mgr.mainShellId + ' #seekBarCursor');
  seekBarCursor.css('display', 'none');
};

//****************************************************************/
//********************  Subtitles  *******************************/
//****************************************************************/

Controls.prototype.updateSubtitles = function(currentTime){
  if (controls.subtitleCues == undefined){
    //controls.clearDisplayedCue();
    return;
  }
  //make sure currentCueIndex points INTO subtitleCues OR right after the end of subtitleCues
  if (controls.currentCueIndex < 0 || controls.currentCueIndex > controls.subtitleCues.length){
    controls.currentCueIndex = controls.countCurrentCueIndex(currentTime);
  }
  var previousCue = (
	controls.currentCueIndex > 0 
	? controls.subtitleCues[controls.currentCueIndex - 1] 
	: {endTime: '0'});
  //make sure we're after previous cue's end
  if (currentTime < previousCue.endTime){
    controls.currentCueIndex = controls.countCurrentCueIndex(currentTime);
  }
  //make sure we're before current cue's end
  if (controls.currentCueIndex < controls.subtitleCues.length){
    var currentCue = controls.subtitleCues[controls.currentCueIndex];
    if (currentTime > currentCue.endTime){
      controls.currentCueIndex = controls.countCurrentCueIndex(currentTime);
    }
  }
  var currentCue = (
	controls.currentCueIndex < controls.subtitleCues.length 
	? controls.subtitleCues[controls.currentCueIndex] 
	: undefined);
  if (currentCue == undefined){// || currentTime < currentCue.startTime){
    //if (controls.displayedCueIndex != undefined){
      controls.clearDisplayedCue();
    //}
  } else if (currentTime > currentCue.startTime) {
    controls.displayCue(currentCue);
  }
};

//return index value such that previous cue already ended and this cue didn't yet end
//if last cue already ended, return subtitleCues.length
Controls.prototype.countCurrentCueIndex = function(currentTime){
  if (controls.subtitleCues.length == 0){
    return 0;
  }
  var result = 0;
  var currentCue = controls.subtitleCues[0];
  if (currentCue.endTime > currentTime){
    return result;
  }
  result = 1;
  while (result < controls.subtitleCues.length){
    var previousCue = currentCue;
    currentCue = controls.subtitleCues[result];
    if (previousCue.endTime < currentTime && currentCue.endTime > currentTime){
      return result;
    }
    result++;
  }
  return result;
};

Controls.prototype.clearDisplayedCue = function(){
  controls.displayedCueIndex = undefined;
      $(player_mgr.mainShellId + ' #twoLineSubtitlesLine1').text("");
      $(player_mgr.mainShellId + ' #twoLineSubtitlesLine2').text("");
  //$(player_mgr.mainShellId + ' #subtitlesShell').css('display', 'none');
  //console.trace();
  //console.log("clear cue");
};

Controls.prototype.displayCue = function(cueToDisplay){
  console.log("display cue");
  if (controls.currentCueIndex != controls.displayedCueIndex){
    var cueLines = cueToDisplay.text.split("\n");
    $(player_mgr.mainShellId + ' #twoLineSubtitlesLine1').text(cueLines[0]);
    $(player_mgr.mainShellId + ' #twoLineSubtitlesLine2').text(cueLines.length > 1 ? cueLines[1] : "");
    controls.displayedCueIndex = controls.currentCueIndex;
  }
};

//****************************************************************/
//********************  Skip overlay *****************************/
//****************************************************************/

Controls.prototype.setupSkipOverlay = function(countDownSecs){
  if (player_mgr.settings.uimode == 'audio'){
    return;
  }
  console.log("SETTING SKIP OVERLAY");
  var skipShell = $(player_mgr.mainShellId + ' #skipShell');
  skipShell.css('display', 'block');
  skipShell.removeClass('canSkip');
  controls.skipCountDownTotal = countDownSecs;
  controls.skipCountDownOn = true;
  controls.updateSkipOverlay(0);
};

Controls.prototype.updateSkipOverlay = function(currentTime){
  if (! controls.skipCountDownOn){
    return;
  }
  var secsLeft = controls.skipCountDownTotal - Math.floor(currentTime);
  if (secsLeft > 0){
    $(player_mgr.mainShellId + ' #skipSecsLeft')[0].textContent = "za " + controls.formatCountDownString(secsLeft);
  } else {
    var skipShell = $(player_mgr.mainShellId + ' #skipShell');
    skipShell.addClass('canSkip');
    controls.skipCountDownOn = false;
  }
};

Controls.prototype.hideSkipOverlay = function(){
  var skipShell = $(player_mgr.mainShellId + ' #skipShell');
  skipShell.css('display', 'none');
  skipShell.removeClass('canSkip');
  controls.skipCountDownOn = false;
};

Controls.prototype.formatCountDownString = function(secsLeft){
  var countDownString = secsLeft + " sekund";
  if (secsLeft == 1){
    countDownString += "u";
  } else if (secsLeft < 5){
    countDownString += "y";
  }
  return countDownString;
};

//****************************************************************/
//*******************  Next in series  ***************************/
//****************************************************************/

Controls.prototype.setupNextInSeries = function(countDownSecs, title){
  player_mgr.showNextInSeriesScreen();
  //vytvorit timer, ktery po dobu x vterin kazdou vterinu updatne pocet vterin do zacatku prehravani noveho dilu
  controls.nextSeriesCountDownValue = countDownSecs;
  controls.updateNextInSeriesCountDown();
  controls.nextInSeriesCountDownInterval = setInterval(function() {
	  controls.updateNextInSeriesCountDown();
  }, 1000);
  $(player_mgr.mainShellId + ' #skipNextInCountdownSvg').css('animation', 'nextInSeriesDash ' + countDownSecs + 's linear forwards');
  $(player_mgr.mainShellId + ' #nextInSeriesLine2').text(title);
};

Controls.prototype.updateNextInSeriesCountDown = function(){
  $(player_mgr.mainShellId + ' #secsLeft')[0].textContent = controls.formatCountDownString(controls.nextSeriesCountDownValue);
  controls.nextSeriesCountDownValue -= 1;
  if (controls.nextSeriesCountDownValue == 0){
    clearInterval(controls.nextInSeriesCountDownInterval);
   	player_mgr.playNextInSeries();
  }
};

//tohle se vola, kdykoli se zmeni aktualni cas videa
Controls.prototype.onTimeUpdate = function(event){
  //console.log("onTimeUpdate: currentTime: " + video_element.currentTime);
  //console.log(event);
  player_mgr.showVideoScreen();
  controls.updateSkipOverlay(video_element.currentTime);
  //seekbar v hrajicim timeshiftu se nema prekreslovat
  if (! player_mgr.isTimeshift){
    controls.updateSeekBar();
  }
  if (formatter.forceSeekBarRepaint){
    var seekBar = $(player_mgr.mainShellId + ' #seekBar')[0];
    controls.updateSeekBarInternal(seekBar.max, seekBar.min, seekBar.max);
    formatter.forceSeekBarRepaint = false;
  }
  if (player_mgr.editMode && player_mgr.settings.uimode == 'full'){
    controls.updateEditModeValue(player_mgr.previousItemsTotalTime + video_element.currentTime);
  }
  controls.updateSubtitles(video_element.currentTime);
  
  player_mgr.sendTrackingEvents();
};

Controls.prototype.onBufferProgress = function(event){
  this.updateSeekBarBufferedLine();
}

//****************************************************************/
//************************  Subtitles  ***************************/
//****************************************************************/

Controls.prototype.setSubtitlesTrack = function(value){
  this.subtitleCues = undefined;
  this.currentCueIndex = undefined;
  this.clearDisplayedCue();

  var subtitlesShell = $(player_mgr.mainShellId + ' #audioShell #subtitlesShell'); // plati pouze pro audioplayer
  formatter.addOrRemoveClass(subtitlesShell, (value != undefined), 'hasSubtitles');
  
  this.waitingForSubtitles = value;
  if (value != undefined) {
    var thisControls = this;
    var loader = player_mgr.currentItem.getSubtitlesLoader(value);
    loader.callWhenReady(function(data) { thisControls.subtitlesTrackLoaded(value, data); });
  }
}

Controls.prototype.subtitlesTrackLoaded = function(value, data) {
	if (this.waitingForSubtitles == value) {
		console.log('Got subtitles', value);
		this.subtitleCues = data;
		this.currentCueIndex = 0;
		this.updateSubtitles(player_mgr.video.currentTime);
	} else {
		console.log('Ignoring late subtitles', value);
	}
};

//****************************************************************/
//*******************  Version information  **********************/
//****************************************************************/

Controls.prototype.displayVersionInformation = function(){
  $(player_mgr.mainShellId + ' #versionInfoTextArea').text(player_mgr.version);
  $(player_mgr.mainShellId + ' #settingsInfoTextArea').text(JSON.stringify(player_mgr.settings, null, 2));
  $(player_mgr.mainShellId + ' #playlistInfoTextArea').text(JSON.stringify(playlist.ct_playlist, null, 2));
  $(player_mgr.mainShellId + ' #versionInfoShell').css('display', 'block');
};

Controls.prototype.hideVersionInformation = function(){
  $(player_mgr.mainShellId + ' #versionInfoShell').css('display', 'none');
};

Controls.prototype.closeSettings = function() {
    formatter.deactivateScreen('settings');
    this.showControls(); // prodlouzit timer pro skryti controls
}

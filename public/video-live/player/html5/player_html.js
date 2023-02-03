var videoPlayerHtmlString = '\
  <div id="videoShell" class="controlsExited" role="complementary" aria-label="Videopřehrávač">\
    <div id="videoBackground">\
    </div>\
    <div id="videoWrapper">\
      <video id="video" crossorigin="anonymous" webkit-playsinline>\
                  <!--video id="video" poster="http://shaka-player-demo.appspot.com/assets/poster.jpg"-->\
                  <!--track label="Czech" kind="subtitles" srclang="cz" src="http://imgct.ceskatelevize.cz/cache/data/ivysilani/subtitles/208/208522161600005/sub.vtt" default-->\
      </video>\
    </div>\
    <div id="hbbTvOverlay">\
      <img id="hbbTvOverlayImage"/>\
	</div>\
    <div id="overlay">\
      <div id="versionInfoOpener">\
      </div><!--versionInfoOpener-->\
      <div id="gradientShell">\
      </div><!--gradientShell-->\
      <div id="gradientShell2">\
      </div><!--gradientShell2-->\
      <div id="controls">\
        <div id="videoButtons" class="dontDblClick">\
          <div id="settingsShell" class="videoButtonShell dontHideControls dontHideSettings cursorPointer focusableBtn" aria-role="button" aria-label="Nastavení" title="Nastavení" tabindex="3">\
            <div class="controlBtnBackground"></div>\
            <div id="settingsBtn" class="controlBtn">\
              <svg><use xlink:href="#icon-ico-settings"></use></svg>\
            </div>\
          </div><!--settingsShell-->\
\
          <div id="volumeShell" class="dontHideControls cursorPointer">\
            <div class="controlBtnBackground"></div>\
            <div id="volumeBarShell">\
	          <div id="volumeBarContentsWrapper">\
	            <div id="volumeBarContents">\
                  <div id="volumeBarTrack"></div>\
                  <div id="volumeBarFilledTrack"></div>\
                  <div id="volumeBarThumb">\
                    <svg><use xlink:href="#icon-ico-volume-handle"></use></svg>\
                  </div>\
                  <div id="volumeBar"></div>\
                </div>\
	          </div>\
            </div><!--volumeBarShell-->\
            <div id="volumeButtons" class="videoButtonShell focusableBtn dontHideControls" title="Zvuk" aria-role="button" aria-label="Zvuk" tabindex="5"> \
              <div id="volumeBtn-0" class="controlBtn">\
                <svg><use xlink:href="#icon-ico-volume-0"></use></svg>\
              </div>\
              <div id="volumeBtn-50" class="controlBtn">\
                <svg><use xlink:href="#icon-ico-volume-50"></use></svg>\
              </div>\
              <div id="volumeBtn-100" class="controlBtn">\
                <svg><use xlink:href="#icon-ico-volume-100"></use></svg>\
              </div>\
            </div><!-- volumeButtons -->\
          </div><!-- volumeShell -->\
          <div id="newWindowShell" class="videoButtonShell dontHideControls cursorPointer focusableBtn" title="Do nového okna" aria-role="button" aria-label="Do nového okna" tabindex="5">\
            <div id="newWindowBtn" class="controlBtn">\
              <svg><use xlink:href="#icon-ico-pop"></use></svg>\
            </div>\
          </div>\
          <div id="fullScreenShell" class="videoButtonShell dontHideControls cursorPointer focusableBtn" title="Na celou obrazovku" aria-role="button" aria-label="Na celou obrazovku" tabindex="5">\
            <div id="fullScreenBtn" class="controlBtn">\
              <svg id="fullScreen"><use xlink:href="#icon-ico-fullscreen"></use></svg>\
              <svg id="smallScreen"><use xlink:href="#icon-ico-smallscreen"></use></svg>\
            </div>\
          </div>\
          <div id="hbbTvShell" class="videoButtonShell dontHideControls cursorPointer focusableBtn" title="Spárováno" aria-role="button" aria-label="Spárováno" tabindex="5">\
            <div class="controlBtnBackground"></div>\
            <div id="hbbTvBtn" class="controlBtn">\
              <svg id="linked"><use xlink:href="#icon-ico-tv-linked"></use></svg>\
              <svg id="disconnected"><use xlink:href="#icon-ico-tv-disconnected"></use></svg>\
            </div>\
	        <div id="hbbTvListArea">\
	          <div id="hbbTvListTitle">Vybrat TV</div>\
	          <div id="hbbTvList">\
	          </div>\
	        </div>\
          </div>\
        </div><!--videoButtons-->\
        <div id="seekBarAndSwitch" class="dontDblClick dontHideControls">\
          <div id="timeShiftButtons">\
            <div id="backInTimeShell" class="videoButtonShell cursorPointer dontDblClick focusableBtn" title="Zpět v čase" aria-role="button" aria-label="Zpět v čase" tabindex="2">\
              <div id="backInTimeButton" class="controlBtn">\
                <span id="backInTimeImage">\
                  <svg><use xlink:href="#icon-ico-timeshift"></use></svg>\
                </span>\
                <span id="backInTimeBtn">ZPĚT V ČASE</span>\
              </div><!--backInTimeButton-->\
            </div>\
            <div id="liveShell" class="videoButtonShell isLive cursorPointer dontDblClick focusableBtn" tabindex="2" aria-role="button" aria-label="Živě" title="Živě">\
              <div id="liveButton" class="controlBtn">\
  	            <div class="controlBtnBackground active"></div>\
                <span id="liveImage"></span>\
                <span id="liveBtn">ŽIVĚ</span>\
              </div>\
            </div>\
          </div><!-- timeShiftButtons -->\
          <div id="seekBarShell">\
            <span id="totalTimeInfo"></span>\
            <span id="remainingTimeInfo"></span>\
            <div id="seekBarTrackShell">\
              <div id="seekBarArea">\
                <div class="seekBuffered">\
                  <div class="seekBarLine">\
                    <div>&nbsp;</div>\
                  </div>\
                </div>\
                <div class="seekElapsed">\
                  <span class="seekBarTimeInfo"></span>\
                  <div class="seekBarLine">\
                    <div>&nbsp;</div>\
                  </div>\
                  <div id="seekBarThumbCircle"></div>\
                </div>\
                <div class="seekNonElapsed">\
                  <span class="seekBarTimeInfo"></span>\
                  <div class="seekBarLine">\
                    <div>&nbsp;</div>\
                  </div>\
                </div>\
				<form novalidate>\
				  <div id="seekBarFocusTarget" class="dontHideControls" tabindex="2" aria-label="Časová osa"></div>\
                  <input id="seekBar" type="range" step="any" min="0" max="1000" tabindex="-1"/>\
				  <div id="seekBarTouchArea"></div>\
	            </form>\
              </div>\
            </div>\
          </div><!--seekBarShell-->\
        </div><!--seekBarAndSwitch-->\
      </div><!--controls-->\
      <div id="playBtn" aria-role="button" aria-label="Spustit" title="Spustit" class="overlayBtn systemBtn inactive dontHideControls cursorPointer focusableBtn" tabindex="1">\
        <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\
        <svg class="icon"><use xlink:href="#icon-ico-play-big"></use></svg>\
      </div>\
      <div id="pauseBtn" aria-role="button" aria-label="Pauza" title="Pauza" class="overlayBtn systemBtn inactive dontHideControls cursorPointer focusableBtn" tabindex="1">\
        <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\
        <svg class="icon"><use xlink:href="#icon-ico-pause-big"></use></svg>\
      </div>\
      <div id="replayBtn" aria-role="button" aria-label="Přehrát znovu" title="Přehrát znovu" class="overlayBtn systemBtn inactive dontHideControls cursorPointer focusableBtn" tabindex="1">\
        <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\
        <svg class="icon"><use xlink:href="#icon-ico-replay-big"></use></svg>\
      </div>\
      <div id="customPlayBtn" aria-role="button" aria-label="Spustit" title="Spustit" class="overlayBtn customBtn inactive dontHideControls cursorPointer focusableBtn" tabindex="1">\
        <img id="customPlayBtnImage" />\
      </div>\
      <div id="skipShell" tabindex="1" class="dontDblClick focusableBtn" aria-role="button" aria-label="Přeskočit" title="Přeskočit">\
	    <div id="skipContents">\
          <div id="skipText">Přeskočit</div>\
          <div id="skipSecsLeft"></div>\
          <div id="skipBtn">\
	        Přeskočit\
            <svg class="icon"><use xlink:href="#icon-ico-skip"></use></svg>\
          </div>\
        </div>\
      </div> <!--skipShell-->\
      <div id="afterTimeShift" class="dontDblClick">\
      <svg id="afterTimeShiftSvg1"><use xlink:href="#icon-ico-after-timeshift-1"></use></svg> \
      <svg id="afterTimeShiftSvg2"><use xlink:href="#icon-ico-after-timeshift-2"></use></svg> \
      <svg id="afterTimeShiftSvg3"><use xlink:href="#icon-ico-after-timeshift-3"></use></svg> \
      <svg id="afterTimeShiftSvg4"><use xlink:href="#icon-ico-after-timeshift-4"></use></svg> \
      </div>\
      <div id="seekBarCursor"></div>\
\
	  <div id="settingsDiv" class="dontDblClick dontHideControls dontHideSettings">\
            <div id="settingsContentWrapper">\
              <div id="settingsContentScroller">\
              <div id="settingsContent">\
                <div id="leftColumn" class="settingsColumn">\
                  <div class="columnContent">\
                  </div>\
                </div>\
                <div id="rightColumn" class="settingsColumn">\
                  <div class="columnContent">\
                  </div>\
                </div>\
				<div id="settingsInnerPage">\
				  <div id="settingsInnerPageCentering">\
				  <div id="settingsInnerPageBackground"></div>\
                  <div id="addTvDiv">\
                    <div id="addTvTitle">\
                      Jak přidat TV\
                    </div>\
                    <div id="addTvStep1" class="addTvStep">\
                      <span class="addTvStepIcon">\
                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\
                        1\
                      </span>\
                      <span class="addTvStepText">Zapněte TV a&nbsp;spusťte ČT&nbsp;bod</span>\
                    </div>\
                    <div id="addTvStep2" class="addTvStep">\
                      <span class="addTvStepIcon">\
                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\
                        2\
                      </span>\
                      <span class="addTvStepText">Stiskněte na&nbsp;ovladači číslo&nbsp;8</span>\
                    </div>\
                    <div id="addTvStep3" class="addTvStep">\
                      <span class="addTvStepIcon">\
                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\
                        3\
                      </span>\
                      <span class="addTvStepText">Zadejte kód z&nbsp;TV:</span>\
                      <div id="addTvCodeInputShell">\
                        <input id="addTvCodeInput" type="text" class="dontHideControls dontHideSettings" tabindex="4">\
                      </div>\
                    </div>\
                    <div id="addTvInfo">\
                      <span class="addTvStepIcon">\
                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\
                        <svg id="addTvInfoIcon"><use xlink:href="#icon-ico-info"></use></svg>\
                      </span>\
                      <span class="addTvStepText">\
                        <a target="_blank" href="http://www.ceskatelevize.cz/hbbtv/" class="dontHideControls dontHideSettings" tabindex="4">TV musí být připojena k&nbsp;internetu\
                        a&nbsp;podporovat HbbTv. Více info &gt;</a>\
                      </span>\
                    </div>\
                  </div><!--addTvDiv-->\
				  <div id="removeTvDiv">\
					<div id="removeTvTitle">Chcete skutečně TV odebrat?</div>\
					<div id="removeTvInfo">Budete-li chtít pouštět videa na této televizi pomocí mobilu nebo počítače, budete ji muset znovu spárovat.</div>\
					<div id="removeTvConfirm" class="focusableBtn dontHideControls dontHideSettings" aria-role="button" aria-label="Odebrat TV" title="Odebrat TV" tabindex="4">Odebrat TV</div>\
					<div id="removeTvCancel" class="focusableBtn dontHideControls dontHideSettings" aria-role="button" aria-label="Nechci odebrat TV" title="Nechci odebrat TV" tabindex="4">Nechci</div>\
				  </div>\
				  </div><!--settingsInnerPageCentering-->\
	            </div><!--settingsInnerPage-->\
              </div>\
	      <div id="settingsHbbtv" class="settingsElement">\
	        <div class="settingsElementTitle">Pustit na TV</div>\
                <div id="hbbtvWrapper">\
                  <div class="settingsSelectorShell">\
                    <a href="#" class="settingsSelector" tabindex="-1">\
                      <div class="settingsSelectorPlaceholder"></div>\
                      <div class="settingsSelectorList" aria-role="listbox"></div>\
                      <div class="settingsSelectorOpenIcon"></div>\
                      <div id="showTVsIcon">\
	                <svg id="linked"><use xlink:href="#icon-ico-tv-linked"></use></svg>\
                      </div>\
                      <div class="settingsElementArrows">\
		        <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\
		        <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\
                      </div><!--settingsElementArrows-->\
                    </a>\
                  </div>\
	          <div id="addTvBtn" class="dontHideSettings dontHideControls focusableBtn" tabindex="4" aria-role="button" aria-label="Přidat TV" title="Přidat TV">\
                    <span>Přidat&nbsp;TV</span>\
                  </div>\
                </div>\
	      </div><!--settingsHbbtv-->\
	      <div id="settingsSubtitles" class="settingsElement">\
	        <div class="settingsElementTitle">Titulky</div>\
                <div class="settingsSelectorShell">\
                  <a href="#" class="settingsSelector" tabindex="-1">\
                    <div class="settingsSelectorPlaceholder"></div>\
                    <div class="settingsSelectorList" aria-role="listbox"></div>\
                    <div class="settingsSelectorOpenIcon"></div>\
                    <div class="settingsElementArrows">\
		      <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\
		      <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\
                    </div><!--settingsElementArrows-->\
                  </a>\
                </div>\
	      </div><!--settingsSubtitles-->\
	      <div id="settingsAudio" class="settingsElement">\
	        <div class="settingsElementTitle">Zvuková stopa</div>\
                <div class="settingsSelectorShell">\
                  <a href="#" class="settingsSelector" tabindex="-1">\
                    <div class="settingsSelectorPlaceholder"></div>\
                    <div class="settingsSelectorList" aria-role="listbox"></div>\
                    <div class="settingsSelectorOpenIcon"></div>\
                    <div class="settingsElementArrows">\
		      <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\
		      <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\
                    </div><!--settingsElementArrows-->\
                  </a>\
                </div>\
	      </div><!--settingsAudio-->\
	      <div id="settingsQuality" class="settingsElement">\
	        <div class="settingsElementTitle">Kvalita</div>\
                <div class="settingsSelectorShell">\
                  <a href="#" class="settingsSelector" tabindex="-1">\
                    <div class="settingsSelectorPlaceholder"></div>\
                    <div class="settingsSelectorList" aria-role="listbox"></div>\
                    <div class="settingsSelectorOpenIcon"></div>\
                    <div class="settingsElementArrows">\
		      <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\
		      <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\
                    </div><!--settingsElementArrows-->\
                  </a>\
                </div>\
	      </div><!--settingsQuality-->\
            </div><!--settingsContentScroller-->\
	    </div><!--settingsContentWrapper-->\
            <div id="settingsControls" class="cursorPointer">\
              <div id="settingsCloseButton" class="dontHideControls dontHideSettings focusableBtn" aria-role="button" aria-label="Zavřít" title="Zavřít" tabindex="4">\
                <svg><use xlink:href="#icon-ico-close"></use></svg>\
              </div>\
            </div>\
	  </div><!--settingsDiv-->\
          <div>\
	    <div id="previewImageShell">\
              <div id="previewImageText"></div>\
	      <div id="previewImage"></div>\
              <div id="previewImageTime"><span id="previewImageTimeText">00:00</span></div>\
	    </div>\
          </div>\
\
    </div><!--overlay-->\
\
        <div id="editModeShell">\
          0:00\
        </div>\
\
        <div id="subtitlesShell">\
          <div id="twoLineSubtitlesLine1"></div>\
          <br>\
          <div id="twoLineSubtitlesLine2"></div>\
        </div><!--subtitlesShell-->\
\
    <div id="nextInSeriesOverlay">\
	  <div id="nextInSeriesContent">\
		  <div id="nextInSeriesLine1">Další díl</div>\
		  <div id="nextInSeriesLine2">Budu ve tvých vzpomínkách</div>\
		  <div id="nextInSeriesLine3">\
		    <span id="willBePlayed">se přehraje za</span>\
		    <span id="secsLeft">10 sekund</span>\
		  </div>\
		  <div id="nextInSeriesLine4">\
	  	    <div id="nextInSeriesButtonShell">\
	    	  <div id="nextInSeriesBtn">Nepřehrávat další díl</div>\
		      <svg id="skipNextInCountdownSvg">\
				<path d="M102,2 l96,0 a4,4,0,0,1,4,4 l0,44 a4,4,0,0,1,-4,4 l-192,0 a4,4,0,0,1,-4,-4 l0,-44 a4,4,0,0,1,4,-4 l96,0"/>\
		 	  </svg>\
		    </div>\
	    	  <div id="middleSeriesReplayBtn" aria-role="button" aria-label="Přehrát znovu" title="Přehrát znovu" class="seriesReplayBtn dontHideControls cursorPointer focusableBtn" tabindex="1">\
	    		<svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\
	    		<svg class="icon"><use xlink:href="#icon-ico-replay-big"></use></svg>\
			  </div>\
		    </div>\
	  </div><!-- nextInSeriesContent -->\
	  <div id="bottomSeriesReplayBtn" aria-role="button" aria-label="Přehrát znovu" title="Přehrát znovu" class="seriesReplayBtn dontHideControls cursorPointer focusableBtn" tabindex="1">\
		<svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\
		<svg class="icon"><use xlink:href="#icon-ico-replay-big"></use></svg>\
	  </div>\
        </div><!--nextInSeriesOverlay-->\
\
        <div id="loadingOverlay" class="dontDblClick">\
          <div id="loadingAnimationCircle"></div>\
          <div id="loadingAnimationText">Nahrávám video...</div>\
          <div id="loadingAnimationBar"></div>\
        </div><!--loadingOverlay-->\
\
        <div id="errorOverlay">\
	      <div id="errorVerticalAligner">\
            <div id="errorIcon">\
              <svg><use xlink:href="#icon-ico-error-general"></use></svg>\
             </div>\
            <div id="errorLine1">Omlouváme se, něco se pokazilo...</div>\
            <div id="errorLine2">Dostali jsme zprávu o chybě a co nejdřív se na to podíváme.</div>\
            <div id="errorButtonsShell">\
              <div id="errorReloadShell">\
                <div id="errorReloadIcon" class="errorSmallIcon">\
                  <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\
                  <svg class="icon"><use xlink:href="#icon-ico-replay"></use></svg>\
                <!-- no whitespace --></div><div id="errorReloadText" class="errorButtonText">znovu načíst</div>\
              </div>\
              <div id="errorHelpShell">\
                <div id="errorHelpIcon" class="errorSmallIcon">\
                  <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\
                  <svg class="icon"><use xlink:href="#icon-ico-help"></use></svg>\
	              <!-- no whitespace --></div><div id="errorHelpText" class="errorButtonText">nápověda k přehrávači</div>\
              </div>\
            </div>\
          </div>\
        </div><!--errorOverlay-->\
      </div><!--videoShell-->\
\
      <div id="versionInfoShell">\
        <div id="versionShell">\
          <div id="versionInfoLabel">version</div>\
          <textarea id="versionInfoTextArea" rows="1" cols="9"></textarea>\
        </div>\
        <div id="hideVersionInfoBtn">X</div>\
        <div id="settingsInfoShell">\
          <div id="settingsInfoLabel">settings</div>\
          <textarea id="settingsInfoTextArea" rows="40" cols="80"></textarea>\
        </div>\
        <div id="playlistInfoShell">\
          <div id="playlistInfoLabel">playlist</div>\
          <textarea id="playlistInfoTextArea" rows="40" cols="80"></textarea>\
        </div>\
      </div><!--versionInfoShell-->\
\
	  <div id="newWindowFormShell"></div>\
';

var audioPlayerHtmlString = '\
      <div id="audioShell" role="complementary" aria-label="Audiopřehrávač">\
        <video id="video" crossorigin="anonymous" style="display: none;">\
	  <!--track label="Czech" kind="subtitles" srclang="cz" src="http://imgct.ceskatelevize.cz/cache/data/ivysilani/subtitles/208/208522161600005/sub.vtt" default-->\
        </video>\
        <div id="subtitlesShell">\
          <div id="twoLineSubtitlesLine1"></div>\
          <br>\
          <div id="twoLineSubtitlesLine2"></div>\
        </div><!--subtitlesShell-->\
\
        <div id="audioPlayerControlsShell">\
          <div id="audioPlayStopBtnShell">\
            <div id="audioPlayBtn" class="audioBtn audioBtn1 focusableBtn" tabindex="1" aria-role="button" aria-label="Spustit" title="Spustit" >\
               <svg><use xlink:href="#icon-ico-play"></use></svg>\
            </div>\
            <div id="audioStopBtn" class="audioBtn audioBtn1 focusableBtn" tabindex="1" aria-role="button" aria-label="Pauza" title="Pauza" >\
               <svg><use xlink:href="#icon-ico-pause"></use></svg>\
            </div>\
            <div id="audioReplayBtn" class="audioBtn audioBtn1 focusableBtn" tabindex="1" aria-role="button" aria-label="Přehrát znovu" title="Přehrát znovu" >\
               <svg><use xlink:href="#icon-ico-replay"></use></svg>\
            </div>\
          </div>\
          <div id="audioSubtitlesShell" class="focusableBtn" tabindex="4" title="Titulky" aria-role="button" aria-label="Titulky">\
	        <div id="settingsSubtitles">\
              <div class="settingsSelectorList" aria-role="listbox"></div>\
	        </div>\
            <div id="audioSubtitlesBtn">Tit.</div>\
          </div>\
          <div id="volumeShell">\
           <div id="volumeBarShell">\
             <div id="volumeBarContents">\
               <div id="volumeBarTrack"></div>\
               <div id="volumeBarFilledTrack"></div>\
               <div id="volumeBarThumb">\
                 <svg><use xlink:href="#icon-ico-volume-handle"></use></svg>\
               </div>\
               <input id="volumeBar" type="range" step="1" min="0" max="100" orient="vertical" tabindex="-1"/>\
             </div>\
           </div><!--volumeBarShell-->\
	    <div id="volumeButtons" class="focusableBtn" title="Zvuk" aria-role="button" aria-label="Zvuk" tabindex="3"> \
  	      <div id="volumeBtn-0" class="audioBtn">\
		    <svg><use xlink:href="#icon-ico-volume-0"></use></svg>\
	      </div>\
	      <div id="volumeBtn-50" class="audioBtn">\
	        <svg><use xlink:href="#icon-ico-volume-50"></use></svg>\
	      </div>\
	      <div id="volumeBtn-100" class="audioBtn">\
	        <svg><use xlink:href="#icon-ico-volume-100"></use></svg>\
	      </div>\
	    </div>\
        </div>\
\
          <div id="seekBarShell" class="notLoaded">\
            <span id="totalTimeInfo"></span>\
            <span id="remainingTimeInfo"></span>\
            <div id="seekBarTrackShell">\
              <div id="seekBarArea">\
                <div class="seekBuffered">\
                  <div class="seekBarLine">\
                    <div>&nbsp;</div>\
                  </div>\
                </div>\
                <div class="seekElapsed">\
                  <span class="seekBarTimeInfo"></span>\
                  <div class="seekBarLine">\
                    <div>&nbsp;</div>\
                  </div>\
                  <div id="seekBarThumbCircle"></div>\
                </div>\
                <div class="seekNonElapsed">\
                  <span class="seekBarTimeInfo"></span>\
                  <div class="seekBarLine">\
                    <div>&nbsp;</div>\
                  </div>\
                </div>\
				<form novalidate>\
				  <div id="seekBarFocusTarget" class="dontHideControls" tabindex="2" aria-label="Časová osa"></div>\
                  <input id="seekBar" type="range" step="any" min="0" max="1000"/>\
                </form>\
              </div>\
            </div>\
          </div><!--seekBarShell-->\
        </div><!--audioPlayerControlsShell-->\
\
      </div><!--audioShell-->\
';

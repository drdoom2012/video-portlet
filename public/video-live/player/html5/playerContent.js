	var waitMilisShaka = 400;
	$.getScript("https://www.googletagmanager.com/gtag/js?id=UA-63458229-1", function(){
	window.dataLayer = window.dataLayer || [];
		function gtag() { dataLayer.push(arguments); }
		gtag('js', new Date());
		gtag('config', 'UA-63458229-1');
});
	
		function removeVideoDiv(){
			var node = document.getElementById("videoDiv");
			node.parentNode.removeChild(node);
		}
		
		function initializePlayer(playerElem, settings) {
			var playerDiv = $(playerElem)[0];
			$.getJSON(settings.playlistURL, function (json) {
				mhmpJson = json;
				initShaka();
			});
		}		
				
		function configLivePanel(elem){
			var config = {addSeekBar: false, controlPanelElements: ["mute","volume","fullscreen"]};
			elem.configure(config);
		}

		// load shaka playeru
		function initShaka() {
			shaka.polyfill.installAll();
			if (shaka.Player.isBrowserSupported()) {
				var manifestUri = mhmpJson.playlist[0].streamUrls.main;
				const videoDiv = document.getElementById('videoDiv');
				
				//const player = new shaka.Player(videoDiv);
				setTimeout(function (){
					const ui = videoDiv['ui'];
					const controls = ui.getControls();
					const player = controls.getPlayer();
					configLivePanel(ui);
				
					window.player = player;
					player.addEventListener('error', function(event) {console.error(event);});
					try {
						player.load(manifestUri);  
					} catch (error) {
						console.error('Error code', error.code, 'object', error);
					}
				}, waitMilisShaka);
			} else {
				console.error('Browser not supported!');
			}
		}
		
		function initFailed() {
			console.error('Unable to load the UI library!');
		}
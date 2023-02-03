var mhmpJson = {};
var video = document.getElementById('video');
var player = {};
var playerType = getPlayerType();
var isFlash = !(playerType == "html5Dash" || playerType == "html5Hls");
var flashPlaylistUrl = "";
var flashPlaylistUrlHearingLoss = "";

$.getScript("https://www.googletagmanager.com/gtag/js?id=UA-63458229-1", function(){
	window.dataLayer = window.dataLayer || [];
		function gtag() { dataLayer.push(arguments); }
		gtag('js', new Date());
		gtag('config', 'UA-63458229-1');
});

// inicializační funkce pro fetch jsonu, následné načtení playeru a interaktivního menu 
var init = function(sourceDash, flashPlaylistUrl, flashPlaylistUrlHearingLoss) {
    this.flashPlaylistUrl = flashPlaylistUrl;
    this.flashPlaylistUrlHearingLoss = flashPlaylistUrlHearingLoss;
    setUpTabsListener();
    $.getJSON(sourceDash, function (json) {
        mhmpJson = json;
        if (!isFlash) {
			initHtml5Shaka();
            //if (playerType == "html5Hls") {
              //  initHtml5Hls();
            //} else if (playerType == "html5Dash") {
                //initHtml5Dash();
            //}
        } else {
            initFlash(false);
        }
        hideElement(isFlash);
        generateItems(false);
    });
}

function initFlash(isHearingLoss) {
	var flashvars = {
		playlistURL: isHearingLoss ? flashPlaylistUrlHearingLoss : flashPlaylistUrl,
		logLevel: "DEBUG",
		enableDVR: true,
		flushLiveURLCache: true,
		expandable: false,
		analyticsTrackers: "GA"
	};
	console.log("load Flash: "+flashvars.playlistURL);
	var params = {
		menu: "false",
		allowScriptAccess: "always",
		allowFullScreen: true,
		allowFullScreenInteractive: true,
		wmode: "direct"
	};
	var attributes = {
		id: "flashPlayerDiv",
		name: "player"
	};
	swfobject.embedSWF("resources/js/player/flash/CTPlayerLoader-3.0.1.swf", "flashPlayerDiv", "700", "524", "10.1.0", "expressInstall.swf", flashvars, params, attributes);
}

// generování interaktivního menu
var generateItems = function (isHearingLossSelected) {
    var agendaItems = mhmpJson.agendaItems;

    var container = document.getElementById("playlist-items");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (var i = 0; i < agendaItems.length; i++) {
        var agendaItem = agendaItems[i];

        if (agendaItem.isHearingLossSource == isHearingLossSelected) {
            var referenceParts = agendaItem.referenceParts;
            var listGroupItem = document.createElement("p");

            listGroupItem.setAttribute("class", "list-group-item");
            listGroupItem.setAttribute("id", agendaItem.id);

            //listGroupItem.setAttribute("href", "#");
            var titleLink = document.createElement("a");
            titleLink.setAttribute("href", "");
            titleLink.setAttribute("id", agendaItem.id);


            var h4ItemTitle = document.createElement("h4");
            h4ItemTitle.setAttribute("class", "list-group-item-heading");
            h4ItemTitle.setAttribute("id", agendaItem.id);
            h4ItemTitle.style.cursor = "pointer";
            h4ItemTitle.innerText = agendaItem.agendaItemName + " - " + agendaItem.petitioner;
            titleLink.appendChild(h4ItemTitle);
            setUpOnClickListener(h4ItemTitle);

            var paraItemDesctiption = document.createElement("p");
            paraItemDesctiption.setAttribute("class", "list-group-item-text");
            paraItemDesctiption.innerText = agendaItem.description;

            listGroupItem.appendChild(h4ItemTitle);
            listGroupItem.appendChild(paraItemDesctiption)

            var referencePartTitle = document.createElement("p");
            referencePartTitle.innerText = "Referencováno v čase: ";
            referencePartTitle.style.marginTop = "20px";
            referencePartTitle.style.fontWeight = "bold";

            listGroupItem.appendChild(referencePartTitle);

            for (var j = 0; j < referenceParts.length; j++) {
                var referenceElement = getReferencePartElement(referenceParts[j])
                var startTime = parseTimestamp(referenceParts[j].startTime);
                if (startTime >= 0) {
                    setUpReferenceOnClickListener(referenceElement, referenceParts[j], h4ItemTitle);
                }
                listGroupItem.appendChild(referenceElement);
            }

            container.appendChild(listGroupItem);
        }
    }
}

// přepínání mezi slyšící/neslyšící -> načtení přehrávače a menu pro daný typ
var setUpTabsListener = function () {
    var originalTab = document.getElementById("originalTab");
    var hearingLossTab = document.getElementById("hearingLossTab");

    originalTab.onclick = function () {
        if (!isFlash) {
            //if (playerType == "html5Dash") {
                //player.unload();
                //loadStream(false)
            //} else if (playerType == "html5Hls") {
                //video.src=getHlsMediaUrl(false);
            //}
			player.unload();
            loadStream(false);
        } else {
            initFlash(false);
        }

        var className = originalTab.className;
        if (className !== "active") {
            hearingLossTab.className = "";
            originalTab.className = "active";
            generateItems(false);
        }
    }

    hearingLossTab.onclick = function () {
        if (!isFlash) {
            //if (playerType == "html5Dash") {
                //player.unload();
                //loadStream(true)
            //} else if (playerType == "html5Hls") {
                //video.src=getHlsMediaUrl(true);
            //}
			player.unload();
            loadStream(true);
        } else {
            initFlash(true);
        }

        var className = hearingLossTab.className;
        if (className !== "active") {
            hearingLossTab.className = "active";
            originalTab.className = "";
            generateItems(true);
        }
    }
}

// seek kliknutím na určitou položku v menu
var setUpOnClickListener = function (element) {
    element.onclick = function () {
        for (var i = 0; i < mhmpJson.agendaItems.length; i++) {
            if (element.id == mhmpJson.agendaItems[i].id) {
                highlightClickedItem(element);
                var startTime = mhmpJson.agendaItems[i].referenceParts[0].startTime;
                if (isFlash) {
                    seek(parseTimestamp(startTime))
                } else {
                    seekHtml5Player(parseTimestamp(startTime));
                }
            }
        }
    }
}

// seek kliknutím na položku v "Referencováno v čase"
var setUpReferenceOnClickListener = function (element, referencePart, agendaElement) {
    element.onclick = function () {
        var startTime = referencePart.startTime;
        highlightClickedItem(agendaElement);
        if (isFlash) {
            seek(parseTimestamp(startTime))
        } else {
            seekHtml5Player(parseTimestamp(startTime));
        }
    }
}

// highlight zvolené části z menu
var highlightClickedItem = function (element) {
    var container = document.getElementById("playlist-items");
    var containerNodes = container.childNodes;

    var containerChildArray = Array.prototype.slice.call(containerNodes);
    for (var i = 0; i < containerChildArray.length; i++) {
        var containerItem = containerChildArray[i];
        containerItem.className = containerItem.id == element.id ? "list-group-item active" : "list-group-item";
    }
}


// pomocná funkce při generování menu (konkrétně referenčních částí)
var getReferencePartElement = function (referencePart) {
    var referencePartElement = document.createElement("div");
    referencePartElement.style.cursor = "pointer";
    //referencePartElement.setAttribute("href", "#");
    var referencePartPara = document.createElement("p");
    referencePartPara.setAttribute("class", "list-group-item-text");

    referencePartPara.innerText = trimTimestamp(referencePart.startTime);

    referencePartElement.appendChild(referencePartPara);
    return referencePartElement;
}

var getAgendaItem = function (agendaItems, agendaId) {
    for (var i = 0; i < agendaItems.length; i++) {
        var agendaItem = agendaItems[i];
        if (agendaItem.id == agendaId) {
            return agendaItem;
        }
    }
}

var parseTimestamp = function (timestamp) {
    var a = timestamp.split(':'); // split it at the colons

    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    return seconds;
}

var trimTimestamp = function (timestamp) {
    if (timestamp === undefined || timestamp.length <= 0) {
        return "";
    } else {
        return timestamp.substring(0, timestamp.length - 3);
    }
}
function initHtml5Shaka() {
	// Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();
	// Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer(false);
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}

// inicializační funkce pro shaka player (dash stream type)
function initHtml5Dash() {
	console.log("initHtml5Dash");
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer(false);
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}

// inicializační funkce pro HlS
function initHtml5Hls() {
    console.log("initHtml5Hls");
    video.src=getHlsMediaUrl(false);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener("seeking", onSeeking)
}

// pomocná funkce, která změní příponu u "mediaUrl" z mpd na m3u8 
function getHlsMediaUrl(isHearingLoss) {
    var mediaUrl = isHearingLoss ? mhmpJson.mediaUrlHearingLoss : mhmpJson.mediaUrl;
    var pos = mediaUrl.lastIndexOf(".");
    mediaUrl = mediaUrl.substr(0, pos < 0 ? mediaUrl.length : pos) + ".m3u8";
    return mediaUrl;
}

// load shaka playeru
function initPlayer(isHearingLoss) {
    // Create a Player instance.
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener("seeking", onSeeking)
    player = new shaka.Player(video);

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', onErrorEvent);
    // Try to load a manifest.
    // This is an asynchronous process.
	loadStream(false);
}

function loadStream(isHearingLoss) {
    var manifestUri = "";
	if (isHearingLoss) {
        manifestUri = mhmpJson.mediaUrlHearingLoss;
    } else {
        manifestUri = mhmpJson.mediaUrl;
    }
	if (playerType == "html5Hls") {
		var pos = manifestUri.lastIndexOf(".");
		manifestUri = manifestUri.substr(0, pos < 0 ? manifestUri.length : pos) + ".m3u8";
	}
	console.log("load Shaka: "+manifestUri);
    player.load(manifestUri).then(function () {
        // This runs if the asynchronous load is successful.
        console.log('The video has been loaded!');
    }).catch(onError);  // onError is executed if the asynchronous load fails.
}

// callback funkce shaka playeru
function onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
}

function onError(error) {
    // Log the error.
    console.error('Error code', error.code, 'object', error);
}

function onDestroy() {
    console.log("destroyed!")
}

// Google Analytics eventy
function onPlaying() {
    gtag('event', 'stream_html5_play');
}

function onPause() {
    gtag('event', 'stream_html5_pause');
}

function onEnded() {
    gtag('event', 'stream_html5_ended');
}

function onSeeked() {
    gtag('event', 'stream_html5_seek');
}

function onSeeking() {
    //console.log("seeking: " + isSeeking);
}

function seekHtml5Player(secs) {
    onSeeked();
    video.currentTime = secs;
}
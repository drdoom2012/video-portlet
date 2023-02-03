var playerType = getPlayerType();
var isFlash = !(playerType == "html5Dash" || playerType == "html5Hls");

if (isFlash) {
	initFlash("mhmp-hls.json");
}

hideElement(isFlash);
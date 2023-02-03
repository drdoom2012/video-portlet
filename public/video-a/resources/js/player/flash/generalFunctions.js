function checkMSECompatibility(mimeType) {
    var mse = window['MediaSource'] || window['WebKitMediaSource'];
    if (mse && !mse.isTypeSupported) {
        // When async type detection is required, fall back to canPlayType.
        return videoElement.canPlayType(mimeType);
    } else {
        return mse && mse.isTypeSupported(mimeType);
    }
    return false;
};
    //checkMSECompatibility('video/mp4; codecs="avc1.4d401e"');
//var patternApple=/(iPhone|iPod|iPad|Macintosh)/i;
//var patternAndroid=/Android/i;
var patternMobile=/(iPhone|iPod|iPad|Android)/i;

function isMobile() {
    return navigator.userAgent.match(patternMobile);
}


function getPlayerType() {
    //return "flash";
    if (checkMSECompatibility('video/mp4; codecs="avc1.4d401e"')) {
        return "html5Dash";
    }
    else {
        var videoElement = document.createElement('video');
        if (videoElement && videoElement.canPlayType && 
            (videoElement.canPlayType('application/vnd.apple.mpegURL') || 
            videoElement.canPlayType('application/x-mpegURL'))) { //browser podporuje videoelement a podporuje HLS
                return "html5Hls";
        }
        else {
            return "flash";
        }
    }
}

function hideElement(isFlash) {
    var flashDiv = document.getElementById("flashPlayerDiv");
    var html5div = document.getElementById("html5PlayerDiv");

    if (isFlash) {
        html5div.style.display = "none";
        flashDiv.style.display = "block";
    } else {
        html5div.style.display = "block";
        flashDiv.style.display = "none";
    }
}
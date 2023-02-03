(function() {  // anonymous namespace
  // The sources may be in a different folder from the test app.
  // Compute the base URL for all library sources.
  var loaderSrc = $('script[src*=playerLoader]').attr('src');
  /*var currentScript = document.currentScript ||
                      document.scripts[document.scripts.length - 1];
  var loaderSrc = currentScript.src;*/
  var baseUrl = loaderSrc.split('/').slice(0, -1).join('/') + '/';

  function loadScript(src) {
    // This does not seem like it would be the best way to do this, but the
    // timing is different than creating a new script element and appending
    // it to the head element.  This way, all script loading happens before
    // DOMContentLoaded.  This is also compatible with goog.require's loading
    // mechanism, whereas appending an element to head isn't.
    console.log("script " + baseUrl + " " + src);
    document.write('<script src="' + baseUrl + src + '"></script>');
  }

  function loadCss(src) {
    console.log("css " + baseUrl);
    document.write('<link rel="stylesheet" href="' + baseUrl + src + '"></link>');
  }

  // document.write('<script src="https://jsconsole.com/js/remote.js?62c2cebe-6401-4c13-ac3b-119de6020711"></script>');
  //document.write('<script src="http://player.devterium.cz/myjsconsole/myjsconsole.js"></script>');
  
  loadScript('controls.js');
  loadScript('controlsFormatter.js');
  loadScript('playerMgr.js');
  loadScript('player_html.js');
  loadScript('playlist.js');
  loadScript('playlistItem.js');
  loadScript('playerPlayer.js');
  loadScript('playerShaka.js');
  loadScript('playerHLS.js');
  loadScript('util.js');

  //loadScript('shaka-player/load.js');
  loadScript('shaka-player/third_party/closure/goog/base.js');
  loadScript('shaka-player/dist/deps.js');
  loadScript('shaka-player/shaka-player.compiled.js');

  loadScript('vtt.min.js');

  // loadCss('index.css'); // loaded in playerMgr.js
})();  // anonymous namespace


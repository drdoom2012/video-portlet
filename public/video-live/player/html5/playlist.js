function devterium_ct_playlist(){
  this.ct_playlist = null;
}

devterium_ct_playlist.prototype.init = function (ct_playlist){
  playlist.ct_playlist = ct_playlist;
  //playlist.preRoll = player_mgr.settings.vast ? player_mgr.settings.vast.preRoll : [];
  //playlist.postRoll = player_mgr.settings.vast ? player_mgr.settings.vast.postRoll : [];
  var vast = ct_playlist.setup.vast;
  playlist.preRoll = vast ? vast.preRoll : [];
  playlist.postRoll = vast ? vast.postRoll : [];
  console.log("Preroll, postroll");
  console.log(player_mgr.settings, ct_playlist);
  console.log(playlist.preRoll);
  console.log(playlist.postRoll);
  console.log(ct_playlist);
  console.log(player_mgr.settings);
  console.log();
};

//tohle bere playlist jako celek, vcetne preRoll a postRoll; index je tedy indexem do 
//celeho pole itemu, ktere mohou jit prehrat
devterium_ct_playlist.prototype.getItem = function(index){
  var prerollCount = this.getPrerollItemCount();
  if (index < prerollCount) {
    return this.getPreRollItem(index);
  }
  index -= prerollCount;
  
  var mainCount = this.getMainPlaylistItemCount();
  if (index < mainCount) {
    return this.getPlaylistItem(index);
  }
  index -= mainCount;
  
  var postrollCount = this.getPostrollItemCount();
  if (index < postrollCount) {
    return this.getPostRollItem(index);
  }
  
  console.log("no item");
  return undefined;
};

devterium_ct_playlist.prototype.getItemCount = function(){
  return this.getPrerollItemCount() + this.getMainPlaylistItemCount() + this.getPostrollItemCount();
}

devterium_ct_playlist.prototype.getPrerollItemCount = function() {
	return this.getVastItemCount(this.preRoll);
}

devterium_ct_playlist.prototype.getPostrollItemCount = function() {
	return this.getVastItemCount(this.postRoll);
}
devterium_ct_playlist.prototype.getVastItemCount = function(vastArray) {
	return (vastArray == undefined) ? 0 : vastArray.length;
}

devterium_ct_playlist.prototype.getMainPlaylistItemCount = function() {
	return this.ct_playlist.playlist.length;
}

//tohle pracuje pouze s polem playlist.playlist; tedy nebere v potaz preRoll a postRoll
//reklamy, ktere jsou okolo
devterium_ct_playlist.prototype.getPlaylistItem = function(index){
  return (playlist.ct_playlist.playlist[index] ? new PlaylistItem(false, playlist.ct_playlist.playlist[index]) : undefined);
};

devterium_ct_playlist.prototype.getPreRollItem = function(index){
  return playlist.getVastItem(playlist.preRoll[index]);
};

devterium_ct_playlist.prototype.getPostRollItem = function(index){
  return playlist.getVastItem(playlist.postRoll[index]);
};

devterium_ct_playlist.prototype.getVastItem = function(vastUrl){
  return new PlaylistItem(true, vastUrl);
};

devterium_ct_playlist.prototype.getPreviewImageUrl = function(){
  return playlist.ct_playlist.setup.previewImageUrl;
};

devterium_ct_playlist.prototype.getAspect = function(){
  return playlist.getPlaylistItem(0).getAspect();
};

devterium_ct_playlist.prototype.getWidth = function(){
  return playlist.getPlaylistItem(0).getWidth();
};

devterium_ct_playlist.prototype.getGemius = function() {
	return this.ct_playlist.setup.gemius;
}

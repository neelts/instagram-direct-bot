package instagram.thread;

@:enum abstract ItemType(String) {
	var Text = "text";
	var MediaShare = "mediaShare";
	var StoryShare = "story_share";
	var Profile = "profile";
}
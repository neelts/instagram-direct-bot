package instagram;

import instagram.Media.Story;

@:jsRequire("instagram-private-api/client/v1/thread-item")
extern class ThreadItem extends Params<ThreadItemParams> {
	public var mediaShare:Media;
}

typedef ThreadItemParams = {
	var type:ItemType;
	var accountId:String;
	var storyShare:Story;
}

@:enum abstract ItemType(String) {
	var Text = "text";
	var MediaShare = "mediaShare";
	var StoryShare = "story_share";
	var Profile = "profile";
}

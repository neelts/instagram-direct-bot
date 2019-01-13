package instagram;

@:jsRequire("instagram-private-api/client/v1/media")
extern class Media extends Params<MediaParams> {
	public var id:String;
}

typedef Story = {
	var media:StoryMedia;
}

typedef StoryMedia = {
	var caption:StoryMediaCaption;
}

typedef StoryMediaCaption = {
	var text:String;
}

typedef MediaParams = {
	var caption:String;
}

package instagram.media;

typedef Story = {
	var media:StoryMedia;
}

typedef StoryMedia = {
	var caption:StoryMediaCaption;
}

typedef StoryMediaCaption = {
	var text:String;
}
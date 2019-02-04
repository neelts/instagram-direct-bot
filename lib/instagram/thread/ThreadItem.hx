package instagram.thread;

import instagram.core.Params;
import instagram.media.Media;
import instagram.media.Profile;
import instagram.media.Story;

@:jsRequire("instagram-private-api/client/v1/thread-item")
extern class ThreadItem extends Params<ThreadItemParams> {

}

typedef ThreadItemParams = {
	var id:String;
	var type:ItemType;
	var text:String;
	var accountId:String;
	var mediaShare:Media;
	var storyShare:Story;
	var profile:Profile;
}
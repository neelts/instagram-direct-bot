package instagram.media;

import instagram.core.Params;
@:jsRequire("instagram-private-api/client/v1/media")
extern class Media extends Params<MediaParams> {
	public var id:String;
}

typedef MediaParams = {
	var caption:String;
}
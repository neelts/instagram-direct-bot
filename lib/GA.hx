package ;

import haxe.http.HttpNodeJs;

using sys.io.File;

class GA {

	static var request = {
		var http = new HttpNodeJs('http://www.google-analytics.com/collect');
		http.addParameter('v', '1');
		http.addParameter('tid', 'ga.id'.getContent());
		http.addParameter('t', 'event');
		http.setPostData('');
		http;
	}

	public static function event(category:String, action:String, user:String = '0'):Void {
		Log.print('$category -> $action');
		request.setParameter('cid', user);
		request.setParameter('ec', category);
		request.setParameter('ea', action);
		request.request(true);
	}
}

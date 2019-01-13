package ;

import haxe.http.HttpNodeJs;

using Utils;
using sys.io.File;

class GA {

	static var request:HttpNodeJs = {
		var http = new HttpNodeJs('http://www.google-analytics.com/collect');
		http.addParameter('v', '1');
		http.addParameter('tid', 'ga.id'.getContent());
		http.addParameter('t', 'event');
		http.setPostData('');
		http;
	}

	public static function event(category:String, action:String, user:String = '0'):Void {
		'$category -> $action'.log();
		request.setParameter('cid', user);
		request.setParameter('ec', category);
		request.setParameter('ea', action);
		request.request(true);
	}
}
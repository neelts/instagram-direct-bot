package ;

import haxe.http.HttpNodeJs;

using Utils;
using sys.io.File;
using sys.FileSystem;

class Analytics {

	static inline var ga = 'ga.id';

	static var request:HttpNodeJs = {
		if (ga.exists()) {
			var http = new HttpNodeJs('http://www.google-analytics.com/collect');
			http.addParameter('v', '1');
			http.addParameter('tid', ga.getContent());
			http.addParameter('t', 'event');
			http.setPostData('');
			http;
		} else null;
	}

	public static function event(category:Category, action:String, user:String = '0'):Void {
		'$category -> $action'.log();
		if (request != null) {
			request.setParameter('cid', user);
			request.setParameter('ec', category);
			request.setParameter('ea', action);
			request.request(true);
		}
	}
}

@:enum abstract Category(String) to String {
	var App = 'app';
	var Pending = 'pending';
	var Respond = 'respond';
}
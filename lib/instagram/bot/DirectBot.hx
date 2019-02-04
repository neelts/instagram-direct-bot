package instagram.bot;

import google.Analytics;
import instagram.core.Session;
import instagram.core.Device;
import instagram.core.CookieFileStorage;

using sys.io.File;
using sys.FileSystem;
using Utils;
using haxe.Timer;

@:allow(instagram.bot.DirectBotComponent)
class DirectBot {

	static inline var COOKIES:String = 'cookies';

	static inline var alive:Int = 60 * 1000;

	var user:String;
	var components:Array<Class<DirectBotComponent>>;

	var device:Device;
	var storage:CookieFileStorage;
	var approver:DirectApprover;
	var session:Session;
	var userId:String;

	public function new(user:String, components:Array<Class<DirectBotComponent>>) {
		this.user = user;
		this.components = components;
		this.components.unshift(DirectApprover);
		device = new Device(user);
		if (!COOKIES.exists()) COOKIES.createDirectory();
		var cookies = '$COOKIES/$user.json';
		if (!cookies.exists()) cookies.saveContent('');
		storage = new CookieFileStorage(cookies);
		login();
	}

	function login() {
		Analytics.event(Category.App, 'login');
		Session.create(device, storage, user, '$user.p'.getContent()).then(
			getUserId, _ -> login.delayRand()
		);
	}

	function getUserId(session:Session) {
		this.session = session;
		session.getAccountId().then(init);
	}

	function init(userId:String) {
		this.userId = userId;
		for (ComponentClass in components) Type.createInstance(ComponentClass, [this]);
		Analytics.event(Category.App, 'init');
		alive.repeat(() -> Analytics.event(Category.App, 'alive'));
	}

}
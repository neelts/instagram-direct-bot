import instagram.Session;
import instagram.Device;
import instagram.CookieFileStorage;

using Utils;
using haxe.Timer;
using sys.io.File;

class GetAvatar {

	static inline var tick = 60 * 1000;

	static var user:String;
	static var device:Device;
	static var storage:CookieFileStorage;
	static var approver:DirectApprover;
	static var session:Session;

    static public function main() {
		user = 'get.avatar';
		device = new Device(user);
		storage = new CookieFileStorage('cookies/$user.json');	
		login();
    }

	static function login() {
		Session.create(device, storage, user, '$user.p'.getContent()).then(getUserId, _ -> login.delay(2.rand(3)));
	}

	static function getUserId(session) {
		GetAvatar.session = session;
		session.getAccountId().then(init);
	}

	static function init(userId) {
		approver = new DirectApprover(session);
		GA.event('app', 'init');
		tick.repeat(() -> GA.event('app', 'alive'));
	}

	public static inline function log(message:String):Void {
		Sys.println('${Date.now()}: $message');
	}
}
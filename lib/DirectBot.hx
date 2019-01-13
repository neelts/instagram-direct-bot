package;

import instagram.Session;
import instagram.CookieFileStorage;
import instagram.Device;

using sys.io.File;
using Utils;
using haxe.Timer;

@:allow(DirectBotComponent)
class DirectBot {

    static inline var alive:Int = 60 * 1000;

	var user:String;
	var analytics:Bool;
	var components:Array<Class<DirectBotComponent>>;

	var device:Device;
	var storage:CookieFileStorage;
	var approver:DirectApprover;
	var session:Session;
	var userId:String;

    public function new(user:String, components:Array<Class<DirectBotComponent>>, analytics:Bool = false) {
        this.user = user;
		this.analytics = analytics;
		this.components = components;
		this.components.unshift(DirectApprover);
		device = new Device(user);
        storage = new CookieFileStorage('cookies/$user.json');
        login();
    }

    function login() {
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
        if (analytics) {
			GA.event('app', 'init');
        	alive.repeat(() -> GA.event('app', 'alive'));
		}
    }

}
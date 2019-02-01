package instagram.core;

import js.Promise;

@:jsRequire("instagram-private-api/client/v1/session")
extern class Session {
	public static function create(device:Device, storage:CookieFileStorage, username:String, password:String, ?proxy:String):Promise<Session>;
	public function getAccountId():Promise<String>;
}

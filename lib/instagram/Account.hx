package instagram;

import js.Promise;

@:jsRequire("instagram-private-api/client/v1/account")
extern class Account {
	public var id:String;
	public static function getById(session:Session, id:String):Promise<Dynamic>;
}

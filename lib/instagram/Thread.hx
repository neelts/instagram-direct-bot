package instagram;

import js.Promise;

@:jsRequire("instagram-private-api/client/v1/thread")
extern class Thread extends Params<ThreadParams> {
	public function new(session:Session, thread:Thread);
	public var id:String;
	public var accounts:Array<Account>;
	public function hide():Promise<Void>;
	public function approve():Promise<Void>;
	public static function configureText(session:Session, users:Array<String>, text:String):Promise<Array<Thread>>;
	public static function approveAll():Promise<Void>;
}

typedef ThreadParams = {
	var pending:Bool;
	var threadId:String;
	var threadV2Id:String;
}

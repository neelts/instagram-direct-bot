package instagram.thread;

import instagram.core.Session;
import js.Promise;

@:jsRequire("instagram-private-api/client/v1/feeds/thread-items")
extern class ThreadItems {
	public var threadId:String;
	public function new(session:Session, ?threadId:String, ?limit:Int);
	public function get():Promise<Array<ThreadItem>>;
}

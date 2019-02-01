package instagram;

import instagram.core.Session;
import instagram.thread.Thread;
import js.Promise;

@:jsRequire("instagram-private-api/client/v1/feeds/inbox")
extern class Inbox {
	public function new(session:Session, ?limit:Int);
	public function get():Promise<Array<Thread>>;
}

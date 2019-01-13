package instagram;

import js.Promise;

@:jsRequire("instagram-private-api/client/v1/feeds/inbox-pending")
extern class InboxPending {
	public var pendingRequestsTotal:Int;
	public function new(session:Session, ?limit:Int);
	public function get():Promise<Array<Thread>>;
}

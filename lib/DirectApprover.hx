import haxe.crypto.Sha256;
import instagram.Thread;
import instagram.InboxPending;
import instagram.Session;

using Utils;
using haxe.Timer;

class DirectApprover {

	var inboxPending:InboxPending;

	public function new(session:Session) {
		inboxPending = new InboxPending(session);
		get();
	}

	function get() {
		inboxPending.get().then(check).catchError(error);
	}

	function check(threads:Array<Thread>) {
		for (thread in threads) {
			thread.approve().catchError(Utils.log);
			GA.event('pending', 'approve', Sha256.encode(thread.accounts[0].id));
		}
		get.delay(2.rand(3));
	}

	function error(e) {
		Utils.log(e);
		get.delay(2.rand(3));
	}
}

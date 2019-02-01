import instagram.thread.Thread;
import Analytics.Category;
import haxe.crypto.Sha256;
import instagram.InboxPending;

using Utils;
using haxe.Timer;

class DirectApprover extends DirectBotComponent {

	var inboxPending:InboxPending;

	public function new(bot:DirectBot) {
		super(bot);
		inboxPending = new InboxPending(bot.session);
		get();
	}

	function get() {
		inboxPending.get().then(check).catchError(error);
	}

	function check(threads:Array<Thread>) {
		for (thread in threads) {
			thread.approve().catchError(Utils.log);
			Analytics.event(Category.Pending, 'approve', Sha256.encode(thread.accounts[0].id));
		}
		get.delayRand();
	}

	function error(e:String) {
		e.log();
		get.delayRand();
	}
}

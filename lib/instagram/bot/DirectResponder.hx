package instagram.bot;
import haxe.crypto.Sha256;
import instagram.thread.Thread;
import instagram.thread.ThreadItem;
import instagram.thread.ThreadItems;

using Utils;

class DirectResponder extends DirectBotComponent {

	var busy:Bool;
	var queue:Array<ThreadMessage> = [];

	var inbox:Inbox;
	var threadItems:ThreadItems;

	@:keep public function new(bot:DirectBot) {
		super(bot);
		inbox = new Inbox(bot.session);
		threadItems = new ThreadItems(bot.session);
		get();
	}

	function get() {
		inbox.get().then((threads:Array<Thread>) -> if (threads.isNotEmpty()) for (thread in threads) {
			var gaUser = !thread.accounts.isNotEmpty() ? Sha256.encode(thread.accounts[0].id) : '0';
			threadItems.threadId = thread.id;
			threadItems.get().then((messages:Array<ThreadItem>) -> {
				if (messages.isNotEmpty()) {
					for (message in messages) {
						if (message.params.accountId != bot.userId) check(thread, message);
					}
				}
				next();
			}, error);
		} else next(), error);
	}

	function check(thread:Thread, message:ThreadItem) {
		// Override
	}

	function error(e:Any):Void {
		Utils.log('getError: ' + e);
		next();
	}

	function next():Void get.delayRand();

	function respond(thread:Thread, text:String = null) {
		queue.push({ thread: thread, userId: thread.accounts[0].id, text: text });
		if (!busy) {
			send();
			busy = true;
		}
	}

	private function send(?_):Void {
		if (queue.length > 0) {
			var message:ThreadMessage = queue.shift();
			Thread.configureText(bot.session, [message.userId], message.text).then(sendNext).catchError(sendError);
		} else busy = false;
	}

	private function sendNext(threads:Array<Thread>) {
		if (queue.length == 0 || (queue.length > 0 && queue[0].userId != bot.userId)) {
			threads[0].hide().then(send).catchError(error);
		} else send();
	}

	private function sendError(e) {
		Utils.log('sendError: ' + e);
		send();
	}
}

private typedef ThreadMessage = {
	var thread:Thread;
	var userId:String;
	var text:String;
}
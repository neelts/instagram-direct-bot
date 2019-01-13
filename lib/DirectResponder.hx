package ;
import instagram.ThreadItem;
import haxe.crypto.Sha256;
import instagram.Thread;
import instagram.ThreadItems;
import instagram.Inbox;

using Utils;

class DirectResponder extends DirectBotComponent {

	var analytics:Bool;
	var queue:Array<ThreadMessage> = [];

	var inbox:Inbox;
	var threadItems:ThreadItems;

	public function new(bot:DirectBot, analytics:Bool = false) {
		super(bot);
		this.analytics = analytics;
		inbox = new Inbox(bot.session);
		threadItems = new ThreadItems(bot.session);
		get();
	}

	function get() {
		inbox.get().then((threads : Array<Thread>) -> {
			if (threads.isNotEmpty())
				for (thread in threads) {
					var gaUser = !thread.accounts.isNotEmpty() ? Sha256.encode(thread.accounts[0].id) : '0';
					threadItems.threadId = thread.id;
					threadItems.get().then((messages : Array<ThreadItem>) -> {
						if (messages.isNotEmpty()) {
							var responded = false;

							for (message in messages)
								if (message.params.accountId != bot.userId) {
									var caption:String = switch (message.params.type) {
										case MediaShare: message.mediaShare.params.caption;
										case StoryShare: message.params.storyShare.media != null && message.params.storyShare.media.caption != null ? message
										.params.storyShare.media.caption.text : null;
										default: null;
									}

									if (caption != null) {
										add(thread, caption);

										var urls:Int = 0;
										var emails:Int = 0;
										var phones:Int = 0;

										for (link in matches(caption, URL)) {
											add(thread, link);
											urls++;
										}

										for (email in matches(caption, EMAIL)) {
											add(thread, email);
											emails++;
										}

										for (phone in matches(caption, PHONE)) {
											add(thread, phone);
											phones++;
										}

										if (!responded)
											responded = true;

										if (analytics) {
											GA.event('respond', 'text', gaUser);
											if (urls > 0)
												GA.event('respond', 'url', gaUser);
											if (emails > 0)
												GA.event('respond', 'email', gaUser);
											if (phones > 0)
												GA.event('respond', 'phone', gaUser);
										}
									}
								}

							if (!responded) {
								add(thread, '${0xD83D.fromCharCode()}${(0xDC00 + (Math.random() * 0x3D).int()).fromCharCode()}');
								if (analytics) GA.event('respond', 'unknown', gaUser);
							}

							stats.messages++;
						}

						next();
					}, error);
				} else {
				next();
			}
		}, error);
	}

	function add(thread:Thread, text:String = null) {
		queue.push({thread: thread, userId: thread.accounts.first().id, text: text});
		if (!busy) {
			send();
			busy = true;
		}
	}
}

private typedef ThreadMessage = {
	var thread:Thread;
	var userId:String;
	var text:String;
}
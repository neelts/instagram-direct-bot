package;

import instagram.Account;
import instagram.Thread;
import instagram.ThreadItem;

class GetAvatar {
	static var bot:DirectBot;

	static public function main() {
		bot = new DirectBot('get.avatar', [GetAvatarResponder]);
	}
}

class GetAvatarResponder extends DirectResponder {

	override function check(thread:Thread, message:ThreadItem) {
		switch (message.params.type) {
			case Text: respond(thread, message.mediaShare.params.caption);
			case Profile: {
				Account.getById(bot.session, message.params.accountId).then((r) -> {
					trace(r);
				});
			}
			default: respond(thread, 'Hello!');
		}
	}
}
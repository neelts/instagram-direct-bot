package;

import instagram.bot.DirectBot;
import instagram.bot.DirectResponder;
import instagram.thread.Thread;
import instagram.thread.ThreadItem;
import instagram.thread.ItemType;
import instagram.account.Account;

class GetAvatar {

	static var bot:DirectBot;

	static public function main() {
		bot = new DirectBot('get.avatar', [GetAvatarResponder]);
	}
}

class GetAvatarResponder extends DirectResponder {

	override function check(thread:Thread, message:ThreadItem) {
		switch (message.params.type) {
			case Text: checkUserNameAndSearch(thread, message.params.text);
			case Profile: searchByIdAndSend(thread, message.params.profile.pk);
			default: respond(thread, '❓');
		}
	}

	private function checkUserNameAndSearch(thread:Thread, username:String):Void {
		if (~/@[a-z0-9\._]+/.match(username)) {
			username = username.substr(1);
			Account.search(bot.session, username).then(
				(accounts:Array<Account>) -> {
					if (accounts != null && accounts.length > 0) {
						for (account in accounts) if (account.params.username == username) {
							searchByIdAndSend(thread, account.id);
							return;
						}
					}
					respond(thread, "❌");
				}, e -> respond(thread, e)
			);
		} else respond(thread, '➡ @username!');
	}

	private function searchByIdAndSend(thread:Thread, id:String):Void {
		Account.getById(bot.session, id).then(
			(account:Account) -> {
				var hd = account.params.hdProfilePicUrlInfo;
				respond(thread, hd != null ? hd.url : account.params.picture);
			}, e -> respond(thread, e)
		);
	}
}
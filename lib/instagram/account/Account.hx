package instagram.account;

import instagram.core.Session;
import js.Promise;

@:jsRequire("instagram-private-api/client/v1/account")
extern class Account extends Params<AccountParams> {
	public var id:String;
	public static function getById(session:Session, id:String):Promise<Account>;
	public static function search(session:Session, username:String):Promise<Array<Account>>;
}

typedef AccountParams = {
	var pk:Int;
	var username:String;
	var fullName:String;
	var isPrivate:Bool;
	var profilePicUrl:String;
	var profilePicId:String;
	var isVerified:Bool;
	var hasAnonymousProfilePicture:Bool;
	var mediaCount:Int;
	var geoMediaCount:Int;
	var followerCount:Int;
	var followingCount:Int;
	var followingTagCount:Int;
	var biography:String;
	var externalUrl:String;
	var totalIgtvVideos:Int;
	var totalArEffects:Int;
	var reelAutoArchive:String;
	var usertagsCount:Int;
	var isFavorite:Bool;
	var isInterestAccount:Bool;
	var hasChaining:Bool;
	var hdProfilePicUrlInfo:AccountParamsProfilePicVersions;
	var hdProfilePicVersions:Array<AccountParamsProfilePicVersions>;
	var mutualFollowersCount:Int;
	var hasHighlightReels:Bool;
	var canBeReportedAsFraud:Bool;
	var isBusiness:Bool;
	var isCallToActionEnabled:Bool;
	var includeDirectBlacklistStatus:Bool;
	var isPotentialBusiness:Bool;
	var isBestie:Bool;
	var hasUnseenBestiesMedia:Bool;
	var showAccountTransparencyDetails:Bool;
	var autoExpandChaining:Bool;
	var highlightReshareDisabled:Bool;
	var picture:String;
	var id:Int;
}

typedef AccountParamsProfilePicVersions = {
	var url:String;
	var width:Int;
	var height:Int;
}
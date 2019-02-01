package instagram.media;

typedef Profile = {
	var pk:String;
	var username:String;
	var full_name:String;
	var is_private:Bool;
	var profile_pic_url:String;
	var profile_pic_id:String;
	var is_verified:Bool;
	var has_anonymous_profile_picture:Bool;
	var reel_auto_archive:String;
}
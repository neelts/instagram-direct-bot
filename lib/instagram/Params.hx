package instagram;

extern class Params<T> {
	var _params:T;
	public var params(get, null):T;
	private inline function get_params():T
		return _params;
}

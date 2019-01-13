class Log {

    public static inline function print(message:String):Void {
		Sys.println('${Date.now()}: $message');
	}
    
}
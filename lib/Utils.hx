import haxe.Timer;

class Utils {

	public static inline function log(message:String) Sys.println('${Date.now()}: $message');

	public static inline function first<T>(array:Array<T>):T return array[0];

	public static inline function last<T>(array:Array<T>):T return array[array.length - 1];

	public static inline function isEmpty<T>(array:Array<T>):Bool return array == null || array.length == 0;

	public static inline function isNotEmpty<T>(array:Array<T>):Bool return array != null && array.length > 0;

	public static inline function or<T>(value:Null<T>, alter:T):T return value != null ? value : alter;

	public static inline function rand(base:Float, vary:Float):Int return Std.int((base + Math.random() * vary) * 1000);

	public static inline function repeat(time:Int, run:Void -> Void) new Timer(time).run = run;

	public static inline function delayRand(run:Void -> Void, base:Float = 2, time:Float = 3) Timer.delay(run, rand(2, 3));

}
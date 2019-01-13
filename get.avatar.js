// Generated by Haxe 4.0.0-preview.5+7eb789f54
if (process.version < "v4.0.0") console.warn("Module " + (typeof(module) == "undefined" ? "" : module.filename) + " requires node.js version 4.0.0 or higher");
(function () { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}var DirectApprover = function(session) {
	this.inboxPending = new instagram_InboxPending(session);
	this.get();
};
DirectApprover.__name__ = true;
DirectApprover.prototype = {
	get: function() {
		this.inboxPending.get().then($bind(this,this.check))["catch"]($bind(this,this.error));
	}
	,check: function(threads) {
		var _g = 0;
		while(_g < threads.length) {
			var thread = threads[_g];
			++_g;
			thread.approve()["catch"](Utils.log);
			GA.event("pending","approve",haxe_crypto_Sha256.encode(thread.accounts[0].id));
		}
		haxe_Timer.delay($bind(this,this.get),(2 + Math.random() * 3) * 1000 | 0);
	}
	,error: function(e) {
		var v = "" + Std.string(new Date()) + ": " + e;
		process.stdout.write(v);
		process.stdout.write("\n");
		haxe_Timer.delay($bind(this,this.get),(2 + Math.random() * 3) * 1000 | 0);
	}
};
var DirectBot = function(user,analytics) {
	if(analytics == null) {
		analytics = false;
	}
	this.user = user;
	this.analytics = analytics;
	this.device = new instagram_Device(user);
	this.storage = new instagram_CookieFileStorage("cookies/" + user + ".json");
	this.login();
};
DirectBot.__name__ = true;
DirectBot.prototype = {
	login: function() {
		var _gthis = this;
		instagram_Session.create(this.device,this.storage,this.user,js_node_Fs.readFileSync("" + this.user + ".p",{ encoding : "utf8"})).then($bind(this,this.getUserId),function(_) {
			var tmp = (2 + Math.random() * 3) * 1000 | 0;
			return haxe_Timer.delay($bind(_gthis,_gthis.login),tmp);
		});
	}
	,getUserId: function(session) {
		this.session = session;
		session.getAccountId().then($bind(this,this.init));
	}
	,init: function(userId) {
		this.approver = new DirectApprover(this.session);
		if(this.analytics) {
			GA.event("app","init");
			new haxe_Timer(60000).run = function() {
				GA.event("app","alive");
				return;
			};
		}
	}
};
var haxe_http_HttpBase = function(url) {
	this.url = url;
	this.headers = [];
	this.params = [];
};
haxe_http_HttpBase.__name__ = true;
haxe_http_HttpBase.prototype = {
	setParameter: function(name,value) {
		var _g = 0;
		var _g1 = this.params.length;
		while(_g < _g1) {
			var i = _g++;
			if(this.params[i].name == name) {
				this.params[i] = { name : name, value : value};
				return;
			}
		}
		this.params.push({ name : name, value : value});
	}
	,addParameter: function(name,value) {
		this.params.push({ name : name, value : value});
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
};
var haxe_http_HttpNodeJs = function(url) {
	haxe_http_HttpBase.call(this,url);
};
haxe_http_HttpNodeJs.__name__ = true;
haxe_http_HttpNodeJs.__super__ = haxe_http_HttpBase;
haxe_http_HttpNodeJs.prototype = $extend(haxe_http_HttpBase.prototype,{
	request: function(post) {
		var _gthis = this;
		this.responseData = null;
		var parsedUrl = js_node_Url.parse(this.url);
		var secure = parsedUrl.protocol == "https:";
		var host = parsedUrl.hostname;
		var path = parsedUrl.path;
		var port = parsedUrl.port != null ? Std.parseInt(parsedUrl.port) : secure ? 443 : 80;
		var h = { };
		var _g = 0;
		var _g1 = this.headers;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			var arr = Reflect.field(h,i.name);
			if(arr == null) {
				arr = [];
				h[i.name] = arr;
			}
			arr.push(i.value);
		}
		if(this.postData != null) {
			post = true;
		}
		var uri = null;
		var _g2 = 0;
		var _g3 = this.params;
		while(_g2 < _g3.length) {
			var p = _g3[_g2];
			++_g2;
			if(uri == null) {
				uri = "";
			} else {
				uri += "&";
			}
			var s = p.name;
			var uri1 = encodeURIComponent(s) + "=";
			var s1 = p.value;
			uri += uri1 + encodeURIComponent(s1);
		}
		var question = path.split("?").length <= 1;
		if(uri != null) {
			path += (question ? "?" : "&") + uri;
		}
		var opts = { protocol : parsedUrl.protocol, hostname : host, port : port, method : post ? "POST" : "GET", path : path, headers : h};
		var httpResponse = function(res) {
			var s2 = res.statusCode;
			if(s2 != null) {
				_gthis.onStatus(s2);
			}
			var body = "";
			res.on("data",function(d) {
				body += d;
			});
			res.on("end",function(_) {
				_gthis.responseData = body;
				_gthis.req = null;
				if(s2 != null && s2 >= 200 && s2 < 400) {
					_gthis.onData(body);
				} else {
					_gthis.onError("Http Error #" + s2);
				}
			});
		};
		this.req = secure ? js_node_Https.request(opts,httpResponse) : js_node_Http.request(opts,httpResponse);
		if(post) {
			this.req.write(this.postData);
		}
		this.req.end();
	}
});
var js_node_Fs = require("fs");
var GA = function() { };
GA.__name__ = true;
GA.event = function(category,action,user) {
	if(user == null) {
		user = "0";
	}
	var v = "" + Std.string(new Date()) + ": " + ("" + category + " -> " + action);
	process.stdout.write(v);
	process.stdout.write("\n");
	GA.request.setParameter("cid",user);
	GA.request.setParameter("ec",category);
	GA.request.setParameter("ea",action);
	GA.request.request(true);
};
var GetAvatar = function() { };
GetAvatar.__name__ = true;
GetAvatar.main = function() {
	GetAvatar.bot = new DirectBot("get.avatar");
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x, x && x[0]=="0" && (x[1]=="x" || x[1]=="X") ? 16 : 10);
	if(isNaN(v)) {
		return null;
	}
	return v;
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.hex = function(n,digits) {
	var s = "";
	while(true) {
		s = "0123456789ABCDEF".charAt(n & 15) + s;
		n >>>= 4;
		if(!(n > 0)) {
			break;
		}
	}
	if(digits != null) {
		while(s.length < digits) s = "0" + s;
	}
	return s;
};
var Utils = function() { };
Utils.__name__ = true;
Utils.log = function(message) {
	var v = "" + Std.string(new Date()) + ": " + message;
	process.stdout.write(v);
	process.stdout.write("\n");
};
Utils.first = function(array) {
	return array[0];
};
Utils.last = function(array) {
	return array[array.length - 1];
};
Utils.isNotEmpty = function(array) {
	if(array != null) {
		return array.length > 0;
	} else {
		return false;
	}
};
Utils.or = function(value,alter) {
	if(value != null) {
		return value;
	} else {
		return alter;
	}
};
Utils.rand = function(base,vary) {
	return (base + Math.random() * vary) * 1000 | 0;
};
Utils.repeat = function(time,run) {
	new haxe_Timer(time).run = run;
};
Utils.delayRand = function(run,base,time) {
	if(time == null) {
		time = 3;
	}
	if(base == null) {
		base = 2;
	}
	haxe_Timer.delay(run,(2 + Math.random() * 3) * 1000 | 0);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var haxe_crypto_Sha256 = function() {
};
haxe_crypto_Sha256.__name__ = true;
haxe_crypto_Sha256.encode = function(s) {
	var sh = new haxe_crypto_Sha256();
	return sh.hex(sh.doEncode(haxe_crypto_Sha256.str2blks(s),s.length * 8));
};
haxe_crypto_Sha256.str2blks = function(s) {
	var s1 = haxe_io_Bytes.ofString(s);
	var nblk = (s1.length + 8 >> 6) + 1;
	var blks = [];
	var _g = 0;
	var _g1 = nblk * 16;
	while(_g < _g1) blks[_g++] = 0;
	var _g2 = 0;
	var _g3 = s1.length;
	while(_g2 < _g3) {
		var i = _g2++;
		blks[i >> 2] |= s1.b[i] << 24 - ((i & 3) << 3);
	}
	var i1 = s1.length;
	blks[i1 >> 2] |= 128 << 24 - ((i1 & 3) << 3);
	blks[nblk * 16 - 1] = s1.length * 8;
	return blks;
};
haxe_crypto_Sha256.prototype = {
	doEncode: function(m,l) {
		var K = [1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998];
		var HASH = [1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225];
		var W = [];
		W[64] = 0;
		var a;
		var b;
		var c;
		var d;
		var e;
		var f;
		var g;
		var h;
		var T1;
		var T2;
		m[l >> 5] |= 128 << 24 - l % 32;
		m[(l + 64 >> 9 << 4) + 15] = l;
		var i = 0;
		while(i < m.length) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
			var _g = 0;
			while(_g < 64) {
				var j = _g++;
				if(j < 16) {
					W[j] = m[j + i];
				} else {
					var x = W[j - 2];
					var x1 = (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10;
					var y = W[j - 7];
					var lsw = (x1 & 65535) + (y & 65535);
					var x2 = (x1 >> 16) + (y >> 16) + (lsw >> 16) << 16 | lsw & 65535;
					var x3 = W[j - 15];
					var y1 = (x3 >>> 7 | x3 << 25) ^ (x3 >>> 18 | x3 << 14) ^ x3 >>> 3;
					var lsw1 = (x2 & 65535) + (y1 & 65535);
					var x4 = (x2 >> 16) + (y1 >> 16) + (lsw1 >> 16) << 16 | lsw1 & 65535;
					var y2 = W[j - 16];
					var lsw2 = (x4 & 65535) + (y2 & 65535);
					W[j] = (x4 >> 16) + (y2 >> 16) + (lsw2 >> 16) << 16 | lsw2 & 65535;
				}
				var y3 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
				var lsw3 = (h & 65535) + (y3 & 65535);
				var x5 = (h >> 16) + (y3 >> 16) + (lsw3 >> 16) << 16 | lsw3 & 65535;
				var y4 = e & f ^ ~e & g;
				var lsw4 = (x5 & 65535) + (y4 & 65535);
				var x6 = (x5 >> 16) + (y4 >> 16) + (lsw4 >> 16) << 16 | lsw4 & 65535;
				var y5 = K[j];
				var lsw5 = (x6 & 65535) + (y5 & 65535);
				var x7 = (x6 >> 16) + (y5 >> 16) + (lsw5 >> 16) << 16 | lsw5 & 65535;
				var y6 = W[j];
				var lsw6 = (x7 & 65535) + (y6 & 65535);
				T1 = (x7 >> 16) + (y6 >> 16) + (lsw6 >> 16) << 16 | lsw6 & 65535;
				var x8 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
				var y7 = a & b ^ a & c ^ b & c;
				var lsw7 = (x8 & 65535) + (y7 & 65535);
				T2 = (x8 >> 16) + (y7 >> 16) + (lsw7 >> 16) << 16 | lsw7 & 65535;
				h = g;
				g = f;
				f = e;
				var lsw8 = (d & 65535) + (T1 & 65535);
				e = (d >> 16) + (T1 >> 16) + (lsw8 >> 16) << 16 | lsw8 & 65535;
				d = c;
				c = b;
				b = a;
				var lsw9 = (T1 & 65535) + (T2 & 65535);
				a = (T1 >> 16) + (T2 >> 16) + (lsw9 >> 16) << 16 | lsw9 & 65535;
			}
			var y8 = HASH[0];
			var lsw10 = (a & 65535) + (y8 & 65535);
			HASH[0] = (a >> 16) + (y8 >> 16) + (lsw10 >> 16) << 16 | lsw10 & 65535;
			var y9 = HASH[1];
			var lsw11 = (b & 65535) + (y9 & 65535);
			HASH[1] = (b >> 16) + (y9 >> 16) + (lsw11 >> 16) << 16 | lsw11 & 65535;
			var y10 = HASH[2];
			var lsw12 = (c & 65535) + (y10 & 65535);
			HASH[2] = (c >> 16) + (y10 >> 16) + (lsw12 >> 16) << 16 | lsw12 & 65535;
			var y11 = HASH[3];
			var lsw13 = (d & 65535) + (y11 & 65535);
			HASH[3] = (d >> 16) + (y11 >> 16) + (lsw13 >> 16) << 16 | lsw13 & 65535;
			var y12 = HASH[4];
			var lsw14 = (e & 65535) + (y12 & 65535);
			HASH[4] = (e >> 16) + (y12 >> 16) + (lsw14 >> 16) << 16 | lsw14 & 65535;
			var y13 = HASH[5];
			var lsw15 = (f & 65535) + (y13 & 65535);
			HASH[5] = (f >> 16) + (y13 >> 16) + (lsw15 >> 16) << 16 | lsw15 & 65535;
			var y14 = HASH[6];
			var lsw16 = (g & 65535) + (y14 & 65535);
			HASH[6] = (g >> 16) + (y14 >> 16) + (lsw16 >> 16) << 16 | lsw16 & 65535;
			var y15 = HASH[7];
			var lsw17 = (h & 65535) + (y15 & 65535);
			HASH[7] = (h >> 16) + (y15 >> 16) + (lsw17 >> 16) << 16 | lsw17 & 65535;
			i += 16;
		}
		return HASH;
	}
	,hex: function(a) {
		var str = "";
		var _g = 0;
		while(_g < a.length) str += StringTools.hex(a[_g++],8);
		return str.toLowerCase();
	}
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.ofString = function(s,encoding) {
	if(encoding == haxe_io_Encoding.RawNative) {
		var buf = new Uint8Array(s.length << 1);
		var _g = 0;
		var _g1 = s.length;
		while(_g < _g1) {
			var i = _g++;
			var c = s.charCodeAt(i);
			buf[i << 1] = c & 255;
			buf[i << 1 | 1] = c >> 8;
		}
		return new haxe_io_Bytes(buf.buffer);
	}
	var a = [];
	var i1 = 0;
	while(i1 < s.length) {
		var c1 = s.charCodeAt(i1++);
		if(55296 <= c1 && c1 <= 56319) {
			c1 = c1 - 55232 << 10 | s.charCodeAt(i1++) & 1023;
		}
		if(c1 <= 127) {
			a.push(c1);
		} else if(c1 <= 2047) {
			a.push(192 | c1 >> 6);
			a.push(128 | c1 & 63);
		} else if(c1 <= 65535) {
			a.push(224 | c1 >> 12);
			a.push(128 | c1 >> 6 & 63);
			a.push(128 | c1 & 63);
		} else {
			a.push(240 | c1 >> 18);
			a.push(128 | c1 >> 12 & 63);
			a.push(128 | c1 >> 6 & 63);
			a.push(128 | c1 & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__ : true, __constructs__ : ["UTF8","RawNative"]
	,UTF8: {_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
var instagram_CookieFileStorage = require("instagram-private-api/client/v1/cookie-file-storage");
var instagram_Device = require("instagram-private-api/client/v1/device");
var instagram_InboxPending = require("instagram-private-api/client/v1/feeds/inbox-pending");
var instagram_Session = require("instagram-private-api/client/v1/session");
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var n = e.__constructs__[o._hx_index];
			var con = e[n];
			if(con.__params__) {
				s += "\t";
				var tmp = n + "(";
				var _g = [];
				var _g1 = 0;
				var _g2 = con.__params__;
				while(_g1 < _g2.length) {
					var p = _g2[_g1];
					++_g1;
					_g.push(js_Boot.__string_rec(o[p],s));
				}
				return tmp + _g.join(",") + ")";
			} else {
				return n;
			}
		}
		if((o instanceof Array)) {
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g3 = 0;
			var _g11 = l;
			while(_g3 < _g11) {
				var i1 = _g3++;
				str += (i1 > 0 ? "," : "") + js_Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e1 ) {
			var e2 = (e1 instanceof js__$Boot_HaxeError) ? e1.val : e1;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str1 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str1.length != 2) {
			str1 += ", \n";
		}
		str1 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str1 += "\n" + s + "}";
		return str1;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var js_node_Http = require("http");
var js_node_Https = require("https");
var js_node_Url = require("url");
var js_node_tls_SecureContext = function() { };
js_node_tls_SecureContext.__name__ = true;
var $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = "Date";
Object.defineProperty(js__$Boot_HaxeError.prototype,"message",{ get : function() {
	return String(this.val);
}});
DirectBot.tick = 60000;
DirectBot.base = 2;
DirectBot.time = 3;
GA.request = (function($this) {
	var $r;
	var http = new haxe_http_HttpNodeJs("http://www.google-analytics.com/collect");
	http.addParameter("v","1");
	http.addParameter("tid",js_node_Fs.readFileSync("ga.id",{ encoding : "utf8"}));
	http.addParameter("t","event");
	http.setPostData("");
	$r = http;
	return $r;
}(this));
GetAvatar.main();
})();

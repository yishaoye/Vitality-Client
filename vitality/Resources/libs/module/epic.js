


// Modules
(function (process) {
  this.global = this;
  process.cwd = function(){
  };

  function startup() {
	// 设置一些全局变量
    startup.globalVariables();

	if (process.argv[1]) {					// 运行脚本

	  // 获取脚本文件的完整路径
      //var path = NativeModule.require('path');
      //process.argv[1] = path.resolve(process.argv[1]);

	  // 加载 module 对象
      var Module = NativeModule.require('libs/module/module.js');
	  
	  print( 'run main' );
	  print( process.argv[ 1 ] );
	  // 运行脚本
      Module.runMain();

    }
	else
	{
		print( 'Error' );
	}
  }
  startup.globalVariables = function() {
	global.process = process;
	global.global = global;
	global.GLOBAL = global;
	global.root = global;
	global.runInThisContext = process.runInThisContext;
  };

  // Below you find a minimal module system, which is used to load the node
  // core modules found in lib/*.js. All core modules are compiled into the
  // node binary, so they can be loaded faster.

  function NativeModule(id) {
    this.filename = id;
    this.id = id;
    this.exports = {};
    this.loaded = false;
  }

  NativeModule._source = {};
  NativeModule._cache = {};

  NativeModule.require = function(id) {
	if (id == 'native_module') {
      return NativeModule;
    }

    var cached = NativeModule.getCached(id);
    if (cached) {
      return cached.exports;
    }

    if (!NativeModule.exists(id)) {
      print('ERROR: No such native module [ ' + id + ' ]');
	  var err = new Error('ERROR: No such native module [ ' + id + ' ]');
	  err.code = 'MODULE_NOT_FOUND';
	  throw err;
    }

    var nativeModule = new NativeModule(id);

    nativeModule.compile();
    nativeModule.cache();

    return nativeModule.exports;
  };

  NativeModule.getCached = function(id) {
    return NativeModule._cache[id];
  } 

  NativeModule.exists = function(id) {
	if( !NativeModule._source.hasOwnProperty(id) ){
		NativeModule._source[ id ] = process.binding( id )[ id ];
	}
	return NativeModule._source.hasOwnProperty(id);
  }

  NativeModule.getSource = function(id) {
    return NativeModule._source[id];
  }

  NativeModule.wrap = function(script) {
    return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
  };

  NativeModule.wrapper = [
    '(function (exports, require, module, __filename, __dirname) { ',
    '\n});'
  ];

  NativeModule.prototype.compile = function() {
    var source = NativeModule.getSource(this.id);
    source = NativeModule.wrap(source);

    var fn = runInThisContext(source, this.filename, true);
    fn(this.exports, NativeModule.require, this, this.filename);

    this.loaded = true;
  };

  NativeModule.prototype.cache = function() {
    NativeModule._cache[this.id] = this;
  };

   startup();

});

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var NativeModule = require('native_module');

var isWindows = process.platform === 'win32';

var path = {};
if (isWindows) {
	// Regex to split a windows path into three parts: [*, device, slash,
	// tail] windows-only
	var splitDeviceRe =
	  /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?([\\\/])?([\s\S]*?)$/;

	// Regex to split the tail part of the above into [*, dir, basename, ext]
	var splitTailRe =
	  /^([\s\S]+[\\\/](?!$)|[\\\/])?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/\\]*)?)$/;

	// Function to split a filename into [root, dir, basename, ext]
	// windows version
	var splitPath = function(filename) {
	// Separate device+slash from tail
	var result = splitDeviceRe.exec(filename),
		device = (result[1] || '') + (result[2] || ''),
		tail = result[3] || '';
	// Split the tail into dir, basename and extension
	var result2 = splitTailRe.exec(tail),
		dir = result2[1] || '',
		basename = result2[2] || '',
		ext = result2[3] || '';
	return [device, dir, basename, ext];
	};
	path.extname = function(path) {
		return splitPath(path)[3];
	};
	path.dirname = function(path) {
		var result = splitPath(path),
		root = result[0],
		dir = result[1];

		if (!root && !dir) {
		// No dirname whatsoever
		return '.';
		}

		if (dir) {
		// It has a dirname, strip trailing slash
		dir = dir.substring(0, dir.length - 1);
		}

		return root + dir;
	};
}
else{

	var splitPathRe =
	  /^(\/?)([\s\S]+\/(?!$)|\/)?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/]*)?)$/;
	var splitPath = function(filename) {
	var result = splitPathRe.exec(filename);
	return [result[1] || '', result[2] || '', result[3] || '', result[4] || ''];
	};

	path.extname = function(path) {
	  return splitPath(path)[3];
	};
	path.dirname = function(path) {
		var result = splitPath(path),
		root = result[0],
		dir = result[1];

		if (!root && !dir) {
		// No dirname whatsoever
		return '.';
		}

		if (dir) {
		// It has a dirname, strip trailing slash
		dir = dir.substring(0, dir.length - 1);
		}

		return root + dir;
	};
}




function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }

  this.filename = null;
  this.loaded = false;
  this.children = [];
}
module.exports = Module;

// Set the environ variable NODE_MODULE_CONTEXTS=1 to make node load all
// modules in thier own context.
//Module._contextLoad = (+process.env['NODE_MODULE_CONTEXTS'] > 0);
Module._cache = {};
Module._extensions = {};

// 包装 .js 文件为匿名函数
Module.wrapper = NativeModule.wrapper;
Module.wrap = NativeModule.wrap;


// 检测文件是否已经加载
Module._load = function(request, parent, isMain) {

  var filename = request;
  // 检测模块管理, 如果有次文件直接返回
  var cachedModule = Module._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;
  }
  // 新创建一个模块
  var module = new Module(filename, parent);

  if (isMain) {
    process.mainModule = module;
    module.id = '.';
  }
  // 加入模块管理
  Module._cache[filename] = module;

  var hadException = true;

  try {
	// 加载文件
    module.load(filename);
    hadException = false;
  } finally {
    if (hadException) {
      delete Module._cache[filename];
    }
  }

  return module.exports;
};

// 加载文件
Module.prototype.load = function(filename) {

  this.filename = filename;

  var extension = path.extname(filename) || '.js';
  if (!Module._extensions[extension]) extension = '.js';
  Module._extensions[extension](this, filename);
  this.loaded = true;
};

Module.prototype.require = function(path) {
  return Module._load(path, this);
};

// 编译并运行脚本
Module.prototype._compile = function(content, filename) {
  var self = this;

  // remove shebang
  content = content.replace(/^\#\!.*/, '');

  function require(path) {
    return self.require(path);
  }

  var dirname = path.dirname(filename);

  // create wrapper function
  var wrapper = Module.wrap(content);

  var compiledWrapper = runInThisContext(wrapper, filename, true);

  var args = [self.exports, require, self, filename, dirname];
  return compiledWrapper.apply(self.exports, args);
};

function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

// Native extension for .js
Module._extensions['.js'] = function(module, filename) {
  var content = process.binding(filename)[ filename ];
  module._compile(stripBOM(content), filename);
};


// Native extension for .json
Module._extensions['.json'] = function(module, filename) {
  var content = process.binding(filename)[ filename ];
  try {
    module.exports = JSON.parse(stripBOM(content));
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};



// 运行 main 模块.
Module.runMain = function() {
  // 加载主模块——命令行参数.
  Module._load(process.argv[1], null, true);
};

// backwards compatibility
Module.Module = Module;

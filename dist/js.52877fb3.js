// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"kontra/events.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = on;
exports.off = off;
exports.emit = emit;
exports.callbacks = void 0;

/**
 * A simple event system. Allows you to hook into Kontra lifecycle events or create your own, such as for [Plugins](api/plugin).
 *
 * ```js
 * import { on, off, emit } from 'kontra';
 *
 * function callback(a, b, c) {
 *   console.log({a, b, c});
 * });
 *
 * on('myEvent', callback);
 * emit('myEvent', 1, 2, 3);  //=> {a: 1, b: 2, c: 3}
 * off('myEvent', callback);
 * ```
 * @sectionName Events
 */
// expose for testing
var callbacks = {};
/**
 * There are currently only three lifecycle events:
 * - `init` - Emitted after `konta.init()` is called.
 * - `tick` - Emitted every frame of kontra.GameLoop before the loops `update()` and `render()` functions are called.
 * - `assetLoaded` - Emitted after an asset has fully loaded using the asset loader. The callback function is passed the asset and the url of the asset as parameters.
 * @sectionName Lifecycle Events
 */

/**
 * Register a callback for an event to be called whenever the event is emitted. The callback will be passed all arguments used in the `emit` call.
 * @function on
 *
 * @param {String} event - Name of the event.
 * @param {Function} callback - Function that will be called when the event is emitted.
 */

exports.callbacks = callbacks;

function on(event, callback) {
  callbacks[event] = callbacks[event] || [];
  callbacks[event].push(callback);
}
/**
 * Remove a callback for an event.
 * @function off
 *
 * @param {String} event - Name of the event.
 * @param {Function} callback - The function that was passed during registration.
 */


function off(event, callback) {
  var index;
  if (!callbacks[event] || (index = callbacks[event].indexOf(callback)) < 0) return;
  callbacks[event].splice(index, 1);
}
/**
 * Call all callback functions for the event. All arguments will be passed to the callback functions.
 * @function emit
 *
 * @param {String} event - Name of the event.
 * @param {*} [args] - Arguments passed to all callbacks.
 */


function emit(event) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (!callbacks[event]) return;
  callbacks[event].map(function (fn) {
    return fn.apply(void 0, args);
  });
}
},{}],"kontra/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCanvas = getCanvas;
exports.getContext = getContext;
exports.init = init;

var _events = require("./events.js");

var canvasEl, context;
/**
 * Return the canvas element.
 * @function getCanvas
 *
 * @returns {HTMLCanvasElement} The canvas element for the game.
 */

function getCanvas() {
  return canvasEl;
}
/**
 * Return the context object.
 * @function getContext
 *
 * @returns {CanvasRenderingContext2D} The context object the game draws to.
 */


function getContext() {
  return context;
}
/**
 * Initialize the library and set up the canvas. Typically you will call `init()` as the first thing and give it the canvas to use. This will allow all Kontra objects to reference the canvas when created.
 *
 * ```js
 * import { init } from 'kontra';
 *
 * let { canvas, context } = init('game');
 * ```
 * @function init
 *
 * @param {String|HTMLCanvasElement} [canvas] - The canvas for Kontra to use. Can either be the ID of the canvas element or the canvas element itself. Defaults to using the first canvas element on the page.
 *
 * @returns {Object} An object with properties `canvas` and `context`. `canvas` it the canvas element for the game and `context` is the context object the game draws to.
 */


function init(canvas) {
  // check if canvas is a string first, an element next, or default to getting
  // first canvas on page
  canvasEl = document.getElementById(canvas) || canvas || document.querySelector('canvas'); // @if DEBUG

  if (!canvasEl) {
    throw Error('You must provide a canvas element for the game');
  } // @endif


  context = canvasEl.getContext('2d');
  context.imageSmoothingEnabled = false;
  (0, _events.emit)('init');
  return {
    canvas: canvasEl,
    context: context
  };
}
},{"./events.js":"kontra/events.js"}],"kontra/animation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = animationFactory;

var _core = require("./core.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Animation =
/*#__PURE__*/
function () {
  function Animation() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        spriteSheet = _ref.spriteSheet,
        frames = _ref.frames,
        frameRate = _ref.frameRate,
        _ref$loop = _ref.loop,
        loop = _ref$loop === void 0 ? true : _ref$loop;

    _classCallCheck(this, Animation);

    /**
     * The sprite sheet to use for the animation.
     * @memberof Animation
     * @property {kontra.SpriteSheet} spriteSheet
     */
    this.spriteSheet = spriteSheet;
    /**
     * Sequence of frames to use from the sprite sheet.
     * @memberof Animation
     * @property {Number[]} frames
     */

    this.frames = frames;
    /**
     * Number of frames to display per second. Adjusting this value will change the speed of the animation.
     * @memberof Animation
     * @property {Number} frameRate
     */

    this.frameRate = frameRate;
    /**
     * If the animation should loop back to the beginning once completed.
     * @memberof Animation
     * @property {Boolean} loop
     */

    this.loop = loop;
    var _spriteSheet$frame = spriteSheet.frame,
        width = _spriteSheet$frame.width,
        height = _spriteSheet$frame.height,
        _spriteSheet$frame$ma = _spriteSheet$frame.margin,
        margin = _spriteSheet$frame$ma === void 0 ? 0 : _spriteSheet$frame$ma;
    /**
     * The width of an individual frame. Taken from the property of the same name in the [spriteSheet](api/animation#spriteSheet).
     * @memberof Animation
     * @property {Number} width
     */

    this.width = width;
    /**
     * The height of an individual frame. Taken from the property of the same name in the [spriteSheet](api/animation#spriteSheet).
     * @memberof Animation
     * @property {Number} height
     */

    this.height = height;
    /**
     * The space between each frame. Taken from the property of the same name in the [spriteSheet](api/animation#spriteSheet).
     * @memberof Animation
     * @property {Number} margin
     */

    this.margin = margin; // f = frame, a = accumulator

    this._f = 0;
    this._a = 0;
  }
  /**
   * Clone an animation so it can be used more than once. By default animations passed to kontra.Sprite will be cloned so no two sprites update the same animation. Otherwise two sprites who shared the same animation would make it update twice as fast.
   * @memberof Animation
   * @function clone
   *
   * @returns {kontra.Animation} A new kontra.Animation instance.
   */


  _createClass(Animation, [{
    key: "clone",
    value: function clone() {
      return animationFactory(this);
    }
    /**
     * Reset an animation to the first frame.
     * @memberof Animation
     * @function reset
     */

  }, {
    key: "reset",
    value: function reset() {
      this._f = 0;
      this._a = 0;
    }
    /**
     * Update the animation.
     * @memberof Animation
     * @function update
     *
     * @param {Number} [dt=1/60] - Time since last update.
     */

  }, {
    key: "update",
    value: function update() {
      var dt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1 / 60;
      // if the animation doesn't loop we stop at the last frame
      if (!this.loop && this._f == this.frames.length - 1) return;
      this._a += dt; // update to the next frame if it's time

      while (this._a * this.frameRate >= 1) {
        this._f = ++this._f % this.frames.length;
        this._a -= 1 / this.frameRate;
      }
    }
    /**
     * Draw the current frame of the animation.
     * @memberof Animation
     * @function render
     *
     * @param {Object} properties - Properties to draw the animation.
     * @param {Number} properties.x - X position to draw the animation.
     * @param {Number} properties.y - Y position to draw the animation.
     * @param {Number} [properties.width] - width of the sprite. Defaults to [Animation.width](api/animation#width).
     * @param {Number} [properties.height] - height of the sprite. Defaults to [Animation.height](api/animation#height).
     * @param {Canvas​Rendering​Context2D} [properties.context] - The context the animation should draw to. Defaults to [core.getContext()](api/core#getContext).
     */

  }, {
    key: "render",
    value: function render() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          x = _ref2.x,
          y = _ref2.y,
          _ref2$width = _ref2.width,
          width = _ref2$width === void 0 ? this.width : _ref2$width,
          _ref2$height = _ref2.height,
          height = _ref2$height === void 0 ? this.height : _ref2$height,
          _ref2$context = _ref2.context,
          context = _ref2$context === void 0 ? (0, _core.getContext)() : _ref2$context;

      // get the row and col of the frame
      var row = this.frames[this._f] / this.spriteSheet._f | 0;
      var col = this.frames[this._f] % this.spriteSheet._f | 0;
      context.drawImage(this.spriteSheet.image, col * this.width + (col * 2 + 1) * this.margin, row * this.height + (row * 2 + 1) * this.margin, this.width, this.height, x, y, width, height);
    }
  }]);

  return Animation;
}();

function animationFactory(properties) {
  return new Animation(properties);
}

animationFactory.prototype = Animation.prototype;
animationFactory.class = Animation;
},{"./core.js":"kontra/core.js"}],"kontra/assets.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setImagePath = setImagePath;
exports.setAudioPath = setAudioPath;
exports.setDataPath = setDataPath;
exports.loadImage = loadImage;
exports.loadAudio = loadAudio;
exports.loadData = loadData;
exports.load = load;
exports._reset = _reset;
exports._setCanPlayFn = _setCanPlayFn;
exports.dataAssets = exports.audioAssets = exports.imageAssets = void 0;

var _events = require("./events.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var imageRegex = /(jpeg|jpg|gif|png)$/;
var audioRegex = /(wav|mp3|ogg|aac)$/;
var leadingSlash = /^\//;
var trailingSlash = /\/$/;
var dataMap = new WeakMap();
var imagePath = '';
var audioPath = '';
var dataPath = '';
/**
 * Get the full URL from the base.
 *
 * @param {String} url - The URL to the asset.
 * @param {String} base - Base URL.
 *
 * @returns {String}
 */

function getUrl(url, base) {
  return new URL(url, base).href;
}
/**
 * Join a base path and asset path.
 *
 * @param {String} base - The asset base path.
 * @param {String} url - The URL to the asset.
 *
 * @returns {String}
 */


function joinPath(base, url) {
  return [base.replace(trailingSlash, ''), base ? url.replace(leadingSlash, '') : url].filter(function (s) {
    return s;
  }).join('/');
}
/**
 * Get the extension of an asset.
 *
 * @param {String} url - The URL to the asset.
 *
 * @returns {String}
 */


function getExtension(url) {
  return url.split('.').pop();
}
/**
 * Get the name of an asset.
 *
 * @param {String} url - The URL to the asset.
 *
 * @returns {String}
 */


function getName(url) {
  var name = url.replace('.' + getExtension(url), ''); // remove leading slash if there is no folder in the path
  // @see https://stackoverflow.com/a/50592629/2124254

  return name.split('/').length == 2 ? name.replace(leadingSlash, '') : name;
}
/**
 * Get browser audio playability.
 * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
 *
 * @param {HTMLMediaElement} audio - Audio element.
 *
 * @returns {object}
 */


function getCanPlay(audio) {
  return {
    wav: '',
    mp3: audio.canPlayType('audio/mpeg;'),
    ogg: audio.canPlayType('audio/ogg; codecs="vorbis"'),
    aac: audio.canPlayType('audio/aac;')
  };
}
/**
 * Object of all loaded image assets by both file name and path. If the base [image path](api/assets#setImagePath) was set before the image was loaded, the file name and path will not include the base image path.
 *
 * ```js
 * import { load, setImagePath, imageAssets } from 'kontra';
 *
 * load('assets/imgs/character.png').then(function() {
 *   // Image asset can be accessed by both
 *   // name: imageAssets['assets/imgs/character']
 *   // path: imageAssets['assets/imgs/character.png']
 * });
 *
 * setImagePath('assets/imgs');
 * load('character_walk_sheet.png').then(function() {
 *   // Image asset can be accessed by both
 *   // name: imageAssets['character_walk_sheet']
 *   // path: imageAssets['character_walk_sheet.png']
 * });
 * ```
 * @property {Object} imageAssets
 */


var imageAssets = {};
/**
 * Object of all loaded audio assets by both file name and path. If the base [audio path](api/assets#setAudioPath) was set before the audio was loaded, the file name and path will not include the base audio path.
 *
 * ```js
 * import { load, setAudioPath, audioAssets } from 'kontra';
 *
 * load('/audio/music.ogg').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: audioAssets['/audio/music']
 *   // path: audioAssets['/audio/music.ogg']
 * });
 *
 * setAudioPath('/audio');
 * load('sound.ogg').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: audioAssets['sound']
 *   // path: audioAssets['sound.ogg']
 * });
 * ```
 * @property {Object} audioAssets
 */

exports.imageAssets = imageAssets;
var audioAssets = {};
/**
 * Object of all loaded data assets by both file name and path. If the base [data path](api/assets#setDataPath) was set before the data was loaded, the file name and path will not include the base data path.
 *
 * ```js
 * import { load, setDataPath, dataAssets } from 'kontra';
 *
 * load('assets/data/file.txt').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: dataAssets['assets/data/file']
 *   // path: dataAssets['assets/data/file.txt']
 * });
 *
 * setDataPath('assets/data');
 * load('info.json').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: dataAssets['info']
 *   // path: dataAssets['info.json']
 * });
 * ```
 * @property {Object} dataAssets
 */

exports.audioAssets = audioAssets;
var dataAssets = {};
/**
 * Add a global kontra object so TileEngine can access information about the
 * loaded assets when kontra is loaded in parts rather than as a whole (e.g.
 * `import { load, TileEngine } from 'kontra';`)
 */

exports.dataAssets = dataAssets;

function addGlobal() {
  if (!window.__k) {
    window.__k = {
      dm: dataMap,
      u: getUrl,
      d: dataAssets,
      i: imageAssets
    };
  }
}
/**
 * Sets the base path for all image assets. If a base path is set, all load calls for image assets will prepend the base path to the URL.
 *
 * ```js
 * import { setImagePath, load } from 'kontra';
 *
 * setImagePath('/imgs');
 * load('character.png');  // loads '/imgs/character.png'
 * ```
 * @function setImagePath
 *
 * @param {String} path - Base image path.
 */


function setImagePath(path) {
  imagePath = path;
}
/**
 * Sets the base path for all audio assets. If a base path is set, all load calls for audio assets will prepend the base path to the URL.
 *
 * ```js
 * import { setAudioPath, load } from 'kontra';
 *
 * setAudioPath('/audio');
 * load('music.ogg');  // loads '/audio/music.ogg'
 * ```
 * @function setAudioPath
 *
 * @param {String} path - Base audio path.
 */


function setAudioPath(path) {
  audioPath = path;
}
/**
 * Sets the base path for all data assets. If a base path is set, all load calls for data assets will prepend the base path to the URL.
 *
 * ```js
 * import { setDataPath, load } from 'kontra';
 *
 * setDataPath('/data');
 * load('file.json');  // loads '/data/file.json'
 * ```
 * @function setDataPath
 *
 * @param {String} path - Base data path.
 */


function setDataPath(path) {
  dataPath = path;
}
/**
 * Load a single Image asset. Uses the base [image path](api/assets#setImagePath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [imageAssets](api/assets#imageAssets) property.
 *
 * ```js
 * import { loadImage } from 'kontra';
 *
 * loadImage('car.png').then(function(image) {
 *   console.log(image.src);  //=> 'car.png'
 * })
 * ```
 * @function loadImage
 *
 * @param {String} url - The URL to the Image file.
 *
 * @returns {Promise} A deferred promise. Promise resolves with the Image.
 */


function loadImage(url) {
  addGlobal();
  return new Promise(function (resolve, reject) {
    var resolvedUrl, image, fullUrl;
    resolvedUrl = joinPath(imagePath, url);
    if (imageAssets[resolvedUrl]) return resolve(imageAssets[resolvedUrl]);
    image = new Image();

    image.onload = function loadImageOnLoad() {
      fullUrl = getUrl(resolvedUrl, window.location.href);
      imageAssets[getName(url)] = imageAssets[resolvedUrl] = imageAssets[fullUrl] = this;
      (0, _events.emit)('assetLoaded', this, url);
      resolve(this);
    };

    image.onerror = function loadImageOnError() {
      reject(
      /* @if DEBUG */
      'Unable to load image ' +
      /* @endif */
      resolvedUrl);
    };

    image.src = resolvedUrl;
  });
}
/**
 * Load a single Audio asset. Supports loading multiple audio formats which the loader will use to load the first audio format supported by the browser in the order listed. Uses the base [audio path](api/assets#setAudioPath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [audioAssets](api/assets#audioAssets) property. Since the loader determines which audio asset to load based on browser support, you should only reference the audio by its name and not by its file path since there's no guarantee which asset was loaded.
 *
 * ```js
 * import { loadAudio, audioAssets } from 'kontra';
 *
 * loadAudio([
 *   '/audio/music.mp3',
 *   '/audio/music.ogg'
 * ]).then(function(audio) {
 *
 *   // access audio by its name only (not by its .mp3 or .ogg path)
 *   audioAssets['/audio/music'].play();
 * })
 * ```
 * @function loadAudio
 *
 * @param {String} url - The URL to the Audio file.
 *
 * @returns {Promise} A deferred promise. Promise resolves with the Audio.
 */


function loadAudio(url) {
  return new Promise(function (resolve, reject) {
    var audioEl, canPlay, resolvedUrl, fullUrl;
    audioEl = new Audio();
    canPlay = getCanPlay(audioEl); // determine the first audio format the browser can play

    url = [].concat(url).reduce(function (playableSource, source) {
      return playableSource ? playableSource : canPlay[getExtension(source)] ? source : null;
    }, 0); // 0 is the shortest falsy value

    if (!url) {
      return reject(
      /* @if DEBUG */
      'cannot play any of the audio formats provided' +
      /* @endif */
      url);
    }

    resolvedUrl = joinPath(audioPath, url);
    if (audioAssets[resolvedUrl]) return resolve(audioAssets[resolvedUrl]);
    audioEl.addEventListener('canplay', function loadAudioOnLoad() {
      fullUrl = getUrl(resolvedUrl, window.location.href);
      audioAssets[getName(url)] = audioAssets[resolvedUrl] = audioAssets[fullUrl] = this;
      (0, _events.emit)('assetLoaded', this, url);
      resolve(this);
    });

    audioEl.onerror = function loadAudioOnError() {
      reject(
      /* @if DEBUG */
      'Unable to load audio ' +
      /* @endif */
      resolvedUrl);
    };

    audioEl.src = resolvedUrl;
    audioEl.load();
  });
}
/**
 * Load a single Data asset. Uses the base [data path](api/assets#setDataPath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [dataAssets](api/assets#dataAssets) property.
 *
 * ```js
 * import { loadData } from 'kontra';
 *
 * loadData('assets/data/tile_engine_basic.json').then(function(data) {
 *   // data contains the parsed JSON data
 * })
 * ```
 * @function loadData
 *
 * @param {String} url - The URL to the Data file.
 *
 * @returns {Promise} A deferred promise. Promise resolves with the contents of the file. If the file is a JSON file, the contents will be parsed as JSON.
 */


function loadData(url) {
  addGlobal();
  var resolvedUrl, fullUrl;
  resolvedUrl = joinPath(dataPath, url);
  if (dataAssets[resolvedUrl]) return Promise.resolve(dataAssets[resolvedUrl]);
  return fetch(resolvedUrl).then(function (response) {
    if (!response.ok) throw response;
    return response.clone().json().catch(function () {
      return response.text();
    });
  }).then(function (response) {
    fullUrl = getUrl(resolvedUrl, window.location.href);

    if (_typeof(response) === 'object') {
      dataMap.set(response, fullUrl);
    }

    dataAssets[getName(url)] = dataAssets[resolvedUrl] = dataAssets[fullUrl] = response;
    (0, _events.emit)('assetLoaded', response, url);
    return response;
  });
}
/**
 * Load Image, Audio, or data files. Uses the [loadImage](api/assets#loadImage), [loadAudio](api/assets#loadAudio), and [loadData](api/assets#loadData) functions to load each asset type.
 *
 * ```js
 * import { load } from 'kontra';
 *
 * load(
 *   'assets/imgs/character.png',
 *   'assets/data/tile_engine_basic.json',
 *   ['/audio/music.ogg', '/audio/music.mp3']
 * ).then(function(assets) {
 *   // all assets have loaded
 * }).catch(function(err) {
 *   // error loading an asset
 * });
 * ```
 * @function load
 *
 * @param {String|String[]} urls - Comma separated list of asset urls to load.
 *
 * @returns {Promise} A deferred promise. Resolves with all the loaded assets.
 */


function load() {
  addGlobal();

  for (var _len = arguments.length, urls = new Array(_len), _key = 0; _key < _len; _key++) {
    urls[_key] = arguments[_key];
  }

  return Promise.all(urls.map(function (asset) {
    // account for a string or an array for the url
    var extension = getExtension([].concat(asset)[0]);
    return extension.match(imageRegex) ? loadImage(asset) : extension.match(audioRegex) ? loadAudio(asset) : loadData(asset);
  }));
} // expose for testing


function _reset() {
  exports.imageAssets = imageAssets = {};
  exports.audioAssets = audioAssets = {};
  exports.dataAssets = dataAssets = {};
  imagePath = audioPath = dataPath = '';
  window.__k = undefined;

  if (getCanPlay._r) {
    getCanPlay = getCanPlay._r;
  }
} // Override the getCanPlay function to provide a specific return type for tests


function _setCanPlayFn(fn) {
  var originalCanPlay = getCanPlay;
  getCanPlay = fn;
  getCanPlay._r = originalCanPlay;
}
},{"./events.js":"kontra/events.js"}],"kontra/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = void 0;

/**
 * Noop function
 */
var noop = function noop() {};

exports.noop = noop;
},{}],"kontra/gameLoop.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GameLoop;

var _utils = require("./utils.js");

var _events = require("./events.js");

var _core = require("./core.js");

function clear() {
  var canvas = (0, _core.getCanvas)();
  (0, _core.getContext)().clearRect(0, 0, canvas.width, canvas.height);
}
/**
 * The game loop updates and renders the game every frame. The game loop is stopped by default and will not start until the loops `start()` function is called.
 *
 * The game loop uses a time-based animation with a fixed `dt` to [avoid frame rate issues](http://blog.sklambert.com/using-time-based-animation-implement/). Each update call is guaranteed to equal 1/60 of a second.
 *
 * This means that you can avoid having to do time based calculations in your update functions  and instead do fixed updates.
 *
 * ```js
 * import { Sprite, GameLoop } from 'kontra';
 *
 * let sprite = Sprite({
 *   x: 100,
 *   y: 200,
 *   width: 20,
 *   height: 40,
 *   color: 'red'
 * });
 *
 * let loop = GameLoop({
 *   update: function(dt) {
 *     // no need to determine how many pixels you want to
 *     // move every second and multiple by dt
 *     // sprite.x += 180 * dt;
 *
 *     // instead just update by how many pixels you want
 *     // to move every frame and the loop will ensure 60FPS
 *     sprite.x += 3;
 *   },
 *   render: function() {
 *     sprite.render();
 *   }
 * });
 *
 * loop.start();
 * ```
 * @sectionName GameLoop
 *
 * @param {Object}   properties - Properties of the game loop.
 * @param {Function} properties.update - Function called every frame to update the game. Is passed the fixed `dt` as a parameter.
 * @param {Function} properties.render - Function called every frame to render the game.
 * @param {Number}   [properties.fps=60] - Desired frame rate.
 * @param {Boolean}  [properties.clearCanvas=true] - Clear the canvas every frame before the `render()` function is called.
 */


function GameLoop() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$fps = _ref.fps,
      fps = _ref$fps === void 0 ? 60 : _ref$fps,
      _ref$clearCanvas = _ref.clearCanvas,
      clearCanvas = _ref$clearCanvas === void 0 ? true : _ref$clearCanvas,
      update = _ref.update,
      render = _ref.render;

  // check for required functions
  // @if DEBUG
  if (!(update && render)) {
    throw Error('You must provide update() and render() functions');
  } // @endif
  // animation variables


  var accumulator = 0;
  var delta = 1E3 / fps; // delta between performance.now timings (in ms)

  var step = 1 / fps;
  var clearFn = clearCanvas ? clear : _utils.noop;
  var last, rAF, now, dt, loop;
  /**
   * Called every frame of the game loop.
   */

  function frame() {
    rAF = requestAnimationFrame(frame);
    now = performance.now();
    dt = now - last;
    last = now; // prevent updating the game with a very large dt if the game were to lose focus
    // and then regain focus later

    if (dt > 1E3) {
      return;
    }

    (0, _events.emit)('tick');
    accumulator += dt;

    while (accumulator >= delta) {
      loop.update(step);
      accumulator -= delta;
    }

    clearFn();
    loop.render();
  } // game loop object


  loop = {
    /**
     * Called every frame to update the game. Put all of your games update logic here.
     * @memberof GameLoop
     * @function update
     *
     * @param {Number} dt - The fixed dt time of 1/60 of a frame.
     */
    update: update,

    /**
     * Called every frame to render the game. Put all of your games render logic here.
     * @memberof GameLoop
     * @function render
     */
    render: render,

    /**
     * If the game loop is currently stopped.
     *
     * ```js
     * import { GameLoop } from 'kontra';
     *
     * let loop = GameLoop({
     *   // ...
     * });
     * console.log(loop.isStopped);  //=> true
     *
     * loop.start();
     * console.log(loop.isStopped);  //=> false
     *
     * loop.stop();
     * console.log(loop.isStopped);  //=> true
     * ```
     * @memberof GameLoop
     * @property {Boolean} isStopped
     */
    isStopped: true,

    /**
     * Start the game loop.
     * @memberof GameLoop
     * @function start
     */
    start: function start() {
      last = performance.now();
      this.isStopped = false;
      requestAnimationFrame(frame);
    },

    /**
     * Stop the game loop.
     * @memberof GameLoop
     * @function stop
     */
    stop: function stop() {
      this.isStopped = true;
      cancelAnimationFrame(rAF);
    },
    // expose properties for testing
    // @if DEBUG
    _frame: frame,

    set _last(value) {
      last = value;
    } // @endif


  };
  return loop;
}

;
},{"./utils.js":"kontra/utils.js","./events.js":"kontra/events.js","./core.js":"kontra/core.js"}],"kontra/keyboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initKeys = initKeys;
exports.bindKeys = bindKeys;
exports.unbindKeys = unbindKeys;
exports.keyPressed = keyPressed;
exports.keyMap = void 0;

/**
 * A minimalistic keyboard API. You can use it move the main sprite or respond to a key press.
 *
 * ```js
 * import { initKeys, keyPressed } from 'kontra';
 *
 * // this function must be called first before keyboard
 * // functions will work
 * initKeys();
 *
 * function update() {
 *   if (keyPressed('left')) {
 *     // move left
 *   }
 * }
 * ```
 * @sectionName Keyboard
 */

/**
 * Below is a list of keys that are provided by default. If you need to extend this list, you can use the [keyMap](api/keyboard#keyMap) property.
 *
 * - a-z
 * - 0-9
 * - enter, esc, space, left, up, right, down
 * @sectionName Available Keys
 */
var callbacks = {};
var pressedKeys = {};
/**
 * A map of keycodes to key names. Add to this object to expand the list of [available keys](api/keyboard#available-keys).
 *
 * ```js
 * import { keyMap, bindKeys } from 'kontra';
 *
 * keyMap[34] = 'pageDown';
 *
 * bindKeys('pageDown', function(e) {
 *   // handle pageDown key
 * });
 * ```
 * @property {Object} keyMap
 */

var keyMap = {
  // named keys
  'Enter': 'enter',
  'Escape': 'esc',
  'Space': 'space',
  'ArrowLeft': 'left',
  'ArrowUp': 'up',
  'ArrowRight': 'right',
  'ArrowDown': 'down',
  // for Edge compatibility
  13: 'enter',
  27: 'esc',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};
/**
 * Execute a function that corresponds to a keyboard key.
 *
 * @param {KeyboardEvent} evt
 */

exports.keyMap = keyMap;

function keydownEventHandler(evt) {
  var key = keyMap[evt.code || evt.which];
  pressedKeys[key] = true;

  if (callbacks[key]) {
    callbacks[key](evt);
  }
}
/**
 * Set the released key to not being pressed.
 *
 * @param {KeyboardEvent} evt
 */


function keyupEventHandler(evt) {
  pressedKeys[keyMap[evt.code || evt.which]] = false;
}
/**
 * Reset pressed keys.
 */


function blurEventHandler() {
  pressedKeys = {};
}
/**
 * Initialize keyboard event listeners. This function must be called before using other keyboard functions.
 * @function initKeys
 */


function initKeys() {
  var i; // alpha keys
  // @see https://stackoverflow.com/a/43095772/2124254

  for (i = 0; i < 26; i++) {
    // rollupjs considers this a side-effect (for now), so we'll do it in the
    // initKeys function
    keyMap[i + 65] = keyMap['Key' + String.fromCharCode(i + 65)] = String.fromCharCode(i + 97);
  } // numeric keys


  for (i = 0; i < 10; i++) {
    keyMap[48 + i] = keyMap['Digit' + i] = '' + i;
  }

  window.addEventListener('keydown', keydownEventHandler);
  window.addEventListener('keyup', keyupEventHandler);
  window.addEventListener('blur', blurEventHandler);
}
/**
 * Bind a set of keys that will call the callback function when they are pressed. Takes a single key or an array of keys. Is passed the original KeyboardEvent as a parameter.
 *
 * ```js
 * import { initKeys, bindKeys } from 'kontra';
 *
 * initKeys();
 *
 * bindKeys('p', function(e) {
 *   // pause the game
 * });
 * bindKeys(['enter', 'space'], function(e) {
 *   e.preventDefault();
 *   // fire gun
 * });
 * ```
 * @function bindKeys
 *
 * @param {String|String[]} keys - Key or keys to bind.
 */


function bindKeys(keys, callback) {
  // smaller than doing `Array.isArray(keys) ? keys : [keys]`
  [].concat(keys).map(function (key) {
    return callbacks[key] = callback;
  });
}
/**
 * Remove the callback function for a bound set of keys. Takes a single key or an array of keys.
 *
 * ```js
 * import { unbindKeys } from 'kontra';
 *
 * unbindKeys('left');
 * unbindKeys(['enter', 'space']);
 * ```
 * @function unbindKeys
 *
 * @param {String|String[]} keys - Key or keys to unbind.
 */


function unbindKeys(keys) {
  // 0 is the smallest falsy value
  [].concat(keys).map(function (key) {
    return callbacks[key] = 0;
  });
}
/**
 * Check if a key is currently pressed. Use during an `update()` function to perform actions each frame.
 *
 * ```js
 * import { Sprite, initKeys, keyPressed } from 'kontra';
 *
 * initKeys();
 *
 * let sprite = Sprite({
 *   update: function() {
 *     if (keyPressed('left')){
 *       // left arrow pressed
 *     }
 *     else if (keyPressed('right')) {
 *       // right arrow pressed
 *     }
 *
 *     if (keyPressed('up')) {
 *       // up arrow pressed
 *     }
 *     else if (keyPressed('down')) {
 *       // down arrow pressed
 *     }
 *   }
 * });
 * ```
 * @function keyPressed
 *
 * @param {String} key - Key to check for pressed state.
 *
 * @returns {Boolean} `true` if the key is pressed, `false` otherwise.
 */


function keyPressed(key) {
  return !!pressedKeys[key];
}
},{}],"kontra/plugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPlugin = registerPlugin;
exports.unregisterPlugin = unregisterPlugin;
exports.extendObject = extendObject;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * A plugin system based on the [interceptor pattern](https://en.wikipedia.org/wiki/Interceptor_pattern), designed to share reusable code such as more advance collision detection or a 2D physics engine.
 *
 * ```js
 * import { registerPlugin, Sprite } from 'kontra';
 * import loggingPlugin from 'path/to/plugin/code.js'
 *
 * // register a plugin that adds logging to all Sprites
 * registerPlugin(Sprite, loggingPlugin);
 * ```
 * @sectionName Plugin
 */

/**
 * @docs docs/api_docs/plugin.js
 */

/**
 * Get the kontra object method name from the plugin.
 *
 * @param {String} methodName - Before/After function name
 *
 * @returns {String}
 */
function getMethod(methodName) {
  var methodTitle = methodName.substr(methodName.search(/[A-Z]/));
  return methodTitle[0].toLowerCase() + methodTitle.substr(1);
}
/**
 * Remove an interceptor.
 *
 * @param {function[]} interceptors - Before/After interceptor list
 * @param {function} fn - Interceptor function
 */


function removeInterceptor(interceptors, fn) {
  var index = interceptors.indexOf(fn);

  if (index !== -1) {
    interceptors.splice(index, 1);
  }
}
/**
 * Register a plugin to run a set of functions before or after the Kontra object functions.
 * @function registerPlugin
 *
 * @param {Object} kontraObj - Kontra object to attach the plugin to.
 * @param {Object} pluginObj - Plugin object with before and after intercept functions.
 */


function registerPlugin(kontraObj, pluginObj) {
  var objectProto = kontraObj.prototype;
  if (!objectProto) return; // create interceptor list and functions

  if (!objectProto._inc) {
    objectProto._inc = {};

    objectProto._bInc = function beforePlugins(context, method) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return this._inc[method].before.reduce(function (acc, fn) {
        var newArgs = fn.apply(void 0, [context].concat(_toConsumableArray(acc)));
        return newArgs ? newArgs : acc;
      }, args);
    };

    objectProto._aInc = function afterPlugins(context, method, result) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        args[_key2 - 3] = arguments[_key2];
      }

      return this._inc[method].after.reduce(function (acc, fn) {
        var newResult = fn.apply(void 0, [context, acc].concat(args));
        return newResult ? newResult : acc;
      }, result);
    };
  } // add plugin to interceptors


  Object.getOwnPropertyNames(pluginObj).forEach(function (methodName) {
    var method = getMethod(methodName);
    if (!objectProto[method]) return; // override original method

    if (!objectProto['_o' + method]) {
      objectProto['_o' + method] = objectProto[method];

      objectProto[method] = function interceptedFn() {
        var _objectProto;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        // call before interceptors
        var alteredArgs = this._bInc.apply(this, [this, method].concat(args));

        var result = (_objectProto = objectProto['_o' + method]).call.apply(_objectProto, [this].concat(_toConsumableArray(alteredArgs))); // call after interceptors


        return this._aInc.apply(this, [this, method, result].concat(args));
      };
    } // create interceptors for the method


    if (!objectProto._inc[method]) {
      objectProto._inc[method] = {
        before: [],
        after: []
      };
    }

    if (methodName.startsWith('before')) {
      objectProto._inc[method].before.push(pluginObj[methodName]);
    } else if (methodName.startsWith('after')) {
      objectProto._inc[method].after.push(pluginObj[methodName]);
    }
  });
}
/**
 * Unregister a plugin from a Kontra object.
 * @function unregisterPlugin
 *
 * @param {Object} kontraObj - Kontra object to detach plugin from.
 * @param {Object} pluginObj - The plugin object that was passed during registration.
 */


function unregisterPlugin(kontraObj, pluginObj) {
  var objectProto = kontraObj.prototype;
  if (!objectProto || !objectProto._inc) return; // remove plugin from interceptors

  Object.getOwnPropertyNames(pluginObj).forEach(function (methodName) {
    var method = getMethod(methodName);

    if (methodName.startsWith('before')) {
      removeInterceptor(objectProto._inc[method].before, pluginObj[methodName]);
    } else if (methodName.startsWith('after')) {
      removeInterceptor(objectProto._inc[method].after, pluginObj[methodName]);
    }
  });
}
/**
 * Safely extend the functionality of a Kontra object. Any properties that already exist on the Kontra object will not be added.
 *
 * ```js
 * import { extendObject, Vector } from 'kontra';
 *
 * // add a subtract function to all Vectors
 * extendObject(Vector, {
 *   subtract(vec) {
 *     return Vector(this.x - vec.x, this.y - vec.y);
 *   }
 * });
 * ```
 * @function extendObject
 *
 * @param {Object} kontraObj - Kontra object to extend
 * @param {Object} properties - Properties to add.
 */


function extendObject(kontraObj, properties) {
  var objectProto = kontraObj.prototype;
  if (!objectProto) return;
  Object.getOwnPropertyNames(properties).forEach(function (prop) {
    if (!objectProto[prop]) {
      objectProto[prop] = properties[prop];
    }
  });
}
},{}],"kontra/pointer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPointer = initPointer;
exports.track = track;
exports.untrack = untrack;
exports.pointerOver = pointerOver;
exports.onPointerDown = onPointerDown;
exports.onPointerUp = onPointerUp;
exports.pointerPressed = pointerPressed;
exports.pointer = void 0;

var _core = require("./core.js");

var _events = require("./events.js");

var thisFrameRenderOrder = [];
var lastFrameRenderOrder = [];
var callbacks = {};
var trackedObjects = [];
var pressedButtons = {};
/**
 * Below is a list of buttons that you can use.
 *
 * - left, middle, right
 * @sectionName Available Buttons
 */

var buttonMap = {
  0: 'left',
  1: 'middle',
  2: 'right'
};
/**
 * Object containing the `radius` and current `x` and `y` position of the pointer relative to the top-left corner of the canvas.
 *
 * ```js
 * import { initPointer, pointer } from 'kontra';
 *
 * initPointer();
 *
 * console.log(pointer);  //=> { x: 100, y: 200, radius: 5 };
 * ```
 * @property {Object} pointer
 */

var pointer = {
  x: 0,
  y: 0,
  radius: 5 // arbitrary size

};
/**
 * Detection collision between a rectangle and a circlevt.
 * @see https://yal.cc/rectangle-circle-intersection-test/
 *
 * @param {Object} object - Object to check collision against.
 */

exports.pointer = pointer;

function circleRectCollision(object, _pntr) {
  var pntr = _pntr || pointer;
  var x = object.x;
  var y = object.y;

  if (object.anchor) {
    x -= object.width * object.anchor.x;
    y -= object.height * object.anchor.y;
  }

  var dx = pntr.x - Math.max(x, Math.min(pntr.x, x + object.width));
  var dy = pntr.y - Math.max(y, Math.min(pntr.y, y + object.height));
  return dx * dx + dy * dy < pntr.radius * pntr.radius;
}
/**
 * Get the first on top object that the pointer collides with.
 *
 * @returns {Object} First object to collide with the pointer.
 */


function getCurrentObject(_pntr) {
  var pntr = _pntr || pointer; // if pointer events are required on the very first frame or without a game
  // loop, use the current frame order array

  var frameOrder = lastFrameRenderOrder.length ? lastFrameRenderOrder : thisFrameRenderOrder;
  var length = frameOrder.length - 1;
  var object, collides;

  for (var i = length; i >= 0; i--) {
    object = frameOrder[i];

    if (object.collidesWithPointer) {
      collides = object.collidesWithPointer(pntr);
    } else {
      collides = circleRectCollision(object, pntr);
    }

    if (collides) {
      return object;
    }
  }
}
/**
 * Execute the onDown callback for an object.
 *
 * @param {MouseEvent|TouchEvent} evt
 */


function pointerDownHandler(evt) {
  // touchstart should be treated like a left mouse button
  var button = evt.button !== undefined ? buttonMap[evt.button] : 'left';
  pressedButtons[button] = true;
  pointerHandler(evt, 'onDown');
}
/**
 * Execute the onUp callback for an object.
 *
 * @param {MouseEvent|TouchEvent} evt
 */


function pointerUpHandler(evt) {
  var button = evt.button !== undefined ? buttonMap[evt.button] : 'left';
  pressedButtons[button] = false;
  pointerHandler(evt, 'onUp');
}
/**
 * Track the position of the mousevt.
 *
 * @param {MouseEvent|TouchEvent} evt
 */


function mouseMoveHandler(evt) {
  pointerHandler(evt, 'onOver');
}
/**
 * Reset pressed buttons.
 */


function blurEventHandler() {
  pressedButtons = {};
}
/**
 * Find the first object for the event and execute it's callback function
 *
 * @param {MouseEvent|TouchEvent} evt
 * @param {string} eventName - Which event was called.
 */


function pointerHandler(evt, eventName) {
  var canvas = (0, _core.getCanvas)();
  if (!canvas) return;
  var clientX, clientY;
  var ratio = canvas.height / canvas.offsetHeight;
  var rect = canvas.getBoundingClientRect();
  var isTouchEvent = ['touchstart', 'touchmove', 'touchend'].indexOf(evt.type) !== -1;

  if (isTouchEvent) {
    // Update pointer.touches
    pointer.touches = {};

    for (var i = 0; i < evt.touches.length; i++) {
      pointer.touches[evt.touches[i].identifier] = {
        id: evt.touches[i].identifier,
        x: (evt.touches[i].clientX - rect.left) * ratio,
        y: (evt.touches[i].clientY - rect.top) * ratio,
        changed: false
      };
    } // Handle all touches


    for (var i = evt.changedTouches.length; i--;) {
      var id = evt.changedTouches[i].identifier;

      if (typeof pointer.touches[id] !== "undefined") {
        pointer.touches[id].changed = true;
      }

      clientX = evt.changedTouches[i].clientX; // Save for later

      clientY = evt.changedTouches[i].clientY; // Trigger events

      var object = getCurrentObject({
        id: id,
        x: (clientX - rect.left) * ratio,
        y: (clientY - rect.top) * ratio,
        radius: pointer.radius // only for collision

      });

      if (object && object[eventName]) {
        object[eventName](evt);
      }

      if (callbacks[eventName]) {
        callbacks[eventName](evt, object);
      }
    }
  } else {
    clientX = evt.clientX;
    clientY = evt.clientY;
  }

  pointer.x = (clientX - rect.left) * ratio;
  pointer.y = (clientY - rect.top) * ratio;
  evt.preventDefault();

  if (!isTouchEvent) {
    // Prevent double touch event
    var _object = getCurrentObject();

    if (_object && _object[eventName]) {
      _object[eventName](evt);
    }

    if (callbacks[eventName]) {
      callbacks[eventName](evt, _object);
    }
  }
}
/**
 * Initialize pointer event listeners. This function must be called before using other pointer functions.
 * @function initPointer
 */


function initPointer() {
  var canvas = (0, _core.getCanvas)();
  canvas.addEventListener('mousedown', pointerDownHandler);
  canvas.addEventListener('touchstart', pointerDownHandler);
  canvas.addEventListener('mouseup', pointerUpHandler);
  canvas.addEventListener('touchend', pointerUpHandler);
  canvas.addEventListener('touchcancel', pointerUpHandler);
  canvas.addEventListener('blur', blurEventHandler);
  canvas.addEventListener('mousemove', mouseMoveHandler);
  canvas.addEventListener('touchmove', mouseMoveHandler); // reset object render order on every new frame

  (0, _events.on)('tick', function () {
    lastFrameRenderOrder.length = 0;
    thisFrameRenderOrder.map(function (object) {
      lastFrameRenderOrder.push(object);
    });
    thisFrameRenderOrder.length = 0;
  });
}
/**
 * Begin tracking pointer events for a set of objects. Takes a single object or an array of objects.
 *
 * ```js
 * import { initPointer, track } from 'kontra';
 *
 * initPointer();
 *
 * track(obj);
 * track([obj1, obj2]);
 * ```
 * @function track
 *
 * @param {Object|Object[]} objects - Objects to track.
 */


function track(objects) {
  [].concat(objects).map(function (object) {
    // override the objects render function to keep track of render order
    if (!object._r) {
      object._r = object.render;

      object.render = function () {
        thisFrameRenderOrder.push(this);

        this._r();
      };

      trackedObjects.push(object);
    }
  });
}
/**
* Remove the callback function for a bound set of objects.
 *
 * ```js
 * import { untrack } from 'kontra';
 *
 * untrack(obj);
 * untrack([obj1, obj2]);
 * ```
 * @function untrack
 *
 * @param {Object|Object[]} objects - Object or objects to stop tracking.
 */


function untrack(objects) {
  [].concat(objects).map(function (object) {
    // restore original render function to no longer track render order
    object.render = object._r;
    object._r = 0; // 0 is the shortest falsy value

    var index = trackedObjects.indexOf(object);

    if (index !== -1) {
      trackedObjects.splice(index, 1);
    }
  });
}
/**
 * Check to see if the pointer is currently over the object. Since multiple objects may be rendered on top of one another, only the top most object under the pointer will return true.
 *
 * ```js
 * import { initPointer, track, pointer, pointerOver, Sprite } from 'kontra';
 *
 * initPointer();
 *
 * let sprite1 = Sprite({
 *   x: 10,
 *   y: 10,
 *   width: 10,
 *   height: 10
 * });
 * let sprite2 = Sprite({
 *   x: 15,
 *   y: 10,
 *   width: 10,
 *   height: 10
 * });
 *
 * track([sprite1, sprite2]);
 *
 * sprite1.render();
 * sprite2.render();
 *
 * pointer.x = 14;
 * pointer.y = 15;
 *
 * console.log(pointerOver(sprite1));  //=> false
 * console.log(pointerOver(sprite2));  //=> true
 * ```
 * @function pointerOver
 *
 * @param {Object} object - The object to check if the pointer is over.
 *
 * @returns {Boolean} `true` if the pointer is currently over the object, `false` otherwise.
 */


function pointerOver(object) {
  if (!trackedObjects.includes(object)) return false;
  return getCurrentObject() === object;
}
/**
 * Register a function to be called on all pointer down events. Is passed the original Event and the target object (if there is one).
 *
 * ```js
 * import { initPointer, onPointerDown } from 'kontra';
 *
 * initPointer();
 *
 * onPointerDown(function(e, object) {
 *   // handle pointer down
 * })
 * ```
 * @function onPointerDown
 *
 * @param {Function} callback - Function to call on pointer down.
 */


function onPointerDown(callback) {
  callbacks.onDown = callback;
}
/**
* Register a function to be called on all pointer up events. Is passed the original Event and the target object (if there is one).
 *
 * ```js
 * import { initPointer, onPointerUp } from 'kontra';
 *
 * initPointer();
 *
 * onPointerUp(function(e, object) {
 *   // handle pointer up
 * })
 * ```
 * @function onPointerUp
 *
 * @param {Function} callback - Function to call on pointer up.
 */


function onPointerUp(callback) {
  callbacks.onUp = callback;
}
/**
 * Check if a button is currently pressed. Use during an `update()` function to perform actions each frame.
 *
 * ```js
 * import { initPointer, pointerPressed } from 'kontra';
 *
 * initPointer();
 *
 * Sprite({
 *   update: function() {
 *     if (pointerPressed('left')){
 *       // left mouse button pressed
 *     }
 *     else if (pointerPressed('right')) {
 *       // right mouse button pressed
 *     }
 *   }
 * });
 * ```
 * @function pointerPressed
 *
 * @param {String} button - Button to check for pressed state.
 *
 * @returns {Boolean} `true` if the button is pressed, `false` otherwise.
 */


function pointerPressed(button) {
  return !!pressedButtons[button];
}
},{"./core.js":"kontra/core.js","./events.js":"kontra/events.js"}],"kontra/pool.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = poolFactory;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A fast and memory efficient [object pool](https://gameprogrammingpatterns.com/object-pool.html) for sprite reuse. Perfect for particle systems or SHUMPs. The pool starts out with just one object, but will grow in size to accommodate as many objects as are needed.
 *
 * <canvas width="600" height="200" id="pool-example"></canvas>
 * <script src="assets/js/pool.js"></script>
 * @class Pool
 *
 * @param {Object} properties - Properties of the pool.
 * @param {Function} properties.create - Function that returns a new object to be added to the pool when there are no more alive objects.
 * @param {Number} [properties.maxSize=1024] - The maximum number of objects allowed in the pool. The pool will never grow beyond this size.
 */
var Pool =
/*#__PURE__*/
function () {
  /**
   * @docs docs/api_docs/pool.js
   */
  function Pool() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        create = _ref.create,
        _ref$maxSize = _ref.maxSize,
        maxSize = _ref$maxSize === void 0 ? 1024 : _ref$maxSize;

    _classCallCheck(this, Pool);

    // check for the correct structure of the objects added to pools so we know that the
    // rest of the pool code will work without errors
    // @if DEBUG
    var obj;

    if (!create || !(obj = create()) || !(obj.update && obj.init && obj.isAlive)) {
      throw Error('Must provide create() function which returns an object with init(), update(), and isAlive() functions');
    } // @endif
    // c = create


    this._c = create;
    /**
     * All objects currently in the pool, both alive and not alive.
     * @memberof Pool
     * @property {Object[]} objects
     */

    this.objects = [create()]; // start the pool with an object

    /**
     * The number of alive objects.
     * @memberof Pool
     * @property {Number} size
     */

    this.size = 0;
    /**
     * The maximum number of objects allowed in the pool. The pool will never grow beyond this size.
     * @memberof Pool
     * @property {Number} maxSize
     */

    this.maxSize = maxSize;
  }
  /**
   * Get and return an object from the pool. The properties parameter will be passed directly to the objects `init()` function. If you're using a kontra.Sprite, you should also pass the `ttl` property to designate how many frames you want the object to be alive for.
   *
   * If you want to control when the sprite is ready for reuse, pass `Infinity` for `ttl`. You'll need to set the sprites `ttl` to `0` when you're ready for the sprite to be reused.
   *
   * ```js
   * // exclude-tablist
   * let sprite = pool.get({
   *   // the object will get these properties and values
   *   x: 100,
   *   y: 200,
   *   width: 20,
   *   height: 40,
   *   color: 'red',
   *
   *   // pass Infinity for ttl to prevent the object from being reused
   *   // until you set it back to 0
   *   ttl: Infinity
   * });
   * ```
   * @memberof Pool
   * @function get
   *
   * @param {Object} properties - Properties to pass to the objects `init()` function.
   *
   * @returns {Object} The newly initialized object.
   */


  _createClass(Pool, [{
    key: "get",
    value: function get() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // the pool is out of objects if the first object is in use and it can't grow
      if (this.size === this.objects.length) {
        if (this.size === this.maxSize) {
          return;
        } // double the size of the array by adding twice as many new objects to the end
        else {
            for (var i = 0; i < this.size && this.objects.length < this.maxSize; i++) {
              this.objects.push(this._c());
            }
          }
      } // save off first object in pool to reassign to last object after unshift


      var obj = this.objects[this.size];
      this.size++;
      obj.init(properties);
      return obj;
    }
    /**
     * Returns an array of all alive objects. Useful if you need to do special processing on all alive objects outside of the pool, such as add all alive objects to a kontra.Quadtree.
     * @memberof Pool
     * @function getAliveObjects
     *
     * @returns {Object[]} An Array of all alive objects.
     */

  }, {
    key: "getAliveObjects",
    value: function getAliveObjects() {
      return this.objects.slice(0, this.size);
    }
    /**
     * Clear the object pool. Removes all objects from the pool and resets its [size](api/pool#size) to 1.
     * @memberof Pool
     * @function clear
     */

  }, {
    key: "clear",
    value: function clear() {
      this.size = this.objects.length = 0;
      this.objects.push(this._c());
    }
    /**
     * Update all alive objects in the pool by calling the objects `update()` function. This function also manages when each object should be recycled, so it is recommended that you do not call the objects `update()` function outside of this function.
     * @memberof Pool
     * @function update
     *
     * @param {Number} [dt] - Time since last update.
     */

  }, {
    key: "update",
    value: function update(dt) {
      var obj;
      var doSort = false;

      for (var i = this.size; i--;) {
        obj = this.objects[i];
        obj.update(dt);

        if (!obj.isAlive()) {
          doSort = true;
          this.size--;
        }
      } // sort all dead elements to the end of the pool


      if (doSort) {
        this.objects.sort(function (a, b) {
          return b.isAlive() - a.isAlive();
        });
      }
    }
    /**
     * Render all alive objects in the pool by calling the objects `render()` function.
     * @memberof Pool
     * @function render
     */

  }, {
    key: "render",
    value: function render() {
      for (var i = this.size; i--;) {
        this.objects[i].render();
      }
    }
  }]);

  return Pool;
}();

function poolFactory(properties) {
  return new Pool(properties);
}

poolFactory.prototype = Pool.prototype;
poolFactory.class = Pool;
},{}],"kontra/quadtree.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quadtreeFactory;

var _core = require("./core.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function getIndices(object, bounds) {
  var indices = [];
  var verticalMidpoint = bounds.x + bounds.width / 2;
  var horizontalMidpoint = bounds.y + bounds.height / 2; // save off quadrant checks for reuse

  var intersectsTopQuadrants = object.y < horizontalMidpoint && object.y + object.height >= bounds.y;
  var intersectsBottomQuadrants = object.y + object.height >= horizontalMidpoint && object.y < bounds.y + bounds.height; // object intersects with the left quadrants

  if (object.x < verticalMidpoint && object.x + object.width >= bounds.x) {
    if (intersectsTopQuadrants) {
      // top left
      indices.push(0);
    }

    if (intersectsBottomQuadrants) {
      // bottom left
      indices.push(2);
    }
  } // object intersects with the right quadrants


  if (object.x + object.width >= verticalMidpoint && object.x < bounds.x + bounds.width) {
    // top right
    if (intersectsTopQuadrants) {
      indices.push(1);
    }

    if (intersectsBottomQuadrants) {
      // bottom right
      indices.push(3);
    }
  }

  return indices;
}
/*
The quadtree acts like an object pool in that it will create subnodes as objects are needed but it won't clean up the subnodes when it collapses to avoid garbage collection.

The quadrant indices are numbered as follows (following a z-order curve):
     |
  0  |  1
 ----+----
  2  |  3
     |
*/

/**
 * A 2D [spatial partitioning](https://gameprogrammingpatterns.com/spatial-partition.html) data structure. Use it to quickly group objects by their position for faster access and collision checking.
 *
 * <canvas width="600" height="200" id="quadtree-example"></canvas>
 * <script src="assets/js/quadtree.js"></script>
 * @class Quadtree
 *
 * @param {Object} properties - Properties of the quadtree.
 * @param {Number} [properties.maxDepth=3] - Maximum node depth of the quadtree.
 * @param {Number} [properties.maxObjects=25] - Maximum number of objects a node can have before splitting.
 * @param {Object} [properties.bounds] - The 2D space (x, y, width, height) the quadtree occupies. Defaults to the entire canvas width and height.
 */


var Quadtree =
/*#__PURE__*/
function () {
  /**
   * @docs docs/api_docs/quadtree.js
   */
  function Quadtree() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$maxDepth = _ref.maxDepth,
        maxDepth = _ref$maxDepth === void 0 ? 3 : _ref$maxDepth,
        _ref$maxObjects = _ref.maxObjects,
        maxObjects = _ref$maxObjects === void 0 ? 25 : _ref$maxObjects,
        bounds = _ref.bounds;

    _classCallCheck(this, Quadtree);

    /**
     * Maximum node depth of the quadtree.
     * @memberof Quadtree
     * @property {Number} maxDepth
     */
    this.maxDepth = maxDepth;
    /**
     * Maximum number of objects a node can have before splitting.
     * @memberof Quadtree
     * @property {Number} maxObjects
     */

    this.maxObjects = maxObjects;
    /**
     * The 2D space (x, y, width, height) the quadtree occupies.
     * @memberof Quadtree
     * @property {Object} bounds
     */

    var canvas = (0, _core.getCanvas)();
    this.bounds = bounds || {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    }; // since we won't clean up any subnodes, we need to keep track of which nodes are
    // currently the leaf node so we know which nodes to add objects to
    // b = branch, d = depth, o = objects, s = subnodes, p = parent

    this._b = false;
    this._d = 0;
    this._o = [];
    this._s = [];
    this._p = null;
  }
  /**
   * Removes all objects from the quadtree. You should clear the quadtree every frame before adding all objects back into it.
   * @memberof Quadtree
   * @function clear
   */


  _createClass(Quadtree, [{
    key: "clear",
    value: function clear() {
      this._s.map(function (subnode) {
        subnode.clear();
      });

      this._b = false;
      this._o.length = 0;
    }
    /**
     * Get an array of all objects that belong to the same node as the passed in object.
     *
     * **Note:** if the passed in object is also part of the quadtree, it will not be returned in the results.
     *
     * ```js
     * import { Sprite, Quadtree } from 'kontra';
     *
     * let quadtree = Quadtree();
     * let player = Sprite({
     *   // ...
     * });
     * let enemy1 = Sprite({
     *   // ...
     * });
     * let enemy2 = Sprite({
     *   // ...
     * });
     *
     * quadtree.add(player, enemy1, enemy2);
     * quadtree.get(player);  //=> [enemy1]
     * ```
     * @memberof Quadtree
     * @function get
     *
     * @param {Object} object - Object to use for finding other objects. The object must have the properties `x`, `y`, `width`, and `height` so that its position in the quadtree can be calculated.
     *
     * @returns {Object[]} A list of objects in the same node as the object, not including the object itself.
     */

  }, {
    key: "get",
    value: function get(object) {
      // since an object can belong to multiple nodes we should not add it multiple times
      var objects = new Set();
      var indices, i; // traverse the tree until we get to a leaf node

      while (this._s.length && this._b) {
        indices = getIndices(object, this.bounds);

        for (i = 0; i < indices.length; i++) {
          this._s[indices[i]].get(object).forEach(function (obj) {
            return objects.add(obj);
          });
        }

        return Array.from(objects);
      } // don't add the object to the return list


      return this._o.filter(function (obj) {
        return obj !== object;
      });
    }
    /**
     * Add objects to the quadtree and group them by their position. Can take a single object, a list of objects, and an array of objects.
     *
     * ```js
     * import { Quadtree, Sprite, Pool, GameLoop } from 'kontra';
     *
     * let quadtree = Quadtree();
     * let bulletPool = Pool({
     *   create: Sprite
     * });
     *
     * let player = Sprite({
     *   // ...
     * });
     * let enemy = Sprite({
     *   // ...
     * });
     *
     * // create some bullets
     * for (let i = 0; i < 100; i++) {
     *   bulletPool.get({
     *     // ...
     *   });
     * }
     *
     * let loop = GameLoop({
     *   update: function() {
     *     quadtree.clear();
     *     quadtree.add(player, enemy, bulletPool.getAliveObjects());
     *   }
     * });
     * ```
     * @memberof Quadtree
     * @function add
     *
     * @param {Object|Object[]} objectsN - Objects to add to the quadtree.
     */

  }, {
    key: "add",
    value: function add() {
      var i, j, object, obj, indices, index;

      for (j = 0; j < arguments.length; j++) {
        object = arguments[j]; // add a group of objects separately

        if (Array.isArray(object)) {
          this.add.apply(this, object);
          continue;
        } // current node has subnodes, so we need to add this object into a subnode


        if (this._b) {
          this._a(object);

          continue;
        } // this node is a leaf node so add the object to it


        this._o.push(object); // split the node if there are too many objects


        if (this._o.length > this.maxObjects && this._d < this.maxDepth) {
          this._sp(); // move all objects to their corresponding subnodes


          for (i = 0; obj = this._o[i]; i++) {
            this._a(obj);
          }

          this._o.length = 0;
        }
      }
    }
    /**
     * Add an object to a subnode.
     *
     * @param {Object} object - Object to add into a subnode
     */
    // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var

  }, {
    key: "_a",
    value: function _a(object, indices, i) {
      indices = getIndices(object, this.bounds); // add the object to all subnodes it intersects

      for (i = 0; i < indices.length; i++) {
        this._s[indices[i]].add(object);
      }
    }
    /**
     * Split the node into four subnodes.
     */
    // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var

  }, {
    key: "_sp",
    value: function _sp(subWidth, subHeight, i) {
      this._b = true; // only split if we haven't split before

      if (this._s.length) {
        return;
      }

      subWidth = this.bounds.width / 2 | 0;
      subHeight = this.bounds.height / 2 | 0;

      for (i = 0; i < 4; i++) {
        this._s[i] = quadtreeFactory({
          bounds: {
            x: this.bounds.x + (i % 2 === 1 ? subWidth : 0),
            // nodes 1 and 3
            y: this.bounds.y + (i >= 2 ? subHeight : 0),
            // nodes 2 and 3
            width: subWidth,
            height: subHeight
          },
          maxDepth: this.maxDepth,
          maxObjects: this.maxObjects
        }); // d = depth, p = parent

        this._s[i]._d = this._d + 1;
        /* @if VISUAL_DEBUG */

        this._s[i]._p = this;
        /* @endif */
      }
    }
    /**
     * Draw the quadtree. Useful for visual debugging.
     */

    /* @if VISUAL_DEBUG **
    render() {
      // don't draw empty leaf nodes, always draw branch nodes and the first node
      if (this._o.length || this._d === 0 ||
          (this._p && this._p._b)) {
         context.strokeStyle = 'red';
        context.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
         if (this._s.length) {
          for (let i = 0; i < 4; i++) {
            this._s[i].render();
          }
        }
      }
    }
    /* @endif */

  }]);

  return Quadtree;
}();

function quadtreeFactory(properties) {
  return new Quadtree(properties);
}

quadtreeFactory.prototype = Quadtree.prototype;
quadtreeFactory.class = Quadtree;
},{"./core.js":"kontra/core.js"}],"kontra/vector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = vectorFactory;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A simple 2d vector object.
 *
 * ```js
 * import { Vector } from 'kontra';
 *
 * let vector = Vector(100, 200);
 * ```
 * @class Vector
 *
 * @param {Number} [x=0] - X coordinate of the vector.
 * @param {Number} [y=0] - Y coordinate of the vector.
 */
var Vector =
/*#__PURE__*/
function () {
  function Vector() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector);

    this._x = x;
    this._y = y;
  }
  /**
   * Return a new Vector whose value is the addition of the current Vector and the passed in Vector. If `dt` is provided, the result is multiplied by the value.
   * @memberof Vector
   * @function add
   *
   * @param {kontra.Vector} vector - Vector to add to the current Vector.
   * @param {Number} [dt=1] - Time since last update.
   *
   * @returns {kontra.Vector} A new kontra.Vector instance.
   */


  _createClass(Vector, [{
    key: "add",
    value: function add(vec) {
      var dt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return vectorFactory(this.x + (vec.x || 0) * dt, this.y + (vec.y || 0) * dt, this);
    }
    /**
     * Clamp the Vector between two points, preventing `x` and `y` from going below or above the minimum and maximum values. Perfect for keeping a sprite from going outside the game boundaries.
     *
     * ```js
     * import { Vector } from 'kontra';
     *
     * let vector = Vector(100, 200);
     * vector.clamp(0, 0, 200, 300);
     *
     * vector.x += 200;
     * console.log(vector.x);  //=> 200
     *
     * vector.y -= 300;
     * console.log(vector.y);  //=> 0
     *
     * vector.add({x: -500, y: 500});
     * console.log(vector);    //=> {x: 0, y: 300}
     * ```
     * @memberof Vector
     * @function clamp
     *
     * @param {Number} xMin - Minimum x value.
     * @param {Number} yMin - Minimum y value.
     * @param {Number} xMax - Maximum x value.
     * @param {Number} yMax - Maximum y value.
     */

  }, {
    key: "clamp",
    value: function clamp(xMin, yMin, xMax, yMax) {
      this._c = true;
      this._a = xMin;
      this._b = yMin;
      this._d = xMax;
      this._e = yMax;
    }
    /**
     * X coordinate of the vector.
     * @memberof Vector
     * @property {Number} x
     */

  }, {
    key: "x",
    get: function get() {
      return this._x;
    }
    /**
     * Y coordinate of the vector.
     * @memberof Vector
     * @property {Number} y
     */
    ,
    set: function set(value) {
      this._x = this._c ? Math.min(Math.max(this._a, value), this._d) : value;
    }
  }, {
    key: "y",
    get: function get() {
      return this._y;
    },
    set: function set(value) {
      this._y = this._c ? Math.min(Math.max(this._b, value), this._e) : value;
    }
  }]);

  return Vector;
}();

function vectorFactory(x, y) {
  var vec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var vector = new Vector(x, y); // preserve vector clamping when creating new vectors

  if (vec._c) {
    vector.clamp(vec._a, vec._b, vec._d, vec._e); // reset x and y so clamping takes effect

    vector.x = x;
    vector.y = y;
  }

  return vector;
}

vectorFactory.prototype = Vector.prototype;
vectorFactory.class = Vector;
},{}],"helpers/log.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Log =
/*#__PURE__*/
function () {
  function Log() {
    _classCallCheck(this, Log);
  }

  _createClass(Log, null, [{
    key: "q",
    value: function q(value) {
      var category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "general";
      Log.logs[category] = value;

      if (!Log.logging) {
        Log.logging = true;
        Log.startLogging();
      }
    }
  }, {
    key: "fps",
    value: function fps() {
      var thisLoop = Date.now();
      var fps = 1000 / (thisLoop - this.lastLoop);
      fps = Math.floor(fps);
      this.lastLoop = thisLoop;
      Log.logs.fps = fps;
    }
  }, {
    key: "startLogging",
    value: function startLogging() {
      this.dashboard = document.createElement("div");
      this.dashboard.classList.add("dashboard");
      document.body.append(this.dashboard);
      setInterval(function () {
        Object.entries(Log.logs).forEach(function (value) {
          console.log(_typeof(value[1]));

          if (typeof value[1] === "number") {
            value[1] = value[1].toFixed(2);
          }

          Log.addToDashboard(value[0], value[1]);
        });
      }, 250);
    }
  }, {
    key: "addToDashboard",
    value: function addToDashboard(category, value) {
      var entry = document.querySelector("." + category);

      if (entry) {
        entry.textContent = category + " : " + value;
        return;
      }

      entry = document.createElement("div");
      entry.classList.add(category);
      entry.append(document.createTextNode(category + " : " + value));
      this.dashboard.append(entry);
    }
  }]);

  return Log;
}();

exports.Log = Log;
Log.logs = {};
Log.logging = false;
Log.lastLoop = Date.now();
},{}],"kontra/sprite.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = spriteFactory;

var _core = require("./core.js");

var _vector = _interopRequireDefault(require("./vector.js"));

var _log = require("../helpers/log.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A versatile way to update and draw your game objects. It can handle simple rectangles, images, and sprite sheet animations. It can be used for your main player object as well as tiny particles in a particle engine.
 * @class Sprite
 *
 * @param {Object} properties - Properties of the sprite.
 * @param {Number} properties.x - X coordinate of the position vector.
 * @param {Number} properties.y - Y coordinate of the position vector.
 * @param {Number} [properties.dx] - X coordinate of the velocity vector.
 * @param {Number} [properties.dy] - Y coordinate of the velocity vector.
 * @param {Number} [properties.ddx] - X coordinate of the acceleration vector.
 * @param {Number} [properties.ddy] - Y coordinate of the acceleration vector.
 *
 * @param {String} [properties.color] - Fill color for the sprite if no image or animation is provided.
 * @param {Number} [properties.width] - Width of the sprite.
 * @param {Number} [properties.height] - Height of the sprite.
 *
 * @param {Number} [properties.ttl=Infinity] - How many frames the sprite should be alive. Used by kontra.Pool.
 * @param {Number} [properties.rotation=0] - Sprites rotation around the origin in radians.
 * @param {Number} [properties.anchor={x:0,y:0}] - The x and y origin of the sprite. {x:0, y:0} is the top left corner of the sprite, {x:1, y:1} is the bottom right corner.
 *
 * @param {Canvas​Rendering​Context2D} [properties.context] - The context the sprite should draw to. Defaults to [core.getContext()](api/core#getContext).
 *
 * @param {Image|HTMLCanvasElement} [properties.image] - Use an image to draw the sprite.
 * @param {Object} [properties.animations] - An object of [Animations](api/animation) from a kontra.Spritesheet to animate the sprite.
 *
 * @param {Function} [properties.update] - Function called every frame to update the sprite.
 * @param {Function} [properties.render] - Function called every frame to render the sprite.
 * @param {*} [properties.*] - Any additional properties you need added to the sprite. For example, if you pass `Sprite({type: 'player'})` then the sprite will also have a property of the same name and value. You can pass as many additional properties as you want.
 */
var Sprite =
/*#__PURE__*/
function () {
  /**
   * @docs docs/api_docs/sprite.js
   */
  function Sprite(properties) {
    _classCallCheck(this, Sprite);

    this.init(properties);
  }
  /**
   * Use this function to reinitialize a sprite. It takes the same properties object as the constructor. Useful it you want to repurpose a sprite.
   * @memberof Sprite
   * @function init
   *
   * @param {Object} properties - Properties of the sprite.
   */


  _createClass(Sprite, [{
    key: "init",
    value: function init() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var x = properties.x,
          y = properties.y,
          dx = properties.dx,
          dy = properties.dy,
          ddx = properties.ddx,
          ddy = properties.ddy,
          width = properties.width,
          height = properties.height,
          image = properties.image;
      /**
       * The sprites position vector. The sprites position is its position in the world, as opposed to the position in the [viewport](api/sprite#viewX). Typically the position in the world and the viewport are the same value. If the sprite has been [added to a tileEngine](/api/tileEngine#addObject), the position vector represents where in the tile world the sprite is while the viewport represents where to draw the sprite in relation to the top-left corner of the canvas.
       * @memberof Sprite
       * @property {kontra.Vector} position
       */

      this.position = (0, _vector.default)(x, y);
      /**
       * The sprites velocity vector.
       * @memberof Sprite
       * @property {kontra.Vector} velocity
       */

      this.velocity = (0, _vector.default)(dx, dy);
      /**
       * The sprites acceleration vector.
       * @memberof Sprite
       * @property {kontra.Vector} acceleration
       */

      this.acceleration = (0, _vector.default)(ddx, ddy); // defaults
      // sx = flipX, sy = flipY

      this._fx = this._fy = 1;
      /**
       * The rotation of the sprite around the origin in radians.
       * @memberof Sprite
       * @property {Number} rotation
       */

      this.width = this.height = this.rotation = 0;
      /**
       * How may frames the sprite should be alive. Primarily used by kontra.Pool to know when to recycle an object.
       * @memberof Sprite
       * @property {Number} ttl
       */

      this.ttl = Infinity;
      /**
       * The x and y origin of the sprite. {x:0, y:0} is the top left corner of the sprite, {x:1, y:1} is the bottom right corner.
       * @memberof Sprite
       * @property {Object} anchor
       *
       * @example
       * // exclude-code:start
       * let { Sprite } = kontra;
       * // exclude-code:end
       * // exclude-script:start
       * import { Sprite } from 'kontra';
       * // exclude-script:end
       *
       * let sprite = Sprite({
       *   x: 150,
       *   y: 100,
       *   color: 'red',
       *   width: 50,
       *   height: 50,
       *   // exclude-code:start
       *   context: context,
       *   // exclude-code:end
       *   render: function() {
       *     this.draw();
       *
       *     // draw origin
       *     this.context.fillStyle = 'yellow';
       *     this.context.beginPath();
       *     this.context.arc(this.x, this.y, 3, 0, 2*Math.PI);
       *     this.context.fill();
       *   }
       * });
       * sprite.render();
       *
       * sprite.anchor = {x: 0.5, y: 0.5};
       * sprite.x = 300;
       * sprite.render();
       *
       * sprite.anchor = {x: 1, y: 1};
       * sprite.x = 450;
       * sprite.render();
       */

      this.anchor = {
        x: 0,
        y: 0
      };
      /**
       * The context the sprite will draw to.
       * @memberof Sprite
       * @property {Canvas​Rendering​Context2D} context
       */

      this.context = (0, _core.getContext)();
      /**
       * The color of the sprite if it was passed as an argument.
       * @memberof Sprite
       * @property {String} color
       */

      /**
       * The image the sprite will use when drawn if passed as an argument.
       * @memberof Sprite
       * @property {Image|HTMLCanvasElement} image
       */
      // add all properties to the sprite, overriding any defaults

      for (var prop in properties) {
        this[prop] = properties[prop];
      } // image sprite


      if (image) {
        this.width = width !== undefined ? width : image.width;
        this.height = height !== undefined ? height : image.height;
      }
      /**
       * The X coordinate of the camera. Used to determine [viewX](api/sprite#viewX).
       * @memberof Sprite
       * @property {Number} sx
       */


      this.sx = 0;
      /**
       * The Y coordinate of the camera. Used to determine [viewY](api/sprite#viewY).
       * @memberof Sprite
       * @property {Number} sy
       */

      this.sy = 0;
    } // define getter and setter shortcut functions to make it easier to work with the
    // position, velocity, and acceleration vectors.

    /**
     * X coordinate of the position vector.
     * @memberof Sprite
     * @property {Number} x
     */

  }, {
    key: "isAlive",

    /**
     * Check if the sprite is alive. Primarily used by kontra.Pool to know when to recycle an object.
     * @memberof Sprite
     * @function isAlive
     *
     * @returns {Boolean} `true` if the sprites [ttl](api/sprite#ttl) property is above `0`, `false` otherwise.
     */
    value: function isAlive() {
      return this.ttl > 0;
    }
    /**
     * Check if the sprite collide with the object. Uses a simple [Axis-Aligned Bounding Box (AABB) collision check](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Axis-Aligned_Bounding_Box). Takes into account the sprites [anchor](api/sprite#anchor).
     *
     * **NOTE:** Does not take into account sprite rotation. If you need collision detection between rotated sprites you will need to implement your own `collidesWith()` function. I suggest looking at the Separate Axis Theorem.
     *
     * ```js
     * import { Sprite } from 'kontra';
     *
     * let sprite = Sprite({
     *   x: 100,
     *   y: 200,
     *   width: 20,
     *   height: 40
     * });
     *
     * let sprite2 = Sprite({
     *   x: 150,
     *   y: 200,
     *   width: 20,
     *   height: 20
     * });
     *
     * sprite.collidesWith(sprite2);  //=> false
     *
     * sprite2.x = 115;
     *
     * sprite.collidesWith(sprite2);  //=> true
     * ```
     *
     * If you need a different type of collision check, you can override this function by passing an argument by the same name.
     *
     * ```js
     * // circle collision
     * function collidesWith(object) {
     *   let dx = this.x - object.x;
     *   let dy = this.y - object.y;
     *   let distance = Math.sqrt(dx * dx + dy * dy);
     *
     *   return distance < this.radius + object.radius;
     * }
     *
     * let sprite = Sprite({
     *   x: 100,
     *   y: 200,
     *   radius: 25,
     *   collidesWith: collidesWith
     * });
     *
     * let sprite2 = Sprite({
     *   x: 150,
     *   y: 200,
     *   radius: 30,
     *   collidesWith: collidesWith
     * });
     *
     * sprite.collidesWith(sprite2);  //=> true
     * ```
     * @memberof Sprite
     * @function collidesWith
     *
     * @param {Object} object - Object to check collision against.
     *
     * @returns {Boolean|null} `true` if the objects collide, `false` otherwise. Will return `null` if the either of the two objects are rotated.
     */

  }, {
    key: "collidesWith",
    value: function collidesWith(object) {
      // console.log(object);
      if (this.rotation || object.rotation) return null; // take into account sprite anchors

      var x = this.x - this.width * this.anchor.x;
      var y = this.y - this.height * this.anchor.y;
      var objX = object.x;
      var objY = object.y;

      if (object.anchor) {
        objX -= object.width * object.anchor.x;
        objY -= object.height * object.anchor.y;
      }

      _log.Log.q([x, y], "collision"); // console.log(
      //   x < objX + object.width &&
      //     x + this.width > objX &&
      //     y < objY + object.height &&
      //     y + this.height > objY
      // );


      return x < objX + object.width && x + this.width > objX && y < objY + object.height && y + this.height > objY;
    }
    /**
     * Update the sprites position based on its velocity and acceleration. Calls the sprites [advance()](api/sprite#advance) function.
     * @memberof Sprite
     * @function update
     *
     * @param {Number} [dt] - Time since last update.
     */

  }, {
    key: "update",
    value: function update(dt) {
      this.advance(dt);
    }
    /**
     * Render the sprite. Calls the sprites [draw()](api/sprite#draw) function.
     * @memberof Sprite
     * @function render
     */

  }, {
    key: "render",
    value: function render() {
      this.draw();
    }
    /**
     * Set the currently playing animation of an animation sprite.
     *
     * ```js
     * import { Sprite, SpriteSheet } from 'kontra';
     *
     * let spriteSheet = SpriteSheet({
     *   // ...
     *   animations: {
     *     idle: {
     *       frames: 1
     *     },
     *     walk: {
     *       frames: [1,2,3]
     *     }
     *   }
     * });
     *
     * let sprite = Sprite({
     *   x: 100,
     *   y: 200,
     *   animations: spriteSheet.animations
     * });
     *
     * sprite.playAnimation('idle');
     * ```
     * @memberof Sprite
     * @function playAnimation
     *
     * @param {String} name - Name of the animation to play.
     */

  }, {
    key: "playAnimation",
    value: function playAnimation(name) {
      this.currentAnimation = this.animations[name];

      if (!this.currentAnimation.loop) {
        this.currentAnimation.reset();
      }
    }
    /**
     * Move the sprite by its acceleration and velocity. If the sprite is an [animation sprite](api/sprite#animation-sprite), it also advances the animation every frame.
     *
     * If you override the sprites [update()](api/sprite#update) function with your own update function, you can call this function to move the sprite normally.
     *
     * ```js
     * import { Sprite } from 'kontra';
     *
     * let sprite = Sprite({
     *   x: 100,
     *   y: 200,
     *   width: 20,
     *   height: 40,
     *   dx: 5,
     *   dy: 2,
     *   update: function() {
     *     // move the sprite normally
     *     sprite.advance();
     *
     *     // change the velocity at the edges of the canvas
     *     if (this.x < 0 ||
     *         this.x + this.width > this.context.canvas.width) {
     *       this.dx = -this.dx;
     *     }
     *     if (this.y < 0 ||
     *         this.y + this.height > this.context.canvas.height) {
     *       this.dy = -this.dy;
     *     }
     *   }
     * });
     * ```
     * @memberof Sprite
     * @function advance
     *
     * @param {Number} [dt] - Time since last update.
     *
     */

  }, {
    key: "advance",
    value: function advance(dt) {
      this.velocity = this.velocity.add(this.acceleration, dt);
      this.position = this.position.add(this.velocity, dt);
      this.ttl--;

      if (this.currentAnimation) {
        this.currentAnimation.update(dt);
      }
    }
    /**
     * Draw the sprite at its X and Y position. This function changes based on the type of the sprite. For a [rectangle sprite](api/sprite#rectangle-sprite), it uses `context.fillRect()`, for an [image sprite](api/sprite#image-sprite) it uses `context.drawImage()`, and for an [animation sprite](api/sprite#animation-sprite) it uses the [currentAnimation](api/sprite#currentAnimation) `render()` function.
     *
     * If you override the sprites `render()` function with your own render function, you can call this function to draw the sprite normally.
     *
     * ```js
     * import { Sprite } from 'kontra';
     *
     * let sprite = Sprite({
     *  x: 290,
     *  y: 80,
     *  color: 'red',
     *  width: 20,
     *  height: 40,
     *
     *  render: function() {
     *    // draw the rectangle sprite normally
     *    this.draw();
     *
     *    // outline the sprite
     *    this.context.strokeStyle = 'yellow';
     *    this.context.lineWidth = 2;
     *    this.context.strokeRect(this.x, this.y, this.width, this.height);
     *  }
     * });
     *
     * sprite.render();
     * ```
     * @memberof Sprite
     * @function draw
     */

  }, {
    key: "draw",
    value: function draw() {
      var anchorWidth = -this.width * this.anchor.x;
      var anchorHeight = -this.height * this.anchor.y;
      this.context.save();
      this.context.translate(this.viewX, this.viewY); // rotate around the anchor

      if (this.rotation) {
        this.context.rotate(this.rotation);
      } // flip sprite around the center so the x/y position does not change


      if (this._fx == -1 || this._fy == -1) {
        var x = this.width / 2 + anchorWidth;
        var y = this.height / 2 + anchorHeight;
        this.context.translate(x, y);
        this.context.scale(this._fx, this._fy);
        this.context.translate(-x, -y);
      }

      if (this.image) {
        this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, anchorWidth, anchorHeight, this.width, this.height);
      } else if (this.currentAnimation) {
        this.currentAnimation.render({
          x: anchorWidth,
          y: anchorHeight,
          width: this.width,
          height: this.height,
          context: this.context
        });
      } else {
        this.context.fillStyle = this.color;
        this.context.fillRect(anchorWidth, anchorHeight, this.width, this.height);
      }

      this.context.restore();
    }
  }, {
    key: "x",
    get: function get() {
      return this.position.x;
    }
    /**
     * Y coordinate of the position vector.
     * @memberof Sprite
     * @property {Number} y
     */
    ,
    set: function set(value) {
      this.position.x = value;
    }
  }, {
    key: "y",
    get: function get() {
      return this.position.y;
    }
    /**
     * X coordinate of the velocity vector.
     * @memberof Sprite
     * @property {Number} dx
     */
    ,
    set: function set(value) {
      this.position.y = value;
    }
  }, {
    key: "dx",
    get: function get() {
      return this.velocity.x;
    }
    /**
     * Y coordinate of the velocity vector.
     * @memberof Sprite
     * @property {Number} dy
     */
    ,
    set: function set(value) {
      this.velocity.x = value;
    }
  }, {
    key: "dy",
    get: function get() {
      return this.velocity.y;
    }
    /**
     * X coordinate of the acceleration vector.
     * @memberof Sprite
     * @property {Number} ddx
     */
    ,
    set: function set(value) {
      this.velocity.y = value;
    }
  }, {
    key: "ddx",
    get: function get() {
      return this.acceleration.x;
    }
    /**
     * Y coordinate of the acceleration vector.
     * @memberof Sprite
     * @property {Number} ddy
     */
    ,
    set: function set(value) {
      this.acceleration.x = value;
    }
  }, {
    key: "ddy",
    get: function get() {
      return this.acceleration.y;
    }
    /**
     * An object of [Animations](api/animation) from a kontra.SpriteSheet to animate the sprite. Each animation is named so that it can can be used by name for the sprites [playAnimation()](api/sprite#playAnimation) function.
     *
     * ```js
     * import { Sprite, SpriteSheet } from 'kontra';
     *
     * let spriteSheet = SpriteSheet({
     *   // ...
     *   animations: {
     *     idle: {
     *       frames: 1,
     *       loop: false,
     *     },
     *     walk: {
     *       frames: [1,2,3]
     *     }
     *   }
     * });
     *
     * let sprite = Sprite({
     *   x: 100,
     *   y: 200,
     *   animations: spriteSheet.animations
     * });
     *
     * sprite.playAnimation('idle');
     * ```
     * @memberof Sprite
     * @property {Object} animations
     */
    ,
    set: function set(value) {
      this.acceleration.y = value;
    }
  }, {
    key: "animations",
    get: function get() {
      return this._a;
    }
    /**
     * Readonly. X coordinate of where to draw the sprite. Typically the same value as the [position vector](api/sprite#position) unless the sprite has been [added to a tileEngine](api/tileEngine#addObject).
     * @memberof Sprite
     * @property {Number} viewX
     */
    ,
    set: function set(value) {
      var prop, firstAnimation; // a = animations

      this._a = {}; // clone each animation so no sprite shares an animation

      for (prop in value) {
        this._a[prop] = value[prop].clone(); // default the current animation to the first one in the list

        firstAnimation = firstAnimation || this._a[prop];
      }
      /**
       * The currently playing Animation object if `animations` was passed as an argument.
       * @memberof Sprite
       * @property {kontra.Animation} currentAnimation
       */


      this.currentAnimation = firstAnimation;
      this.width = this.width || firstAnimation.width;
      this.height = this.height || firstAnimation.height;
    } // readonly

  }, {
    key: "viewX",
    get: function get() {
      return this.x - this.sx;
    }
    /**
     * Readonly. Y coordinate of where to draw the sprite. Typically the same value as the [position vector](api/sprite#position) unless the sprite has been [added to a tileEngine](api/tileEngine#addObject).
     * @memberof Sprite
     * @property {Number} viewY
     */
    ,
    set: function set(value) {
      return;
    }
  }, {
    key: "viewY",
    get: function get() {
      return this.y - this.sy;
    }
    /**
     * The width of the sprite. If the sprite is a [rectangle sprite](api/sprite#rectangle-sprite), it uses the passed in value. For an [image sprite](api/sprite#image-sprite) it is the width of the image. And for an [animation sprite](api/sprite#animation-sprite) it is the width of a single frame of the animation.
     *
     * Setting the value to a negative number will result in the sprite being flipped across the vertical axis while the width will remain a positive value.
     * @memberof Sprite
     * @property {Number} width
     */
    ,
    set: function set(value) {
      return;
    }
  }, {
    key: "width",
    get: function get() {
      return this._w;
    }
    /**
     * The height of the sprite. If the sprite is a [rectangle sprite](api/sprite#rectangle-sprite), it uses the passed in value. For an [image sprite](api/sprite#image-sprite) it is the height of the image. And for an [animation sprite](api/sprite#animation-sprite) it is the height of a single frame of the animation.
     *
     * Setting the value to a negative number will result in the sprite being flipped across the horizontal axis while the height will remain a positive value.
     * @memberof Sprite
     * @property {Number} height
     */
    ,
    set: function set(value) {
      var sign = value < 0 ? -1 : 1;
      this._fx = sign;
      this._w = value * sign;
    }
  }, {
    key: "height",
    get: function get() {
      return this._h;
    },
    set: function set(value) {
      var sign = value < 0 ? -1 : 1;
      this._fy = sign;
      this._h = value * sign;
    }
  }]);

  return Sprite;
}();

function spriteFactory(properties) {
  return new Sprite(properties);
}

spriteFactory.prototype = Sprite.prototype;
spriteFactory.class = Sprite;
},{"./core.js":"kontra/core.js","./vector.js":"kontra/vector.js","../helpers/log.ts":"helpers/log.ts"}],"kontra/spriteSheet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = spriteSheetFactory;

var _animation = _interopRequireDefault(require("./animation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Parse a string of consecutive frames.
 *
 * @param {Number|String} frames - Start and end frame.
 *
 * @returns {Number|Number[]} List of frames.
 */
function parseFrames(consecutiveFrames) {
  // return a single number frame
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types
  if (+consecutiveFrames === consecutiveFrames) {
    return consecutiveFrames;
  }

  var sequence = [];
  var frames = consecutiveFrames.split('..'); // coerce string to number
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types

  var start = +frames[0];
  var end = +frames[1];
  var i = start; // ascending frame order

  if (start < end) {
    for (; i <= end; i++) {
      sequence.push(i);
    }
  } // descending order
  else {
      for (; i >= end; i--) {
        sequence.push(i);
      }
    }

  return sequence;
}
/**
 * A sprite sheet to animate a sequence of images. Used to create [animation sprites](api/sprite#animation-sprite).
 *
 * <figure>
 *   <a href="assets/imgs/character_walk_sheet.png">
 *     <img src="assets/imgs/character_walk_sheet.png" alt="11 frames of a walking pill-like alien wearing a space helmet.">
 *   </a>
 *   <figcaption>Sprite sheet image courtesy of <a href="https://kenney.nl/assets">Kenney</a>.</figcaption>
 * </figure>
 *
 * Typically you create a sprite sheet just to create animations and then use the animations for your sprite.
 *
 * ```js
 * import { Sprite, SpriteSheet } from 'kontra';
 *
 * let image = new Image();
 * image.src = 'assets/imgs/character_walk_sheet.png';
 * image.onload = function() {
 *   let spriteSheet = SpriteSheet({
 *     image: image,
 *     frameWidth: 72,
 *     frameHeight: 97,
 *     animations: {
 *       // create a named animation: walk
 *       walk: {
 *         frames: '0..9',  // frames 0 through 9
 *         frameRate: 30
 *       }
 *     }
 *   });
 *
 *   let sprite = Sprite({
 *     x: 200,
 *     y: 100,
 *
 *     // use the sprite sheet animations for the sprite
 *     animations: spriteSheet.animations
 *   });
 * };
 * ```
 * @class SpriteSheet
 *
 * @param {Object} properties - Properties of the sprite sheet.
 * @param {Image|HTMLCanvasElement} properties.image - The sprite sheet image.
 * @param {Number} properties.frameWidth - The width of a single frame.
 * @param {Number} properties.frameHeight - The height of a single frame.
 * @param {Number} [properties.frameMargin=0] - The amount of whitespace between each frame.
 * @param {Object} [properties.animations] - Animations to create from the sprite sheet using kontra.Animation. Passed directly into the sprite sheets [createAnimations()](api/spriteSheet#createAnimations) function.
 */


var SpriteSheet =
/*#__PURE__*/
function () {
  function SpriteSheet() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        image = _ref.image,
        frameWidth = _ref.frameWidth,
        frameHeight = _ref.frameHeight,
        frameMargin = _ref.frameMargin,
        animations = _ref.animations;

    _classCallCheck(this, SpriteSheet);

    // @if DEBUG
    if (!image) {
      throw Error('You must provide an Image for the SpriteSheet');
    } // @endif

    /**
     * An object of named kontra.Animation objects. Typically you pass this object into kontra.Sprite to create an [animation sprites](api/spriteSheet#animation-sprite).
     * @memberof SpriteSheet
     * @property {Object} animations
     */


    this.animations = {};
    /**
     * The sprite sheet image.
     * @memberof SpriteSheet
     * @property {Image|HTMLCanvasElement} image
     */

    this.image = image;
    /**
     * An object that defines properties of a single frame in the sprite sheet. It has properties of `width`, `height`, and `margin`.
     *
     * `width` and `height` are the width of a single frame, while `margin` defines the amount of whitespace between each frame.
     * @memberof SpriteSheet
     * @property {Object} frame
     */

    this.frame = {
      width: frameWidth,
      height: frameHeight,
      margin: frameMargin
    }; // f = framesPerRow

    this._f = image.width / frameWidth | 0;
    this.createAnimations(animations);
  }
  /**
   * Create named animations from the sprite sheet. Called from the constructor if the `animations` argument is passed.
   *
   * This function populates the sprite sheets `animations` property with kontra.Animation objects. Each animation is accessible by its name.
   *
   * ```js
   * import { Sprite, SpriteSheet } from 'kontra';
   *
   * let image = new Image();
   * image.src = 'assets/imgs/character_walk_sheet.png';
   * image.onload = function() {
   *
   *   let spriteSheet = SpriteSheet({
   *     image: image,
   *     frameWidth: 72,
   *     frameHeight: 97,
   *
   *     // this will also call createAnimations()
   *     animations: {
   *       // create 1 animation: idle
   *       idle: {
   *         // a single frame
   *         frames: 1
   *       }
   *     }
   *   });
   *
   *   spriteSheet.createAnimations({
   *     // create 4 animations: jump, walk, moonWalk, attack
   *     jump: {
   *       // sequence of frames (can be non-consecutive)
   *       frames: [1, 10, 1],
   *       frameRate: 10,
   *       loop: false,
   *     },
   *     walk: {
   *       // ascending consecutive frame animation (frames 2-6, inclusive)
   *       frames: '2..6',
   *       frameRate: 20
   *     },
   *     moonWalk: {
   *       // descending consecutive frame animation (frames 6-2, inclusive)
   *       frames: '6..2',
   *       frameRate: 20
   *     },
   *     attack: {
   *       // you can also mix and match, in this case frames [8,9,10,13,10,9,8]
   *       frames: ['8..10', 13, '10..8'],
   *       frameRate: 10,
   *       loop: false,
   *     }
   *   });
   * };
   * ```
   * @memberof SpriteSheet
   * @function createAnimations
   *
   * @param {Object} animations - Object of named animations to create from the sprite sheet.
   * @param {Number|String|Number[]|String[]} animations.<name>.frames - The sequence of frames to use from the sprite sheet. It can either be a single frame (`1`), a sequence of frames (`[1,2,3,4]`), or a consecutive frame notation (`'1..4'`). Sprite sheet frames are `0` indexed.
   * @param {Number} animations.<name>.frameRate - The number frames to display per second.
   * @param {Boolean} [animations.<name>.loop=true] - If the animation should loop back to the beginning once completed.
   */


  _createClass(SpriteSheet, [{
    key: "createAnimations",
    value: function createAnimations(animations) {
      var sequence, name;

      for (name in animations) {
        var _animations$name = animations[name],
            frames = _animations$name.frames,
            frameRate = _animations$name.frameRate,
            loop = _animations$name.loop; // array that holds the order of the animation

        sequence = []; // @if DEBUG

        if (frames === undefined) {
          throw Error('Animation ' + name + ' must provide a frames property');
        } // @endif
        // add new frames to the end of the array


        [].concat(frames).map(function (frame) {
          sequence = sequence.concat(parseFrames(frame));
        });
        this.animations[name] = (0, _animation.default)({
          spriteSheet: this,
          frames: sequence,
          frameRate: frameRate,
          loop: loop
        });
      }
    }
  }]);

  return SpriteSheet;
}();

function spriteSheetFactory(properties) {
  return new SpriteSheet(properties);
}

spriteSheetFactory.prototype = SpriteSheet.prototype;
spriteSheetFactory.class = SpriteSheet;
},{"./animation.js":"kontra/animation.js"}],"kontra/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStoreItem = setStoreItem;
exports.getStoreItem = getStoreItem;

/**
 * A simple interface to LocalStorage based on [store.js](https://github.com/marcuswestin/store.js), whose sole purpose is to ensure that any keys you save to LocalStorage come out the same type as when they went in.
 *
 * Normally when you save something to LocalStorage, it converts it into a string. So if you were to save a number, it would be saved as `"12"` instead of `12`. This means when you retrieved the number, it would now be a string.
 *
 * ```js
 * import { setStoreItem, getStoreItem } from 'kontra';
 *
 * setStoreItem('highScore', 100);
 * getStoreItem('highScore');  //=> 100
 * ```
 * @sectionName Store
 */

/**
 * Save an item to localStorage.
 * @function setStoreItem
 *
 * @param {String} key - The name of the key.
 * @param {*} value - The value to store.
 */
function setStoreItem(key, value) {
  if (value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
/**
 * Retrieve an item from localStorage and convert it back to its original type.
 * @function getStoreItem
 *
 * @param {String} key - Name of the key of the item to retrieve.
 *
 * @returns {*} The retrieved item.
 */


function getStoreItem(key) {
  var value = localStorage.getItem(key);

  try {
    value = JSON.parse(value);
  } catch (e) {}

  return value;
}
},{}],"kontra/tileEngine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TileEngine;

var _core = require("./core.js");

function TileEngine() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var width = properties.width,
      height = properties.height,
      tilewidth = properties.tilewidth,
      tileheight = properties.tileheight,
      _properties$context = properties.context,
      context = _properties$context === void 0 ? (0, _core.getContext)() : _properties$context,
      tilesets = properties.tilesets,
      layers = properties.layers;
  var mapwidth = width * tilewidth;
  var mapheight = height * tileheight; // create an off-screen canvas for pre-rendering the map
  // @see http://jsperf.com/render-vs-prerender

  var offscreenCanvas = document.createElement('canvas');
  var offscreenContext = offscreenCanvas.getContext('2d');
  offscreenCanvas.width = mapwidth;
  offscreenCanvas.height = mapheight; // map layer names to data

  var layerMap = {};
  var layerCanvases = {}; // objects added to tile engine to sync with the camera

  var objects = [];
  /**
   * The width of tile map (in tiles).
   * @memberof TileEngine
   * @property {Number} width
   */

  /**
   * The height of tile map (in tiles).
   * @memberof TileEngine
   * @property {Number} height
   */

  /**
   * The width a tile (in pixels).
   * @memberof TileEngine
   * @property {Number} tilewidth
   */

  /**
   * The height of a tile (in pixels).
   * @memberof TileEngine
   * @property {Number} tileheight
   */

  /**
   * Array of all layers of the tile engine.
   * @memberof TileEngine
   * @property {Object[]} layers
   */

  /**
   * Array of all tilesets of the tile engine.
   * @memberof TileEngine
   * @property {Object[]} tilesets
   */

  var tileEngine = Object.assign({
    /**
     * The context the tile engine will draw to.
     * @memberof TileEngine
     * @property {CanvasRenderingContext2D} context
     */
    context: context,

    /**
     * The width of the tile map (in pixels).
     * @memberof TileEngine
     * @property {Number} mapwidth
     */
    mapwidth: mapwidth,

    /**
     * The height of the tile map (in pixels).
     * @memberof TileEngine
     * @property {Number} mapheight
     */
    mapheight: mapheight,
    _sx: 0,
    _sy: 0,
    // d = dirty
    _d: false,

    /**
     * X coordinate of the tile map camera.
     * @memberof TileEngine
     * @property {Number} sx
     */
    get sx() {
      return this._sx;
    },

    /**
     * Y coordinate of the tile map camera.
     * @memberof TileEngine
     * @property {Number} sy
     */
    get sy() {
      return this._sy;
    },

    // when clipping an image, sx and sy must within the image region, otherwise
    // Firefox and Safari won't draw it.
    // @see http://stackoverflow.com/questions/19338032/canvas-indexsizeerror-index-or-size-is-negative-or-greater-than-the-allowed-a
    set sx(value) {
      var _this = this;

      this._sx = Math.min(Math.max(0, value), mapwidth - (0, _core.getCanvas)().width);
      objects.forEach(function (obj) {
        return obj.sx = _this._sx;
      });
    },

    set sy(value) {
      var _this2 = this;

      this._sy = Math.min(Math.max(0, value), mapheight - (0, _core.getCanvas)().height);
      objects.forEach(function (obj) {
        return obj.sy = _this2._sy;
      });
    },

    /**
     * Render all visible layers.
     * @memberof TileEngine
     * @function render
     */
    render: function render() {
      if (this._d) {
        this._d = false;

        this._p();
      }

      _render(offscreenCanvas);
    },

    /**
     * Render a specific layer by name.
     * @memberof TileEngine
     * @function renderLayer
     *
     * @param {String} name - Name of the layer to render.
     */
    renderLayer: function renderLayer(name) {
      var canvas = layerCanvases[name];
      var layer = layerMap[name];

      if (!canvas) {
        // cache the rendered layer so we can render it again without redrawing
        // all tiles
        canvas = document.createElement('canvas');
        canvas.width = mapwidth;
        canvas.height = mapheight;
        layerCanvases[name] = canvas;

        tileEngine._r(layer, canvas.getContext('2d'));
      }

      if (layer._d) {
        layer._d = false;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        tileEngine._r(layer, canvas.getContext('2d'));
      }

      _render(canvas);
    },

    /**
     * Check if the object collides with the layer (shares a gird coordinate with any positive tile index in layers data). The object being checked must have the properties `x`, `y`, `width`, and `height` so that its position in the grid can be calculated. kontra.Sprite defines these properties for you.
     *
     * ```js
     * import { TileEngine, Sprite } from 'kontra';
     *
     * let tileEngine = TileEngine({
     *   tilewidth: 32,
     *   tileheight: 32,
     *   width: 4,
     *   height: 4,
     *   tilesets: [{
     *     // ...
     *   }],
     *   layers: [{
     *     name: 'collision',
     *     data: [ 0,0,0,0,
     *             0,1,4,0,
     *             0,2,5,0,
     *             0,0,0,0 ]
     *   }]
     * });
     *
     * let sprite = Sprite({
     *   x: 50,
     *   y: 20,
     *   width: 5,
     *   height: 5
     * });
     *
     * tileEngine.layerCollidesWith('collision', sprite);  //=> false
     *
     * sprite.y = 28;
     *
     * tileEngine.layerCollidesWith('collision', sprite);  //=> true
     * ```
     * @memberof TileEngine
     * @function layerCollidesWith
     *
     * @param {String} name - The name of the layer to check for collision.
     * @param {Object} object - Object to check collision against.
     *
     * @returns {boolean} `true` if the object collides with a tile, `false` otherwise.
     */
    layerCollidesWith: function layerCollidesWith(name, object) {
      var x = object.x;
      var y = object.y;

      if (object.anchor) {
        x -= object.width * object.anchor.x;
        y -= object.height * object.anchor.y;
      }

      var row = getRow(y);
      var col = getCol(x);
      var endRow = getRow(y + object.height);
      var endCol = getCol(x + object.width);
      var layer = layerMap[name]; // check all tiles

      for (var r = row; r <= endRow; r++) {
        for (var c = col; c <= endCol; c++) {
          if (layer.data[c + r * this.width]) {
            return true;
          }
        }
      }

      return false;
    },

    /**
     * Get the tile at the specified layer using either x and y coordinates or row and column coordinates.
     *
     * ```js
     * import { TileEngine } from 'kontra';
     *
     * let tileEngine = TileEngine({
     *   tilewidth: 32,
     *   tileheight: 32,
     *   width: 4,
     *   height: 4,
     *   tilesets: [{
     *     // ...
     *   }],
     *   layers: [{
     *     name: 'collision',
     *     data: [ 0,0,0,0,
     *             0,1,4,0,
     *             0,2,5,0,
     *             0,0,0,0 ]
     *   }]
     * });
     *
     * tileEngine.tileAtLayer('collision', {x: 50, y: 50});  //=> 1
     * tileEngine.tileAtLayer('collision', {row: 2, col: 1});  //=> 2
     * ```
     * @memberof TileEngine
     * @function tileAtLayer
     *
     * @param {String} name - Name of the layer.
     * @param {Object} position - Position of the tile in either {x, y} or {row, col} coordinates.
     *
     * @returns {Number} The tile index. Will return `-1` if no layer exists by the provided name.
     */
    tileAtLayer: function tileAtLayer(name, position) {
      var row = position.row || getRow(position.y);
      var col = position.col || getCol(position.x);

      if (layerMap[name]) {
        return layerMap[name].data[col + row * tileEngine.width];
      }

      return -1;
    },

    /**
     * Set the tile at the specified layer using either x and y coordinates or row and column coordinates.
     *
     * ```js
     * import { TileEngine } from 'kontra';
     *
     * let tileEngine = TileEngine({
     *   tilewidth: 32,
     *   tileheight: 32,
     *   width: 4,
     *   height: 4,
     *   tilesets: [{
     *     // ...
     *   }],
     *   layers: [{
     *     name: 'collision',
     *     data: [ 0,0,0,0,
     *             0,1,4,0,
     *             0,2,5,0,
     *             0,0,0,0 ]
     *   }]
     * });
     *
     * tileEngine.setTileAtLayer('collision', {row: 2, col: 1}, 10);
     * tileEngine.tileAtLayer('collision', {row: 2, col: 1});  //=> 10
     * ```
     * @memberof TileEngine
     * @function setTileAtLayer
     *
     * @param {String} name - Name of the layer.
     * @param {Object} position - Position of the tile in either {x, y} or {row, col} coordinates.
     * @param {Number} tile - Tile index to set.
     */
    setTileAtLayer: function setTileAtLayer(name, position, tile) {
      var row = position.row || getRow(position.y);
      var col = position.col || getCol(position.x);

      if (layerMap[name]) {
        layerMap[name]._d = true;
        layerMap[name].data[col + row * tileEngine.width] = tile;
      }
    },

    /**
    * Set the data at the specified layer.
    * 
    * ```js
    * import { TileEngine } from 'kontra';
    *
    * let tileEngine = TileEngine({
    *   tilewidth: 32,
    *   tileheight: 32,
    *   width: 2,
    *   height: 2,
    *   tilesets: [{
    *     // ...
    *   }],
    *   layers: [{
    *     name: 'collision',
    *     data: [ 0,1,
    *             2,3 ]
    *   }]
    * });
    *
    * tileEngine.setLayer('collision', [ 4,5,6,7]);
    * tileEngine.tileAtLayer('collision', {row: 0, col: 0});  //=> 4
    * tileEngine.tileAtLayer('collision', {row: 0, col: 1});  //=> 5
    * tileEngine.tileAtLayer('collision', {row: 1, col: 0});  //=> 6
    * tileEngine.tileAtLayer('collision', {row: 1, col: 1});  //=> 7
    * ```
    * 
    * @memberof TileEngine
    * @function setLayer
    * 
    * @param {String} name - Name of the layer.
    * @param {Number[]} data - 1D array of tile indices.
    */
    setLayer: function setLayer(name, data) {
      if (layerMap[name]) {
        layerMap[name]._d = true;
        layerMap[name].data = data;
      }
    },

    /**
     * Add an object to the tile engine. The tile engine will set the objects camera position (`sx`, `sy`) to be in sync with the tile engine camera. kontra.Sprite uses this information to draw the sprite to the correct position on the canvas.
     * @memberof TileEngine
     * @function addObject
     *
     * @param {Object} object - Object to add to the tile engine.
     */
    addObject: function addObject(object) {
      objects.push(object);
      object.sx = this._sx;
      object.sy = this._sy;
    },

    /**
     * Remove an object from the tile engine.
     * @memberof TileEngine
     * @function removeObject
     *
     * @param {Object} object - Object to remove from the tile engine.
     */
    removeObject: function removeObject(object) {
      var index = objects.indexOf(object);

      if (index !== -1) {
        objects.splice(index, 1);
        object.sx = object.sy = 0;
      }
    },
    // expose for testing
    _r: renderLayer,
    _p: prerender,
    // @if DEBUG
    layerCanvases: layerCanvases,
    layerMap: layerMap // @endif

  }, properties); // resolve linked files (source, image)

  tileEngine.tilesets.map(function (tileset) {
    // get the url of the Tiled JSON object (in this case, the properties object)
    var url = (window.__k ? window.__k.dm.get(properties) : '') || window.location.href;

    if (tileset.source) {
      // @if DEBUG
      if (!window.__k) {
        throw Error("You must use \"load\" or \"loadData\" to resolve tileset.source");
      } // @endif


      var source = window.__k.d[window.__k.u(tileset.source, url)]; // @if DEBUG


      if (!source) {
        throw Error("You must load the tileset source \"".concat(tileset.source, "\" before loading the tileset"));
      } // @endif


      Object.keys(source).map(function (key) {
        tileset[key] = source[key];
      });
    }

    if ('' + tileset.image === tileset.image) {
      // @if DEBUG
      if (!window.__k) {
        throw Error("You must use \"load\" or \"loadImage\" to resolve tileset.image");
      } // @endif


      var image = window.__k.i[window.__k.u(tileset.image, url)]; // @if DEBUG


      if (!image) {
        throw Error("You must load the image \"".concat(tileset.image, "\" before loading the tileset"));
      } // @endif


      tileset.image = image;
    }
  });
  /**
   * Get the row from the y coordinate.
   * @private
   *
   * @param {Number} y - Y coordinate.
   *
   * @return {Number}
   */

  function getRow(y) {
    return y / tileEngine.tileheight | 0;
  }
  /**
   * Get the col from the x coordinate.
   * @private
   *
   * @param {Number} x - X coordinate.
   *
   * @return {Number}
   */


  function getCol(x) {
    return x / tileEngine.tilewidth | 0;
  }
  /**
   * Render a layer.
   * @private
   *
   * @param {Object} layer - Layer data.
   * @param {Context} context - Context to draw layer to.
   */


  function renderLayer(layer, context) {
    context.save();
    context.globalAlpha = layer.opacity;
    layer.data = layer.data || [];
    layer.data.map(function (tile, index) {
      // skip empty tiles (0)
      if (!tile) return; // find the tileset the tile belongs to
      // assume tilesets are ordered by firstgid

      var tileset;

      for (var i = tileEngine.tilesets.length - 1; i >= 0; i--) {
        tileset = tileEngine.tilesets[i];

        if (tile / tileset.firstgid >= 1) {
          break;
        }
      }

      var tilewidth = tileset.tilewidth || tileEngine.tilewidth;
      var tileheight = tileset.tileheight || tileEngine.tileheight;
      var margin = tileset.margin || 0;
      var image = tileset.image;
      var offset = tile - tileset.firstgid;
      var cols = tileset.columns || image.width / (tilewidth + margin) | 0;
      var x = index % tileEngine.width * tilewidth;
      var y = (index / tileEngine.width | 0) * tileheight;
      var sx = offset % cols * (tilewidth + margin);
      var sy = (offset / cols | 0) * (tileheight + margin);
      context.drawImage(image, sx, sy, tilewidth, tileheight, x, y, tilewidth, tileheight);
    });
    context.restore();
  }
  /**
   * Pre-render the tiles to make drawing fast.
   * @private
   */


  function prerender() {
    if (tileEngine.layers) {
      tileEngine.layers.map(function (layer) {
        layer._d = false;
        layerMap[layer.name] = layer;

        if (layer.visible !== false) {
          tileEngine._r(layer, offscreenContext);
        }
      });
    }
  }
  /**
   * Render a tile engine canvas.
   * @private
   *
   * @param {HTMLCanvasElement} canvas - Tile engine canvas to draw.
   */


  function _render(canvas) {
    var _getCanvas = (0, _core.getCanvas)(),
        width = _getCanvas.width,
        height = _getCanvas.height;

    var sWidth = Math.min(canvas.width, width);
    var sHeight = Math.min(canvas.height, height);
    tileEngine.context.drawImage(canvas, tileEngine.sx, tileEngine.sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
  }

  prerender();
  return tileEngine;
}

;
},{"./core.js":"kontra/core.js"}],"kontra/kontra.defaults.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _animation = _interopRequireDefault(require("./animation.js"));

var _assets = require("./assets.js");

var _core = require("./core.js");

var _events = require("./events.js");

var _gameLoop = _interopRequireDefault(require("./gameLoop.js"));

var _keyboard = require("./keyboard.js");

var _plugin = require("./plugin.js");

var _pointer = require("./pointer.js");

var _pool = _interopRequireDefault(require("./pool.js"));

var _quadtree = _interopRequireDefault(require("./quadtree.js"));

var _sprite = _interopRequireDefault(require("./sprite.js"));

var _spriteSheet = _interopRequireDefault(require("./spriteSheet.js"));

var _store = require("./store.js");

var _tileEngine = _interopRequireDefault(require("./tileEngine.js"));

var _vector = _interopRequireDefault(require("./vector.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var kontra = {
  Animation: _animation.default,
  imageAssets: _assets.imageAssets,
  audioAssets: _assets.audioAssets,
  dataAssets: _assets.dataAssets,
  setImagePath: _assets.setImagePath,
  setAudioPath: _assets.setAudioPath,
  setDataPath: _assets.setDataPath,
  loadImage: _assets.loadImage,
  loadAudio: _assets.loadAudio,
  loadData: _assets.loadData,
  load: _assets.load,
  init: _core.init,
  getCanvas: _core.getCanvas,
  getContext: _core.getContext,
  on: _events.on,
  off: _events.off,
  emit: _events.emit,
  GameLoop: _gameLoop.default,
  keyMap: _keyboard.keyMap,
  initKeys: _keyboard.initKeys,
  bindKeys: _keyboard.bindKeys,
  unbindKeys: _keyboard.unbindKeys,
  keyPressed: _keyboard.keyPressed,
  registerPlugin: _plugin.registerPlugin,
  unregisterPlugin: _plugin.unregisterPlugin,
  extendObject: _plugin.extendObject,
  initPointer: _pointer.initPointer,
  pointer: _pointer.pointer,
  track: _pointer.track,
  untrack: _pointer.untrack,
  pointerOver: _pointer.pointerOver,
  onPointerDown: _pointer.onPointerDown,
  onPointerUp: _pointer.onPointerUp,
  pointerPressed: _pointer.pointerPressed,
  Pool: _pool.default,
  Quadtree: _quadtree.default,
  Sprite: _sprite.default,
  SpriteSheet: _spriteSheet.default,
  setStoreItem: _store.setStoreItem,
  getStoreItem: _store.getStoreItem,
  TileEngine: _tileEngine.default,
  Vector: _vector.default
};
var _default = kontra;
exports.default = _default;
},{"./animation.js":"kontra/animation.js","./assets.js":"kontra/assets.js","./core.js":"kontra/core.js","./events.js":"kontra/events.js","./gameLoop.js":"kontra/gameLoop.js","./keyboard.js":"kontra/keyboard.js","./plugin.js":"kontra/plugin.js","./pointer.js":"kontra/pointer.js","./pool.js":"kontra/pool.js","./quadtree.js":"kontra/quadtree.js","./sprite.js":"kontra/sprite.js","./spriteSheet.js":"kontra/spriteSheet.js","./store.js":"kontra/store.js","./tileEngine.js":"kontra/tileEngine.js","./vector.js":"kontra/vector.js"}],"kontra/kontra.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Animation", {
  enumerable: true,
  get: function () {
    return _animation.default;
  }
});
Object.defineProperty(exports, "imageAssets", {
  enumerable: true,
  get: function () {
    return _assets.imageAssets;
  }
});
Object.defineProperty(exports, "audioAssets", {
  enumerable: true,
  get: function () {
    return _assets.audioAssets;
  }
});
Object.defineProperty(exports, "dataAssets", {
  enumerable: true,
  get: function () {
    return _assets.dataAssets;
  }
});
Object.defineProperty(exports, "setImagePath", {
  enumerable: true,
  get: function () {
    return _assets.setImagePath;
  }
});
Object.defineProperty(exports, "setAudioPath", {
  enumerable: true,
  get: function () {
    return _assets.setAudioPath;
  }
});
Object.defineProperty(exports, "setDataPath", {
  enumerable: true,
  get: function () {
    return _assets.setDataPath;
  }
});
Object.defineProperty(exports, "loadImage", {
  enumerable: true,
  get: function () {
    return _assets.loadImage;
  }
});
Object.defineProperty(exports, "loadAudio", {
  enumerable: true,
  get: function () {
    return _assets.loadAudio;
  }
});
Object.defineProperty(exports, "loadData", {
  enumerable: true,
  get: function () {
    return _assets.loadData;
  }
});
Object.defineProperty(exports, "load", {
  enumerable: true,
  get: function () {
    return _assets.load;
  }
});
Object.defineProperty(exports, "init", {
  enumerable: true,
  get: function () {
    return _core.init;
  }
});
Object.defineProperty(exports, "getCanvas", {
  enumerable: true,
  get: function () {
    return _core.getCanvas;
  }
});
Object.defineProperty(exports, "getContext", {
  enumerable: true,
  get: function () {
    return _core.getContext;
  }
});
Object.defineProperty(exports, "on", {
  enumerable: true,
  get: function () {
    return _events.on;
  }
});
Object.defineProperty(exports, "off", {
  enumerable: true,
  get: function () {
    return _events.off;
  }
});
Object.defineProperty(exports, "emit", {
  enumerable: true,
  get: function () {
    return _events.emit;
  }
});
Object.defineProperty(exports, "GameLoop", {
  enumerable: true,
  get: function () {
    return _gameLoop.default;
  }
});
Object.defineProperty(exports, "keyMap", {
  enumerable: true,
  get: function () {
    return _keyboard.keyMap;
  }
});
Object.defineProperty(exports, "initKeys", {
  enumerable: true,
  get: function () {
    return _keyboard.initKeys;
  }
});
Object.defineProperty(exports, "bindKeys", {
  enumerable: true,
  get: function () {
    return _keyboard.bindKeys;
  }
});
Object.defineProperty(exports, "unbindKeys", {
  enumerable: true,
  get: function () {
    return _keyboard.unbindKeys;
  }
});
Object.defineProperty(exports, "keyPressed", {
  enumerable: true,
  get: function () {
    return _keyboard.keyPressed;
  }
});
Object.defineProperty(exports, "registerPlugin", {
  enumerable: true,
  get: function () {
    return _plugin.registerPlugin;
  }
});
Object.defineProperty(exports, "unregisterPlugin", {
  enumerable: true,
  get: function () {
    return _plugin.unregisterPlugin;
  }
});
Object.defineProperty(exports, "extendObject", {
  enumerable: true,
  get: function () {
    return _plugin.extendObject;
  }
});
Object.defineProperty(exports, "initPointer", {
  enumerable: true,
  get: function () {
    return _pointer.initPointer;
  }
});
Object.defineProperty(exports, "pointer", {
  enumerable: true,
  get: function () {
    return _pointer.pointer;
  }
});
Object.defineProperty(exports, "track", {
  enumerable: true,
  get: function () {
    return _pointer.track;
  }
});
Object.defineProperty(exports, "untrack", {
  enumerable: true,
  get: function () {
    return _pointer.untrack;
  }
});
Object.defineProperty(exports, "pointerOver", {
  enumerable: true,
  get: function () {
    return _pointer.pointerOver;
  }
});
Object.defineProperty(exports, "onPointerDown", {
  enumerable: true,
  get: function () {
    return _pointer.onPointerDown;
  }
});
Object.defineProperty(exports, "onPointerUp", {
  enumerable: true,
  get: function () {
    return _pointer.onPointerUp;
  }
});
Object.defineProperty(exports, "pointerPressed", {
  enumerable: true,
  get: function () {
    return _pointer.pointerPressed;
  }
});
Object.defineProperty(exports, "Pool", {
  enumerable: true,
  get: function () {
    return _pool.default;
  }
});
Object.defineProperty(exports, "Quadtree", {
  enumerable: true,
  get: function () {
    return _quadtree.default;
  }
});
Object.defineProperty(exports, "Sprite", {
  enumerable: true,
  get: function () {
    return _sprite.default;
  }
});
Object.defineProperty(exports, "SpriteSheet", {
  enumerable: true,
  get: function () {
    return _spriteSheet.default;
  }
});
Object.defineProperty(exports, "setStoreItem", {
  enumerable: true,
  get: function () {
    return _store.setStoreItem;
  }
});
Object.defineProperty(exports, "getStoreItem", {
  enumerable: true,
  get: function () {
    return _store.getStoreItem;
  }
});
Object.defineProperty(exports, "TileEngine", {
  enumerable: true,
  get: function () {
    return _tileEngine.default;
  }
});
Object.defineProperty(exports, "Vector", {
  enumerable: true,
  get: function () {
    return _vector.default;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _kontraDefaults.default;
  }
});

var _animation = _interopRequireDefault(require("./animation.js"));

var _assets = require("./assets.js");

var _core = require("./core.js");

var _events = require("./events.js");

var _gameLoop = _interopRequireDefault(require("./gameLoop.js"));

var _keyboard = require("./keyboard.js");

var _plugin = require("./plugin.js");

var _pointer = require("./pointer.js");

var _pool = _interopRequireDefault(require("./pool.js"));

var _quadtree = _interopRequireDefault(require("./quadtree.js"));

var _sprite = _interopRequireDefault(require("./sprite.js"));

var _spriteSheet = _interopRequireDefault(require("./spriteSheet.js"));

var _store = require("./store.js");

var _tileEngine = _interopRequireDefault(require("./tileEngine.js"));

var _vector = _interopRequireDefault(require("./vector.js"));

var _kontraDefaults = _interopRequireDefault(require("./kontra.defaults.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./animation.js":"kontra/animation.js","./assets.js":"kontra/assets.js","./core.js":"kontra/core.js","./events.js":"kontra/events.js","./gameLoop.js":"kontra/gameLoop.js","./keyboard.js":"kontra/keyboard.js","./plugin.js":"kontra/plugin.js","./pointer.js":"kontra/pointer.js","./pool.js":"kontra/pool.js","./quadtree.js":"kontra/quadtree.js","./sprite.js":"kontra/sprite.js","./spriteSheet.js":"kontra/spriteSheet.js","./store.js":"kontra/store.js","./tileEngine.js":"kontra/tileEngine.js","./vector.js":"kontra/vector.js","./kontra.defaults.js":"kontra/kontra.defaults.js"}],"helpers/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configCanvas = configCanvas;
exports.distance = distance;
exports.normalize = normalize;
exports.$$ = exports.$ = void 0;
// based on https://gist.github.com/paulirish/12fb951a8b893a454b32
var $ = document.querySelector.bind(document);
exports.$ = $;
var $$ = document.querySelectorAll.bind(document);
exports.$$ = $$;

function configCanvas(canvas) {
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 480;
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 320;
  var color = arguments.length > 3 ? arguments[3] : undefined;
  canvas.width = width;
  canvas.height = height;
  canvas.style.backgroundColor = color;
  return canvas;
}

function distance(obj) {
  var tgt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    x: 0,
    y: 0
  };
  return Math.sqrt(Math.pow(obj.x - tgt.x, 2) + Math.pow(obj.y - tgt.y, 2));
}

function normalize(v) {
  var d = distance(v);

  if (d > 0) {
    return {
      x: v.x / d,
      y: v.y / d
    };
  } else {
    return {
      x: 0,
      y: 0
    };
  }
}
},{}],"maps/tiles.png":[function(require,module,exports) {
module.exports = "/tiles.92cd188e.png";
},{}],"assets/images/player.png":[function(require,module,exports) {
module.exports = "/player.6e7d807a.png";
},{}],"maps/map.json":[function(require,module,exports) {
module.exports = {
  "compressionlevel": 0,
  "height": 30,
  "infinite": false,
  "layers": [{
    "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 0, 0, 3, 0, 3, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 0, 0, 3, 0, 3, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 3, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1],
    "height": 30,
    "id": 1,
    "name": "walls",
    "opacity": 1,
    "type": "tilelayer",
    "visible": true,
    "width": 40,
    "x": 0,
    "y": 0
  }, {
    "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    "height": 30,
    "id": 4,
    "name": "floor",
    "opacity": 1,
    "type": "tilelayer",
    "visible": true,
    "width": 40,
    "x": 0,
    "y": 0
  }, {
    "draworder": "topdown",
    "id": 2,
    "name": "entities",
    "objects": [{
      "height": 16,
      "id": 1,
      "name": "player",
      "rotation": 0,
      "type": "player",
      "visible": true,
      "width": 16,
      "x": 112,
      "y": 128
    }, {
      "height": 16,
      "id": 8,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 176,
      "y": 96
    }, {
      "height": 16,
      "id": 9,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 272,
      "y": 128
    }, {
      "height": 16,
      "id": 10,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 272,
      "y": 192
    }, {
      "height": 16,
      "id": 11,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 272,
      "y": 240
    }, {
      "height": 16,
      "id": 12,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 272,
      "y": 288
    }, {
      "height": 16,
      "id": 13,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 272,
      "y": 320
    }, {
      "height": 16,
      "id": 14,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 224,
      "y": 320
    }, {
      "height": 16,
      "id": 15,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 64,
      "y": 304
    }, {
      "height": 16,
      "id": 16,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 80,
      "y": 320
    }, {
      "height": 16,
      "id": 17,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 80,
      "y": 336
    }, {
      "height": 16,
      "id": 18,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 64,
      "y": 368
    }, {
      "height": 16,
      "id": 19,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 80,
      "y": 352
    }, {
      "height": 16,
      "id": 20,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 320,
      "y": 432
    }, {
      "height": 16,
      "id": 21,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 448,
      "y": 432
    }, {
      "height": 16,
      "id": 22,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 480,
      "y": 144
    }, {
      "height": 16,
      "id": 23,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 464,
      "y": 144
    }, {
      "height": 16,
      "id": 24,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 464,
      "y": 160
    }, {
      "height": 16,
      "id": 25,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 480,
      "y": 160
    }, {
      "height": 16,
      "id": 26,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 384,
      "y": 160
    }, {
      "height": 16,
      "id": 27,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 368,
      "y": 144
    }, {
      "height": 16,
      "id": 28,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 384,
      "y": 144
    }, {
      "height": 16,
      "id": 29,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 368,
      "y": 160
    }, {
      "height": 16,
      "id": 30,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 496,
      "y": 240
    }, {
      "height": 16,
      "id": 31,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 480,
      "y": 224
    }, {
      "height": 16,
      "id": 32,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 496,
      "y": 224
    }, {
      "height": 16,
      "id": 33,
      "name": "coin",
      "rotation": 0,
      "type": "coin",
      "visible": true,
      "width": 16,
      "x": 480,
      "y": 240
    }, {
      "height": 16,
      "id": 34,
      "name": "enemy",
      "properties": [{
        "name": "etype",
        "type": "int",
        "value": 0
      }],
      "rotation": 0,
      "type": "enemy",
      "visible": true,
      "width": 16,
      "x": 288,
      "y": 240
    }, {
      "height": 16,
      "id": 35,
      "name": "enemy",
      "properties": [{
        "name": "etype",
        "type": "int",
        "value": 0
      }],
      "rotation": 0,
      "type": "enemy",
      "visible": true,
      "width": 16,
      "x": 128,
      "y": 384
    }, {
      "height": 16,
      "id": 36,
      "name": "enemy",
      "properties": [{
        "name": "etype",
        "type": "int",
        "value": 0
      }],
      "rotation": 0,
      "type": "enemy",
      "visible": true,
      "width": 16,
      "x": 384,
      "y": 368
    }, {
      "height": 16,
      "id": 37,
      "name": "enemy",
      "properties": [{
        "name": "etype",
        "type": "int",
        "value": 1
      }],
      "rotation": 0,
      "type": "enemy",
      "visible": true,
      "width": 16,
      "x": 384,
      "y": 432
    }, {
      "height": 16,
      "id": 38,
      "name": "enemy",
      "properties": [{
        "name": "etype",
        "type": "int",
        "value": 0
      }],
      "rotation": 0,
      "type": "enemy",
      "visible": true,
      "width": 16,
      "x": 416,
      "y": 224
    }],
    "opacity": 1,
    "type": "objectgroup",
    "visible": true,
    "x": 0,
    "y": 0
  }],
  "nextlayerid": 5,
  "nextobjectid": 39,
  "orientation": "orthogonal",
  "renderorder": "right-down",
  "tiledversion": "1.3.1",
  "tileheight": 16,
  "tilesets": [{
    "columns": 3,
    "firstgid": 1,
    "image": "tiles.png",
    "imageheight": 16,
    "imagewidth": 48,
    "margin": 0,
    "name": "tiles",
    "spacing": 0,
    "tilecount": 3,
    "tileheight": 16,
    "tilewidth": 16
  }],
  "tilewidth": 16,
  "type": "map",
  "version": 1.2,
  "width": 40
};
},{}],"js/assets.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadAssets = loadAssets;
exports.loadSprite = loadSprite;
exports.loadAnimatedPlayer = loadAnimatedPlayer;
exports.loadTiles = loadTiles;

var _kontra = require("../kontra/kontra.js");

function loadAssets() {}

function loadSprite() {}

function loadAnimatedPlayer(imageSrc) {
  return new Promise(function (resolve) {
    var image = new Image();
    image.src = imageSrc;

    image.onload = function () {
      var spriteSheet = (0, _kontra.SpriteSheet)({
        image: image,
        frameWidth: 16,
        frameHeight: 16,
        animations: {
          idle: {
            frames: "0",
            frameRate: 0
          },
          up: {
            frames: "6..8",
            frameRate: 6
          },
          down: {
            frames: "0..2",
            frameRate: 6
          },
          left: {
            frames: "3..5",
            frameRate: 6
          },
          right: {
            frames: "3..5",
            frameRate: 6
          }
        }
      });
      var sprite = (0, _kontra.Sprite)({
        x: 100,
        y: 100,
        // use the sprite sheet animations for the sprite
        animations: spriteSheet.animations
      });
      resolve(sprite);
    };
  });
}

function loadTiles(mapJson, tilesImage) {
  return new Promise(function (resolve) {
    return (0, _kontra.load)(tilesImage).then(function (img) {
      mapJson.tilesets[0].image = tilesImage;
      var tileEngine = (0, _kontra.TileEngine)(mapJson);
      resolve(tileEngine);
    });
  });
}
},{"../kontra/kontra.js":"kontra/kontra.js"}],"js/controller.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyboardController = void 0;

var _kontra = require("../kontra/kontra.js");

var _index = require("../helpers/index");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KeyboardController =
/*#__PURE__*/
function () {
  function KeyboardController() {
    _classCallCheck(this, KeyboardController);

    (0, _kontra.initKeys)();
  }

  _createClass(KeyboardController, [{
    key: "update",
    value: function update() {
      var dirs = {
        x: 0,
        y: 0
      };

      if ((0, _kontra.keyPressed)("left")) {
        dirs.x = -1;
      }

      if ((0, _kontra.keyPressed)("up")) {
        dirs.y = -1;
      }

      if ((0, _kontra.keyPressed)("right")) {
        dirs.x = 1;
      }

      if ((0, _kontra.keyPressed)("down")) {
        dirs.y = 1;
      }

      return (0, _index.normalize)(dirs);
    }
  }]);

  return KeyboardController;
}();

exports.KeyboardController = KeyboardController;
},{"../kontra/kontra.js":"kontra/kontra.js","../helpers/index":"helpers/index.ts"}],"js/player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var _assets = require("./assets");

var _controller = require("./controller");

var _log = require("../helpers/log");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player =
/*#__PURE__*/
function () {
  function Player() {
    _classCallCheck(this, Player);

    this.speed = 2;
    this.controller = new _controller.KeyboardController();
  }

  _createClass(Player, [{
    key: "load",
    value: function load(playerImg, posX, posY, speed) {
      var _this = this;

      return new Promise(function (resolve) {
        (0, _assets.loadAnimatedPlayer)(playerImg).then(function (loadedPlayer) {
          _this.body = loadedPlayer;
          _this.initialWidth = _this.body.width;
          _this.body.x = posX;
          _this.body.y = posY;
          _this.speed = speed;
          resolve(_this.body);
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      if (this.body) {
        var dirs = this.controller.update();
        this.body.dx = dirs.x * this.speed;
        this.body.dy = dirs.y * this.speed;
        this.body.update();
        this.setAnimation();
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.body) {
        this.body.render();

        _log.Log.q(this.body.x); // console.log(this.body.x, this.body.y);

      }
    }
  }, {
    key: "setAnimation",
    value: function setAnimation() {
      // Change animation based on velocity
      if (this.body.dy < 0) {
        this.body.playAnimation("up");
      }

      if (this.body.dy > 0) {
        this.body.playAnimation("down");
      }

      if (this.body.dx < 0) {
        this.body.playAnimation("left");
        this.unflip();
      }

      if (this.body.dx > 0) {
        this.body.playAnimation("right");
        this.flip();
      }

      if (this.body.dx === 0 && this.body.dy === 0) {
        this.body.playAnimation("idle");
      }
    }
  }, {
    key: "flip",
    value: function flip() {
      this.body.width = -this.initialWidth;
    }
  }, {
    key: "unflip",
    value: function unflip() {
      this.body.width = this.initialWidth;
    }
  }]);

  return Player;
}();

exports.Player = Player;
},{"./assets":"js/assets.ts","./controller":"js/controller.ts","../helpers/log":"helpers/log.ts"}],"js/game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var _tiles = _interopRequireDefault(require("../maps/tiles.png"));

var _player = _interopRequireDefault(require("../assets/images/player.png"));

var _map = _interopRequireDefault(require("../maps/map.json"));

var _assets = require("./assets");

var _player2 = require("./player");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game() {
    _classCallCheck(this, Game);

    this.ready = false;
    this.player = new _player2.Player();
    this.player2 = new _player2.Player();
  }

  _createClass(Game, [{
    key: "load",
    value: function load() {
      var _this = this;

      console.log("loading game assets");
      (0, _assets.loadTiles)(_map.default, _tiles.default).then(function (tiles) {
        _this.tiles = tiles;

        _this.player.load(_player.default, 100, 100, 2).then(function (body) {
          _this.ready = true;
        });

        _this.player2.load(_player.default, 180, 100, -1).then(function (body) {
          _this.ready = true;
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      if (this.ready) {
        if (this.tiles.layerCollidesWith("walls", this.player.body)) {// console.log(this.player.body);
        }

        this.player.update();
        this.player2.update();
        this.player.body.collidesWith(this.player2.body);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.ready) {
        this.tiles.render();
        this.player.render();
        this.player2.render();
      }
    }
  }]);

  return Game;
}();

exports.Game = Game;
},{"../maps/tiles.png":"maps/tiles.png","../assets/images/player.png":"assets/images/player.png","../maps/map.json":"maps/map.json","./assets":"js/assets.ts","./player":"js/player.ts"}],"js/index.ts":[function(require,module,exports) {
"use strict";

var _kontra = require("../kontra/kontra.js");

var _index = require("../helpers/index");

var _game = require("./game");

var _log = require("../helpers/log");

var _init = (0, _kontra.init)(),
    canvas = _init.canvas,
    context = _init.context;

(0, _index.configCanvas)(canvas, 640, 512, "#111111"); // Manage loading screen and all.

var game = new _game.Game();
game.load();
var loop = (0, _kontra.GameLoop)({
  update: function update() {
    game.update();
  },
  render: function render() {
    game.render();

    _log.Log.fps();
  }
});
loop.start(); // start the game
},{"../kontra/kontra.js":"kontra/kontra.js","../helpers/index":"helpers/index.ts","./game":"js/game.ts","../helpers/log":"helpers/log.ts"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42041" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","js/index.ts"], null)
//# sourceMappingURL=/js.52877fb3.js.map
Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _slicedToArray = (function () {
  function sliceIterator (arr, i) {
    const _arr = [];
    let _n = true;
    let _d = false;
    let _e;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) {
          break;
        }
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i.return) {
          _i.return();
        }
      } finally {
        if (_d) {
          throw _e;
        }
      }
    }
    return _arr;
  }
  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    }
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
  };
}());

const decodeOffsetKey = function decodeOffsetKey (offsetKey) {
  const _offsetKey$split = offsetKey.split('-');

  const _offsetKey$split2 = _slicedToArray(_offsetKey$split, 3);

  const blockKey = _offsetKey$split2[0];
  const decoratorKey = _offsetKey$split2[1];
  const leafKey = _offsetKey$split2[2];

  return {
    blockKey,
    decoratorKey: parseInt(decoratorKey, 10),
    leafKey: parseInt(leafKey, 10),
  };
};

exports.default = decodeOffsetKey;

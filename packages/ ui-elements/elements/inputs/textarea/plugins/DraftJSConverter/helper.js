import _ from 'lodash';

export const applyCharMeta = (array, from = 0, length = 1, styleKey, entityObject) => {
  if (!array) {
    return false;
  }

  const entityIndex = Object.keys(array._entityList).length.toString();
  from = parseInt(from);
  length = parseInt(length);

  if (entityObject && entityObject.type) {
    array._entityList[entityIndex] = {
      type: entityObject.type,
      data: entityObject.data || {},
      mutability: entityObject.mutability || 'MUTABLE',
    };
  }

  for (let i = from; i < from + length; i++) {
    if (entityObject && entityObject.type && entityIndex) {
      array.entity[i] = entityIndex;
    }

    if (!array.style[i] && styleKey) {
      array.style[i] = [styleKey];
    } else if (array.style[i] && styleKey && array.style[i].indexOf(styleKey) < 0) {
      array.style[i].push(styleKey);
    }
  }

  return {
    entity: {
      from,
      length,
      ...(entityObject || {}),
    },
    style: {
      from,
      length,
      styleKey,
    },
  };
};

export const getWithNoFormatting = (text, regexArray, exceptions = {}) => {
  Object.keys(regexArray)
    .map((key) => {
      text = text.replace(regexArray[key], exceptions[key] ? exceptions[key] : '$1$2');
    });
  return text;
};

export const encodeContent = (text) => text.replace(/[*_`]/g, '\\$&');

export const convertToCharMeta = (text, styles, entities) => {
  const output = [];
  let charStyle = [];
  let prevCharStyle = [];
  let curData = {};
  for (let i = 0; i < text.length; i++) {
    prevCharStyle = charStyle;
    charStyle = styles[i] ? styles[i] : [];
    curData = {
      style: styles[i] || [],
      entity: entities[i] || null,
    };

    if (
      i > 0 &&
      (_.difference(charStyle, prevCharStyle).length >= 1 ||
        _.difference(prevCharStyle, charStyle).length >= 1)
    ) {
      if (text[i - 1 || 0] === ' ') {
        output[i - 1 || 0].style = [];
      }
      if (text[i] === ' ') {
        curData.style = [];
      }
    }

    output.push(curData);
  }

  return output;
};

export const getEntityRanges = (text, charMetaList) => {
  let charEntity = null;
  let prevCharEntity = null;
  const ranges = [];
  let rangeStart = 0;
  for (let i = 0, len = text.length; i < len; i++) {
    prevCharEntity = charEntity;
    const meta = charMetaList[i];
    charEntity = meta.entity ? meta.entity : null;
    if (i > 0 && charEntity !== prevCharEntity) {
      ranges.push([
        prevCharEntity,
        getStyleRanges(text.slice(rangeStart, i), charMetaList.slice(rangeStart, i)),
      ]);
      rangeStart = i;
    }
  }
  ranges.push([charEntity, getStyleRanges(text.slice(rangeStart), charMetaList.slice(rangeStart))]);
  return ranges;
};

export const getStyleRanges = (text, charMetaList) => {
  let charStyle = [];
  let prevCharStyle = [];
  const ranges = [];
  let rangeStart = 0;
  for (let i = 0, len = text.length; i < len; i++) {
    prevCharStyle = charStyle;
    const meta = charMetaList[i];
    charStyle = meta.style ? meta.style : [];
    if (
      i > 0 &&
      (_.difference(charStyle, prevCharStyle).length >= 1 ||
        _.difference(prevCharStyle, charStyle).length >= 1)
    ) {
      ranges.push([text.slice(rangeStart, i), prevCharStyle]);
      rangeStart = i;
    }
  }
  ranges.push([text.slice(rangeStart), charStyle]);
  return ranges;
};

export const exportFunc = (list, target) =>
  _.mapValues(list || {}, (item) => (item.bind && item.bind(target)) || item);

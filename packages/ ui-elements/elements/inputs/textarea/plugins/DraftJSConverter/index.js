import _ from 'lodash';

import { exportFunc } from './helper.js';

import parsers from './parsers';
import renders from './renderers';

const data = {
  _parsers: parsers,
  _renders: renders,
  parserData: {},
  renderData: {},
};

module.exports = exportFunc(data._parsers, Object.assign({}, data));

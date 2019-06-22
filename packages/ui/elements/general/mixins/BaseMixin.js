import _ from 'lodash';

export default function (store) {
  return {
    store () {
      return store || this.props.store;
    },

    shouldComponentUpdate (nextProps, nextState) {
      const checkNextProps = {};
      const checkProps = {};


      for (const prop of Object.getOwnPropertyNames(nextProps)) { // eslint-disable-line
        if (prop !== 'store' && prop !== 'key' && prop !== 'ref') {
          checkNextProps[prop] = nextProps[prop];
        }
      }

      for (const prop of Object.getOwnPropertyNames(this.props)) { // eslint-disable-line
        if (prop !== 'store' && prop !== 'key' && prop !== 'ref') {
          checkProps[prop] = this.props[prop];
        }
      }

      return (!_.isEqual(nextState, this.state)) || (!_.isEqual(checkNextProps, checkProps));
    },
  };
}

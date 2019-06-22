import momentHelper from '../helpers/moment.js';

const config = {
  day: {
    subtract: momentHelper.subtractDay,
    add: momentHelper.addDay,
    isNowStr: 'Today',
    renderStep: 5,
  },
  week: {
    subtract: momentHelper.subtractWeek,
    add: momentHelper.addWeek,
    isNowStr: 'This week',
    renderStep: 5,
  },
};

export default config;

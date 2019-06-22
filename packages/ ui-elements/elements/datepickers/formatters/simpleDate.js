import moment from 'moment-timezone';
import 'moment-range';

export const [WEEK, TWO_WEEK, MONTH, THREE_MONTHS, YEAR] = [
  'WEEK',
  'TWO_WEEK',
  'MONTH',
  'THREE_MONTHS',
  'YEAR',
];
const [NAME, LABEL, VALUE, DAYS] = ['name', 'label', 'value', 'days'];

const DATE_RANGE = {
  [WEEK]: {
    [NAME]: '7d',
    [LABEL]: 'Last 7 days',
    [VALUE]: '7days',
    [DAYS]: 6,
  },
  [TWO_WEEK]: {
    [NAME]: '14d',
    [LABEL]: 'Last 2 weeks',
    [VALUE]: '14days',
    [DAYS]: 13,
  },
  [MONTH]: {
    [NAME]: '1m',
    [LABEL]: 'Last month',
    [VALUE]: '30days',
    [DAYS]: 29,
  },
  [THREE_MONTHS]: {
    [NAME]: '3m',
    [LABEL]: 'Last 3 months',
    [VALUE]: '90days',
    [DAYS]: 89,
  },
  [YEAR]: {
    [NAME]: '1y',
    [LABEL]: 'Last year',
    [VALUE]: '365days',
    [DAYS]: 364,
  },
};

class SimpleDate {
  static getDateRange (range) {
    if (!range) {
      return DATE_RANGE;
    }
    return DATE_RANGE[range];
  }

  static getDateRangeName (range) {
    return DATE_RANGE[range][NAME];
  }

  static getDateRangeLabel (range) {
    return DATE_RANGE[range][LABEL];
  }

  static getDateRangeValue (range) {
    return DATE_RANGE[range][VALUE];
  }

  static getDateRangeDays (range) {
    return DATE_RANGE[range][DAYS];
  }

  static getSubtractStartDate (range) {
    const ranges = [WEEK, TWO_WEEK, MONTH, THREE_MONTHS, YEAR];
    let days = range;

    if (ranges.indexOf(range) !== -1) {
      days = DATE_RANGE[range][DAYS];
    }

    return SimpleDate.subtract(days)
      .startOf('day');
  }

  static getStartDate (value) {
    return moment(value)
      .startOf('day');
  }

  static getEndDate (value) {
    return moment(value)
      .endOf('day');
  }

  static range (from, to) {
    return moment.range(from, to);
  }

  static format (value, string) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return moment(value[0], value[1])
        .format(string);
    }
    return moment(value)
      .format(string);
  }

  static subtract (value) {
    return moment()
      .subtract(value, 'days');
  }

  static utcOffset (value) {
    return moment(value)
      .utcOffset(0, true);
  }
}

export default SimpleDate;

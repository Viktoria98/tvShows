import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const [WEEK, TWO_WEEK, MONTH, THREE_MONTHS, YEAR] = ['WEEK', 'TWO_WEEK', 'MONTH', 'THREE_MONTHS', 'YEAR'];
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
    [LABEL]: 'Last 14 days',
    [VALUE]: '14days',
    [DAYS]: 13,
  },
  [MONTH]: {
    [NAME]: '1m',
    [LABEL]: 'Last 30 days',
    [VALUE]: '30days',
    [DAYS]: 29,
  },
  [THREE_MONTHS]: {
    [NAME]: '3m',
    [LABEL]: 'Last 90 days',
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

    return SimpleDate.subtract(days);
  }

  static getAddEndDate (range) {
    const ranges = [WEEK, TWO_WEEK, MONTH, THREE_MONTHS, YEAR];
    let days = range;

    if (ranges.indexOf(range) !== -1) {
      days = DATE_RANGE[range][DAYS];
    }

    return SimpleDate.add(days);
  }

  static getStartDate (value) {
    return moment(value)
      .startOf('day');
  }

  static getEndDate (value) {
    return moment(value)
      .endOf('day');
  }

  static getCountOfSelectedMonths (startDate, endDate) {
    return (
      moment(endDate)
        .month() -
      moment(startDate)
        .month()
      ) + 1;
  }

  static getDaysInMonth (date) {
    return moment(date)
      .daysInMonth();
  }

  static range (from, to) {
    return (from && to) ? moment.range(from, to) :
                          null;
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
      .subtract(value, 'days')
      .startOf('day');
  }

  static add (value) {
    return moment()
      .add(value, 'days')
      .startOf('day');
  }

  static utcOffset (value) {
    const date = moment(value);
    const offset = date.utcOffset();
    return date.add(offset, 'minutes');
  }

  static get ranges () {
    return {
      week: '7days',
      twoWeeks: '14days',
      month: '30days',
      threeMonths: '90days',
      custom: 'custom',
    };
  }

  static get intervals () {
    return {
      WEEK,
      TWO_WEEK,
      MONTH,
      THREE_MONTHS,
      YEAR,
    };
  }

  static get intervalByDate () {
    return {
      '7days': WEEK,
      '14days': TWO_WEEK,
      '30days': MONTH,
      '90days': THREE_MONTHS,
    };
  }
}

export default SimpleDate;

import moment from 'moment';

class momentHelper {
  static addDay (date, count = 1) {
    return date.clone()
      .add(count, 'day');
  }

  static subtractDay (date, count = 1) {
    return date.clone()
      .subtract(count, 'day');
  }

  static addWeek (date, count = 1) {
    return date
      .clone()
      .add(count, 'week')
      .day(1)
      .endOf('day');
  }

  static subtractWeek (date, count = 1) {
    return date
      .clone()
      .subtract(count, 'week')
      .day(1)
      .endOf('day');
  }

  // returns array of dates in specific range based on period type
  static calculateDateRange (args) {
    const {
      start, end, period, config,
    } = args;
    const dates = [];

    let lastDate = start;

    while (!lastDate.isAfter(end, period)) {
      dates.push(lastDate);
      const nextDate = config[period].add(lastDate);
      lastDate = nextDate;
    }

    return dates;
  }
}

export default momentHelper;

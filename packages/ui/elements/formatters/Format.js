import moment from 'moment-timezone';

class Format {
  static number (value, decimals = 2) {
    if (isNaN(value)) {
      return 0;
    }
    let result = Number(value);
    result = result % 1 === 0 ? result.toString() : result.toFixed(decimals);
    return Format.numberFormat(result);
  }

  static numberFormat (value) {
    const parts = value.toString()
      .split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  static decimal (value) {
    return Format.fixedDecimal(value, 2);
  }

  static fixedDecimal (value, decimals = 2) {
    if (isNaN(value)) {
      return 0;
    }
    let result = Number(value);
    result = result.toFixed(decimals);
    return Format.numberFormat(result);
  }

  static date (value, zone) {
    const d = moment(value);
    if (!d.isValid()) {
      return value;
    }
    const timezone = zone || 'Europe/London';

    return d.tz(timezone)
      .format(Format.dateFormat);
  }

  static utc (value) {
    const d = moment(value);
    if (!d.isValid()) {
      return value;
    }
    return d.utc()
      .format(Format.dateFormat);
  }

  static ucfirst (value) {
    return value && value[0].toUpperCase() + value.slice(1);
  }
}

Format.dateFormat = 'h:mma ddd MMM D, YYYY';

export default Format;

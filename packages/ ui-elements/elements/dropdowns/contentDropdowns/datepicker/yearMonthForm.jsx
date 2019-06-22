import React from 'react';

export function YearMonthForm ({
  date, localeUtils, onChange, fromMonth, toMonth,
}) {
  const months = localeUtils.getMonths()
    .map((month, i) => (
      <option key={i} value={i}>
        {month}
      </option>
    ));

  let years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }
  years = years.map((year, i) => (
    <option key={i} value={year}>
      {year}
    </option>
  ));

  const handleChange = function handleChange (e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {months}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {years}
      </select>
    </form>
  );
}

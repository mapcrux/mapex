const React = require('react');

const DateTimePicker = jest.fn(({onChange, value}) =>
  React.createElement('View', {testID: 'date-time-picker', value, onChange}),
);

module.exports = DateTimePicker;
module.exports.default = DateTimePicker;

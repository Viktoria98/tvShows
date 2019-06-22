import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'color-parser';
import Color from 'easy-color';

const ColoredCell = class extends Component {

  render () {
    const {
      value, width, backgroundColor, backgroundColorSecond, isValueDependent = false,
    } = this.props;

    const getColor = (color = '#ffffff', isValueDependent) => {
      if (!isValueDependent) {
        return color;
      }
      const num = parseInt(value);
      if (isNaN(num)) {
        return color;
      }
      const parsedColor = parse(color);
      let parser = new Color.fromRGBA(parsedColor);
      // Decrease lightening from max proportionately with value
      parser.hsl.l = 100 - Math.round((100 - parser.hsl.l) * num / 100);
      parser = new Color.fromHSL(parser.hsl);

      return parser.to('RGB');
    };

    const getSecondGradientColor = (color = '#ffffff') => {
      if (backgroundColorSecond) {
        return backgroundColorSecond;
      }
      // Compute first color for gradient
      const parsedColor = parse(getColor(color, isValueDependent));
      let parser = new Color.fromRGBA(parsedColor);
      // Increase lightening to get second color for gradient
      parser.hsl.l = Math.round(parser.hsl.l * 1.2);
      parser = new Color.fromHSL(parser.hsl);

      return parser.to('RGB');
    };

    const style = {
      width,
    };

    if (!isValueDependent || value) {
      style.background = `linear-gradient(to right, ${getColor(
        backgroundColor,
        isValueDependent
      )}, ${getSecondGradientColor(backgroundColor)})`;
    }

    return (
      <div style={style}>
        {value}
      </div>
    );
  }
};

ColoredCell.propTypes = {
  width: PropTypes.number,
  value: PropTypes.string,
  backgroundColor: PropTypes.string,
  backgroundColorSecond: PropTypes.string,
  isValueDependent: PropTypes.bool,
};

ColoredCell.defaultProps = {
  width: 80,
  value: '',
  backgroundColor: '',
  backgroundColorSecond: '',
  isValueDependent: true,
};

export default ColoredCell;

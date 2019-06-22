import React, { Component } from 'react';
import PropTypes from 'prop-types';

const SmartInfiniteScroll = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      scroll: 0,
      client: 0,
    };

    this.dimensions = {
      x: {
        scroll: 'scrollLeft',
        client: 'clientWidth',
        padding: 'paddingLeft',
        sizeProp: 'minWidth',
      },
      y: {
        scroll: 'scrollTop',
        client: 'clientHeight',
        padding: 'paddingTop',
        sizeProp: 'minHeight',
      },
    };

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    this.initScroller();
  }

  componentWillReceiveProps (nextProps) {
    const dimension = this.dimensions[this.props.axis];
    const client = this.container[dimension.client];

    if (this.state.client !== client) {
      this.setState({
        client,
      });
    }
  }

  initScroller () {
    const { axis } = this.props;
    const scroll = 0;

    const client = this.container[this.dimensions[axis].client];
    this.setState({ scroll, client });
  }

  onScroll (event) {
    event.stopPropagation();
    const dimension = this.dimensions[this.props.axis];
    this.setState({
      scroll: this.container[dimension.scroll],
      client: this.container[dimension.client],
    });
  }

  calculcateRange () {
    const { scroll, client } = this.state;
    const { itemSize } = this.props;

    const first = Math.floor(scroll / itemSize);
    const last = Math.floor(client / itemSize) + first + 1;

    return {
      first,
      last,
    };
  }

  render () {
    const {
      itemSize, items, containerProps, wrapperProps, axis,
    } = this.props;
    const { first, last } = this.calculcateRange();
    const dimension = this.dimensions[axis];

    const offset = itemSize * first;
    const size = items.length * itemSize;

    return (
      <div
        ref={(container) => (this.container = container)}
        onScroll={this.onScroll}
        className={`infinite-scroll__container ${containerProps.className}`}
        style={{
          overflow: 'auto',
          ...containerProps.style,
        }}
      >
        <div
          className="infinite-scroll__wrapper"
          style={{
            [dimension.padding]: offset,
            [dimension.sizeProp]: size,
            boxSizing: 'border-box',
            ...(wrapperProps.style || {}),
          }}
        >
          {this.props.children({ first, last })}
        </div>
      </div>
    );
  }
};

SmartInfiniteScroll.propTypes = {
  axis: PropTypes.string,
  items: PropTypes.array,
  itemSize: PropTypes.number,
  containerProps: PropTypes.object,
  wrapperProps: PropTypes.object,
};

SmartInfiniteScroll.defaultProps = {
  containerProps: {},
  wrapperProps: {},
};

export default SmartInfiniteScroll;

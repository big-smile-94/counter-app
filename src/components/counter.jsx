import React, { Component } from 'react';

class Counter extends Component {
  formatCount() {
    const { value } = this.props.counter;
    return value === 0 ? 'Zero' : value;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('prevProps', prevProps);
    console.log('prevState', prevState);
    if (prevProps.counter.value !== this.props.counter.value) {
      // Ajax call to the server to get new data from the server
    }
  }

  componentWillUnmount() {
    console.log('Counter - Unmounted');
  }

  render() {
    console.log('Counter - Rendered');

    const { counter, onDelete, onIncrement } = this.props;
    return (
      <div>
        <span className={this.getBadgeClasses()}>{this.formatCount()}</span>
        <button
          onClick={() => onIncrement(counter)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
        <button
          onClick={() => onDelete(counter)}
          className="btn btn-danger btn-sm m-2"
        >
          Delete
        </button>
      </div>
    );
  }

  getBadgeClasses() {
    let classes = 'badge m-2 badge-';
    return (classes += this.props.counter.value === 0 ? 'warning' : 'primary');
  }
}

export default Counter;

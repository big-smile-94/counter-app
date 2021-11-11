import React, { Component } from 'react';

class Counter extends Component {
  state = {
    count: 0,
  };

  formatCount() {
    const { count } = this.state;
    return count === 0 ? 'Zero' : count;
  }

  handleIncrement = () => {
    console.log('Increment Clicked', this.state.count);
  };

  render() {
    return (
      <>
        <span className={this.getBadgeClasses()}>{this.formatCount()}</span>
        <button
          onClick={this.handleIncrement}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
      </>
    );
  }

  getBadgeClasses() {
    let classes = 'badge m-2 badge-';
    return (classes += this.state.count === 0 ? 'warning' : 'primary');
  }
}

export default Counter;

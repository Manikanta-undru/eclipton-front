import React, { Component } from 'react';

require('./title-and-filter.scss');

class TitleAndFilter extends Component {
  render() {
    return (
      <div className="title-and-filter">
        <div className="title1">
          <h2> Fresh Collection </h2>
        </div>

        <div className="filter">
          <span> View : </span>
          <div className="filter-box">
            <button className="active">
              {' '}
              <i className="fa fa-th" />{' '}
            </button>
            <button>
              {' '}
              <i className="fa fa-list" />{' '}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default TitleAndFilter;

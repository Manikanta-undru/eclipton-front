import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-image-crop/dist/ReactCrop.css';

import '../styles.scss';

require('../../../_styles/market-area.scss');
require('../../dashboard.scss');

class SearchContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_key: this.props.search_key,
      start_date: new Date(),
      end_date: new Date(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
  }

  handleChangeStartDate(date) {
    this.setState({
      start_date: date,
    });
    this.props.dataChange({
      start_date: date,
    });
  }

  handleChangeEndDate(date) {
    this.setState({
      end_date: date,
    });
    this.props.dataChange({
      end_date: date,
    });
  }

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
    this.props.dataChange({
      [name]: val,
    });
  };

  render() {
    const user = this.props.currentUser;
    return (
      <div className="col-lg-9 col-md-12">
        <form className="form-inline  d-flex">
          <div className="form-group me-4">
            <label htmlFor="inputPassword6">Search :</label>
            <input
              type="text"
              id="inputPassword6"
              name="search_key"
              className="form-control mx-sm-3 pl-3"
              onChange={this.handleChange}
              placeholder="Search"
            />
          </div>
          <div className="form-group me-2">
            <label htmlFor="inputPassword6">Form :</label>
            {this.state.start_date !== undefined && (
              <ReactDatePicker
                selected={new Date(this.state.start_date)}
                onChange={this.handleChangeStartDate}
                name="start_date"
                dateFormat="dd/MM/yyyy"
              />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword6">To :</label>
            {this.state.end_date !== undefined && (
              <ReactDatePicker
                selected={new Date(this.state.end_date)}
                onChange={this.handleChangeEndDate}
                name="end_date"
                dateFormat="dd/MM/yyyy"
              />
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default SearchContent;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AdImg from '../../../../assets/images/market-place/ad-1.jpg';

class AdBox extends Component {
  render() {
    return (
      <div className="ad-box">
        <Link to="/">
          <img src={AdImg} />
        </Link>
      </div>
    );
  }
}

export default AdBox;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import offersImg1 from '../../../../assets/images/market-place/more-offers/offer-1.jpg';
import offersImg2 from '../../../../assets/images/market-place/more-offers/offer-2.jpg';
import offersImg3 from '../../../../assets/images/market-place/more-offers/offer-3.jpg';

require('./hot-offers.scss');

class AdBox extends Component {
  render() {
    return (
      <>
        <div className="offer-box">
          {' '}
          <Link to="/">
            {' '}
            <img src={offersImg1} />{' '}
          </Link>{' '}
        </div>
        <div className="offer-box">
          {' '}
          <Link to="/">
            {' '}
            <img src={offersImg2} />{' '}
          </Link>{' '}
        </div>
        <div className="offer-box">
          {' '}
          <Link to="/">
            {' '}
            <img src={offersImg3} />{' '}
          </Link>{' '}
        </div>
        <div className="offer-box">
          {' '}
          <Link to="/">
            {' '}
            <img src={offersImg2} />{' '}
          </Link>{' '}
        </div>
        <div className="offer-box">
          {' '}
          <Link to="/">
            {' '}
            <img src={offersImg1} />{' '}
          </Link>{' '}
        </div>
      </>
    );
  }
}

export default AdBox;

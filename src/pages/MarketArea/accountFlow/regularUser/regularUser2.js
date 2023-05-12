import React from 'react';
import { Link } from 'react-router-dom';
import MarketWidget from '../../../../components/MarketWidget';
import MarketMenu from '../../../../components/Menu/MarketMenu';

import Slider1 from '../../_widgets/slider1';
import Tab1 from '../../_widgets/tab1';
import icon1 from '../../../../assets/images/market-place/icons/icon1.png';

require('../../_styles/market-area.scss');
require('./regular.scss');

class RegularUser2 extends React.Component {
  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout-1">
          <div className="layout-type-1">
            <div className="left">
              <MarketMenu {...this.props} current="/" />
            </div>

            <div className="right-holder">
              <div className="breadcrumb-product-detail">
                <ul>
                  <li>
                    {' '}
                    <Link to="/"> Home </Link>{' '}
                  </li>
                  <li>
                    {' '}
                    <Link to="/"> Headphones </Link>{' '}
                  </li>
                  <li>
                    {' '}
                    <Link to="/"> Accessories in Karachi </Link>{' '}
                  </li>
                  <li> Headphone TWS </li>
                </ul>
              </div>

              <div className="reach-more-customers">
                <div className="left">
                  <img src={icon1} alt="" />
                </div>

                <div className="middle">
                  <h3> Reach More Customers </h3>
                  <p>
                    {' '}
                    You got the talent, now go viral. Share your ads on Social
                    Media to connect with new customers and get more orders
                  </p>
                </div>

                <div className="right">
                  <div className="select-and-dropdown">
                    <div className="select-box">
                      <select name="" id="">
                        <option value=""> Mark as Sold </option>
                      </select>
                    </div>

                    <div className="dropdown-box dropdown-1">
                      <button>
                        {' '}
                        <i className="fa fa-ellipsis-v" />{' '}
                      </button>
                      <ul className="bg-lite">
                        <li>
                          {' '}
                          <Link to="/"> Mark as Sold </Link>{' '}
                        </li>
                        <li>
                          {' '}
                          <Link to="/"> Edit Listing </Link>{' '}
                        </li>
                        <li>
                          {' '}
                          <Link to="/"> Delete </Link>{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-detail">
                {/* <!-- BEGIN :: CENTER COLUMN --> */}
                <div className="middle content-area">
                  {/* <!-- BEGIN :: SLIDER 1 --> */}
                  <div className="slider-1">
                    <Slider1 />
                  </div>
                  {/* <!-- END :: SLIDER 1 --> */}

                  {/* <!-- BEGIN :: TAB 1 --> */}
                  <div className="tab-1">
                    <Tab1 />
                  </div>
                  {/* <!-- END :: TAB 1 --> */}
                </div>
                {/* <!-- END :: CENTER COLUMN --> */}

                {/* <!-- BEGIN :: RIGHT --> */}
                <div className="right hide-seller-description">
                  <MarketWidget {...this.props} />
                </div>
                {/* <!-- END :: RIGHT --> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegularUser2;

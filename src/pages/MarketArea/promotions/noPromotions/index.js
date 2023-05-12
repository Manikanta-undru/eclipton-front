import React from 'react';
import { Link } from 'react-router-dom';
import SideMenu3 from '../../_widgets/sideMenu3';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import emptyIcon from '../../../../assets/images/market-place/icons/no-promotions.png';

require('../../_styles/market-area.scss');

class NoPromotions extends React.Component {
  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout-1">
          <div className="layout-type-1">
            <div className="left">
              <MarketMenu {...this.props} current="/" />
            </div>

            <div className="middle content">
              <div className="split-type-1">
                <div className="left">
                  <SideMenu3 />
                </div>

                <div className="right ">
                  <div className="common-empty-box">
                    <div className="holder">
                      <img src={emptyIcon} alt="" />
                      <h3> No Promotions, Yet! </h3>
                      <p>
                        {' '}
                        Offer buyers a discount on all or some of your
                        currentproducts added on your marketplace{' '}
                      </p>
                      <Link to="/" className="btn-1">
                        {' '}
                        Create a Promotion{' '}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NoPromotions;

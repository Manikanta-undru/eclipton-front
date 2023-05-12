import React from 'react';

import bannerTopImg from '../../../../assets/images/market-place/create-ad-top.jpg';
import icon1 from '../../../../assets/images/icons/icon-sell-1.PNG';

require('../../_styles/market-area.scss');
require('./create-ad.scss');

class MarketCreateAd extends React.Component {
  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="banner-top">
            <img src={bannerTopImg} />
          </div>

          <div className="create-ad-wrapper">
            <h2>
              {' '}
              create your ad or Promotion on marketplace with these amazing
              guidelines{' '}
            </h2>
            <div className="create-ad-grid">
              {/* BEGIN :: CREATE AD BOX */}
              <div className="create-ad-box">
                <div className="icon">
                  <img src={icon1} alt="" />
                </div>
                <div className="detail">
                  <h3> Recalled Items </h3>
                  <p>
                    {
                      "In many places, it's illegal to sell recalled items. If the "
                    }
                    {
                      "item you're buying or selling has been recalled, check website "
                    }
                    for this information.
                  </p>
                </div>
              </div>
              {/* END :: CREATE AD BOX */}

              {/* BEGIN :: CREATE AD BOX */}
              <div className="create-ad-box">
                <div className="icon">
                  <img src={icon1} alt="" />
                </div>
                <div className="detail">
                  <h3> counterfeit items </h3>
                  <p>
                    {`
                  In many places, it's illegal to sell recalled items. if the
                  item you're buying or selling has been recalled, check website
                  for this information.
                  `}
                  </p>
                </div>
              </div>
              {/* END :: CREATE AD BOX */}

              {/* BEGIN :: CREATE AD BOX */}
              <div className="create-ad-box">
                <div className="icon">
                  <img src={icon1} alt="" />
                </div>
                <div className="detail">
                  <h3> Mark as Sold </h3>
                  <p>
                    {`In many places, it's illegal to sell recalled items. if the
                  item you're buying or selling has been recalled, check website
                  for this information.`}
                  </p>
                </div>
              </div>
              {/* END :: CREATE AD BOX */}
            </div>

            <div className="create-ad-btns">
              <a className="btn-1" href="/market-product-overview">
                {' '}
                Let’s Create an Ad{' '}
              </a>
              <a className="btn-2" href="/market-promotion-overview">
                {' '}
                Create a Promotion{' '}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketCreateAd;

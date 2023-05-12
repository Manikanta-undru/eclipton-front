import React from 'react';
import SideMenu1 from '../../_widgets/sideMenu1';
import MarketWidget from '../../../../components/MarketWidget';
import Slider1 from '../../_widgets/slider1';
import Product from '../../_widgets/product/Index';
import Tab1 from '../../_widgets/tab1';

require('../../_styles/market-area.scss');
require('./product-publish.scss');

class MarketProductPublish extends React.Component {
  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-type-1">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <SideMenu1 />
            </div>
            {/* END :: LEFT */}

            <div className="right-holder">
              <div className="grid-detail">
                {/* BEGIN :: MIDDLE */}
                <div className="middle">
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

                  {/* <!-- BEGIN :: RELATED PRODUCTS --> */}
                  <div className="related-products">
                    <div className="title1">
                      <h2> Related Products </h2>
                    </div>
                    <div className="product-wrapper grid-2">
                      <Product />
                    </div>
                  </div>
                  {/* <!-- END :: RELATED PRODUCTS --> */}
                </div>
                {/* END :: MIDDLE */}

                {/* BEGIN :: RIGHT */}
                <div className="right">
                  <MarketWidget {...this.props} />
                </div>
                {/* END :: RIGHT */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketProductPublish;

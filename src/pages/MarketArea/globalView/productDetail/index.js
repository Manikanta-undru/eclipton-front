import React from 'react';
import { Link } from 'react-router-dom';
import MarketWidget from '../../../../components/MarketWidget';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import Slider1 from '../../_widgets/slider1';
import Product from '../../_widgets/product/Index';
import Tab1 from '../../_widgets/tab1';
import ProductFilter from '../../../../components/Filter/productFilter';

require('../../_styles/market-area.scss');

class MarketProductView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.location.state,
    };
  }

  componentDidMount() {
    this.getData();
  }

  dataChange = (data = {}) => {
    this.getData(data);
  };

  getData = (data = {}) => {
    this.setState({
      gigs: [],
    });
  };

  render() {
    return (
      <div className="market-place-styles">
        <div className="feedPage">
          <div className="container-fluid container-layout-1">
            <div className="layout-type-1">
              {/* <!-- BEGIN :: LEFT --> */}
              <div className="left">
                <MarketMenu {...this.props} current="/" />
                <ProductFilter dataChange={this.dataChange} />
              </div>
              {/* <!-- END :: LEFT --> */}

              <div className="right-holder">
                <div className="breadcrumb-product-detail">
                  <ul>
                    <li>
                      {' '}
                      <Link to="/market-default-view"> Home </Link>{' '}
                    </li>
                    <li>
                      {' '}
                      <Link to={`/market-default-view/${this.state.category}`}>
                        {' '}
                        {this.state.category}{' '}
                      </Link>{' '}
                    </li>
                    <li> {this.state.title} </li>
                  </ul>
                </div>
                <div className="grid-detail">
                  {/* <!-- BEGIN :: CENTER COLUMN --> */}
                  <div className="middle content-area">
                    {/* <!-- BEGIN :: SLIDER 1 --> */}
                    <div className="slider-1">
                      <Slider1 images={this.state.attachment} />
                    </div>
                    {/* <!-- END :: SLIDER 1 --> */}

                    {/* <!-- BEGIN :: TAB 1 --> */}
                    <div className="tab-1">
                      <Tab1
                        description={this.state.description}
                        products={this.state}
                      />
                    </div>
                    {/* <!-- END :: TAB 1 --> */}

                    {/* <!-- BEGIN :: RELATED PRODUCTS --> */}
                    <div className="related-products">
                      <div className="title1">
                        <h2> Related Products </h2>
                      </div>
                      <div className="product-wrapper grid-2">
                        <Product category={this.state.category} />
                      </div>
                    </div>
                    {/* <!-- END :: RELATED PRODUCTS --> */}
                  </div>
                  {/* <!-- END :: CENTER COLUMN --> */}

                  {/* <!-- BEGIN :: RIGHT --> */}
                  <div className="right">
                    <MarketWidget products={this.state} />
                  </div>
                  {/* <!-- END :: RIGHT --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketProductView;

import React from 'react';
import { Link } from 'react-router-dom';
import MarketWidget from '../../../../components/MarketWidget';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import Slider1 from '../../_widgets/slider1';
import Product from '../../_widgets/product/Index';
import Tab1 from '../../_widgets/tab1';
import { get } from '../../../../http/product-calls';
import ProductReportModal from '../../_widgets/product/report';
import ProductFilter from '../../../../components/Filter/productFilter';

require('../../_styles/market-area.scss');

class MarketProductDetailView extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props, 'this.props');
    this.state = {
      product_id: this.props.match.params.id,
      isProductReport: false,
      products: {},
      product_size: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  dataChange = (data = {}) => {
    if (data.product_size !== undefined) {
      const { products } = this.state;
      products.product_size = data.product_size;
      this.setState({
        product_size: data.product_size,
        products,
      });
    }
    this.getData(data);
  };

  getData = (data = {}) => {
    get({ product_id: this.state.product_id }).then(
      (res) => {
        const resp = res[0];
        this.setState({ products: resp });
      },
      (err) => {}
    );
    this.setState({
      gigs: [],
    });
  };

  handleCallbackReport = (data) => {
    this.setState({
      isProductReport: data.isProductReport,
      productId: data.productId,
    });
  };

  render() {
    return (
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
                    <Link
                      to={`/market-default-view/${this.state.products.category}`}
                    >
                      {' '}
                      {this.state.products.category}{' '}
                    </Link>{' '}
                  </li>
                  <li> {this.state.products.title} </li>
                </ul>
              </div>
              <div className="grid-detail">
                {/* <!-- BEGIN :: CENTER COLUMN --> */}
                <div className="middle content-area">
                  {/* <!-- BEGIN :: SLIDER 1 --> */}
                  <div className="slider-1">
                    {this.state.products.attachment !== undefined && (
                      <Slider1 images={this.state.products.attachment} />
                    )}
                  </div>
                  {/* <!-- END :: SLIDER 1 --> */}

                  {/* <!-- BEGIN :: TAB 1 --> */}
                  <div className="tab-1">
                    {this.state.products.description !== undefined && (
                      <Tab1
                        dataChange={this.dataChange}
                        description={this.state.products.description}
                        products={this.state.products}
                      />
                    )}
                  </div>
                  {/* <!-- END :: TAB 1 --> */}

                  {/* <!-- BEGIN :: RELATED PRODUCTS --> */}
                  <div className="related-products">
                    <div className="title1">
                      <h2> Related Products </h2>
                    </div>
                    {this.state.products.category !== undefined && (
                      <div className="product-wrapper grid-2">
                        <Product category={this.state.products.category} />
                      </div>
                    )}
                  </div>
                  {/* <!-- END :: RELATED PRODUCTS --> */}
                </div>
                {/* <!-- END :: CENTER COLUMN --> */}

                {/* <!-- BEGIN :: RIGHT --> */}
                <div className="right">
                  {this.state.products.description !== undefined && (
                    <MarketWidget
                      products={this.state.products}
                      parentCallback={this.handleCallbackReport}
                      product_size={this.state.product_size}
                    />
                  )}
                </div>
                {/* <!-- END :: RIGHT --> */}
                {this.state.isProductReport && (
                  <ProductReportModal
                    parentCallback={this.handleCallbackReport}
                    isProductReport={this.state.isProductReport}
                    productId={this.state.product_id}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketProductDetailView;

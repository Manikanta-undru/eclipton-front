import React from 'react';
import SideMenu3 from '../../_widgets/sideMenu3';
import { alertBox } from '../../../../commonRedux';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import { getWishlist } from '../../../../http/product-calls';
import ProductList from '../../_widgets/product/productList';

require('../../_styles/market-area.scss');
require('./wish-list.scss');

class WishList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      total_count: 0,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    getWishlist().then(
      (resp) => {
        const product_like = resp.filter((el) => el.likes.length > 0);
        this.setState({
          products: product_like,
          total_count: product_like.length,
        });
      },
      (error) => {
        alertBox(true, error.message);
      }
    );
  }

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

                <div className="right">
                  {/* BEGIN :: RECENT ACTIVITY BOX */}
                  {this.state.products.length !== 0 && (
                    <div className="product-wrapper">
                      <ProductList products={this.state.products} />
                    </div>
                  )}
                  {this.state.products.length === 0 && (
                    <h6>Product Not Found!</h6>
                  )}
                  {/* END :: RECENT ACTIVITY BOX */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WishList;

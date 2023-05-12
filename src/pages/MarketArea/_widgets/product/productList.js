import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../../commonRedux';
import { like } from '../../../../http/product-calls';
import { getCurrentUser } from '../../../../http/token-interceptor';
import Share from './share';

const currentUser = JSON.parse(getCurrentUser());
require('./product.scss');

class ProductList extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      products: this.props.products,
    };
    this.state = {
      ...initialState,
      shareModel: false,
    };
    this.handleWish = this.handleWish.bind(this);
    this.sharePost = this.sharePost.bind(this);
  }

  componentDidMount() {
    this.state.products.map((item, i) => {
      const element = document.getElementsByClassName(item._id)[0];
      const product_like = item.likes.filter(
        (el) =>
          item._id === el.postid && currentUser && currentUser._id === el.userid
      );
      if (product_like[0]) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }

  handleWish(e, product_id) {
    e.preventDefault();
    const formData = {
      product_id,
    };
    like(formData).then(
      async (resp) => {
        if (resp.message === 'Like') {
          this.state.products.map((item, i) => {
            const element = document.getElementsByClassName(item._id)[0];
            if (item._id === product_id) {
              element.classList.add('active');
            }
          });
        } else {
          this.state.products.map((item, i) => {
            const element = document.getElementsByClassName(item._id)[0];
            if (item._id === product_id) {
              element.classList.remove('active');
            }
          });
        }
        alertBox(true, resp.message, 'success');
      },
      (error) => {
        alertBox(true, error.message);
      }
    );
  }

  handleReport(e, product_id) {
    e.preventDefault();
    this.props.parentCallback({
      productId: product_id,
      isProductReport: true,
    });
  }

  sharePost = (product) => {
    this.setState({ shareModel: true, currProduct: product });
  };

  closeShareModal = () => {
    this.setState({ shareModel: false });
  };

  render() {
    const { products } = this.state;

    return (
      <>
        {/* BEGIN :: QUESTION BOX 1 */}
        {products.length > 0 &&
          products.map((products) => (
            <div key={products._id} className="product-box">
              <Link
                to={{
                  pathname: `/market-product-detail-view/${products._id}`,
                  state: { ...products },
                }}
                key={products}
              >
                <div className="img" key={products}>
                  {products.attachment !== undefined &&
                    products.attachment !== null &&
                    Object.keys(products.attachment).length > 0 && (
                      <img
                        src={
                          products.attachment[
                            Object.keys(products.attachment)[0]
                          ].src
                        }
                        key={products}
                      />
                    )}
                </div>
              </Link>
              <div className="content" key={products}>
                <Link
                  to={{
                    pathname: `/market-product-detail-view/${products._id}`,
                    state: { ...products },
                  }}
                  key={products}
                >
                  <h2 className="product-title" key={products}>
                    {products.title}
                  </h2>
                </Link>

                <div className="price-and-share" key={products}>
                  <div className="price-box" key={products}>
                    <div className="price-details" key={products}>
                      <i className="fa fa-rupee" key={products} />{' '}
                      {(
                        products.amount -
                        (products.amount * products.discount) / 100
                      ).toFixed(2)}
                      <span className="off" key={products}>
                        {' '}
                        {products.price_currency}{' '}
                      </span>
                      <span className="off" key={products}>
                        {' '}
                        {products.discount}% OFF{' '}
                      </span>
                      <span className="strike" key={products}>
                        <i className="fa fa-rupee" key={products} />{' '}
                        {products.amount}
                      </span>
                    </div>
                  </div>

                  <div className="share-box" key={products}>
                    <span
                      className="hovertext"
                      data-hover="Report"
                      key={products}
                    >
                      <Link
                        onClick={(e) => this.handleReport(e, products._id)}
                        className="report"
                        key={products}
                      >
                        <i
                          className="fa fa-exclamation-circle"
                          key={products}
                        />
                      </Link>
                    </span>
                    <span
                      className="hovertext"
                      data-hover="Share"
                      key={products}
                    >
                      <Link
                        to={{
                          pathname: `/market-product-detail-view/${products._id}`,
                          state: { ...products },
                        }}
                        onClick={(e) => this.sharePost(products)}
                        className="btn-share"
                        key={products}
                      >
                        {' '}
                        <i className="fa fa-share-alt" key={products} />{' '}
                      </Link>
                    </span>

                    <span
                      className="hovertext"
                      data-hover="Like"
                      key={products}
                    >
                      <Link
                        onClick={(e) => this.handleWish(e, products._id)}
                        className="btn-wishlist"
                        key={products}
                      >
                        {' '}
                        <i
                          className={`fa fa-heart heartThis ${products._id}`}
                          key={products}
                        />{' '}
                      </Link>
                    </span>
                  </div>
                </div>

                <div className="location" key={products}>
                  <div className="left" key={products}>
                    {' '}
                    <i className="fa fa-map-marker" key={products} />{' '}
                    {products.state} , {products.city}
                  </div>
                  <div className="right" key={products}>
                    {' '}
                    {products.createdAt}{' '}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {products.length === 0 && <h6> Product Not Found! </h6>}
        {this.state.shareModel && (
          <Share
            product={this.state.currProduct}
            shareSuccess={this.shareSuccess}
            closeShareModal={this.closeShareModal}
          />
        )}
        {/* END :: QUESTION BOX 1 */}
      </>
    );
  }
}

export default ProductList;

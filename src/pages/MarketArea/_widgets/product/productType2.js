import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../../commonRedux';
import { like, remove, updateStatus } from '../../../../http/product-calls';
import Share from './share';

require('./product.scss');

class ProductType2 extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      products: this.props.products,
      likeActive: 0,
    };
    this.state = {
      ...initialState,
      shareModel: false,
      limitation: '',
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleWish = this.handleWish.bind(this);
    this.sharePost = this.sharePost.bind(this);
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

  handleDelete(e, product_id, status) {
    e.preventDefault();
    const formData = {
      product_id,
    };
    const con = window.confirm('Are you sure want to delete?');
    if (con == true) {
      remove(formData).then(
        async (resp) => {
          if (status === 'publish') {
            document.getElementById('tab-1').click();
          }
          if (status === 'draft') {
            document.getElementById('tab-2').click();
          }
          if (status === 'mark-as-sold') {
            document.getElementById('tab-3').click();
          }
          if (status === 'out-of-stock') {
            document.getElementById('tab-4').click();
          }
          alertBox(true, 'Product status has been updated!', 'success');
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
    /**/
  }

  handleChange = (e, product_id) => {
    e.preventDefault();
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
    const updateFormData = {
      status: val,
      product_id,
    };
    updateStatus(updateFormData).then(
      async (resp) => {
        if (resp) {
          if (val === 'publish') {
            document.getElementById('tab-1').click();
          }
          if (val === 'draft') {
            document.getElementById('tab-2').click();
          }
          if (val === 'mark-as-sold') {
            document.getElementById('tab-3').click();
          }
          if (val === 'out-of-stock') {
            document.getElementById('tab-4').click();
          }
          alertBox(true, 'Product status has been updated!', 'success');
        }
      },
      (error) => {
        alertBox(true, error.message);
      }
    );
  };

  sharePost = (product) => {
    this.setState({ shareModel: true, currProduct: product });
  };

  closeShareModal = () => {
    this.setState({ shareModel: false });
  };

  async componentDidMount() {}

  render() {
    const { products } = this.state;

    return (
      <>
        {/* BEGIN :: QUESTION BOX 1 */}
        {products.map((products) => (
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
                        products.attachment[Object.keys(products.attachment)[0]]
                          .src
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
                  <span className="hovertext" data-hover="Share" key={products}>
                    <Link
                      to={{ pathname: '/market-account-flow-regular/' }}
                      onClick={(e) => this.sharePost(products)}
                      className="btn-share"
                      key={products}
                    >
                      {' '}
                      <i className="fa fa-share-alt" key={products} />{' '}
                    </Link>
                  </span>

                  <span className="hovertext" data-hover="Like" key={products}>
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

              <div className="select-and-dropdown" key={products}>
                <div className="select-box" key={products}>
                  <select
                    name="limitation"
                    id="limitation"
                    value={
                      this.state.status ? this.state.status : products.status
                    }
                    onChange={(e) => this.handleChange(e, products._id)}
                    key={products}
                  >
                    <option value="" disabled selected key={products}>
                      Select your option
                    </option>
                    <option value="mark-as-sold" key={products}>
                      {' '}
                      Mark as Sold{' '}
                    </option>
                    <option value="out-of-stock" key={products}>
                      {' '}
                      Out Of Stock{' '}
                    </option>
                    <option value="draft" key={products}>
                      {' '}
                      Draft{' '}
                    </option>
                    <option value="publish" key={products}>
                      {' '}
                      Publish{' '}
                    </option>
                  </select>
                </div>

                <div className="dropdown-box dropdown-1" key={products}>
                  <button key={products}>
                    {' '}
                    <i className="fa fa-ellipsis-v" key={products} />{' '}
                  </button>
                  <ul className="bg-lite" key={products}>
                    <li key={products}>
                      <Link
                        to={{
                          pathname: `/market-product-detail-view/${products._id}`,
                          state: { ...products },
                        }}
                        key={products}
                      >
                        View Listing
                      </Link>
                    </li>
                    <li key={products}>
                      {' '}
                      <Link
                        to={{
                          pathname: '/market-product-overview',
                          state: products._id,
                        }}
                        key={products}
                      >
                        {' '}
                        Edit Listing{' '}
                      </Link>{' '}
                    </li>
                    <li key={products}>
                      {' '}
                      <Link
                        onClick={(e) =>
                          this.handleDelete(e, products._id, products.status)
                        }
                        className="delete"
                        key={products}
                      >
                        {' '}
                        Delete{' '}
                      </Link>{' '}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
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

export default ProductType2;

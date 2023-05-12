import React from 'react';
import { Link } from 'react-router-dom';
import returnIcon from '../../assets/images/icons/return.png';
import { alertBox } from '../../commonRedux';
import { getUser, like } from '../../http/product-calls';
import {
  createCart,
  getCarts,
  getCurrencyConverter,
} from '../../http/product-cart-calls';
import { getCurrentUser } from '../../http/token-interceptor';
import { history } from '../../store';
import CartModal from '../../pages/MarketArea/checkOut/cart/cartModal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './style.scss';
import Share from '../../pages/MarketArea/_widgets/product/share';
import {
  MarketPlaceProductStatusKey,
  MarketPlaceProductStatusValue,
} from '../../constants/Constant';

let currentUser = JSON.parse(getCurrentUser());
var cart = JSON.parse(window.localStorage.getItem('cartItem'));
class MarketWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currenctUserID: currentUser._id,
      products:
        this.props.location && this.props.location.state
          ? this.props.location.state
          : this.props.products,
      likeActive: 0,
      isCheckOutModel: false,
      userinfo: {},
      convertAmount:
        this.props.location && this.props.location.state
          ? this.props.location.state.amount -
            this.props.location.state.amount *
              (this.props.location.state.discount / 100)
          : this.props.products.amount -
            this.props.products.amount * (this.props.products.discount / 100),
      currentDiscount:
        this.props.location && this.props.location.state
          ? this.props.location.state.discount
          : this.props.products.discount,
      currentAmount:
        this.props.location && this.props.location.state
          ? this.props.location.state.amount -
            this.props.location.state.amount *
              (this.props.location.state.discount / 100)
          : this.props.products.amount -
            this.props.products.amount * (this.props.products.discount / 100),
      currentCurrency:
        this.props.location && this.props.location.state
          ? this.props.location.state.price_currency
          : this.props.products.price_currency,
      cart: cart && cart.length > 0 ? cart : [],
      shareModel: false,
      stock: this.props.products ? this.props.products.stock : this.props.stock,
      productStatus: this.props.products
        ? this.props.products.stock == 0
          ? 'mark-as-sold'
          : this.props.products.status
        : this.props.stock
        ? 'mark-as-sold'
        : this.props.products.status,

      product_size: [],
    };
    console.log(this.state.products, 'prodcuts');
    this.handleWish = this.handleWish.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.isActive = this.isActive.bind(this);
    this.handleCallbackModal = this.handleCallbackModal.bind(this);
    this.sharePost = this.sharePost.bind(this);
  }

  isActive(product_id, likes) {
    if (likes !== undefined) {
      var product_like = likes.filter(function (el) {
        return (
          product_id === el.postid &&
          currentUser &&
          currentUser._id === el.userid
        );
      });
      if (product_like[0]) {
        return 'active';
      } else {
        return '';
      }
    }
  }

  getProductStatus(status) {
    switch (status) {
      case MarketPlaceProductStatusKey.STATUS_PUBLISH:
        return MarketPlaceProductStatusValue.VALUE_PUBLISH;
      case MarketPlaceProductStatusKey.STATUS_MARK_AS_SOLD:
        return MarketPlaceProductStatusValue.VALUE_MARK_AS_SOLD;
      case MarketPlaceProductStatusKey.STATUS_OUT_OF_STOCK:
        return MarketPlaceProductStatusValue.VALUE_OUT_OF_STOCK;
    }
  }

  componentDidMount() {
    if (currentUser) {
      this.getCartsData();
    }
    getUser({ userid: this.state.products.userid }).then(
      async (resp) => {
        this.setState({
          userinfo: resp,
        });
      },
      (error) => {}
    );
  }

  getCartsData() {
    getCarts({
      //product_id: this.state.products._id
    }).then(
      async (resp) => {
        resp.map((data) => {
          data.quantity = data.product_carts.quantity;
          data.cart_id = data.product_carts._id;
          data.cart_created_at = data.product_carts.createdAt;
          data.price = data.product_carts.price;
          data.currency = data.product_carts.currency;
          data.discount = data.product_carts.discount;
        });
        let cart = JSON.parse(window.localStorage.getItem('cartItem'));
        if (cart === null || cart.length === 0) {
          window.localStorage.setItem('cartItem', JSON.stringify(resp));
        }
      },
      (error) => {}
    );
  }

  handleClick = (event) => {
    const { value } = event.target;
    const temp = this.state.product_size;
    temp.push(value);
    this.setState({
      product_size: temp,
    });
  };

  handleWish(e, product_id) {
    e.preventDefault();
    const formData = {
      product_id: product_id,
    };
    like(formData).then(
      async (resp) => {
        if (resp.message === 'Like') {
          const element = document.getElementsByClassName(
            this.state.products._id
          )[0];
          if (this.state.products._id === product_id) {
            element.classList.add('active');
          }
        } else {
          const element = document.getElementsByClassName(
            this.state.products._id
          )[0];
          if (this.state.products._id === product_id) {
            element.classList.remove('active');
          }
        }
        alertBox(true, resp.message, 'success');
      },
      (error) => {
        alertBox(true, error.message);
      }
    );
  }

  itemInCart(product_id) {
    let cart = JSON.parse(window.localStorage.getItem('cartItem'));
    if (cart == null) {
      this.getCartsData();
    } else {
      const cartItem = cart.filter(function (item) {
        return item._id === product_id;
      });
      if (cartItem[0]) {
        return 'is_found';
      } else {
        return 'not_found';
      }
    }
  }

  handleCallbackModal(data) {
    this.setState({
      cart: data.cart,
      isCheckOutModel: data.isCheckOutModel,
    });
  }

  getUnique(array) {
    var uniqueArray = [];
    var i;
    // Loop through array values
    for (i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }

  handleBuyNow(e, products) {
    e.preventDefault();
    let hashsize = '';
    if (this.itemInCart(this.state.products._id) === 'not_found') {
      products.quantity = 1;
      let cart = JSON.parse(window.localStorage.getItem('cartItem'));
      cart = cart && cart.length > 0 ? cart : [];

      if (this.state.product_size.length > 0) {
        var uniqueSizes = this.getUnique(this.state.product_size);
        hashsize = uniqueSizes.join(',');
        createCart({
          product_id: products._id,
          quantity: 1,
          size: hashsize,
          currentAmount: this.state.currentAmount,
          currentCurrency: this.state.currentCurrency,
          currentDiscount: this.state.currentDiscount,
          convertAmount: this.state.currentAmount,
        }).then(
          async (resp) => {
            products.cart_id = resp._id;
            products.cart_created_at = resp.createdAt;
            products.price = this.state.currentAmount;
            products.currency = this.state.currentCurrency;
            products.discount = this.state.currentDiscount;

            console.log('addToCart before', cart);
            cart.push(products);
            console.log('addToCart after', cart);

            window.localStorage.setItem('cartItem', JSON.stringify(cart));
            this.setState({
              cart: cart,
              isCheckOutModel: true,
            });
            alertBox(true, 'Product added to cart Buy now!', 'success');
          },
          (error) => {
            alertBox(true, error.message);
          }
        );
      } else {
        hashsize = '';
        alertBox(true, 'Kindly choose one product size');
      }
    } else if (this.itemInCart(this.state.products._id) === 'is_found') {
      this.setState({
        isCheckOutModel: true,
      });
    }
  }

  handleBuyCrypto(value, products) {
    let hashsize = '';
    getCurrencyConverter({
      fiat: this.state.currentCurrency,
      crypto: value,
    }).then(async (resp) => {
      this.setState({
        convertAmount: resp.data * this.state.currentAmount,
      });
      if (this.itemInCart(this.state.products._id) === 'not_found') {
        products.quantity = 1;
        let cart = JSON.parse(window.localStorage.getItem('cartItem'));
        cart = cart && cart.length > 0 ? cart : [];

        if (this.state.product_size.length > 0) {
          var uniqueSizes = this.getUnique(this.state.product_size);
          hashsize = uniqueSizes.join(',');
          createCart({
            product_id: products._id,
            quantity: 1,
            size: hashsize,
            currentAmount: this.state.currentAmount,
            currentCurrency: value,
            convertAmount: this.state.convertAmount,
            currentDiscount: this.state.currentDiscount,
          }).then(
            async (resp) => {
              products.cart_id = resp._id;
              products.cart_created_at = resp.createdAt;
              products.price = this.state.convertAmount;
              products.currency = value;
              products.discount = this.state.currentDiscount;

              console.log('addToCart before', cart);
              cart.push(products);
              console.log('addToCart after', cart);

              window.localStorage.setItem('cartItem', JSON.stringify(cart));
              this.setState({
                cart: cart,
                isCheckOutModel: true,
              });
              alertBox(true, 'Product added to cart Buy now!', 'success');
            },
            (error) => {
              alertBox(true, error.message);
            }
          );
        } else {
          hashsize = '';
          alertBox(true, 'Kindly choose one product size');
        }
      } else if (this.itemInCart(this.state.products._id) === 'is_found') {
        this.setState({
          isCheckOutModel: true,
        });
      }
    });
  }

  handleChange(e) {
    const data = e.target.value.split('-');
    const total_price = (parseInt(data[0]) * (parseInt(data[2]) / 100)).toFixed(
      2
    );
    this.setState({
      currentAmount: total_price,
      currentCurrency: data[1],
      currentDiscount: data[2],
    });
  }

  addToCart(e, products) {
    e.preventDefault();
    let hashsize = '';
    products.quantity = 1;
    let cart = JSON.parse(window.localStorage.getItem('cartItem'));
    cart = cart && cart.length > 0 ? cart : [];

    if (this.state.product_size.length > 0) {
      var uniqueSizes = this.getUnique(this.state.product_size);
      hashsize = uniqueSizes.join(',');
      createCart({
        product_id: products._id,
        quantity: 1,
        size: hashsize,
        currentAmount: this.state.currentAmount,
        currentCurrency: this.state.currentCurrency,
        currentDiscount: this.state.currentDiscount,
        convertAmount: this.state.currentAmount,
      }).then(
        async (resp) => {
          products.cart_id = resp._id;
          products.cart_created_at = resp.createdAt;
          products.price = this.state.currentAmount;
          products.currency = this.state.currentCurrency;
          products.discount = this.state.currentDiscount;

          console.log('addToCart before', cart);
          cart.push(products);
          console.log('addToCart after', cart);

          window.localStorage.setItem('cartItem', JSON.stringify(cart));
          this.setState({
            cart: cart,
          });
          history.push({
            pathname: '/market-my-cart',
            cart: cart,
          });

          alertBox(true, 'Product added to cart', 'success');
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    } else {
      hashsize = '';
      alertBox(true, 'Kindly choose one product size');
    }
  }

  handleReport(e, product_id) {
    e.preventDefault();
    this.props.parentCallback({
      productId: product_id,
      isProductReport: true,
    });
  }

  handleCopy(e) {
    e.preventDefault();
    const el = document.createElement('input');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alertBox(true, 'URL has been successfully copied!', 'success');
  }

  sharePost = (product) => {
    this.setState({ shareModel: true, currProduct: product });
  };

  closeShareModal = () => {
    this.setState({ shareModel: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className="widget-1 market-widget-1">
          <div className="price-and-share">
            <div className="price-box">
              <div className="price-details">
                <span className="off">
                  {' '}
                  {this.state.products.price_currency}{' '}
                </span>
                <span className="off">
                  {' '}
                  {this.state.products.discount}% OFF{' '}
                </span>
                <span className="strike">
                  <i className="fa fa-rupee"></i> {this.state.products.amount}
                </span>
                {this.state.products.amount -
                  (this.state.products.amount * this.state.products.discount) /
                    100}
              </div>
              <h5 className="title-2"> Size </h5>
              <ul className="style-1">
                {this.state.products.size.map((data, key) => {
                  return (
                    <li onChange={this.handleClick} key={key}>
                      <input
                        required
                        type="checkbox"
                        value={data}
                        name="product_size"
                      />
                      <spam>{data} </spam>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="share-box">
              <span className="hovertext" data-hover="Copy link">
                <Link onClick={(e) => this.handleCopy(e)}>
                  <i className="fa fa-copy"></i>
                </Link>
              </span>
              <span className="hovertext" data-hover="Report">
                <Link
                  onClick={(e) => this.handleReport(e, this.state.products._id)}
                  className="report"
                >
                  <i className="fa fa-exclamation-circle"></i>
                </Link>
              </span>

              <span className="hovertext" data-hover="Share">
                <Link
                  to={{
                    pathname:
                      '/market-product-detail-view/' + this.state.products._id,
                    state: { ...this.state.products },
                  }}
                  onClick={(e) => this.sharePost(this.state.products)}
                  className="btn-share"
                >
                  {' '}
                  <i className="fa fa-share-alt"></i>{' '}
                </Link>
              </span>

              <span className="hovertext" data-hover="Like">
                <Link
                  onClick={(e) => this.handleWish(e, this.state.products._id)}
                  className="btn-wishlist"
                >
                  {' '}
                  <i
                    className={
                      'fa fa-heart heartThis ' +
                      this.state.products._id +
                      this.isActive(
                        this.state.products._id,
                        this.state.products.likes
                      )
                    }
                  ></i>{' '}
                </Link>
              </span>
            </div>
          </div>

          <h2 className="product-title">
            {' '}
            {this.state.products ? this.state.products.title : ''}{' '}
          </h2>

          {currentUser ? (
            this.state.products.userid != this.state.currenctUserID ? (
              this.state.productStatus == 'publish' ? (
                <div className="grid-2 btns">
                  <DropdownButton
                    key="Primary"
                    id="dropdown-variants-Primary"
                    variant="primary"
                    title="Buy Now"
                  >
                    {this.state.products.availableCurrency.map((data, i) => {
                      return (
                        <>
                          <Dropdown.Item
                            event
                            onClick={(e) =>
                              this.handleBuyCrypto(
                                data.label,
                                this.state.products
                              )
                            }
                            key={i}
                          >
                            Buy With {data.label}
                          </Dropdown.Item>
                        </>
                      );
                    })}
                    <Dropdown.Item
                      eventKey="0"
                      active
                      onClick={(e) => this.handleBuyNow(e, this.state.products)}
                    >
                      Buy Now
                    </Dropdown.Item>
                  </DropdownButton>

                  {this.state.isCheckOutModel && (
                    <CartModal
                      parentCallback={this.handleCallbackModal}
                      isCheckOutModel={this.state.isCheckOutModel}
                      cart={this.state.cart}
                    />
                  )}
                  {this.itemInCart(this.state.products._id) === 'not_found' && (
                    <Link
                      onClick={(e) => this.addToCart(e, this.state.products)}
                      className="button primary-outline big undefined"
                    >
                      {' '}
                      Add to Cart{' '}
                    </Link>
                  )}
                  {this.itemInCart(this.state.products._id) === 'is_found' && (
                    <Link
                      to={{
                        pathname: '/market-my-cart',
                        cart: this.state.cart,
                      }}
                      className="button primary-outline big undefined"
                    >
                      {' '}
                      Go to Cart{' '}
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid-2 btns danger">
                  {this.getProductStatus(this.state.productStatus)}
                </div>
              )
            ) : (
              <div className="grid-2 btns"> </div>
            )
          ) : (
            <div className="grid-2 btns">
              <DropdownButton
                key="Primary"
                id="dropdown-variants-Primary"
                variant="primary"
                title="Buy Now"
              >
                {this.state.products.availableCurrency.map((data, i) => {
                  return (
                    <>
                      <Dropdown.Item
                        event
                        onClick={(e) =>
                          this.handleBuyCrypto(data.value, this.state.products)
                        }
                        key={i}
                      >
                        Buy With {data.label}
                      </Dropdown.Item>
                    </>
                  );
                })}
                <Dropdown.Item
                  eventKey="0"
                  active
                  onClick={(e) => this.handleBuyNow(e, this.state.products)}
                >
                  Buy Now
                </Dropdown.Item>
              </DropdownButton>
              <Link
                onClick={(e) => this.addToCart(e, this.state.products)}
                className="button primary-outline big undefined"
              >
                {' '}
                Add to Cart{' '}
              </Link>
            </div>
          )}
        </div>
        <div className="widget-1 market-widget-2 seller-description">
          <p className="tiny"> Seller Description </p>

          <Link to={'/u/' + this.state.userinfo._id} className="user-box">
            <div className="user-img"></div>
            <div className="user-info">
              <h3> {this.state.userinfo.name} </h3>
              {/* <p> <i className="fa fa-phone"></i> {this.state.userinfo.phone} </p> */}

              {/* <span> <i className="fa fa-angle-right"></i> </span> */}
            </div>
          </Link>

          {/* <div className="grid-2">
            <div className="left">
              <p className="tiny"> Positive Seller Rating </p>
              <p className="big"> 83% </p>
            </div>

            <div className="right">
              <p className="tiny"> Ship on Time </p>
              <p className="big"> 99% </p>
            </div>
          </div> */}

          {this.state.products.userid != this.state.currenctUserID && (
            <div className="chat">
              <Link
                to={{
                  pathname: '/market-chat-with-seller-2',
                  state: {
                    products: this.state.products,
                    isLoadedFrom: 'product',
                  },
                }}
                className="button primary-outline big undefined"
              >
                {' '}
                Chat with Seller{' '}
              </Link>
            </div>
          )}
        </div>
        <div className="widget-1 market-widget-2 return-and-warranty">
          <p className="tiny"> Return & Warranty </p>
          {this.state.products.returns.length > 0 &&
            this.state.products.returns.map((data, i) => {
              return (
                <div className="return-box" key={i}>
                  {data && (
                    <span className="icon">
                      {' '}
                      <img src={returnIcon} />{' '}
                    </span>
                  )}
                  {data && (
                    <div className="text">
                      <p>{data ? data.title : ''}</p>
                      <p className="lead">
                        {' '}
                        {data ? data.no_of_days : ''} days returns{' '}
                      </p>
                      <p className="tiny"> {data ? data.description : ''} </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        {this.state.shareModel && (
          <Share
            product={this.state.currProduct}
            shareSuccess={this.shareSuccess}
            closeShareModal={this.closeShareModal}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MarketWidget;

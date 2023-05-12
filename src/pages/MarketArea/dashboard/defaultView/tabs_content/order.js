import moment from 'moment';
import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';

import '../styles.scss';

require('../../../_styles/market-area.scss');
require('../../dashboard.scss');

class OrderContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: this.props.orders,
    };
  }

  getProductTitle(cart_items) {
    const title = [];
    cart_items.forEach((data) => {
      title.push(data.title);
      // <Link to={'/market-product-detail-view/' + data._id}>{data.title}</Link>)
    });
    return title.join(' ,');
  }

  getProductPrice(element) {
    const price = [];
    element.cart_items.forEach((data) => {
      price.push(data.product_carts.price * data.product_carts.quantity);
      // <Link to={'/market-product-detail-view/' + data._id}>{data.title}</Link>)
    });
    return price.join(' ,');
  }

  getProductCurrency(element) {
    const currency = [];
    element.cart_items.forEach((data) => {
      currency.push(data.product_carts.currency);
      // <Link to={'/market-product-detail-view/' + data._id}>{data.title}</Link>)
    });
    return currency.join(' ,');
  }

  render() {
    const user = this.props.currentUser;
    return (
      <table className="table mt-1">
        <thead className="thead-light">
          <tr>
            <th scope="col">Order Id</th>
            <th scope="col">Customer Email</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Customer Phone</th>
            <th scope="col">Product Title</th>
            <th scope="col">Currency</th>
            <th scope="col">Price</th>
            <th scope="col">Created Date</th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {this.props.orders !== undefined && this.props.orders.length > 0 ? (
            this.props.orders.map((element, key) => (
              <tr className="statusRow" key={key}>
                <td>{element.orderid}</td>
                <td>{element.email}</td>
                <td>
                  {element.firstname} {element.lastname}
                </td>
                <td>{element.phone_number}</td>
                <td>{this.getProductTitle(element.cart_items)}</td>
                <td>{this.getProductCurrency(element)}</td>
                <td>{this.getProductPrice(element)}</td>
                <td> {moment(element.createdAt).format('MMM DD, YYYY')} </td>
                <td>
                  {/* <div className="dropdown">
              <i className="fa fa-ellipsis-v" aria-hidden="true" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false"></i>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item redTxt" href="#">Delete</a>
              </div>
            </div>  */}
                </td>
              </tr>
            ))
          ) : (
            <p>No results found!</p>
          )}
        </tbody>
      </table>
    );
  }
}
export default OrderContent;

import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../../commonRedux';
import {
  removeCheckout,
  updateCheckoutStatus,
} from '../../../../http/product-checkout-calls';

require('./order.scss');
require('./purchase.scss');

class PurchasedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: this.props.orders,
      isProductReport: true,
    };
  }

  handleStatus(e, checkout_id, type, date, item) {
    e.preventDefault();
    const today = new Date();
    const delivery_date = new Date(date);
    const time_diff = delivery_date.getTime() - today.getTime();
    const days_diff = time_diff / (1000 * 3600 * 24);
    const no_of_cancel_days = item.returns[0].no_of_cancel_days
      ? item.returns[0].no_of_cancel_days
      : 2;
    let confirm_message = 'Are you sure want to delete?';
    if (type === 'cancel') {
      confirm_message = 'Are you sure want to cancel?';
    }
    if (
      delivery_date.getTime() > today.getTime() &&
      parseInt(days_diff) > parseInt(no_of_cancel_days) &&
      type === 'cancel'
    ) {
      const con = window.confirm(confirm_message);
      if (con == true) {
        updateCheckoutStatus({
          checkout_id,
          full_fillment_status: 3,
          item,
        }).then(
          async (resp) => {
            document.getElementById('tab-2').click();
            alertBox(true, 'Updated Status Successfully', 'success');
          },
          (err) => {}
        );
      }
    } else {
      alertBox(true, "You can't perform this action");
    }
    if (
      ((delivery_date.getTime() > today.getTime() &&
        parseInt(days_diff) > parseInt(no_of_cancel_days)) ||
        parseInt(days_diff) < 0) &&
      type === 'delete'
    ) {
      const con = window.confirm(confirm_message);
      if (con == true) {
        removeCheckout({
          checkout_id,
        }).then(
          async (resp) => {
            document.getElementById('tab-2').click();
            alertBox(true, 'Removed the Order Successfully', 'success');
          },
          (err) => {}
        );
      }
    } else {
      alertBox(true, "You can't perform this action");
    }
  }

  getProductCurrency(element, id) {
    const product = element.cart_items.filter((el) => id === el._id);
    if (product[0]) {
      return product[0].product_carts.currency;
    }
  }

  getProductPrice(element, id) {
    if (element.cart_items !== null && element.cart_items.length > 0) {
      const product = element.cart_items.filter((el) => id === el._id);
      if (product[0]) {
        return product[0].product_carts.price;
      }
    }
  }

  getOrderStatus(data) {
    if (data.full_fillment_status && data.full_fillment_status === 2) {
      return 'Fullfilled';
    }
    if (data.full_fillment_status && data.full_fillment_status === 1) {
      return 'Partially Fullfilled';
    }
    if (data.full_fillment_status && data.full_fillment_status === 3) {
      return 'Canceled';
    }
  }

  handleReport(e, product_id) {
    e.preventDefault();
    this.props.parentCallback({
      product_id,
      isProductReport: true,
    });
  }

  render() {
    return (
      <table className="table-1 purchase_table">
        <thead className="">
          <th>#</th>
          <th> Product title</th>
          <th> Price </th>
          <th> Currency </th>
          <th> Status </th>
          <th> Purchased Date </th>
          <th> Delivery Date </th>
          <th />
        </thead>
        <tbody>
          {this.state.orders !== undefined &&
            this.state.orders.length > 0 &&
            this.state.orders.map(
              (data, i) =>
                data.cart_items !== null &&
                data.cart_items.length > 0 &&
                data.cart_items.map((item, key) => (
                  <tr key={i}>
                    <td />
                    <td data-xs="Product title">
                      <Link to={`/market-product-detail-view/${item._id}`}>
                        {item.title}
                      </Link>
                    </td>
                    <td data-xs="Price">
                      {this.getProductPrice(data, item._id)}
                    </td>
                    <td>{this.getProductCurrency(data, item._id)}</td>
                    <td>{this.getOrderStatus(data)}</td>
                    <td data-xs="Purchased Date">
                      {' '}
                      {moment(new Date(data.createdAt)).format(
                        'MMM DD, YYYY'
                      )}{' '}
                    </td>
                    <td data-xs="Delivery Date">
                      {moment(new Date(data.createdAt))
                        .add(item.returns[0].no_of_days, 'days')
                        .format('MMM DD, YYYY')}
                    </td>
                    <td>
                      <div className="dropdown-box dropdown-1">
                        <button>
                          {' '}
                          <i className="fa fa-ellipsis-v" />{' '}
                        </button>
                        <ul className="bg-lite">
                          <li>
                            <Link
                              onClick={(e) => this.handleReport(e, item._id)}
                              className="report"
                            >
                              <i className="fa fa-exclamation-circle" /> Report
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/market-my-orders"
                              onClick={(e) =>
                                this.handleStatus(
                                  e,
                                  data._id,
                                  'cancel',
                                  moment(new Date(data.createdAt))
                                    .add(item.returns[0].no_of_days, 'days')
                                    .format('MMM DD, YYYY'),
                                  item
                                )
                              }
                              className="cancel"
                            >
                              {' '}
                              Cancel{' '}
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/market-my-orders"
                              onClick={(e) =>
                                this.handleStatus(
                                  e,
                                  data._id,
                                  'delete',
                                  moment(new Date(data.createdAt))
                                    .add(item.returns[0].no_of_days, 'days')
                                    .format('MMM DD, YYYY'),
                                  item
                                )
                              }
                              className="delete"
                            >
                              {' '}
                              Delete{' '}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
            )}
        </tbody>
      </table>
    );
  }
}

export default PurchasedList;

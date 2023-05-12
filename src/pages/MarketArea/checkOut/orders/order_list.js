import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../../commonRedux';
import Button from '../../../../components/Button';
import {
  removeCheckout,
  updateCheckoutStatus,
} from '../../../../http/product-checkout-calls';
import { getCurrentUser } from '../../../../http/token-interceptor';

require('./order.scss');

const currentUser = JSON.parse(getCurrentUser());

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: this.props.orders,
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
            document.getElementById('tab-1').click();
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
            document.getElementById('tab-1').click();
            alertBox(true, 'Removed the Order Successfully', 'success');
          },
          (err) => {}
        );
      }
    } else {
      alertBox(true, "You can't perform this action");
    }

    if (type === 'partially_fullfillment' || type === 'fullfillment') {
      let full_fillment_status = 2;
      if (type === 'partially_fullfillment') {
        full_fillment_status = 1;
      }
      updateCheckoutStatus({
        checkout_id,
        full_fillment_status,
      }).then(
        async (resp) => {
          document.getElementById('tab-1').click();
          alertBox(true, 'Updated Status Successfully', 'success');
        },
        (err) => {}
      );
    }
  }

  getProductCurrency(element) {
    const currency = [];
    element.cart_items.forEach((data) => {
      if (data.userid === currentUser._id) {
        currency.push(data.product_carts.currency);
      }
    });
    return currency.join(' ,');
  }

  getProductPrice(element) {
    const price = [];
    element.cart_items.forEach((data) => {
      if (data.userid === currentUser._id) {
        price.push(data.product_carts.price);
      }
    });
    return price.join(' ,');
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

  render() {
    return (
      <table className="table-1">
        <thead className="">
          <th>OrderId</th>
          <th> Customer info </th>
          <th> Price </th>
          <th> Currency </th>
          <th> Fullfillment Status</th>
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
                    <td data-xs="OrderId">
                      <Link
                        to={{
                          pathname: '/market-checkout-success',
                          state: {
                            checkout_id: data._id,
                            from: 'order_list',
                          },
                        }}
                      >
                        {data.orderid}
                      </Link>
                    </td>
                    <td data-xs="Customer info">
                      Email: {data.email} <br />
                      Name: {`${data.firstname} ${data.lastname}`} <br />
                      Date: {moment(data.createdAt).format('MMM DD, YYYY')}
                    </td>
                    <td data-xs="Price">{this.getProductPrice(data)}</td>
                    <td>{this.getProductCurrency(data)}</td>
                    <td data-xs="Status">
                      {this.getOrderStatus(data)}
                      {data.full_fillment_status !== 3 &&
                        (data.full_fillment_status &&
                        data.full_fillment_status === 2 ? (
                          <Button
                            className="btn-1 btn-block"
                            variant="primary"
                            onClick={(e) =>
                              this.handleStatus(
                                e,
                                data._id,
                                'partially_fullfillment'
                              )
                            }
                          >
                            Partially Fullfilled
                          </Button>
                        ) : (
                          <Button
                            className="btn-1 btn-block"
                            variant="primary"
                            onClick={(e) =>
                              this.handleStatus(e, data._id, 'fullfillment')
                            }
                          >
                            Fullfilled
                          </Button>
                        ))}
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

export default OrderList;

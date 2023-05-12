import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../commonRedux';
import { history } from '../../../store';
import { getAllDiscount, removeDiscount } from '../../../http/promotion-calls';

require('./discounts.scss');

class DiscountList extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      discounts: this.props.discounts,
      status: this.props.status,
      likeActive: 0,
    };
    this.state = {
      ...initialState,
      limitation: '',
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleEdit(e, discount_id) {
    e.preventDefault();
    history.push({
      pathname: '/market-discount-add',
      state: { discount_id },
    });
  }

  handleDelete(e, discount_id) {
    e.preventDefault();
    const formData = {
      discount_id,
    };
    const con = window.confirm('Are you sure want to delete?');
    if (con == true) {
      removeDiscount(formData).then(
        async (resp) => {
          this.props.parentCallback({
            status: 'success',
          });
          getAllDiscount().then(
            async (resp) => {
              this.setState({ discounts: resp });
            },
            (error) => {}
          );
          alertBox(true, 'Discount has been deleted!', 'success');
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  }

  render() {
    const { discounts } = this.state;

    return (
      <>
        {/* BEGIN :: QUESTION BOX 1 */}
        <table className="table-1">
          <thead className="">
            <tr role="row" className="">
              <th>Code </th>
              <th> Date </th>
              <th> Type </th>
              <th> Price </th>
              <th />
            </tr>
          </thead>
          {discounts &&
            discounts.length > 0 &&
            discounts.map((discounts, i) => (
              <tbody key={i}>
                <tr>
                  <td data-xs="Code">{discounts.code}</td>
                  <td data-xs="Date">
                    {moment(discounts.start_date).format('MMM DD, YYYY')} -{' '}
                    {moment(discounts.end_date).format('MMM DD, YYYY')} |{' '}
                    {discounts.start_time} - {discounts.end_time}
                  </td>
                  <td data-xs="Type"> {discounts.type} </td>
                  <td data-xs="Price">
                    {' '}
                    {discounts.price} | {discounts.currency}{' '}
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
                            to="/market-discount-add"
                            onClick={(e) => this.handleEdit(e, discounts._id)}
                            className="edit"
                          >
                            {' '}
                            Edit{' '}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/market-discount-add"
                            onClick={(e) => this.handleDelete(e, discounts._id)}
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
              </tbody>
            ))}
        </table>
        {/* END :: QUESTION BOX 1 */}
      </>
    );
  }
}

export default DiscountList;

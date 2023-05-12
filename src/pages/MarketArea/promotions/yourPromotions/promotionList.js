import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../../commonRedux';
import { promotionUpdateStatus } from '../../../../http/promotion-calls';
import { history } from '../../../../store';

require('./your-promotions.scss');

class PromotionList extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      promotions: this.props.promotions,
      status: this.props.status,
      likeActive: 0,
    };
    this.state = {
      ...initialState,
      limitation: '',
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleEdit(e, promotion_id) {
    e.preventDefault();
    history.push({
      pathname: '/market-promotion-overview',
      state: { promotion_id },
    });
  }

  handleDelete(e, promotion_id) {
    e.preventDefault();
    const formData = {
      promotion_id,
      status: 'delete',
    };
    let tab_status;
    if (this.state.status === 'Active') {
      tab_status = 'active';
    }
    if (this.state.status === 'All') {
      tab_status = 'all';
    }
    if (this.state.status === 'Draft') {
      tab_status = 'draft';
    }
    if (this.state.status === 'In Active') {
      tab_status = 'in_active';
    }
    const con = window.confirm('Are you sure want to delete?');
    if (con == true) {
      promotionUpdateStatus(formData).then(
        async (resp) => {
          if (tab_status === 'all') {
            document.getElementById('tab-1').click();
          }
          if (tab_status === 'active') {
            document.getElementById('tab-2').click();
          }
          if (tab_status === 'draft') {
            document.getElementById('tab-3').click();
          }
          if (tab_status === 'in_active') {
            document.getElementById('tab-4').click();
          }
          alertBox(true, 'Promotion status has been updated!', 'success');
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  }

  handleChange = (e, promotion_id, status) => {
    e.preventDefault();
    const updateFormData = {
      status,
      promotion_id,
    };
    promotionUpdateStatus(updateFormData).then(
      async (resp) => {
        if (resp) {
          if (status === 'active') {
            document.getElementById('tab-2').click();
          }
          if (status === 'draft') {
            document.getElementById('tab-3').click();
          }
          if (status === 'in_active') {
            document.getElementById('tab-4').click();
          }
          alertBox(true, 'Promotion status has been updated!', 'success');
        }
      },
      (error) => {
        alertBox(true, error.message);
      }
    );
  };

  render() {
    const { promotions } = this.state;

    return (
      <>
        {/* BEGIN :: QUESTION BOX 1 */}
        <table className="table-1">
          <thead className="">
            <tr role="row" className="">
              <th> Image </th>
              <th> Code </th>
              <th> Price </th>
              <th> Status </th>
              <th />
            </tr>
          </thead>
          {promotions.map((promotions, i) => (
            <tbody key={i}>
              <tr>
                <td data-xs="Image">
                  {promotions.attachment !== undefined &&
                    promotions.attachment !== null &&
                    Object.keys(promotions.attachment).length > 0 && (
                      <img
                        src={
                          promotions.attachment[
                            Object.keys(promotions.attachment)[0]
                          ].src
                        }
                      />
                    )}
                </td>
                <td data-xs="Title">
                  {promotions.code}
                  <p>
                    {' '}
                    {moment(promotions.start_date).format(
                      'MMM DD, YYYY'
                    )} - {moment(promotions.end_date).format('MMM DD, YYYY')} |{' '}
                    {promotions.start_time} - {promotions.end_time}{' '}
                  </p>
                </td>
                <td data-xs="Price">
                  {' '}
                  {promotions.price} | {promotions.currency}{' '}
                </td>
                <td data-xs="Promotion"> {promotions.status} </td>
                <td>
                  <div className="dropdown-box dropdown-1">
                    <button>
                      {' '}
                      <i className="fa fa-ellipsis-v" />{' '}
                    </button>
                    <ul className="bg-lite">
                      <li>
                        <Link
                          to="/market-your-promotions"
                          onClick={(e) => this.handleEdit(e, promotions._id)}
                          className="edit"
                        >
                          {' '}
                          Edit{' '}
                        </Link>
                      </li>
                      {this.state.status === 'All' && (
                        <li>
                          <Link
                            to="/market-your-promotions"
                            onClick={(e) =>
                              this.handleChange(e, promotions._id, 'active')
                            }
                          >
                            {' '}
                            Active Promotion{' '}
                          </Link>
                          <Link
                            to="/market-your-promotions"
                            onClick={(e) =>
                              this.handleChange(e, promotions._id, 'in_active')
                            }
                          >
                            {' '}
                            In Active Promotion{' '}
                          </Link>
                        </li>
                      )}
                      {this.state.status === 'Active' && (
                        <li>
                          <Link
                            to="/market-your-promotions"
                            onClick={(e) =>
                              this.handleChange(e, promotions._id, 'in_active')
                            }
                          >
                            {' '}
                            In Active Promotion{' '}
                          </Link>
                        </li>
                      )}
                      {this.state.status === 'Draft' && (
                        <li>
                          <Link
                            to="/market-your-promotions"
                            onClick={(e) =>
                              this.handleChange(e, promotions._id, 'active')
                            }
                          >
                            {' '}
                            Active Promotion{' '}
                          </Link>
                          <Link
                            to="/market-your-promotions"
                            onClick={(e) =>
                              this.handleChange(e, promotions._id, 'in_active')
                            }
                          >
                            {' '}
                            In Active Promotion{' '}
                          </Link>
                        </li>
                      )}
                      {this.state.status === 'In Active' && (
                        <li>
                          <Link
                            to="/market-your-promotions"
                            onClick={(e) =>
                              this.handleChange(e, promotions._id, 'active')
                            }
                          >
                            {' '}
                            Active Promotion{' '}
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/market-your-promotions"
                          onClick={(e) => this.handleDelete(e, promotions._id)}
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

export default PromotionList;

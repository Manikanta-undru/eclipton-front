import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import avatarImg from '../../../../assets/images/market-place/dashboard/avatar-table.png';

class Table2 extends Component {
  render() {
    return (
      <div className="table-wrapper">
        <table className="table-1">
          <thead className="">
            <tr role="row" className="">
              <th> </th>
              <th> Order ID </th>
              <th> Customer </th>
              <th> Order Name </th>
              <th> Pricing </th>
              <th> Delivery date </th>
              <th> Status </th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td data-xs="">
                <img src={avatarImg} alt="" />
              </td>
              <td data-xs="Order ID">
                {' '}
                <Link to="/"> AKN12456 </Link>{' '}
              </td>
              <td data-xs="Customer"> Raza A. </td>
              <td data-xs="Order Name"> Hand Bag </td>
              <td data-xs="Pricing"> $200 </td>
              <td data-xs="Delivery date"> Feb 15, 2020 </td>
              <td data-xs="Status">
                {' '}
                <p> On the Way </p>{' '}
              </td>
              <td data-xs="">
                {' '}
                <i className="fa fa-ellipsis-v" />{' '}
              </td>
            </tr>
            <tr>
              <td data-xs="">
                <img src={avatarImg} alt="" />
              </td>
              <td data-xs="Order ID">
                {' '}
                <Link to="/"> AKN12456 </Link>{' '}
              </td>
              <td data-xs="Customer"> Raza A. </td>
              <td data-xs="Order Name"> Hand Bag </td>
              <td data-xs="Pricing"> $200 </td>
              <td data-xs="Delivery date"> Feb 15, 2020 </td>
              <td data-xs="Status">
                {' '}
                <p className="delivered"> Delivered </p>{' '}
              </td>
              <td data-xs="">
                {' '}
                <i className="fa fa-ellipsis-v" />{' '}
              </td>
            </tr>
            <tr>
              <td data-xs="">
                <img src={avatarImg} alt="" />
              </td>
              <td data-xs="Order ID">
                {' '}
                <Link to="/"> AKN12456 </Link>{' '}
              </td>
              <td data-xs="Customer"> Raza A. </td>
              <td data-xs="Order Name"> Hand Bag </td>
              <td data-xs="Pricing"> $200 </td>
              <td data-xs="Delivery date"> Feb 15, 2020 </td>
              <td data-xs="Status">
                {' '}
                <p> On the Way </p>{' '}
              </td>
              <td data-xs="">
                {' '}
                <i className="fa fa-ellipsis-v" />{' '}
              </td>
            </tr>
            <tr>
              <td data-xs="">
                <img src={avatarImg} alt="" />
              </td>
              <td data-xs="Order ID">
                {' '}
                <Link to="/"> AKN12456 </Link>{' '}
              </td>
              <td data-xs="Customer"> Raza A. </td>
              <td data-xs="Order Name"> Hand Bag </td>
              <td data-xs="Pricing"> $200 </td>
              <td data-xs="Delivery date"> Feb 15, 2020 </td>
              <td data-xs="Status">
                {' '}
                <p className="delivered"> Delivered </p>{' '}
              </td>
              <td data-xs="">
                {' '}
                <i className="fa fa-ellipsis-v" />{' '}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="table-footer">
          <Link to="\"> Load More </Link>
        </div>
      </div>
    );
  }
}

export default Table2;

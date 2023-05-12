import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class SideMenu3 extends Component {
  render() {
    return (
      <div className="side-menu-3">
        <h3> Your Account </h3>
        <div className="holder">
          <NavLink to="/market-account-flow-regular"> Product List </NavLink>
          <NavLink to="/market-your-promotions">Promotions</NavLink>
          <NavLink to="/market-discounts">Discounts</NavLink>
          <NavLink to="/market-account-wishlist">Wish List</NavLink>
          <NavLink to="/market-delivery"> Delivery </NavLink>
          <NavLink to="/market-checkout-refund"> Refund </NavLink>
          <NavLink to="/market-review-list"> Reviews </NavLink>
        </div>
      </div>
    );
  }
}

export default SideMenu3;

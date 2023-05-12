import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class SideMenu1 extends Component {
  render() {
    return (
      <div className="side-menu-1">
        <div className="holder">
          <NavLink className="step" to="/market-checkout-cart">
            {' '}
            Cart{' '}
          </NavLink>
          <NavLink className="step" to="/market-checkout-information">
            {' '}
            Information{' '}
          </NavLink>
          <NavLink className="step" to="/market-checkout-shipping">
            {' '}
            Shipping{' '}
          </NavLink>
          <NavLink className="step" to="/market-checkout-payment">
            {' '}
            Payment{' '}
          </NavLink>
        </div>
      </div>
    );
  }
}

export default SideMenu1;

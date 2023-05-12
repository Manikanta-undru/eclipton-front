import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class SideMenu1 extends Component {
  render() {
    return (
      <div className="side-menu-1">
        <div className="holder">
          <NavLink className="step" to="/market-product-overview">
            {' '}
            Product Overview
          </NavLink>
          <NavLink className="step" to="/market-product-description">
            {' '}
            Description{' '}
          </NavLink>
          <NavLink className="step" to="/market-product-pricing">
            {' '}
            Pricing{' '}
          </NavLink>
          <NavLink className="step" to="/market-product-gallery">
            {' '}
            Gallery{' '}
          </NavLink>
          <NavLink className="step" to="/market-product-faq">
            {' '}
            FAQ{' '}
          </NavLink>
          <NavLink className="step" to="/market-product-returns">
            {' '}
            Shipment and Returns{' '}
          </NavLink>
          <NavLink className="step" to="/market-product-publish">
            {' '}
            Publish{' '}
          </NavLink>
        </div>
      </div>
    );
  }
}

export default SideMenu1;

import React from 'react';
import { NavLink } from 'react-router-dom';
import * as moment from 'moment';
import {
  getPromotion,
  promotionUpdateProductList,
} from '../../../../http/promotion-calls';
import { history } from '../../../../store';
import { getAllProduct } from '../../../../http/product-calls';
import Button from '../../../../components/Button';
import A from '../../../../components/A';
import { alertBox } from '../../../../commonRedux';

require('../../_styles/market-area.scss');
require('./create-promotion.scss');

class CreatePromotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product_ids: [],
      is_master_checkbox: false,
      search_key: '',
      promotion_id: this.props.location.state
        ? this.props.location.state.promotion_id
        : '',
    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    if (this.state.promotion_id) {
      this.fetchData();
    }
  }

  fetchData() {
    getAllProduct().then(
      async (resp) => {
        this.setState({
          products: resp,
        });
      },
      (error) => {}
    );
    const formData = {
      promotion_id: this.state.promotion_id,
    };
    getPromotion(formData).then(
      async (res) => {
        this.setState(res);
      },
      (error) => {}
    );
  }

  handleCancel() {
    history.push({
      pathname: '/market-promotion-banner',
      state: { promotion_id: this.state.promotion_id },
    });
  }

  handleChange(product_id) {
    const ids = this.state.product_ids;
    ids.push(product_id);
    this.setState({
      product_ids: ids,
    });
  }

  handleAllChange(e, products) {
    const ids = [];
    products.map((data) => {
      ids.push(data._id);
      const element = document.getElementsByClassName(data._id)[0];
      if (element !== undefined && element !== null) {
        element.checked = e.target.checked;
      }
    });
    this.setState({ is_master_checkbox: e.target.checked });
    this.setState({
      product_ids: ids,
    });
  }

  handleInput = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
    getAllProduct({ title: val }).then(
      async (resp) => {
        this.setState({
          products: resp,
        });
      },
      (error) => {}
    );
  };

  price(products) {
    const price = [];
    products &&
      products.map((item) => {
        const data = `Currency ${item.currency}, $${item.amount}`;
        price.push(data);
      });
    return price.join(' | ');
  }

  submit = (e, t) => {
    e.preventDefault();
    const err = [];
    if (this.state.product_ids.length === 0)
      err.push('Kindly choose product its required');
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = this.state;
      if (this.state.promotion_id) {
        promotionUpdateProductList(formData).then(
          async (res) => {
            if (t === 1) {
              history.push({
                pathname: '/market-promotion-success',
                state: { promotion_id: res._id },
              });
            } else {
              history.push({
                pathname: '/market-promotion-create',
                state: { promotion_id: res._id },
              });
            }
            alertBox(
              true,
              'Promotion Overview Updated Successfully!',
              'success'
            );
          },
          (error) => {
            alertBox(true, 'Error Update Promotion!');
          }
        );
      }
    }
  };

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-2">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <div className="side-menu-1">
                <div className="holder">
                  <NavLink className="step" to="/market-promotion-overview">
                    {' '}
                    Promotion Overview{' '}
                  </NavLink>
                  <NavLink className="step" to="/market-promotion-pricing">
                    {' '}
                    Pricing{' '}
                  </NavLink>
                  <NavLink className="step" to="/market-promotion-banner">
                    {' '}
                    Banner{' '}
                  </NavLink>
                </div>
              </div>
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                {/* BEGIN :: TITLE WITH BUTTON BLOCK */}
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Add Listings </h2>
                  </div>
                  <div className="pull-right ms-auto me-2">
                    <form action="">
                      <div className="search-1">
                        <input
                          type="text"
                          name="search_key"
                          value={this.state.search_key}
                          onChange={this.handleInput}
                          placeholder="Search"
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* END :: TITLE WITH BUTTON BLOCK */}

                {/* BEGIN :: PROMOTION TITLE WITH CHECKBOX */}
                <div className="promotion-title-with-checkbox">
                  <div className="left">
                    <input
                      type="checkbox"
                      id="applyPromotion"
                      checked={this.state.is_master_checkbox}
                      onChange={(e) =>
                        this.handleAllChange(e, this.state.products)
                      }
                    />
                    <label htmlFor="applyPromotion">
                      <h3> Apply promotion to all listings </h3>
                      <p>
                        {' '}
                        This promotion will be applied to all currently active
                        listings{' '}
                      </p>
                    </label>
                  </div>

                  <div className="right pull-right ms-auto me-2">
                    <h3> Promotion Amount ${this.state.amount} </h3>
                    <p>
                      {' '}
                      {moment(this.state.start_date).format(
                        'MMM DD, YYYY'
                      )} - {moment(this.state.end_date).format('MMM DD, YYYY')}{' '}
                      | {this.state.start_time} - {this.state.end_time}{' '}
                    </p>
                  </div>
                </div>
                {/* END :: PROMOTION TITLE WITH CHECKBOX */}

                {/* BEGIN :: CONENT */}
                <div className="table-wrapper promotion">
                  <table className="table-1">
                    <thead className="">
                      <tr role="row" className="">
                        <th>
                          {' '}
                          <input
                            type="checkbox"
                            id="masterCheckbox"
                            checked={this.state.is_master_checkbox}
                            onChange={(e) =>
                              this.handleAllChange(e, this.state.products)
                            }
                          />{' '}
                        </th>
                        <th> Image </th>
                        <th> Title </th>
                        <th> Price </th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.products.map((products) => (
                        <tr key={products._id}>
                          <td key={products}>
                            {' '}
                            <input
                              type="checkbox"
                              className={`checkbox-1 ${products._id}`}
                              onChange={(e) => this.handleChange(products._id)}
                              key={products}
                            />{' '}
                          </td>
                          <td data-xs="Image" key={products}>
                            {products.attachment !== undefined &&
                              products.attachment !== null &&
                              Object.keys(products.attachment).length > 0 && (
                                <img
                                  src={
                                    products.attachment[
                                      Object.keys(products.attachment)[0]
                                    ].src
                                  }
                                  key={products}
                                />
                              )}
                          </td>
                          <td data-xs="Title" key={products}>
                            {' '}
                            {products.title}{' '}
                          </td>
                          <td data-xs="Price" key={products}>
                            {' '}
                            {this.price(products.amount)}{' '}
                            {this.price(products.price_currency)}{' '}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="btns-block">
                  <Button onClick={this.handleCancel} className="btn-2">
                    {' '}
                    Move to Previous{' '}
                  </Button>
                  <A href="/market-promotion-create">
                    <Button
                      onClick={(e) => this.submit(e, 1)}
                      className="btn-1"
                    >
                      {' '}
                      Save & Continue{' '}
                    </Button>
                  </A>
                </div>
                {/* END :: CONTENT */}
              </div>
              {/* END :: FORM HOLDER 1 */}
            </div>
            {/* END :: RIGHT */}
          </div>
        </div>
      </div>
    );
  }
}

export default CreatePromotion;

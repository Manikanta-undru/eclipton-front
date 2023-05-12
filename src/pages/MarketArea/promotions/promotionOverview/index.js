import React from 'react';
import { NavLink } from 'react-router-dom';
import { alertBox } from '../../../../commonRedux';
import A from '../../../../components/A';
import Button from '../../../../components/Button';
import {
  getPromotion,
  promotionCreate,
  promotionUpdateOverview,
} from '../../../../http/promotion-calls';
import { history } from '../../../../store';
import { getProductCategories } from '../../../../http/product-category-calls';
import { TITLE_REGEX } from '../../../../config/constants';

require('../../../../pages/MarketArea/_styles/market-area.scss');

class PromotionOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: '',
      category: '',
      categories: [],
      target_audience: '',
      promotion_id: this.props.location.state
        ? this.props.location.state.promotion_id
        : '',
    };
  }

  componentDidMount() {
    if (this.state.promotion_id) {
      this.fetchData();
    }
    getProductCategories().then(
      async (res) => {
        this.setState({
          categories: res,
        });
      },
      (err) => {}
    );
  }

  fetchData() {
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

  handleInput = (e) => {
    let val = e.target.value;
    const name = e.target.name;
    this.setState({ titleError: false });
    if (name === 'title') {
      this.setState({
        [name]: val,
      });
      if (val === '' || val.trim() === '') {
        alertBox(true, 'Please enter the title');
      } else {
        if (val.length > 80) {
          val = val.substring(0, 80);
        }

        const regex = TITLE_REGEX;
        if (val.search(regex) === -1) {
          alertBox(
            true,
            'Only letters, number, hyphen, underscore, dot, commas, colons, semicolons, and, slash, parenthesis'
          );
        }
        if (val.length < 15) {
          this.setState({
            titleError: true,
          });
        }
      }
    }
  };

  handleChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: val,
    });
  };

  submit = async (e, t) => {
    e.preventDefault();
    let err = [];
    if (this.state.title === '' || this.state.title.trim() === '')
      err.push('Title is required');
    const regex = TITLE_REGEX;
    if (this.state.title.search(regex) === -1) {
      err.push(
        'Only letters, number, hyphen, underscore, dot, commas, colons, semicolons, and, slash, parenthesis'
      );
    }
    if (this.state.title.length > 80 || this.state.title.length < 4) {
      err.push('Title is required with in 4 to 80 charecters ');
    }
    if (this.state.category === '') err.push('Category is required');
    if (this.state.target_audience === '')
      err.push('Target audience is required');
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = this.state;
      if (this.state.promotion_id) {
        promotionUpdateOverview(formData).then(
          async (res) => {
            if (t === 1) {
              alertBox(true, 'Overview has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-pricing',
                state: { promotion_id: res._id },
              });
            } else {
              alertBox(true, 'Overview draft has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-overview',
                state: { promotion_id: res._id },
              });
            }
          },
          (error) => {
            alertBox(true, 'Error Update Promotion!');
          }
        );
      } else {
        promotionCreate(formData).then(
          async (res) => {
            if (t === 1) {
              alertBox(true, 'Overview has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-pricing',
                state: { promotion_id: res._id },
              });
            } else {
              alertBox(true, 'Overview draft has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-overview',
                state: { promotion_id: res._id },
              });
            }
          },
          (error) => {
            alertBox(true, 'Error Create Promotion!');
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
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Create Your Promotional Ad </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor=""> Promotion Name </label>
                    <div className="input-holder">
                      <input
                        type="text"
                        required
                        className="form-control field"
                        placeholder="Enter your promotion title"
                        name="title"
                        onChange={this.handleInput}
                        value={this.state.title}
                      />
                    </div>
                    <div className="input-condition-info grid-2">
                      {/* {this.state.titleError && }*/}
                      <p>
                        {' '}
                        Promotion title should be at least 15 characters long,
                        Promotion title contain at least 6 words.{' '}
                      </p>
                      <p> {this.state.title.length}/80 max </p>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor="category"> Category </label>
                    <div className="input-holder">
                      <select
                        name="category"
                        id="category"
                        value={this.state.category}
                        className="form-control"
                        onChange={this.handleChange}
                      >
                        <option value=""> --- </option>
                        {this.state.categories.map((e, i) => {
                          return (
                            <option
                              value={e.slug}
                              selected={e.slug === this.state.category}
                              key={e.slug}
                            >
                              {e.category}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor="target_audience"> Target Audience </label>
                    <div className="input-holder">
                      <select
                        name="target_audience"
                        id="target_audience"
                        value={this.state.target_audience}
                        className="form-control"
                        onChange={this.handleChange}
                      >
                        <option value=""> --- </option>
                        <option value="adults"> Adults </option>
                        <option value="teens"> Teens </option>
                        <option value="children"> Children </option>
                        <option value="mid-teens"> Mid-Teens </option>
                        <option value="preschoolers"> Preschoolers </option>
                        <option value="men"> Men </option>
                        <option value="women"> Women </option>
                      </select>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <A href="/market-create-ad">
                      <Button className="btn-2"> Cancel </Button>
                    </A>
                    <A href="/market-promotion-overview">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-promotion-overview">
                      <Button className="btn-1"> Save & Continue </Button>
                    </A>
                  </div>
                </form>
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

export default PromotionOverview;

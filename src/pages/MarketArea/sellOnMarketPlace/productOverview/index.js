import React from 'react';
import MultipleValueTextInput from 'react-multivalue-text-input/build/components/MultipleValueTextInput';
import { alertBox } from '../../../../commonRedux';
import A from '../../../../components/A';
import Button from '../../../../components/Button';
import { create, get, update } from '../../../../http/product-calls';
import { getCurrentUser } from '../../../../http/token-interceptor';
import SideMenu1 from '../../../../pages/MarketArea/_widgets/sideMenu1';
import { getProductCategories } from '../../../../http/product-category-calls';
import {
  getStateList,
  getCountryList,
  getCitiesOfState,
} from '../../../../http/http-calls';
import { TITLE_REGEX } from '../../../../config/constants';
require('../../../../pages/MarketArea/_styles/market-area.scss');
require('./product-overview.scss');
let currentUser = JSON.parse(getCurrentUser());

class MarketProductOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: false,
      condition: '',
      category: '',
      sub_category: '',
      country: '',
      state: '',
      city: '',
      zipcode: '',
      categories: [],
      countries: [],
      sub_categories: [],
      states: [],
      cities: [],
      zipcodes: [],
      status: 'draft',
      target_audience: '',
      size: [],
      loading: true,
      currentUser: currentUser,
      product_id: this.props.location.state,
      isValidStock: true,
    };
  }

  componentDidMount() {
    if (this.state.product_id) {
      this.fetchData();
    }
    this.getCountriesData();
    getProductCategories().then(
      async (res) => {
        this.setState({
          categories: res,
        });
      },
      (err) => {}
    );
  }

  getStateData = (isoCode) => {
    getStateList({ id: isoCode }).then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            states: resp,
          });
        }
      },
      (err) => {}
    );
  };
  getCountriesData = () => {
    getCountryList().then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            countries: resp,
          });
        }
      },
      (err) => {}
    );
  };

  getCityData = (countryCode, stateCode) => {
    getCitiesOfState({ countryCode: countryCode, stateCode: stateCode }).then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            cities: resp,
          });
        }
      },
      (err) => {}
    );
  };

  fetchData() {
    const formData = {
      product_id: this.state.product_id,
    };
    get(formData).then(
      async (res) => {
        let resp = res[0];
        let files2 = [];
        let videos2 = [];
        if (resp.attachment) {
          for (let x in resp.attachment) {
            if (resp.attachment[x].type === 'Video') {
              videos2.push({
                content_url: resp.attachment[x].src,
              });
            } else {
              files2.push({
                content_url: resp.attachment[x].src,
              });
            }
          }
        }
        this.setState({
          loading: false,
          title: resp.title,
          condition: resp.condition,
          category: resp.category,
          target_audience: resp.target_audience,
          stock: resp.stock,
          size:
            resp.size == undefined ||
            resp.size[0] == undefined ||
            resp.size[0] == ''
              ? []
              : resp.size,
          userid: resp.userid,
          editorContent: resp.editorContent,
          description: resp.description,
          status: resp.status,
          price_currency: resp.price_currency,
          amount: resp.amount,
          discount: resp.discount,

          discount_period: resp.discount_period,
          files2: files2,
          videos2: videos2,
          faqs: resp.faqs,
          returns: resp.returns,
          sub_category: resp.sub_category,
          address: resp.address,
          country: resp.country,
          state: resp.state,
          city: resp.city,
          zipcode: resp.zipcode,
          sub_categories: this.getSubCategory(resp.category),
          countries: this.getCountriesData(),
          states: resp.country ? this.getStateData(resp.country) : [],
          cities:
            resp.country && resp.state
              ? this.getCityData(resp.country, resp.state)
              : [],
        });
      },
      (error) => {}
    );
  }

  validateNumberField = (myNumber) => {
    const numberRegEx = /\-?\d*.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
  };

  handleInput = (e) => {
    let val = e.target.value;
    const name = e.target.name;
    this.setState({ titleError: false });
    let isValidStock = true;

    if (name === 'stock') {
      isValidStock = this.validateNumberField(val);
    }
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
    } else {
      this.setState({
        [name]: val,
        isValidStock,
      });
    }
  };

  getSubCategory = (category) => {
    getProductCategories({ slug: category }).then(
      async (res) => {
        this.setState({
          sub_categories: res,
        });
      },
      (err) => {}
    );
  };

  handleChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    if (name === 'category') {
      this.getSubCategory(val);
    }
    if (name === 'country') {
      this.getStateData(val);
    }
    if (name === 'state') {
      this.getCityData(this.state.country, val);
    }
    this.setState({
      [name]: val,
    });
  };

  sizeDelete = (size) => {
    const index = this.state.size.indexOf(size);
    if (index > -1) {
      this.state.size.splice(index, 1);
    }
  };

  getUnique(array) {
    let uniqueArray = [];
    let i;
    // Loop through array values
    for (i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }

  submit = (e, t) => {
    e.preventDefault();
    const { history } = this.props;
    let err = [];
    if (this.state.title === '' || this.state.title.trim() === '') {
      err.push('Title is required');
    }
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
    if (this.state.sub_category === '') err.push('Sub Category is required');
    if (this.state.condition === '') err.push('Condition is required');
    if (this.state.target_audience === '')
      err.push('Target audience is required');
    if (!this.state.isValidStock)
      err.push('Kindly enter the valid stock. Only number is allowed');
    if (this.state.size.length === 0) err.push('Size is required');
    let index = 0;
    this.state.size.forEach((sizeitem) => {
      index++;
      if (sizeitem.length > 50 && index == this.state.size.length) {
        err.push('Keywords Tag must be with in 50 charectors');
      }
    });
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = {
        title: this.state.title,
      };
      let hashsize = '';
      if (this.state.category !== '') formData.category = this.state.category;
      if (this.state.condition !== '')
        formData.condition = this.state.condition;
      if (this.state.target_audience !== '')
        formData.target_audience = this.state.target_audience;
      formData.sub_category = this.state.sub_category;
      formData.address = this.state.address;
      formData.country = this.state.country;
      formData.state = this.state.state;
      formData.city = this.state.city;
      formData.zipcode = this.state.zipcode;
      if (this.state.size.length > 0) {
        const uniqueSizes = this.getUnique(this.state.size);
        hashsize = uniqueSizes.join(',');
      }
      formData.userid = this.state.currentUser._id;
      if (t === 1) {
        formData.status = this.state.status;
      } else {
        formData.status = 'draft';
      }
      formData.stock = this.state.stock;
      formData.size = hashsize;
      if (this.state.product_id) {
        const updateFormData = {
          description: this.state.description,
          editorContent: this.state.editorContent,
          product_id: this.state.product_id,
          loading: false,
          title: this.state.title,
          condition: this.state.condition,
          category: this.state.category,
          target_audience: this.state.target_audience,
          stock: this.state.stock,
          size: hashsize,
          userid: this.state.userid,
          status: t === 1 ? this.state.status : 'draft',
          price_currency: this.state.price_currency,
          amount: this.state.amount,
          discount: this.state.discount,

          discount_period: this.state.discount_period,
          files2: JSON.stringify(this.state.files2),
          videos2: JSON.stringify(this.state.videos2),
          faqs: JSON.stringify(this.state.faqs),
          returns: JSON.stringify(this.state.returns),
          sub_category: this.state.sub_category,
          address: this.state.address,
          country: this.state.country,
          state: this.state.state,
          city: this.state.city,
          zipcode: this.state.zipcode,
        };
        update(updateFormData).then(
          async (resp) => {
            if (t === 1) {
              history.push({
                pathname: '/market-product-description',
                state: this.state.product_id,
              });
              alertBox(true, 'Overview has been updated!', 'success');
            } else {
              history.push({
                pathname: '/market-product-overview',
                state: this.state.product_id,
              });
              alertBox(true, 'Overview draft has been updated!', 'success');
            }
          },
          (error) => {
            alertBox(true, error.message);
          }
        );
      } else {
        // create method start
        create(formData).then(async (resp) => {
          if (resp.message == 'error') {
            alertBox(true, resp.errors);
          } else {
            if (resp.message == 'create success') {
              const product_id = resp.data._id;
              if (t === 1) {
                history.push({
                  pathname: '/market-product-description',
                  state: product_id,
                });
                alertBox(true, 'Overview has been saved!', 'success');
              } else {
                history.push({
                  pathname: '/market-product-overview',
                  state: this.state.product_id,
                });
                alertBox(true, 'Overview draft has been saved!', 'success');
              }
            } else {
              alertBox(true, 'Error created Product!');
            }
          }
        });
        // create method end
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
              <SideMenu1 />
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Create Your Own Product </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor="title"> Product Title </label>
                    <div className="input-holder">
                      <input
                        type="text"
                        required
                        className="form-control field"
                        placeholder="Enter your product title"
                        name="title"
                        onChange={this.handleInput}
                        value={this.state.title}
                      />
                    </div>
                    <div className="input-condition-info grid-2">
                      {/* {this.state.titleError && }*/}
                      <p>
                        {' '}
                        Product title should be at least 15 characters long,
                        Product title contain at least 6 words.{' '}
                      </p>
                      <p> {this.state.title.length}/80 max </p>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="row">
                    <div className="col-md-6">
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
                            {this.state.categories.length > 0 &&
                              this.state.categories.map((e, i) => {
                                return (
                                  <option
                                    value={e.slug}
                                    selected={e.slug === this.state.category}
                                    key={i}
                                  >
                                    {e.category}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group type-1">
                        <label htmlFor="category"> Sub Category </label>
                        <div className="input-holder">
                          <select
                            name="sub_category"
                            id="sub_category"
                            value={this.state.sub_category}
                            className="form-control"
                            onChange={this.handleChange}
                          >
                            <option value=""> --- </option>
                            {this.state.sub_categories &&
                              this.state.sub_categories.length > 0 &&
                              this.state.sub_categories.map((e, i) => {
                                return (
                                  <option
                                    value={e.slug}
                                    selected={
                                      e.slug === this.state.sub_category
                                    }
                                    key={i}
                                  >
                                    {e.category}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group type-1">
                        <label htmlFor=""> Stock </label>
                        <input
                          type="number"
                          required
                          placeholder="in number"
                          step="1"
                          min="0"
                          name="stock"
                          className="form-control w-100"
                          value={this.state.stock}
                          onChange={this.handleInput}
                        />
                        {!this.state.isValidStock && (
                          <span style={{ color: 'red', width: '100%' }}>
                            Kindly enter the number
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <strong>Size</strong>
                        <MultipleValueTextInput
                          onItemAdded={(item, allItems) =>
                            this.setState({ size: allItems })
                          }
                          onItemDeleted={(item, allItems) =>
                            this.sizeDelete(item)
                          }
                          label=""
                          values={this.state.size}
                          name="item-input"
                          maxLength="70"
                          placeholder="Enter the varient"
                        />
                        <small className="text-secondary">
                          Separate size using commas
                        </small>
                      </div>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group type-1">
                        <label htmlFor="condition"> Product Condition </label>
                        <div className="input-holder">
                          <select
                            name="condition"
                            id="condition"
                            className="form-control"
                            value={this.state.condition}
                            onChange={this.handleChange}
                          >
                            <option value=""> --- </option>
                            <option value="New"> New </option>
                            <option value="Very Recent"> Very Recent </option>
                            <option value="0-2 yrs"> 0-2 yrs </option>
                            <option value="3-6 yrs"> 3-6 yrs </option>
                            <option value="6-10 yrs"> 6-10 yrs </option>
                            <option value="10+ yrs"> 10+ yrs </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group type-1">
                        <label htmlFor="target_audience">
                          {' '}
                          Target Audience{' '}
                        </label>
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
                    </div>
                  </div>

                  <div className="form-group type-1">
                    <label htmlFor="title"> Address </label>
                    <div className="input-holder">
                      <input
                        type="text"
                        className="form-control field"
                        placeholder="Enter your address"
                        name="address"
                        onChange={this.handleInput}
                        value={this.state.address}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group type-1">
                        <label htmlFor="title"> Country </label>
                        <div className="input-holder">
                          <select
                            name="country"
                            id="country"
                            required
                            value={this.state.country}
                            className="form-control"
                            onChange={this.handleChange}
                          >
                            <option value=""> --- </option>
                            {this.state.countries &&
                              this.state.countries.length > 0 &&
                              this.state.countries.map((e, i) => {
                                return (
                                  <option
                                    value={e.isoCode}
                                    selected={e.isoCode === this.state.country}
                                    key={i}
                                  >
                                    {e.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group type-1">
                        <label htmlFor="title"> State </label>
                        <div className="input-holder">
                          <select
                            name="state"
                            id="state"
                            required
                            value={this.state.state}
                            className="form-control"
                            onChange={this.handleChange}
                          >
                            <option value=""> --- </option>
                            {this.state.states &&
                              this.state.states.length > 0 &&
                              this.state.states.map((e, i) => {
                                return (
                                  <option
                                    value={e.isoCode}
                                    selected={e.isoCode === this.state.state}
                                    key={i}
                                  >
                                    {e.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group type-1">
                        <label htmlFor="title"> City </label>
                        <div className="input-holder">
                          <select
                            name="city"
                            id="city"
                            required
                            value={this.state.city}
                            className="form-control"
                            onChange={this.handleChange}
                          >
                            <option value=""> --- </option>
                            {this.state.cities &&
                              this.state.cities.length > 0 &&
                              this.state.cities.map((e, i) => {
                                return (
                                  <option
                                    value={e.name}
                                    selected={e.name === this.state.city}
                                    key={i}
                                  >
                                    {e.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group type-1">
                        <label htmlFor="title"> Zipcode </label>
                        <div className="input-holder">
                          <input
                            type="text"
                            required
                            className="form-control field"
                            placeholder="Enter your Zipcode"
                            name="zipcode"
                            onChange={this.handleInput}
                            value={this.state.zipcode}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <A href="/market-create-ad">
                      <Button className="btn-2"> Cancel </Button>
                    </A>
                    <A href="/market-product-overview">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-product-overview">
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

export default MarketProductOverview;

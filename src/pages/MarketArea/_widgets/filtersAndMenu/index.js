import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import A from '../../../../components/A';
import { getLocation } from '../../../../http/product-calls';
import { history } from '../../../../store';
import { getAllPromotion } from '../../../../http/promotion-calls';
import { getProductCategories } from '../../../../http/product-category-calls';

const json_datas = require('countrycitystatejson');

require('./filters-and-menu.scss');

class FiltersAndMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      bannerImages: [],
      isAllTab: true,
      isActive: false,
      categoryClass: '',
      country: '',
      category_menu: this.props.category,
      categories: [],
      countries: json_datas.getCountries(),
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    getProductCategories().then(
      async (res) => {
        this.setState({
          categories: res,
        });
      },
      (err) => {}
    );
  }

  handleClick(e, category) {
    e.preventDefault();
    history.push({
      pathname: `/market-default-view/${category}`,
    });
    this.state.categories.map((item, i) => {
      const element = document.getElementsByClassName(item.slug)[0];
      if (item.slug === category) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
    const key = {
      category,
    };
    this.fetchAllProductByLocation(category, key);
    this.fetchAllPromotionImages(category);
    this.setState({
      isAllTab: false,
    });
  }

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;

    this.setState({
      [name]: val,
    });
    const key = {
      [name]: val,
    };
    this.fetchAllProductByLocation(this.state.category_menu, key);
  };

  fetchAllPromotionImages(category_menu) {
    const err = [];
    getAllPromotion({ category: category_menu }).then(
      async (resp) => {
        const bannerImages = [];
        resp.map((res) => {
          for (const x in res.attachment) {
            bannerImages.push({
              title: res.title,
              description: res.description,
              src: res.attachment[x].src,
              buttons: res.buttons,
            });
          }
        });
        this.props.dataChange({
          bannerImages,
        });
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  fetchAllProductByLocation(category_menu, key) {
    const err = [];
    const formData = {};
    this.props.dataChange({
      products: [],
    });
    if (key.country) {
      formData.country = key.country;
    }
    if (key.location) {
      formData.location = key.location;
    }
    if (category_menu === 'all') {
      // formData.limit = 6;
    } else {
      formData.category = category_menu;
    }
    getLocation(formData).then(
      async (resp) => {
        this.props.dataChange({
          products: resp,
          recordFound: resp.length > 0 ? 'found' : 'not_found',
          datas: formData,
        });
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  render() {
    return (
      <div className="filters-and-menu">
        <div className="top">
          <div className="left">
            <select
              name="country"
              id="country"
              required
              value={this.state.country}
              className="form-control"
              onChange={this.handleChange}
            >
              <option value=""> --- </option>
              {this.state.countries.map((e, i) => (
                <option value={e.shortName} key={e.shortName}>
                  {e.name}
                </option>
              ))}
            </select>
            <span className="icon">
              {' '}
              <i className="fa fa-map-marker" />{' '}
            </span>
          </div>

          <div className="middle">
            <input
              name="location"
              id="location"
              type="text"
              placeholder=" Enter the location"
              onChange={this.handleChange}
            />
            <span className="icon">
              {' '}
              <i className="fa fa-search" />{' '}
            </span>
          </div>

          <div className="right">
            <A href="/market-create-ad">
              <button className="btn-1"> Sell on Marketplace </button>
            </A>
          </div>
        </div>

        <div className="bottom link-style-1">
          <Link
            to="/market-default-view"
            className={this.state.isAllTab ? 'active' : ''}
          >
            {' '}
            All{' '}
          </Link>
          {this.state.categories.map((item, i) => (
            <Link
              key={item.slug}
              to={{
                pathname: `/market-default-view/${item.slug}`,
              }}
              onClick={(e) => this.handleClick(e, item.slug)}
              className={item.slug}
            >
              {' '}
              {item.category}{' '}
            </Link>
          ))}
          {/* <div className="dropdown marketVdrop">
                            <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-ellipsis-h"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </div> */}
        </div>
      </div>
    );
  }
}

export default FiltersAndMenu;

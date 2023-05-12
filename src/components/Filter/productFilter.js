import React, { useState, useEffect } from 'react';
import { GetAssetImage } from '../../globalFunctions';
import './styles.scss';
import { getSearchData } from '../../http/product-calls';
import { getProductCategories } from '../../http/product-category-calls';

function ProductFilter(props) {
  const [category_menu, setCategoryMenu] = useState(props.category);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [rating, setRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [key, setKey] = useState('');
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getProductCategories().then(
      async (res) => {
        setCategories(res);
        setSubCategories([]);
      },
      (err) => {}
    );
  };

  const getSubCategories = (category) => {
    getProductCategories({ slug: category }).then(
      async (res) => {
        setSubCategories(res);
      },
      (err) => {}
    );
  };

  const fetchAllProductBySearch = (category_menu, data) => {
    const err = [];
    const formData = {};
    props.dataChange({
      products: [],
    });
    const { category, subCategory, priceFrom, priceTo, rating, key } = data;
    if (category) {
      formData.category = category;
    }
    if (subCategory) {
      formData.subCategory = subCategory;
    }
    if (priceFrom) {
      formData.priceFrom = priceFrom;
    }
    if (priceTo) {
      formData.priceTo = priceTo;
    }
    if (rating) {
      formData.rating = rating;
    }
    if (key) {
      formData.key = key;
    }
    if (category_menu === 'all') {
      // formData.limit = 6;
    } else {
      formData.category = category_menu;
    }
    if (Object.keys(formData).length > 0) {
      getSearchData(formData).then(
        async (resp) => {
          props.dataChange({
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
  };

  useEffect(() => {
    const data = {
      category,
      subCategory,
      priceFrom,
      priceTo,
      rating,
      key,
    };
    fetchAllProductBySearch(category_menu, data);
  }, [rating, category, subCategory, priceFrom, priceTo, key]);

  return (
    <div className="widget empty-inner-container-with-border filterWidget">
      <div className="container">
        <div className="row" style={{ backgroundColor: 'white' }}>
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <img src={GetAssetImage('Icon feather-filter.png')} />
              <span>Filter</span>
            </li>
          </ul>
          <form className="form p-3 w-100">
            <div className="form-group">
              <label>Search Keyword</label>
              <input
                type="text"
                maxLength="100"
                className="form-control"
                placeholder="eg: Logo Design"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  getData();
                  getSubCategories(e.target.value);
                }}
              >
                <option value="">All</option>
                {categories.length > 0 &&
                  categories.map((e, i) => (
                    <option value={e.slug} key={e.slug}>
                      {e.category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sub Category</label>
              <select
                className="form-control"
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                }}
              >
                <option value="">All</option>
                {subCategories.length > 0 &&
                  subCategories.map((e, i) => (
                    <option value={e.slug} key={e.slug}>
                      {e.category}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label>Price Range</label>
              <div className="d-flex align-items-center justify-content-between">
                <input
                  type="text"
                  className="form-control"
                  placeholder="$"
                  value={priceFrom}
                  onChange={(e) => {
                    setPriceFrom(e.target.value);
                  }}
                />
                <div className="px-2">-</div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="$"
                  value={priceTo}
                  onChange={(e) => {
                    setPriceTo(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Rating</label>
              <div className="d-flex align-items-center justify-content-start starRating">
                <i
                  className={`fa pr-1 ${rating >= 1 ? 'fa-star' : 'fa-star-o'}`}
                  onClick={() => {
                    setRating(1);
                  }}
                />
                <i
                  className={`fa pr-1 ${rating >= 2 ? 'fa-star' : 'fa-star-o'}`}
                  onClick={() => {
                    setRating(2);
                  }}
                />
                <i
                  className={`fa pr-1 ${rating >= 3 ? 'fa-star' : 'fa-star-o'}`}
                  onClick={() => {
                    setRating(3);
                  }}
                />
                <i
                  className={`fa pr-1 ${rating >= 4 ? 'fa-star' : 'fa-star-o'}`}
                  onClick={() => {
                    setRating(4);
                  }}
                />
                <i
                  className={`fa ${rating >= 5 ? 'fa-star' : 'fa-star-o'}`}
                  onClick={() => {
                    setRating(5);
                  }}
                />
                {/*  <div className="px-2 text-small text-secondary">{rating} and up</div>
            {rating > 0 && <i className={"fa fa-times pointer"} onClick={() => {setRating(0)}}></i>} */}
              </div>
            </div>

            {/* <div className="form-group">
          <div className="form-check">
            <input   type="checkbox" value="" id="flexCheckCheckedFriendGig" checked/>
            <label   for="flexCheckCheckedFriendGig">
           Show only my friend's gigs
            </label>
            
          </div>
          </div>

          <div className="form-group">
          <div className="form-check">
            <input  type="checkbox" value="" id="flexCheckCheckedPopular" />
            <label  for="flexCheckCheckedPopular">
            Show popular right now
            </label>
            
          </div>
          </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;

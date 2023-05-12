import React, { useState, useEffect } from 'react';
import { getCategories } from '../../http/gig-calls';
import { GetAssetImage } from '../../globalFunctions';
import './styles.scss';
import { alertBox } from '../../commonRedux';
import DebouncedInput from '../DebouncedInput/DebouncedInput';

const coinsvalues = require('../../pages/Gionomy/add/coins.json');

function GigFilter(props) {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [rating, setRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [key, setKey] = useState('');
  const [coins, setcurreny] = useState([]);
  const [coin, setcurrencies] = useState('');

  useEffect(() => {
    getData();
    setcurreny(coinsvalues);
  }, []);

  const getData = (l = 1, p = '') => {
    getCategories({ level: l, parent: p }).then(
      (resp) => {
        if (l == 1) {
          setCategories(resp);
          setCategory('');
        } else {
          p === '' ? setSubCategories([]) : setSubCategories(resp);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    const data = {
      category,
      subCategory,
      priceFrom,
      priceTo,
      rating,
      key,
      coin,
    };

    props.dataChange(data);
  }, [rating, category, subCategory, priceFrom, priceTo, key, coin]);

  return (
    <div className="widget cardBody filterWidget">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <img src={GetAssetImage('Icon feather-filter.png')} />
              <span>Filter</span>
            </li>
          </ul>
          <form className="form px-3 w-100 pb-3">
            <div className="form-group mb-3">
              <label>Search Keyword</label>
              {/* <input type="text" maxLength="100" className="form-control" placeholder="eg: Logo Design" value={key} onChange={(e) => { setKey(e.target.value) }} /> */}
              <DebouncedInput
                type="text"
                maxLength="100"
                className="form-control"
                placeholder="eg: Logo Design"
                value={key}
                onChange={(value) => {
                  setKey(value);
                }}
              />
            </div>

            <div className="form-group mb-3">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  getData(2, e.target.value);
                  setSubCategory('');
                }}
              >
                <option value="">All</option>
                {categories.length > 0 &&
                  categories.map((e, i) => (
                    <option value={e._id} key={i}>
                      {e.category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group mb-3">
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
                    <option value={e._id} key={i}>
                      {e.category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Currency</label>
              <select
                className="form-control"
                value={coin}
                onChange={(e) => {
                  setcurrencies(e.target.value);
                }}
              >
                <option value="">Choose currency</option>
                {coins.map((e, i) => (
                  <option
                    value={e.currencySymbol}
                    selected={e.currencySymbol == coin}
                    key={i}
                  >
                    {e.currencySymbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Price Range</label>
              <div className="d-flex align-items-center justify-content-between">
                <input
                  type="text"
                  min="1"
                  className="form-control"
                  placeholder={coin}
                  value={priceFrom}
                  onChange={(e) => {
                    if (coin == '') {
                      alertBox(true, 'Please select the search currency');
                    } else {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setPriceFrom(e.target.value);
                      } else {
                        setPriceFrom('');
                      }
                    }
                  }}
                />
                <div className="px-2">-</div>
                <input
                  type="text"
                  min="1"
                  className="form-control"
                  placeholder={coin}
                  value={priceTo}
                  onChange={(e) => {
                    if (coin == '') {
                      alertBox(true, 'Please select the search currency');
                    } else {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setPriceTo(e.target.value);
                      } else {
                        setPriceTo('');
                      }
                    }
                  }}
                />
              </div>
            </div>
            {props.page == undefined ? (
              <div className="form-group">
                <label>Rating</label>
                <div className="d-flex align-items-center justify-content-start starRating">
                  <i
                    className={`fa pr-1 ${
                      rating >= 1 ? 'fa-star' : 'fa-star-o'
                    }`}
                    onClick={() => {
                      setRating(rating == 1 ? 0 : 1);
                    }}
                  />
                  <i
                    className={`fa pr-1 ${
                      rating >= 2 ? 'fa-star' : 'fa-star-o'
                    }`}
                    onClick={() => {
                      setRating(2);
                    }}
                  />
                  <i
                    className={`fa pr-1 ${
                      rating >= 3 ? 'fa-star' : 'fa-star-o'
                    }`}
                    onClick={() => {
                      setRating(3);
                    }}
                  />
                  <i
                    className={`fa pr-1 ${
                      rating >= 4 ? 'fa-star' : 'fa-star-o'
                    }`}
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
            ) : (
              ''
            )}

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

export default GigFilter;

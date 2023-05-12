import React, { useState, useEffect } from 'react';
import './styles.scss';
import { getBlogCategories } from '../../http/blog-calls';
import { GetAssetImage } from '../../globalFunctions';
import DebouncedInput from '../DebouncedInput/DebouncedInput';
import { getCurrency } from '../../http/http-calls';

function BlogFilter(props) {
  const [isFromFreePaid, setIsFromFreePaid] = useState(false);
  const [category, setCategory] = useState('');
  const [freePaid, setFreePaid] = useState('all');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [categories, setCategories] = useState([]);
  const [key, setKey] = useState('');
  const [currency, setcurrencies] = useState('');
  const [currencies, setCurrencies] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getCurrency().then((resp) => {
      resp.splice(-1);
      setCurrencies(resp);
    });
    getBlogCategories().then(
      (resp) => {
        //   if(l == 1){
        setCategories(resp);
        //   }else{
        //     setSubCategory("");
        //     setSubCategories(resp)
        //   }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(
    (e) => {
      const data = {
        isFromFreePaid,
        category,
        freePaid,
        priceFrom,
        priceTo,
        key,
        currency,
      };
      props.dataChange(data);
    },
    [isFromFreePaid, category, freePaid, priceFrom, priceTo, key, currency]
  );

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
              <DebouncedInput
                type="text"
                maxLength="100"
                delay={300}
                className="form-control"
                placeholder="eg: Logo Design"
                value={key}
                onChange={(value) => {
                  setKey(value);
                }}
              />
              {/* <input type="text" maxLength="100" className="form-control" placeholder="eg: Logo Design" value={key}  onChange={(e) => {setKey(e.target.value)}}  /> */}
            </div>

            <div className="form-group mb-3">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="all">All</option>
                {categories.length > 0 &&
                  categories.map((e, i) => (
                    <option value={e._id} key={i}>
                      {e.category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Free/Paid</label>
              <select
                className="form-control"
                value={freePaid}
                onChange={(e) => {
                  setFreePaid(e.target.value);
                  setIsFromFreePaid(true);
                }}
              >
                <option value="all">All</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {freePaid !== 'free' && (
              <div className="form-group mb-3">
                <label>Currency</label>
                <select
                  className="form-control"
                  value={currency}
                  onChange={(e) => {
                    setcurrencies(e.target.value);
                  }}
                >
                  <option value="">Choose</option>
                  {currencies.length > 0 &&
                    currencies.map((e, i) => (
                      <option value={e.currencySymbol} key={i}>
                        {e.currencySymbol}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {freePaid !== 'free' && (
              <div className="form-group mb-3">
                <label>Price Range</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={currency}
                    value={priceFrom}
                    onChange={(e) => {
                      setPriceFrom(e.target.value);
                    }}
                  />
                  <div className="px-2">-</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={currency}
                    value={priceTo}
                    onChange={(e) => {
                      setPriceTo(e.target.value);
                    }}
                  />
                </div>
              </div>
            )}
            {/* <div className="form-group">
            <label>Rating</label>
            <div className="d-flex align-items-center justify-content-between starRating">
            <i className={"fa "+(rating >= 1 ? 'fa-star' : 'fa-star-o')} onClick={() => {setRating(1)}}></i>
            <i className={"fa "+(rating >= 2 ? 'fa-star' : 'fa-star-o')} onClick={() => {setRating(2)}}></i>
            <i className={"fa "+(rating >= 3 ? 'fa-star' : 'fa-star-o')} onClick={() => {setRating(3)}}></i>
            <i className={"fa "+(rating >= 4 ? 'fa-star' : 'fa-star-o')} onClick={() => {setRating(4)}}></i>
            <i className={"fa "+(rating >= 5 ? 'fa-star' : 'fa-star-o')} onClick={() => {setRating(5)}}></i>
            <div className="px-2 text-small text-secondary">{rating} and up</div>
            </div>
          </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default BlogFilter;
